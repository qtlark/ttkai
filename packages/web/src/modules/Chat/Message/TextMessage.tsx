import React from 'react';
import Style from './Message.less';
import jhconvert from './jh';

interface TextMessageProps {
    content: string;
}

function TextMessage(props: TextMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const mcRegex   = /^\w{32}(#\w{32})?#.+#.+$/;
    
    var content = props.content;

    if (! mcRegex.test(content)) {
        content = jhconvert(content);
    }

    return (
        <div
            className={Style.textMessage}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default TextMessage;
