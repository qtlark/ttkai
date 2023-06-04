import React from 'react';
import { getPerRandomColor } from '@fiora/utils/getRandomColor';

interface SystemMessageProps {
    message: string;
    username: string;
}

function SystemMessage(props: SystemMessageProps) {
    const { message, username } = props;
    return (
        <div className="system" dangerouslySetInnerHTML={{ __html: message }}>
            <span style={{ color: getPerRandomColor(username) }}>
                {username}
            </span>
            &nbsp;
        </div>
    );
}

export default SystemMessage;
