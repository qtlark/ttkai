import WuZeiNiangImage from '@fiora/assets/images/wuzeiniang.gif';

// function convertRobot10Message(message) {
//     if (message.from._id === '5adad39555703565e7903f79') {
//         try {
//             const parseMessage = JSON.parse(message.content);
//             message.from.tag = parseMessage.source;
//             message.from.avatar = parseMessage.avatar;
//             message.from.username = parseMessage.username;
//             message.type = parseMessage.type;
//             message.content = parseMessage.content;
//         } catch (err) {
//             console.warn('解析robot10消息失败', err);
//         }
//     }
// }

function convertSystemMessage(message: any) {
    if (message.type === 'system') {
        message.from._id = 'system';
        message.from.originUsername = message.from.username;
        message.from.username = '乌贼娘殿下';
        message.from.avatar = WuZeiNiangImage;
        message.from.tag = 'system';

        const content = JSON.parse(message.content);
        switch (content.command) {
            case 'roll': {
                message.content = `掷出了${content.value}点 (上限${content.top}点)`;
                break;
            }
            case 'rps': {
                message.content = `使出了 ${content.value}`;
                break;
            }
            case 'gpt': {
                message.content = `:「${content.ask}」<hr><font color=OrangeRed>ChatGPT：</font>${content.answer.replaceAll('<', '≺').replaceAll('>', '≻').replaceAll('\n\n','<br>').replaceAll('\n','<br>')}`;
                break;
            }
            default: {
                message.content = '不支持的指令';
            }
        }
    } else if (message.deleted) {
        message.type = 'system';
        message.from._id = 'system';
        message.from.originUsername = message.from.username;
        message.from.username = '乌贼娘殿下';
        message.from.avatar = WuZeiNiangImage;
        message.from.tag = 'system';
        message.content = `撤回了消息`;
    }
}

function jhconvert(strstr: string){
    return strstr
    .replace(/</gm, "≺")
    .replace(/>/gm, "≻")
    .replace(/x([0-9a-fA-F]{6}|[0-9a-fA-F]{3})#(\S+)/gm, "<font color=$1>$2</font>")
    .replace(/0#/gm, "<br>")
    .replace(/1#(\S+)/gm, "<b>$1</b>")
    .replace(/2#(\S+)/gm ,"<i>$1</i>")
    .replace(/3#(\S+)/gm, "<u>$1</u>")
    .replace(/4#(\S+)/gm, "<s>$1</s>")
    .replace(/red#(\S+)/gm,   "<font color=red>$1</font>")
    .replace(/blue#(\S+)/gm, "<font color=blue>$1</font>")
    .replace(/aqua#(\S+)/gm, "<font color=aqua>$1</font>")
    .replace(/(^@|\W@)(\S+)/gm, "<font color=8A2BE2>@$1</font>");
}

function convertMessageHtml(message: any) {
    if (message.type === 'text') {
        message.content = jhconvert(message.content)

    }
    return message;
}

function convertMessageReply(message: any) {
    if (message.type === 'reply') {
        const content = JSON.parse(message.content);
        message.content = `<font color=8A2BE2>${content.replywho}:</font>「${content.orignmsg}」<hr>${jhconvert(content.replymsg)}`;
    }
    return message;
}


export default function convertMessage(message: any) {
    convertSystemMessage(message);
    convertMessageHtml(message);
    convertMessageReply(message);
    return message;
}
