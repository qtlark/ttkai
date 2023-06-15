import React from 'react';
import Style from './Message.less';
import jhconvert from './jh';

interface TextMessageProps {
    content: string;
}

function TextMessage(props: TextMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const content = jhconvert(props.content);

    return (
        <div
            className={Style.textMessage}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

export default TextMessage;
