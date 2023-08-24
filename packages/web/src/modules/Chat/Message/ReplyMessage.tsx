import React, { useState, useCallback, MouseEvent } from 'react';
import loadable from '@loadable/component';
import Style from './Message.less';
import jhconvert from './jh';

interface ReplyMessageProps {
    content: string;
}

const ReactViewerAsync = loadable(
    async () =>
        // @ts-ignore 
        import(/* webpackChunkName: "react-viewer" */ 'react-viewer'),
);



function ReplyMessage(props: ReplyMessageProps) {
    // eslint-disable-next-line react/destructuring-assignment
    const [viewer, toggleViewer] = useState(false);
    const closeViewer = useCallback(() => toggleViewer(false), []);

    function handleImageViewerMaskClick(e: MouseEvent) {
        // @ts-ignore
        if (e.target?.tagName !== 'IMG') {
            closeViewer();
        }
    }

    const jscontent = JSON.parse(props.content);
    const imgRegex = /^.+width=(.+)&height=(.+)$/;
    
    var content = `<font color=8A2BE2>${jhconvert(jscontent.replywho)}</font>:「${jhconvert(jscontent.orignmsg)}」<hr>${jhconvert(jscontent.replymsg)}`;
    if (imgRegex.test(jscontent.orignmsg)) {
        const regexResult = imgRegex.exec(jscontent.orignmsg);
        const p_width = 110;
        const p_height = parseInt(parseInt(regexResult[2]) * p_width / parseInt(regexResult[1]));

        

        return (
            <div className={`${Style.textMessage} ${Style.replyimg}`} >
                <font style={{color:'8A2BE2'}}>{jhconvert(jscontent.replywho)}</font>
                <div style={{textAlign: 'center'}}>
                    <img src={jscontent.orignmsg} style={{width: `${p_width}px`, height: `${p_height}px`, marginTop: '5px'}} />
                </div>
                <hr />
                {jhconvert(jscontent.replymsg)}
                {viewer && (
                    <ReactViewerAsync
                        // eslint-disable-next-line react/destructuring-assignment
                        visible={viewer}
                        onClose={closeViewer}
                        onMaskClick={handleImageViewerMaskClick}
                        images={[
                            {
                                src: jscontent.orignmsg,
                                alt: '',
                            },
                        ]}
                        noNavbar
                    />
                )}
            </div>
        );
    }
    
    return (
        <div
            className={`${Style.textMessage}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );

    

}

export default ReplyMessage;
