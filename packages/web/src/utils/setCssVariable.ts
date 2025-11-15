/**
 * set global css variable
 * @param color primary color, three numbers split with comma, like 255,255,255
 * @param textColor text colore, format like color
 */
export default function setCssVariable(color: string, textColor: string, anata: string, anataText: string) {
    let cssText = '';
    for (let i = 0; i <= 10; i++) {
        cssText += `--primary-color-${i}:rgba(${color}, ${i /
            10});--primary-color-${i}_5:rgba(${color}, ${(i + 0.5) /
            10});--primary-text-color-${i}:rgba(${textColor}, ${i / 10});`;
        cssText += `--anata-color-${i}:rgba(${anata}, ${i /
            10});--anata-color-${i}_5:rgba(${anata}, ${(i + 0.5) /
            10});--anata-text-color-${i}:rgba(${anataText}, ${i / 10});`;
    }
    document.documentElement.style.cssText += cssText;
}
