/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from 'axios';
import assert, { AssertionError } from 'assert';
import { Types } from '@fiora/database/mongoose';
import { Expo, ExpoPushErrorTicket } from 'expo-server-sdk';

import config from '@fiora/config/server';
import xss from '@fiora/utils/xss';
import logger from '@fiora/utils/logger';
import User, { UserDocument } from '@fiora/database/mongoose/models/user';
import Group, { GroupDocument } from '@fiora/database/mongoose/models/group';
import Message, {
    handleInviteV2Message,
    handleInviteV2Messages,
    MessageDocument,
} from '@fiora/database/mongoose/models/message';
import Notification from '@fiora/database/mongoose/models/notification';
import History, {
    createOrUpdateHistory,
} from '@fiora/database/mongoose/models/history';
import Socket from '@fiora/database/mongoose/models/socket';

import {
    DisableSendMessageKey,
    DisableNewUserSendMessageKey,
    Redis,
} from '@fiora/database/redis/initRedis';
import client from '../../../config/client';






async function chatGPT(ctx) {
    const res = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+ config.chatGPTtoken
        },
        data: {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": ctx.trim()}]
        }
    });
    assert(res.status === 200, '未配置token或ChatGPT服务端错误');
    

    try {
        return res.data.choices[0].message.content.trim();
    } catch (err) {
        assert(false, '屑CloseAI的数据解析异常');
        console.log(err);
    }

    return [];
}



async function getBV(bvid) {
    const res = await axios({
        method: 'get',
        url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
    });
    assert(res.status === 200, 'bilibili服务端错误');
    

    try {
        return res.data.data;
    } catch (err) {
        assert(false, '屑b站的数据解析异常');
        console.log(err);
    }

    return false;
}

async function getLive(lvid) {
    const res = await axios({
        method: 'get',
        url: `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${lvid}`,
    });
    assert(res.status === 200, 'bilibili服务端错误');
    

    try {
        return res.data.data;
    } catch (err) {
        assert(false, '屑b站的数据解析异常');
        console.log(err);
    }

    return false;
}

async function getVup(uid) {
    const res = await axios({
        method: 'get',
        url: `https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`,
    });
    assert(res.status === 200, 'bilibili服务端错误');
    

    try {
        return res.data.data;
    } catch (err) {
        assert(false, '屑b站的数据解析异常');
        console.log(err);
    }

    return false;
}

async function shortBV2long(surl) {
    const res = await axios({
        method: 'get',
        url: surl,
    });
    assert(res.status === 200, 'bilibili服务端错误');

    return res.headers;
    

    if(res.headers['bili-trace-id']){
        return res.headers['location'];
    }else{
        return res.request.res.responseUrl;
    }
}



const { isValid } = Types.ObjectId;

/** 初次获取历史消息数 */
const FirstTimeMessagesCount = 15;
/** 每次调用接口获取的历史消息数 */
const EachFetchMessagesCount = 30;

const OneYear = 365 * 24 * 3600 * 1000;

/** 石头剪刀布, 用于随机生成结果 */
const RPS = ['石头', '剪刀', '布'];

async function pushNotification(
    notificationTokens: string[],
    message: MessageDocument,
    groupName?: string,
) {
    const expo = new Expo({});

    const content =
        message.type === 'text' ? message.content : `[${message.type}]`;
    const pushMessages = notificationTokens.map((notificationToken) => ({
        to: notificationToken,
        sound: 'default',
        title: groupName || (message.from as any).username,
        body: groupName
            ? `${(message.from as any).username}: ${content}`
            : content,
        data: { focus: message.to },
    }));

    const chunks = expo.chunkPushNotifications(pushMessages as any);
    for (const chunk of chunks) {
        try {
            const results = await expo.sendPushNotificationsAsync(chunk);
            results.forEach((result) => {
                const { status, message: errMessage } =
                    result as ExpoPushErrorTicket;
                if (status === 'error') {
                    logger.warn('[Notification]', errMessage);
                }
            });
        } catch (error) {
            logger.error('[Notification]', (error as Error).message);
        }
    }
}

/**
 * 发送消息
 * 如果是发送给群组, to是群组id
 * 如果是发送给个人, to是俩人id按大小序拼接后的值
 * @param ctx Context
 */
export async function sendMessage(ctx: Context<SendMessageData>) {
    const disableSendMessage = await Redis.get(DisableSendMessageKey);
    assert(disableSendMessage !== 'true' || ctx.socket.isAdmin, '全员禁言中');

    const disableNewUserSendMessage = await Redis.get(
        DisableNewUserSendMessageKey,
    );
    if (disableNewUserSendMessage === 'true') {
        const user = await User.findById(ctx.socket.user);
        const isNewUser =
            user && user.createTime.getTime() > Date.now() - OneYear;
        assert(
            ctx.socket.isAdmin || !isNewUser,
            '新用户禁言中! 请自发维护交流环境',
        );
    }

    const { to, content } = ctx.data;
    let { type } = ctx.data;
    assert(to, 'to不能为空');

    let toGroup: GroupDocument | null = null;
    let toUser: UserDocument | null = null;
    if (isValid(to)) {
        toGroup = await Group.findOne({ _id: to });
        assert(toGroup, '群组不存在');
    } else {
        const userId = to.replace(ctx.socket.user.toString(), '');
        assert(isValid(userId), '无效的用户ID');
        toUser = await User.findOne({ _id: userId });
        assert(toUser, '用户不存在');
    }

    let messageContent = content;
    if (type === 'text') {
        assert(messageContent.length <= 2048, '消息长度过长');

        const rollRegex = /^-roll( ([0-9]*))?$/;
        const gptRegex  = /^-gpt( (.*))?$/;
        const missRegex = /^-miss( (.*))?$/;
        const sysRegex = /^-sys( (.*))?$/;
        const replyRegex= /^回复(.*)「(.*)」:(.*)/;
        const bvRegex   = /BV\w{10}/i;
        const liveRegex = /\w+:\/\/live.bilibili.com\/(\d+)/;
        const b23Regex  = /\w+:\/\/b23.tv\/\w{7}/;
        if (rollRegex.test(messageContent)) {
            const regexResult = rollRegex.exec(messageContent);
            if (regexResult) {
                let numberStr = regexResult[1] || '100';
                if (numberStr.length > 5) {
                    numberStr = '99999';
                }
                const number = parseInt(numberStr, 10);
                type = 'system';
                messageContent = JSON.stringify({
                    command: 'roll',
                    value: Math.floor(Math.random() * (number + 1)),
                    top: number,
                });
            }
        } else if (/^-rps$/.test(messageContent)) {
            type = 'system';
            messageContent = JSON.stringify({
                command: 'rps',
                value: RPS[Math.floor(Math.random() * RPS.length)],
            });
        } else if (sysRegex.test(messageContent)) {
            const regexResult = sysRegex.exec(messageContent);
            if (regexResult) {
                type = 'system';
                messageContent = JSON.stringify({
                    command: 'sys',
                    tt: regexResult[1].trim()
                });
            }
        } else if (gptRegex.test(messageContent)) {
            const regexResult = gptRegex.exec(messageContent);
            if (regexResult) {
                type = 'system';
                const ansqq = await chatGPT(regexResult[1].trim());
                if (ansqq)
                {
                    messageContent = JSON.stringify({
                        command: 'gpt',
                        ask: regexResult[2].trim(),
                        answer: ansqq,
                    });
                }
            }
        } else if (missRegex.test(messageContent)) {
            const regexResult = missRegex.exec(messageContent);
            if (regexResult) {
                const user = await User.findOne({username: regexResult[1].trim()});
                if (user)
                {
                    const tt = Math.floor((Date.now() - user.lastLoginTime.getTime())/(24*3600*1000))
                    if (tt<1) {
                        messageContent = `今天也是想念${regexResult[1].trim()}的一天`;
                    } else {
                        messageContent = `想念${regexResult[1].trim()}的第${tt}天`;
                    }
                }else{
                    messageContent = '想念龙小姐的第∞天';
                }
            }
        } else if (replyRegex.test(messageContent)){
            const regexResult = replyRegex.exec(messageContent);
            if (regexResult) {
                type = 'reply';
                messageContent = JSON.stringify({
                    replywho: regexResult[1].replace(/<[^>]+>/gm, ''),
                    orignmsg: regexResult[2].replace(/<[^>]+>/gm, ''),
                    replymsg: regexResult[3].trim()?regexResult[3].trim():'　',
                });
            }
        } else if (bvRegex.test(messageContent)){
            const regexResult = bvRegex.exec(messageContent);
            if (regexResult) {
                const ansbv = await getBV(regexResult[0]);
                if(ansbv){
                    type = 'bilibili';
                    messageContent = JSON.stringify(ansbv);
                }
            }
        } else if (liveRegex.test(messageContent)){
            const regexResult = liveRegex.exec(messageContent);
            if (regexResult) {
                const anslv = await getLive(regexResult[1]);
                const ansup = await getVup(anslv.uid);
                if(anslv && ansup){
                    type = 'bilibili';
                    messageContent = JSON.stringify(Object.assign(anslv,ansup));
                }
            }
        } else if (b23Regex.test(messageContent)){
            const regexResult = b23Regex.exec(messageContent);
            if (regexResult) {
                const trueurl = await shortBV2long(regexResult[0]);
                if(true){
                    messageContent = trueurl;
                }else if (bvRegex.test(trueurl)){
                    const regexResult2 = bvRegex.exec(trueurl);
                    if (regexResult2) {
                        const ansbv = await getBV(regexResult2[0]);
                        if(ansbv){
                            type = 'bilibili';
                            messageContent = JSON.stringify(ansbv);
                        }
                    }
                }else if (liveRegex.test(trueurl)){
                    const regexResult3 = liveRegex.exec(trueurl);
                    if (regexResult3) {
                        const anslv = await getLive(regexResult3[1]);
                        const ansup = await getVup(anslv.uid);
                        if(anslv && ansup){
                            type = 'bilibili';
                            messageContent = JSON.stringify(Object.assign(anslv,ansup));
                        }
                    }
                }
            }
        };
        messageContent = xss(messageContent);
    } else if (type === 'file') {
        const file: { size: number } = JSON.parse(content);
        assert(file.size < client.maxFileSize, '要发送的文件过大');
        messageContent = content;
    } else if (type === 'inviteV2') {
        const shareTargetGroup = await Group.findOne({ _id: content });
        if (!shareTargetGroup) {
            throw new AssertionError({ message: '目标群组不存在' });
        }
        const user = await User.findOne({ _id: ctx.socket.user });
        if (!user) {
            throw new AssertionError({ message: '用户不存在' });
        }
        messageContent = JSON.stringify({
            inviter: user._id,
            group: shareTargetGroup._id,
        });
    }

    const user = await User.findOne(
        { _id: ctx.socket.user },
        { username: 1, avatar: 1, tag: 1 },
    );
    if (!user) {
        throw new AssertionError({ message: '用户不存在' });
    }

    const message = await Message.create({
        from: ctx.socket.user,
        to,
        type,
        content: messageContent,
    } as MessageDocument);

    const messageData = {
        _id: message._id,
        createTime: message.createTime,
        from: user.toObject(),
        to,
        type,
        content: message.content,
    };
    if (type === 'inviteV2') {
        await handleInviteV2Message(messageData);
    }

    if (toGroup) {
        ctx.socket.emit(toGroup._id.toString(), 'message', messageData);

        const notifications = await Notification.find({
            user: {
                $in: toGroup.members,
            },
        });
        const notificationTokens: string[] = [];
        notifications.forEach((notification) => {
            // Messages sent by yourself don’t push notification to yourself
            if (
                notification.user._id.toString() === ctx.socket.user.toString()
            ) {
                return;
            }
            notificationTokens.push(notification.token);
        });
        if (notificationTokens.length) {
            pushNotification(
                notificationTokens,
                messageData as unknown as MessageDocument,
                toGroup.name,
            );
        }
    } else {
        const targetSockets = await Socket.find({ user: toUser?._id });
        const targetSocketIdList =
            targetSockets?.map((socket) => socket.id) || [];
        if (targetSocketIdList.length) {
            ctx.socket.emit(targetSocketIdList, 'message', messageData);
        }

        const selfSockets = await Socket.find({ user: ctx.socket.user });
        const selfSocketIdList = selfSockets?.map((socket) => socket.id) || [];
        if (selfSocketIdList.length) {
            ctx.socket.emit(selfSocketIdList, 'message', messageData);
        }

        const notificationTokens = await Notification.find({ user: toUser });
        if (notificationTokens.length) {
            pushNotification(
                notificationTokens.map(({ token }) => token),
                messageData as unknown as MessageDocument,
            );
        }
    }

    createOrUpdateHistory(ctx.socket.user.toString(), to, message._id);

    return messageData;
}

/**
 * 获取一组联系人的最后历史消息
 * @param ctx Context
 */
export async function getLinkmansLastMessages(
    ctx: Context<{ linkmans: string[] }>,
) {
    const { linkmans } = ctx.data;
    assert(Array.isArray(linkmans), '参数linkmans应该是Array');

    const promises = linkmans.map(async (linkmanId) => {
        const messages = await Message.find(
            { to: linkmanId },
            {
                type: 1,
                content: 1,
                from: 1,
                createTime: 1,
                deleted: 1,
            },
            { sort: { createTime: -1 }, limit: FirstTimeMessagesCount },
        ).populate('from', { username: 1, avatar: 1, tag: 1 });
        await handleInviteV2Messages(messages);
        return messages;
    });
    const results = await Promise.all(promises);
    type Messages = {
        [linkmanId: string]: MessageDocument[];
    };
    const messages = linkmans.reduce((result: Messages, linkmanId, index) => {
        result[linkmanId] = (results[index] || []).reverse();
        return result;
    }, {});

    return messages;
}

export async function getLinkmansLastMessagesV2(
    ctx: Context<{ linkmans: string[] }>,
) {
    const { linkmans } = ctx.data;

    const histories = await History.find({
        user: ctx.socket.user.toString(),
        linkman: {
            $in: linkmans,
        },
    });
    const historyMap = histories
        .filter(Boolean)
        .reduce((result: { [linkman: string]: string }, history) => {
            result[history.linkman] = history.message;
            return result;
        }, {});

    const linkmansMessages = await Promise.all(
        linkmans.map(async (linkmanId) => {
            const messages = await Message.find(
                { to: linkmanId },
                {
                    type: 1,
                    content: 1,
                    from: 1,
                    createTime: 1,
                    deleted: 1,
                },
                {
                    sort: { createTime: -1 },
                    limit: historyMap[linkmanId] ? 100 : FirstTimeMessagesCount,
                },
            ).populate('from', { username: 1, avatar: 1, tag: 1 });
            await handleInviteV2Messages(messages);
            return messages;
        }),
    );

    type ResponseData = {
        [linkmanId: string]: {
            messages: MessageDocument[];
            unread: number;
        };
    };
    const responseData = linkmans.reduce(
        (result: ResponseData, linkmanId, index) => {
            const messages = linkmansMessages[index];
            if (historyMap[linkmanId]) {
                const messageIndex = messages.findIndex(
                    ({ _id }) => _id.toString() === historyMap[linkmanId],
                );
                result[linkmanId] = {
                    messages: messages.slice(0, 15).reverse(),
                    unread: messageIndex === -1 ? 100 : messageIndex,
                };
            } else {
                result[linkmanId] = {
                    messages: messages.reverse(),
                    unread: 0,
                };
            }
            return result;
        },
        {},
    );

    return responseData;
}

/**
 * 获取联系人的历史消息
 * @param ctx Context
 */
export async function getLinkmanHistoryMessages(
    ctx: Context<{ linkmanId: string; existCount: number }>,
) {
    const { linkmanId, existCount } = ctx.data;

    const messages = await Message.find(
        { to: linkmanId },
        {
            type: 1,
            content: 1,
            from: 1,
            createTime: 1,
            deleted: 1,
        },
        {
            sort: { createTime: -1 },
            limit: EachFetchMessagesCount + existCount,
        },
    ).populate('from', { username: 1, avatar: 1, tag: 1 });
    await handleInviteV2Messages(messages);
    const result = messages.slice(existCount).reverse();
    return result;
}

/**
 * 获取默认群组的历史消息
 * @param ctx Context
 */
export async function getDefaultGroupHistoryMessages(
    ctx: Context<{ existCount: number }>,
) {
    const { existCount } = ctx.data;

    const group = await Group.findOne({ isDefault: true });
    if (!group) {
        throw new AssertionError({ message: '默认群组不存在' });
    }
    const messages = await Message.find(
        { to: group._id },
        {
            type: 1,
            content: 1,
            from: 1,
            createTime: 1,
            deleted: 1,
        },
        {
            sort: { createTime: -1 },
            limit: EachFetchMessagesCount + existCount,
        },
    ).populate('from', { username: 1, avatar: 1, tag: 1 });
    await handleInviteV2Messages(messages);
    const result = messages.slice(existCount).reverse();
    return result;
}

/**
 * 删除消息, 需要管理员权限
 */
export async function deleteMessage(ctx: Context<{ messageId: string }>) {
    assert(
        !client.disableDeleteMessage || ctx.socket.isAdmin,
        '已禁止撤回消息',
    );

    const { messageId } = ctx.data;
    assert(messageId, 'messageId不能为空');

    const message = await Message.findOne({ _id: messageId });
    if (!message) {
        throw new AssertionError({ message: '消息不存在' });
    }
    assert(
        ctx.socket.isAdmin ||
            message.from.toString() === ctx.socket.user.toString(),
        '只能撤回本人的消息',
    );

    if (ctx.socket.isAdmin) {
        await Message.deleteOne({ _id: messageId });
    } else {
        message.deleted = true;
        await message.save();
    }

    /**
     * 广播删除消息通知, 区分群消息和私聊消息
     */
    const messageName = 'deleteMessage';
    const messageData = {
        linkmanId: message.to.toString(),
        messageId,
        isAdmin: ctx.socket.isAdmin,
    };
    if (isValid(message.to)) {
        // 群消息
        ctx.socket.emit(message.to.toString(), messageName, messageData);
    } else {
        // 私聊消息
        const targetUserId = message.to.replace(ctx.socket.user.toString(), '');
        const targetSockets = await Socket.find({ user: targetUserId });
        const targetSocketIdList =
            targetSockets?.map((socket) => socket.id) || [];
        if (targetSocketIdList) {
            ctx.socket.emit(targetSocketIdList, messageName, messageData);
        }

        const selfSockets = await Socket.find({ user: ctx.socket.user });
        const selfSocketIdList = selfSockets?.map((socket) => socket.id) || [];
        if (selfSocketIdList) {
            ctx.socket.emit(
                selfSocketIdList.filter(
                    (socketId) => socketId !== ctx.socket.id,
                ),
                messageName,
                messageData,
            );
        }
    }

    return {
        msg: 'ok',
    };
}
