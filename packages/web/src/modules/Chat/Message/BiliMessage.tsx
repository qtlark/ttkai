import React from 'react';
import Style from './BiliMessage.less';

interface BiliMessageProps {
    content: string;
}


function BiliMessage(props: BiliMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jsc = JSON.parse(props.content);
    const blink = `https://www.bilibili.com/video/${jsc.bvid}`;


    const face = `https://wsrv.nl/?url=${jsc.owner.face}@20h_!web-comment-note.webp`
    const cover= `https://wsrv.nl/?url=${jsc.pic}@200w_!web-comment-note.webp`


    return (
        <div className={Style.biliMessage}>
            <div>

                <div className={Style.title}>{jsc.title}</div>
                <hr />

                <div>
                    <img src={face} className={Style.face}/>
                    <div className={Style.upname}>{jsc.owner.name}</div>
                    <div className={Style.up}>UP主</div>
                </div>

                

                <a href={blink} target="_blank">
                    <img src={cover}/>
                </a>

                <div className={Style.st}>
                    <div>{jsc.stat.view}播放</div>
                    <div>{jsc.stat.like}点赞</div>
                    <div>{jsc.stat.danmaku}弹幕</div>
                </div>
            </div>
        </div>
    );
}

export default BiliMessage;
