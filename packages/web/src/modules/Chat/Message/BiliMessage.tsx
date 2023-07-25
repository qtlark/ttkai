import React from 'react';
import Style from './BiliMessage.less';

interface BiliMessageProps {
    content: string;
}

function bignum(num: any){
    if (num<10000){
        num = num + '';
    }else if (num<100000){
        num = (num / 10000).toFixed(1) + 'W'
    }else if (num<10000000){
        num = (num / 10000).toFixed(0) + 'W'
    }else{
        num = (num / 10000000).toFixed(0) + 'KW'
    }
    return num;
}


function BiliMessage(props: BiliMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const picRegex = /hdslb.com(.*)/;
    const jsc = JSON.parse(props.content);

    if(jsc.keyframe){
        var blink = `https://live.bilibili.com/${jsc.room_id}`;
        var face  = `/bpi/bfs/face/8f6a614a48a3813d90da7a11894ae56a59396fcd.jpg@30w_!web-avatar-search-user.webp.webp`;
        var cover = `/bpi${picRegex.exec(jsc.user_cover)[1]}@300w_!web-search-common-cover.webp`;
        var info  = [`${jsc.room_id}房号`, `${bignum(jsc.online)}人气`, `${bignum(jsc.attention)}关注`];
    }else{
        var blink = `https://www.bilibili.com/video/${jsc.bvid}`;
        var face  = `/bpi${picRegex.exec(jsc.owner.face)[1]}@30w_!web-avatar-search-user.webp.webp`;
        var cover = `/bpi${picRegex.exec(jsc.pic       )[1]}@300w_!web-search-common-cover.webp`;
        var info  = [`${bignum(jsc.stat.view)}播放`, `${bignum(jsc.stat.like)}点赞`, `${bignum(jsc.stat.danmaku)}弹幕`];
    }


    return (
        <div className={Style.biliMessage}>
            <div>

                <div className={Style.title}>{jsc.title}</div>
                <hr />

                <div className={Style.clo}>
                    <img src={face} className={Style.face}/>
                    <div className={Style.upname}>{jsc.owner.name}</div>
                    <div className={Style.up}>UP主</div>
                </div>

                

                <a href={blink} target="_blank" className={Style.blink}>
                    <img src={cover} className={Style.co}/>
                </a>

                <div className={Style.st}>
                    <div>{info[0]}</div>
                    <div>{info[1]}</div>
                    <div>{info[2]}</div>
                </div>
            </div>
        </div>
    );
}

export default BiliMessage;
