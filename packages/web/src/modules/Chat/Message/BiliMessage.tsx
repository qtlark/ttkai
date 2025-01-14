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

function twoline(tit: any){
    if(tit.length>25){
        return tit.substring(0,25) + '...'
    }
    return tit
}


function BiliMessage(props: BiliMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jsc = JSON.parse(props.content);

    if(jsc.keyframe){
        var blink = `https://live.bilibili.com/${jsc.room_id}`;
        var name  = jsc.info.uname;
        var face  = jsc.info.face;
        
        if(jsc.user_cover.length>0){
            var cover = jsc.user_cover;
        }else{
            var cover = jsc.keyframe;
        }
        
        var info  = [`${bignum(jsc.online)}人气`, `${bignum(jsc.attention)}粉丝`, `${jsc.exp.master_level.level}等级`];
    }else{
        var blink = `https://www.bilibili.com/video/${jsc.bvid}`;
        var name  = jsc.owner.name
        var face  = jsc.owner.face;
        var cover = jsc.pic;
        var info  = [`${bignum(jsc.stat.view)}播放`, `${bignum(jsc.stat.like)}点赞`, `${bignum(jsc.stat.danmaku)}弹幕`];
    }


    return (
        <div className={Style.biliMessage}>
            <div>

                <div className={Style.title}>{twoline(jsc.title)}</div>
                <hr />

                <div className={Style.clo}>
                    <img src={face} className={Style.face} crossorigin="*"/>
                    <div className={Style.upname}>{name}</div>
                    <div className={Style.up}>{jsc.keyframe?'主播':'UP主'}</div>
                </div>

                

                <a href={blink} target="_blank" className={Style.blink}>
                    <img src={cover} className={Style.co} crossorigin="*"/>
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
