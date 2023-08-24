import React from 'react';
import Style from './Message.less';
import jhconvert from './jh';

interface ReplyMessageProps {
    content: string;
}



function ReplyMessage(props: ReplyMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jscontent = JSON.parse(props.content);
    const imgRegex = /^.+width=(.+)&height=(.+)$/;
    var content = `<font color=8A2BE2>${jhconvert(jscontent.replywho)}</font>:「${jhconvert(jscontent.orignmsg)}」<hr>${jhconvert(jscontent.replymsg)}`;
    if (imgRegex.test(jscontent.orignmsg)) {
        const regexResult = imgRegex.exec(jscontent.orignmsg);
        const p_width = 110;
        const p_height = parseInt(parseInt(regexResult[2]) * p_width / parseInt(regexResult[1]));

        return (
            <div className={`${Style.textMessage} ${Style.replyimg}`} >
                <font style={{color:'8A2BE2'}}>{jhconvert(jscontent.replywho)}</font>
                <div style={{textAlign: 'center'}}>
                    <img src={jscontent.orignmsg} style={{width: `${p_width}px`, height: `${p_height}px`, marginTop: '5px'}} />
                </div>
                <hr>
                {jhconvert(jscontent.replymsg)}
            </div>
        );
    }else{
        return (
            <div
                className={`${Style.textMessage}`}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
    

}

export default ReplyMessage;
