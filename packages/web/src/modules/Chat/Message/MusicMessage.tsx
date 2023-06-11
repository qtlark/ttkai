import React from 'react';
import Style from './Message.less';

interface MusicMessageProps {
    content: string;
}

function MusicMessage(props: MusicMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const content = `//music.163.com/outchain/player?type=2&id=${props.content}&auto=1&height=66`;

    return (
        <div className={Style.textMessage} style="margin:-10px -12px">
            <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=280 height=86 src={content} />
        </div>
    );
}

export default MusicMessage;
