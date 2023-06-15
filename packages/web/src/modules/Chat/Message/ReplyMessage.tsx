import React from 'react';

import expressions from '@fiora/utils/expressions';
import { TRANSPARENT_IMAGE } from '@fiora/utils/const';
import Style from './Message.less';
import jhconvert from './jh';

interface ReplyMessageProps {
    content: string;
}


function convertMessageReply(message: any) {
    if (message.type === 'reply') {
        const content = JSON.parse(message.content);
        message.content = `<font color=8A2BE2>${content.replywho}</font>:「${content.orignmsg}」<hr>${content.replymsg}`;
    }
    return message;
}


function ReplyMessage(props: ReplyMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const jscontent = JSON.parse(props.content);
    const content   = `<font color=8A2BE2>${jhconvert(jscontent.replywho)}</font>:「${jhconvert(jscontent.orignmsg)}」<hr>${jhconvert(jscontent.replymsg)}`

    return (
        <div
            className={Style.textMessage}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default ReplyMessage;
