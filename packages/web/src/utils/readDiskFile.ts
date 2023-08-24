export interface ReadFileResult {
    /** 文件名 */
    filename: string;
    /** 文件拓展名 */
    ext: string;
    /** 文件类型 */
    type: string;
    /** 文件内容 */
    result: Blob | ArrayBuffer | string;
    /** 文件长度 */
    length: number;
}

/**
 * 读取本地文件
 * @param {string} resultType 数据类型, {blob|base64}, 默认blob
 * @param {string} accept 可选文件类型, 默认 * / *
 */
export default async function readDiskFIle(
    resultType = 'blob',
    accept = '*/*',
) {
    const result: ReadFileResult | null = await new Promise((resolve) => {
        const $input = document.createElement('input');
        $input.style.display = 'none';
        $input.setAttribute('type', 'file');
        $input.setAttribute('accept', accept);
        // 判断用户是否点击取消, 原生没有提供专门事件, 用hack的方法实现
        $input.onclick = () => {
            // @ts-ignore
            $input.value = null;
            document.body.onfocus = () => {
                // onfocus事件会比$input.onchange事件先触发, 因此需要延迟一段时间
                setTimeout(() => {
                    if ($input.value.length === 0) {
                        resolve(null);
                    }
                    document.body.onfocus = null;
                }, 500);
            };
        };
        $input.onchange = (e: Event) => {
            // @ts-ignore
            const file = e.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onloadend = function handleLoad() {
                if (!this.result) {
                    resolve(null);
                    return;
                }
                // @ts-ignore
                resolve({
                    filename: file.name,
                    ext: file.name
                        .split('.')
                        .pop()
                        .toLowerCase(),
                    type: file.type,
                    // @ts-ignore
                    result: this.result,
                    length:
                        resultType === 'blob' || (resultType === 'yasuo' && (file.type === 'image/gif' || file.type === 'image/webp'))
                            ? (this.result as ArrayBuffer).byteLength
                            : (this.result as string).length,
                });
            };

            switch (resultType) {
                case 'blob': {
                    reader.readAsArrayBuffer(file);
                    break;
                }
                case 'base64': {
                    reader.readAsDataURL(file);
                    break;
                }
                case 'yasuo': {
                    if (file.type === 'image/gif' || file.type === 'image/webp') {
                        reader.readAsArrayBuffer(file);
                    } else {
                        reader.readAsDataURL(file);
                    }
                    break;
                }
                default: {
                    reader.readAsArrayBuffer(file);
                }
            }
        };
        $input.click();
    });

    if (result && resultType === 'blob') {
        result.result = new Blob(
            [new Uint8Array(result.result as ArrayBuffer)],
            {
                type: result.type,
            },
        );
    }

    if (result && resultType === 'yasuo') {
        if (result.type === 'image/gif' || result.type === 'image/webp') {
            result.result = new Blob(
                [new Uint8Array(result.result as ArrayBuffer)],
                {
                    type: result.type,
                },
            );
        } else {
            const sz = result.length/1000;
            result.type = 'image/webp';
            result.result = await compressionFile(result.result, sz<500?0.8:sz<1000?0.9:sz<3000?0.8:0.7);
        }

    }
    return result;
}


const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.src = dataURL
    })
}

const canvastoFile = (canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}

const compressionFile = async (file, quality = 0.9) => {

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    const img = await dataURLToImage(file)

    canvas.width = img.width
    canvas.height = img.height

    context.clearRect(0, 0, img.width, img.height)
    context.drawImage(img, 0, 0, img.width, img.height)

    const blob = (await canvastoFile(canvas, 'image/webp', quality)) as Blob

    context.clearRect(0, 0, img.width, img.height)

    return blob
}