import React from 'react';
import Style from './Message.less';

import { isMobile } from '@fiora/utils/ua';

interface AudioMessageProps {
    content: string;
}

function AudioMessage(props: AudioMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const q_width = isMobile?200:260;
    const content = `<audio src="${props.content}" controls></audio>`;

    return (
        <div className={Style.textMessage} style={{margin:'-10px -12px -14px -12px', height: '90px', width:`${q_width}px`}} dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    );
}

export default AudioMessage;
