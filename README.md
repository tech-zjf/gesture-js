## 简介

在前端开发中，我们经常需要对用户的手势进行响应，实现一些交互效果，比如滑动、缩放等。本文介绍了如何编写一个通用的手势控制库 GestureJs，用于在 PC 和移动端实现手势控制功能。

## 背景

在前端开发中，我们常常需要处理用户的手势操作，例如在移动端实现滑动翻页、图片缩放等功能，或者在 PC 端实现鼠标滚轮控制页面滚动、拖拽元素等功能。为了统一处理这些手势操作，我们可以编写一个通用的手势控制库，简化开发流程，提高开发效率。

## 功能

GestureJs 库提供了以下功能：

-   监听鼠标和触摸事件，实现对用户手势的响应；
-   支持在 PC 和移动端环境下使用；
-   实现了上下左右滑动、鼠标滚动、缩放等常见手势操作。

## 使用方法

### 安装

您可以通过 npm 安装 GestureJs：

```
npm install gesture-js
```

### 示例代码

```
javascriptCopy code
import GestureJs from 'gesture-js';

const gesture = new GestureJs({
    el:'#root',
    triggerNum:60,
    events:{
       upwardSliding(offset){
            console.log('上滑了:',offset)
        },
        downwardSliding(offset){
            console.log('下滑了:',offset)
        },
        leftSliding(offset){
            console.log('左滑了:',offset)
        },
        rightSliding(offset){
            console.log('右滑了:',offset)
        },
        _upwardScroll(){
            console.log('鼠标滚动向上')
        },
        _downwardScroll(){
            console.log('鼠标滚动向下')
        },
        _pinchZoom(zoomType){
            if(zoomType=='enlarge'){
                console.log('放大')
            }
            if(zoomType=='narrow'){
                console.log('缩小')
            }
        }
    }
})

// 最后记得销毁事件
gesture.uninstall()
```

## 总结

GestureJs 是一个实用的手势控制库，提供了丰富的手势操作功能，能够满足前端开发中对于手势控制的需求。通过引入 GestureJs，您可以轻松地实现页面的手势交互效果，为用户提供更好的使用体验。
