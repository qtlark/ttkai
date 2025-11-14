import React from 'react';
import Style from './Message.less';

import { isMobile } from '@fiora/utils/ua';

interface AudioMessageProps {
    content: string;
}

function AudioMessage(props: AudioMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const q_width = isMobile?200:260;
    const content = `<audio style="
        height: 30px;
        width: ${q_width}px;
        margin-bottom: -4px;"
        src="${props.content}" controls controlslist="nodownload noplaybackrate"></audio>`;

    return (
        <div className={Style.textMessage} dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    );
}

export default AudioMessage;
