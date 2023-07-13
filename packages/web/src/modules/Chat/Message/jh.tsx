import Style from './Message.less';
import expressions from '@fiora/utils/expressions';
import { TRANSPARENT_IMAGE } from '@fiora/utils/const';
/**
 * jh转义
 * @param text 要处理的文字
 */
export default function jhconvert(text: string) {
    const mcRegex   = /^\w{32}(#\w{32})?#.+#.+$/;

    if (! mcRegex.test(text)) {
        return text
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
        .replace(/^@\S+/gm, "<font color=8A2BE2>@$0</font>")
        .replace(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}(\.[a-z]{2,6})?\b(:[0-9]{2,5})?([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            (r) =>
                `<a class="${Style.selecteAble}" href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`,
        )
        .replace(/#\(([\u4e00-\u9fa5a-z]+)\)/g, (r, e) => {
            const index = expressions.default.indexOf(e);
            if (index !== -1) {
                return `<img class="${Style.baidu} ${
                    Style.selecteAble
                }" src="${TRANSPARENT_IMAGE}" style="background-position: left ${-30 *
                    index}px;" onerror="this.style.display='none'" alt="${r}">`;
            }
            return r;
        });
    }
}