import React from 'react';
import Style from './Message.less';

import { isMobile } from '@fiora/utils/ua';

interface MusicMessageProps {
    content: string;
}

function MusicMessage(props: MusicMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const q_width = isMobile?200:260;
    const content = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=${q_width} height=86 src="https://music.163.com/outchain/player?type=2&id=${props.content}&auto=0&height=66"></iframe>`;

    return (
        <div className={Style.textMessage} style={{margin:'-10px -12px -14px -12px', height: '90px', width:`${q_width}px`}} dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    );
}

export default MusicMessage;
