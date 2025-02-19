import React, { useState, useCallback, useRef, MouseEvent } from 'react';
import loadable from '@loadable/component';

import { isMobile } from '@fiora/utils/ua';
import { getOSSFileUrl } from '../../../utils/uploadFile';
import Style from './Message.less';
import { CircleProgress } from '../../../components/Progress';

const ReactViewerAsync = loadable(
    async () =>
        // @ts-ignore 
        import(/* webpackChunkName: "react-viewer" */ 'react-viewer'),
);

interface ImageMessageProps {
    src: string;
    loading: boolean;
    percent: number;
}

function ImageMessage(props: ImageMessageProps) {
    const { src, loading, percent } = props;
    const [viewer, toggleViewer] = useState(false);
    const closeViewer = useCallback(() => toggleViewer(false), []);
    const $container = useRef(null);

    let imageSrc = src;
    const containerWidth = isMobile ? window.innerWidth - 25 - 50 : 450;
    const maxWidth = containerWidth - 100 > 500 ? 500 : containerWidth - 100;
    const maxHeight = 200;
    let width = 200;
    let height = 200;
    const parseResult = /(.+)\?width=([0-9]+)&height=([0-9]+)/.exec(imageSrc);
    if (parseResult) {
        const natureWidth = +parseResult[2];
        const naturehHeight = +parseResult[3];
        let scale = 1;
        if (natureWidth * scale > maxWidth) {
            scale = maxWidth / natureWidth;
        }
        if (naturehHeight * scale > maxHeight) {
            scale = maxHeight / naturehHeight;
        }
        width = natureWidth * scale;
        height = naturehHeight * scale;
        imageSrc = parseResult[1];
    }

    let className = Style.imageMessage;
    if (loading) {
        className += ` ${Style.iamgeLoading}`;
    }
    if (/huaji=true/.test(imageSrc)) {
        className += ` ${Style.huaji}`;
    }

    function handleImageViewerMaskClick(e: MouseEvent) {
        // @ts-ignore
        if (e.target?.tagName !== 'IMG') {
            closeViewer();
        }
    }





    let csimg = imageSrc.includes("hdslb.com")?(
        <img
            className={Style.image}
            src={imageSrc}
            alt="b站图片"
            width={width}
            height={height}
            onClick={() => toggleViewer(true)}
            crossorigin="*"
        />
        ):(
            <img
                className={Style.image}
                src={imageSrc}
                alt="消息图片"
                width={width}
                height={height}
                onClick={() => toggleViewer(true)}
            />
        );

    
    return (
        <>
            <div className={className} ref={$container}>
                {csimg}
                <CircleProgress
                    className={Style.imageProgress}
                    percent={percent}
                    strokeWidth={5}
                    strokeColor="#a0c672"
                    trailWidth={5}
                />
                <div
                    className={`${Style.imageProgress} ${Style.imageProgressNumber}`}
                >
                    {Math.ceil(percent)}%
                </div>
                {viewer && (
                    <ReactViewerAsync
                        // eslint-disable-next-line react/destructuring-assignment
                        visible={viewer}
                        onClose={closeViewer}
                        onMaskClick={handleImageViewerMaskClick}
                        images={[
                            {
                                src: getOSSFileUrl(src, `image/quality,q_95`),
                                alt: '',
                            },
                        ]}
                        noNavbar
                    />
                )}
            </div>
        </>
    );
}

export default React.memo(ImageMessage);
