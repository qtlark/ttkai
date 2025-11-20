import React, { useEffect, useRef, useState } from 'react';
import Style from './Message.less';

import { isMobile } from '@fiora/utils/ua';

interface MediaMessageProps {
    content: string; 
}


function MediaMessage(props: MediaMessageProps) {
    const mediaRef = useRef<HTMLVideoElement | null>(null);
    const [isAudio, setIsAudio] = useState<boolean | null>(null);


    useEffect(() => {
        const el = mediaRef.current;
        if (!el) return;

        const onLoadedMetadata = () => {
        if (el.videoWidth > 0 || el.videoHeight > 0) {
            setIsAudio(false);
        } else {
            setIsAudio(true);
        }
        };

        el.addEventListener("loadedmetadata", onLoadedMetadata);
        return () => el.removeEventListener("loadedmetadata", onLoadedMetadata);
    }, [props.content]);


    return (
        <div className={Style.textMessage}>
        {isAudio ? (
            <audio
            ref={mediaRef as any}
            src={props.content}
            controls
            controlsList="nodownload noplaybackrate"
            style={{
                width: isMobile ? "150px" : "260px",
                height: "30px",
                marginBottom: "-4px",
            }}
            className={Style.audioMode}
            />
        ) : (
            <video
            ref={mediaRef}
            src={props.content}
            preload="metadata"
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            style={{
                width: isMobile ? "180px" : "260px",
                marginBottom: "-5px",
                borderRadius: "5px",
            }}
            className={Style.videoMode}
            />
        )}
        </div>
    );
}

export default MediaMessage;