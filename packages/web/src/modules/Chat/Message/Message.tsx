import React, { Component, createRef } from 'react';
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';


import Time from '@fiora/utils/time';
import { getRandomColor, getPerRandomColor } from '@fiora/utils/getRandomColor';
import client from '@fiora/config/client';
import Style from './Message.less';
import Avatar from '../../../components/Avatar';
import TextMessage from './TextMessage';
import { ShowUserOrGroupInfoContext } from '../../../context';

import ImageMessage from './ImageMessage';
import CodeMessage from './CodeMessage';
import UrlMessage from './UrlMessage';
import InviteMessageV2 from './InviteMessageV2';
import SystemMessage from './SystemMessage';
import FileMessage from './FileMessage';

import store from '../../../state/store';
import { ActionTypes, DeleteMessagePayload } from '../../../state/action';
import { deleteMessage } from '../../../service';
import IconButton from '../../../components/IconButton';
import IconButton2 from '../../../components/IconButton2';
import { State } from '../../../state/reducer';
import Tooltip from '../../../components/Tooltip';
import themes from '../../../themes';

import {Message as minfo} from '../../../components/Message';

import ReplyMessage from './ReplyMessage';
import BiliMessage from './BiliMessage';
import MusicMessage from './MusicMessage';



import { addExpression } from '../../../service';


const { dispatch } = store;

interface MessageProps {
    id: string;
    linkmanId: string;
    isSelf: boolean;
    userId: string;
    avatar: string;
    username: string;
    originUsername: string;
    tag: string;
    time: string;
    type: string;
    content: string;
    loading: boolean;
    percent: number;
    shouldScroll: boolean;
    tagColorMode: string;
    isAdmin?: boolean;
}

interface MessageState {
    showDeleteList: boolean;
    showReplyList: boolean;
    showImgList: boolean;
}

/**
 * Message组件用hooks实现有些问题
 * 功能上要求Message组件渲染后触发滚动, 实测中发现在useEffect中触发滚动会比在componentDidMount中晚
 * 具体表现就是会先看到历史消息, 然后一闪而过再滚动到合适的位置
 */
@pureRender
class Message extends Component<MessageProps, MessageState> {
    $container = createRef<HTMLDivElement>();

    constructor(props: MessageProps) {
        super(props);
        this.state = {
            showDeleteList: false,
            showReplyList: false,
            showImgList: false,
        };
    }

    componentDidMount() {
        const { shouldScroll } = this.props;
        if (shouldScroll) {
            // @ts-ignore
            this.$container.current.scrollIntoView();
        }
    }

    handleMouseEnter = () => {
        const { isAdmin, isSelf, type, content } = this.props;
        if (type === 'system') {
            return;
        }
        if (isAdmin || (!client.disableDeleteMessage && isSelf)) {
            this.setState({ showDeleteList: true });
        }
        if (!isAdmin && (type==='text' || type==='reply' || type==='bilibili' ) && !isSelf) {
            this.setState({ showReplyList: true  });
        }
        if (!isAdmin &&  type==='image'  && !content.includes("ImageMessage")  &&!isSelf) {
            this.setState({ showImgList: true  });
        }
    };

    handleMouseLeave = () => {
            this.setState({ showDeleteList: false, showReplyList: false, showImgList: false });
    };

    /**
     * 管理员撤回消息
     */
    handleDeleteMessage = async () => {
        const { id, linkmanId, loading, isAdmin } = this.props;
        if (loading) {
            dispatch({
                type: ActionTypes.DeleteMessage,
                payload: {
                    linkmanId,
                    messageId: id,
                    shouldDelete: isAdmin,
                } as DeleteMessagePayload,
            });
            return;
        }

        const isSuccess = await deleteMessage(id);
        if (isSuccess) {
            dispatch({
                type: ActionTypes.DeleteMessage,
                payload: {
                    linkmanId,
                    messageId: id,
                    shouldDelete: isAdmin,
                } as DeleteMessagePayload,
            });
            this.setState({ showDeleteList: false});
        }
    };

    handleAddExpression = async () => {
        const { type, content, username, qwe } = this.props;
        addExpression(content);
        minfo.success('添加表情成功');
        this.setState({ showImgList: false});
    };

    handleReplyMessage = async () => {
        const { type, content, username, qwe } = this.props;
        if (type==='text'){
            qwe.current.insertCursor(`回复${username}「${content}」:   `);
        }else if (type==='reply'){
            const jscontent = JSON.parse(content);
            qwe.current.insertCursor(`回复${username}「${jscontent.replymsg}」:   `);
        }else if (type=='bilibili'){
            const jscontent = JSON.parse(content);
            qwe.current.insertCursor(`回复${username}的B站分享「${jscontent.title}」:   `);
        }else if (type=='image'){
            qwe.current.insertCursor(`回复${username}的图片「${content}」:   `);
        }
        this.setState({ showReplyList: false});
    };

    handleClickAvatar(showUserInfo: (userinfo: any) => void) {
        const { isSelf, userId, type, username, avatar } = this.props;
        if (!isSelf && type !== 'system') {
            showUserInfo({
                _id: userId,
                username,
                avatar,
            });
        }
    }

    formatTime() {
        const { time } = this.props;
        const messageTime = new Date(time);
        const nowTime = new Date();
        if (Time.isToday(nowTime, messageTime)) {
            return Time.getHourMinute(messageTime);
        }
        if (Time.isYesterday(nowTime, messageTime)) {
            return `昨天 ${Time.getHourMinute(messageTime)}`;
        }
        return `${Time.getMonthDate(messageTime)} ${Time.getHourMinute(
            messageTime,
        )}`;
    }

    renderContent() {
        const { type, content, loading, percent, originUsername } = this.props;
        switch (type) {
            case 'text': {
                return <TextMessage content={content} />;
            }
            case 'reply': {
                return <ReplyMessage content={content} />;
            }
            case 'bilibili': {
                return <BiliMessage content={content} />;
            }
            case 'music': {
                return <MusicMessage content={content} />;
            }
            case 'image': {
                return (
                    <ImageMessage
                        src={content}
                        loading={loading}
                        percent={percent}
                    />
                );
            }
            case 'file': {
                return <FileMessage file={content} percent={percent} />;
            }
            case 'code': {
                return <CodeMessage code={content} />;
            }
            case 'url': {
                return <UrlMessage url={content} />;
            }
            case 'inviteV2': {
                return <InviteMessageV2 inviteInfo={content} />;
            }
            case 'system': {
                return (
                    <SystemMessage
                        message={content}
                        username={originUsername}
                    />
                );
            }
            default:
                return <div className="unknown">不支持的消息类型</div>;
        }
    }

    render() {
        const { isSelf, avatar, tag, tagColorMode, username } = this.props;
        const { showDeleteList, showReplyList, showImgList } = this.state;

        let tagColor = `rgb(${themes.default.primaryColor})`;
        if (tagColorMode === 'fixedColor') {
            tagColor = getRandomColor(tag);
        } else if (tagColorMode === 'randomColor') {
            tagColor = getPerRandomColor(username);
        }

        return (
            <div
                className={`${Style.message} ${isSelf ? Style.self : ''}`}
                ref={this.$container}
            >
                <ShowUserOrGroupInfoContext.Consumer>
                    {(context) => (
                        <Avatar
                            className={Style.avatar}
                            src={avatar}
                            size={44}
                            onClick={() =>
                                // @ts-ignore
                                this.handleClickAvatar(context.showUserInfo)
                            }
                        />
                    )}
                </ShowUserOrGroupInfoContext.Consumer>
                <div className={Style.right}>
                    <div className={Style.nicknameTimeBlock}>
                        {tag && (
                            <span
                                className={Style.tag}
                                style={{ backgroundColor: tagColor }}
                            >
                                {tag}
                            </span>
                        )}
                        <span className={Style.nickname}>{username}</span>
                        <span className={Style.time}>{this.formatTime()}</span>
                    </div>
                    <div
                        className={Style.contentButtonBlock}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                    >
                        <div className={Style.content}>
                            {this.renderContent()}
                        </div>
                        {showDeleteList && (
                            <div className={Style.buttonList}>
                                <Tooltip
                                    placement={isSelf ? 'left' : 'right'}
                                    mouseEnterDelay={0.3}
                                    overlay={<span>撤回消息</span>}
                                >
                                    <div>
                                        <IconButton
                                            className={Style.button}
                                            icon="recall"
                                            iconSize={16}
                                            width={20}
                                            height={20}
                                            onClick={this.handleDeleteMessage}
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                        )}

                        {showReplyList && (
                            <div className={Style.buttonList}>
                                <Tooltip
                                    placement={isSelf ? 'left' : 'right'}
                                    mouseEnterDelay={0.3}
                                    overlay={<span>回复消息</span>}
                                >
                                    <div>
                                        <IconButton
                                            className={Style.button}
                                            icon="chat"
                                            iconSize={16}
                                            width={20}
                                            height={20}
                                            onClick={this.handleReplyMessage}
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                        )}

                        {showImgList && (
                            <div className={Style.buttonList}>
                                <Tooltip
                                    placement={isSelf ? 'left' : 'right'}
                                    mouseEnterDelay={0.3}
                                    overlay={<span>收藏表情</span>}
                                >
                                    <div>
                                        <IconButton2
                                            className={Style.button}
                                            icon="shoucang"
                                            iconSize={16}
                                            width={20}
                                            height={20}
                                            onClick={this.handleReplyMessage}
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                    <div className={Style.arrow} />
                </div>
            </div>
        );
    }
}

export default connect((state: State) => ({
    isAdmin: !!(state.user && state.user.isAdmin),
}))(Message);
