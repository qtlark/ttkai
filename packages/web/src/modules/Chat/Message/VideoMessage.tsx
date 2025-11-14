import React from 'react';
import Style from './Message.less';

import { isMobile } from '@fiora/utils/ua';

interface VideoMessageProps {
    content: string;
}

function VideoMessage(props: VideoMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const q_width = isMobile?200:260;
    const content = `<video style="
        width: ${q_width}px;
        margin-bottom: -5px;
        border-radius: 5px;"
        src="${props.content}" controls controlslist="nodownload noplaybackrate" disablePictureInPicture></video>`;

    return (
        <div className={Style.textMessage} dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    );
}

export default VideoMessage;
