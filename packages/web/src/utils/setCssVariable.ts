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

    const sumRGB = (s: string) => s.split(',').reduce((a, b) => a + +b, 0);
    if(sumRGB(color)<50){
        cssText+=`--icon-color-9: rgba(255, 255, 255, 0.9)`
        cssText+=`--icon-color-7: rgba(255, 255, 255, 0.7)`
        cssText+=`--input-color: rgb(51, 51, 51)`
    }else{
        cssText+=`--icon-color-9: rgba(${color}, 0.9)`
        cssText+=`--icon-color-7: rgba(${color}, 0.7)`
        cssText+=`--input-color: rgb(255, 255, 255)`
    }

    document.documentElement.style.cssText += cssText;
}

