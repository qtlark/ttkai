import WuZeiNiangImage from '@fiora/assets/images/wuzeiniang.gif';
import AtriImage from '@fiora/assets/images/atri.gif';
import AliceImage from '@fiora/assets/images/alice.jpg';

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
        message.from.tag = '看板娘';

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
                message.content = `:「${content.ask}」<hr><font color=OrangeRed>ChatGPT</font>：${content.answer.replaceAll('<', '≺').replaceAll('>', '≻').replaceAll('\n\n','<br>').replaceAll('\n','<br>')}`;
                message.from.avatar = AtriImage;
                message.from.username = '亚托莉';
                message.from.tag = '萝卜子';
                break;
            }
            case 'sys': {
                message.from.originUsername = ''
                message.content = content.tt.replace(/0#/gm, "<br>").replace(/(@[\u4e00-\u9fa5_a-zA-Z0-9]+)/gm, "<font color=8A2BE2>$1</font>");
                message.from.avatar = AliceImage;
                message.from.username = '爱丽丝';
                message.from.tag = '扫地机器人';
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



export default function convertMessage(message: any) {
    convertSystemMessage(message);
    return message;
}
