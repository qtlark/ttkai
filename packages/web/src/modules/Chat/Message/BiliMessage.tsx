import React from 'react';
import Style from './Message.less';

interface BiliMessageProps {
    content: string;
}


function BiliMessage(props: BiliMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jsc = JSON.parse(props.content);
    const blink = `https://www.bilibili.com/video/${jsc.bvid}`;
    const st = `${jsc.stat.view}播放 ${jsc.stat.like}点赞 ${jsc.stat.danmaku}弹幕`;


    const face = `https://wsrv.nl/?url=${jsc.owner.face}@30h_!web-comment-note.webp`
    const cover= `https://wsrv.nl/?url=${jsc.pic}@300w_!web-comment-note.webp`


    return (
        <div className={Style.textMessage}>
            <div>
                <div>
                    <img src={face}/>
                    <div>{jsc.owner.name}</div>
                </div>

                <a href={blink}>
                    <img src={cover}/>
                </a>

                <div>{st}</div>
            </div>
        </div>
    );
}

export default BiliMessage;
