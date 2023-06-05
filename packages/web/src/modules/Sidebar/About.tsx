import React from 'react';

import Dialog from '../../components/Dialog';
import Style from './About.less';
import Common from './Common.less';

interface AboutProps {
    visible: boolean;
    onClose: () => void;
}

function About(props: AboutProps) {
    const { visible, onClose } = props;
    return (
        <Dialog
            className={Style.about}
            visible={visible}
            title="关于"
            onClose={onClose}
        >
            <div>
                <div className={Common.block}>
                    <p className={Common.title}>一些说明</p>
                    <ul>
                        <li>
                        请不要发送站内的资源链接
                        </li>
                        <li>图片不能大于1M，建议换成jpg格式</li>
                        <li>外链图片无大小限制，如果可以请尽量使用高速稳定的图床</li>
                    </ul>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>将ttkai安装到主屏(PWA)</p>
                    <ul>
                        <li>
                            点击地址栏最右边三个点按钮(或者地址栏末尾收藏前的按钮)
                        </li>
                        <li>选择&quot;安装 ttkai&quot;</li>
                    </ul>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>输入框快捷键</p>
                    <ul>
                        <li>Alt + S：发送滑稽</li>
                        <li>Alt + D：发送表情</li>
                    </ul>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>减号终端</p>
                    <ul>
                        <li>骰子：-roll [最大点数]    例：-roll 6</li>
                        <li>猜拳：-rps [没有参数]     例：-rps</li>
                        <li>GPT：-gpt [咨询问题]      例：-gpt 你好</li>
                    </ul>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>井号转义</p>
                    <ul>
                        <li>换行：[段落]#[段落]         例：铁咩#无路赛！</li>
                        <li>颜色：[颜色]#[段落]         例：aqua#阿夸真的是</li>
                        <li>粗体：1#[段落]              例：1#啊这</li>
                        <li>斜体：2#[段落]              例：2#额额</li>
                        <li>下划线：3#[段落]            例：3#咚咚蹬</li>
                        <li>删除线：4#[段落]            例：4#不是</li>
                    </ul>
                </div>
                <div className={Common.block}>
                    <p className={Common.title}>友情链接</p>
                    <ul>
                        <li>
                            <a
                                href="https://www.bilibili.com/"
                                target="_black"
                                rel="noopener noreferrer"
                            >
                                哔哩哔哩
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
}

export default About;
