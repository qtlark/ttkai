import React from 'react';
import Style from './Message.less';

interface ReplyMessageProps {
    content: string;
}


function ReplyMessage(props: ReplyMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jsc = JSON.parse(props.content);
    const blink = `https://www.bilibili.com/video/${jsc.bvid}`
    const st = `${jsc.stat.view}播放 ${jsc.stat.like}点赞 ${jsc.stat.danmaku}弹幕`


    return (
        <div className={Style.textMessage}>
            <div>
                <div>
                    <img src={jsc.owner.face}>
                    <div>{jsc.owner.name}</div>
                </div>

                <a href={blink}>
                    <img src={jsc.pic}>
                </a>

                <div>{st}</div>
            </div>
        </div>
    );
}

export default ReplyMessage;
