import React from 'react';

import Style from './IconButton.less';

type Props = {
    width: number;
    height: number;
    icon: string;
    iconSize: number;
    className?: string;
    style?: Object;
    onClick?: () => void;
};


function IconButton2({
    width,
    height,
    icon,
    iconSize,
    onClick = () => {},
    className = '',
    style = {},
}: Props) {
    return (
        <div
            className={`${Style.iconButton} ${className}`}
            style={{ width, height, ...style }}
            onClick={onClick}
            role="button"
        >
            <i
                className={`iconfont2 icon-${icon}`}
                style={{ fontSize: iconSize, lineHeight: `${height}px` }}
            />
        </div>
    );
}

export default IconButton2;
