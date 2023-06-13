/**
 * xss防护
 * @param text 要处理的文字
 */
export default function jhconvert(text: string) {
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
    .replace(/(^|\W+)@(\S+)/gm, "<font color=8A2BE2>@$2</font> $1");
}
