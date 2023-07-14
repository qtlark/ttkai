import React from 'react';
import Style from './Message.less';
import jhconvert from './jh';

interface ReplyMessageProps {
    content: string;
}



function ReplyMessage(props: ReplyMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jscontent = JSON.parse(props.content);
    const imgRegex  = /^.+width=(.+)&height=(.+)$/;
    var content = `<font color=8A2BE2>${jhconvert(jscontent.replywho)}</font>:「${jhconvert(jscontent.orignmsg)}」<hr>${jhconvert(jscontent.replymsg)}`;
    if (imgRegex.test(jscontent.orignmsg)) {
        content = `<font color=8A2BE2>${jhconvert(jscontent.replywho)}的图片分享</font><br><img src=${jscontent.orignmsg} style="width: 100px;"><hr>${jhconvert(jscontent.replymsg)}`
    }
    
    return (
        <div
            className={Style.textMessage}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default ReplyMessage;
