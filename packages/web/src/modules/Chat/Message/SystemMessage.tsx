import React from 'react';
import { getPerRandomColor } from '@fiora/utils/getRandomColor';

interface SystemMessageProps {
    message: string;
    username: string;
}

function SystemMessage(props: SystemMessageProps) {
    const { message, username } = props;
    return (
        <div className="system">
            <span style={{ color: getPerRandomColor(username) }}>
                {username}
            </span>
            &nbsp;
            <span dangerouslySetInnerHTML={{ __html: message }}>
            </span>
        </div>
    );
}

export default SystemMessage;
