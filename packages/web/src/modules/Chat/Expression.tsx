import React, { useState } from 'react';
import Loading from 'react-loading';

import expressions from '@fiora/utils/expressions';
import { addParam } from '@fiora/utils/url';
import BaiduImage from '@fiora/assets/images/baidu.png';
import Style from './Expression.less';
import {
    Tabs,
    TabPane,
    TabContent,
    ScrollableInkTabBar,
    ScrollableTabBar
} from '../../components/Tabs';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { searchExpression, addExpression, getExpression } from '../../service';
import Message from '../../components/Message';

interface ExpressionProps {
    onSelectText: (expression: string) => void;
    onSelectImage: (expression: string) => void;
}

function Expression(props: ExpressionProps) {
    const { onSelectText, onSelectImage } = props;

    const [keywords, setKeywords] = useState('');
    const [searchLoading, toggleSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    
    //判断图片是否存在
    function validateImage(imgurl: string) {
        return new Promise(function(resolve, reject) {
            var ImgObj = new Image(); //判断图片是否存在
            ImgObj.src = imgurl;
            ImgObj.onload = function(res) {
                resolve(res);
            }
            ImgObj.onerror = function(err) {
                reject(err)
            }
        })
    }

    async function handleGetExpression(e: any) {
        let result = [];
        if(e=='myexp'){
            result = await getExpression();
        }
        setSearchResults(result);
    }

    async function handleSearchExpression() {
        if (keywords) {
            toggleSearchLoading(true);
            setSearchResults([]);
            const result = await searchExpression(keywords);
            if (result) {
                if (result.length !== 0) {
                    setSearchResults(result);
                } else {
                    Message.info('没有相关表情, 换个关键字试试吧');
                }
            }
            toggleSearchLoading(false);
        }
    }

    async function handleDisExpression() {
        if (keywords) {
            toggleSearchLoading(true);
            setSearchResults([]);

            const picRegex = /hdslb.com(.*)/;
            const picRegex2 = /biliimg.com(.*)/;
            var cover = keywords;
            if (picRegex.test(keywords)) {
                cover = `/bpi${picRegex.exec(keywords)[1]}`;
            }
            if (picRegex2.test(keywords)) {
                cover = `/bpi${picRegex2.exec(keywords)[1]}`;
            }
            
            validateImage(cover).then(()=>{
                const result = [{"image":keywords,"width":90,"height":90}];
                setSearchResults(result);
            }).catch(()=>{
                Message.info('无法加载指定链接中的图片');
            })
            toggleSearchLoading(false);
        }
    }

    const renderDefaultExpression = (
        <div className={Style.defaultExpression}>
            {expressions.default.map((e, index) => (
                <div
                    className={Style.defaultExpressionBlock}
                    key={e}
                    data-name={e}
                    onClick={(event) =>
                        onSelectText(event.currentTarget.dataset.name as string)
                    }
                    role="button"
                >
                    <div
                        className={Style.defaultExpressionItem}
                        style={{
                            backgroundPosition: `left ${-30 * index}px`,
                            backgroundImage: `url(${BaiduImage})`,
                        }}
                    />
                </div>
            ))}
        </div>
    );

    function handleClickExpression(e: any) {
        const $target = e.target;
        let url = $target.src;
        if(!url.includes("width=")){
            url = addParam($target.src, {
                width: $target.naturalWidth,
                height: $target.naturalHeight,
            });
        }
        if(!(/\w+:\/\/chat.ttkai.xyz\/\S+/.test(url))){
            addExpression(url);
        }       
        onSelectImage(url);
    }

    const renderSearchExpression = (
        <div className={Style.searchExpression}>
            <div className={Style.searchExpressionInputBlock}>
                <Input
                    className={Style.searchExpressionInput}
                    value={keywords}
                    onChange={setKeywords}
                    onEnter={handleSearchExpression}
                />
                <Button
                    className={Style.searchExpressionButton}
                    onClick={handleSearchExpression}
                >
                    搜索
                </Button>
            </div>
            <div
                className={`${Style.loading} ${
                    searchLoading ? 'show' : 'hide'
                }`}
            >
                <Loading
                    type="spinningBubbles"
                    color="#4A90E2"
                    height={100}
                    width={100}
                />
            </div>
            <div className={Style.searchResult}>
                {searchResults.map(({ image }) => (
                    <div className={Style.searchImage}>
                        <img
                            src={image}
                            alt="表情"
                            key={image}
                            onClick={handleClickExpression}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderOuterExpression = (
        <div className={Style.searchExpression}>
            <div className={Style.searchExpressionInputBlock}>
                <Input
                    className={Style.searchExpressionInput}
                    value={keywords}
                    onChange={setKeywords}
                    onEnter={handleDisExpression}
                />
                <Button
                    className={Style.searchExpressionButton}
                    onClick={handleDisExpression}
                >
                    预览
                </Button>
            </div>
            <div
                className={`${Style.loading} ${
                    searchLoading ? 'show' : 'hide'
                }`}
            >
                <Loading
                    type="spinningBubbles"
                    color="#4A90E2"
                    height={100}
                    width={100}
                />
            </div>
            <div className={Style.searchResult}>
                {searchResults.map(({ image }) => image.includes("hdslb.com")?(
                    <div className={Style.disImage}>
                        <img
                            src={image}
                            alt="b站外链图片"
                            key={image}
                            onClick={handleClickExpression}
                            crossorigin="*"
                        />
                    </div>
                ):(
                    <div className={Style.disImage}>
                        <img
                            src={image}
                            alt="外链搜索图片"
                            key={image}
                            onClick={handleClickExpression}
                        />
                    </div>
                )
                )}
            </div>
        </div>
    );

    const renderMyExpression = (
        <div className={Style.myExpression}>
            <div className={Style.myResult}>
                {searchResults.map(({ image }) => image.includes("hdslb.com")?(
                    <div className={Style.searchImage}>
                        <img
                            src={image}
                            alt="b站收藏图片"
                            key={image}
                            onClick={handleClickExpression}
                            crossorigin="*"
                        />
                    </div>
                ):(
                    <div className={Style.searchImage}>
                        <img
                            src={image}
                            alt="外链收藏图片"
                            key={image}
                            onClick={handleClickExpression}
                        />
                    </div>
                )
                )}
            </div>
        </div>
    );

    return (
        <div className={Style.expression}>
            <Tabs
                defaultActiveKey="default"
                renderTabBar={() => <ScrollableTabBar />}
                renderTabContent={() => <TabContent />}
                onChange={handleGetExpression}
            >
                <TabPane tab="默认表情" key="default">
                    {renderDefaultExpression}
                </TabPane>
                <TabPane tab="收藏夹" key="myexp">
                    {renderMyExpression}
                </TabPane>
                <TabPane tab="搜表情" key="search">
                    {renderSearchExpression}
                </TabPane>
                <TabPane tab="发送外链" key="outer">
                    {renderOuterExpression}
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Expression;
