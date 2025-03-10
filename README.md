# GestureJs

[![npm version](https://img.shields.io/npm/v/@tech-zjf/gesture-js.svg)](https://www.npmjs.com/package/@tech-zjf/gesture-js)
[![License](https://img.shields.io/npm/l/@tech-zjf/gesture-js.svg)](https://github.com/yourusername/gesture-js/blob/main/LICENSE)

## 简介

GestureJs 是一个轻量级、高性能的手势控制库，专为现代 Web 应用设计。它提供了统一的 API 来处理在 PC 和移动端的各种手势操作，让开发者能够轻松实现丰富的交互效果。

## 特性

- 🚀 轻量级，零依赖
- 💪 支持 PC 和移动端
- 🎯 TypeScript 编写，类型安全
- 📦 支持 Tree-shaking
- 🛠 丰富的手势支持：
  - 滑动（上、下、左、右）
  - 鼠标滚轮
  - 缩放（放大/缩小）
  - 旋转
  - 长按
  - 双击

## 安装

```bash
# 使用 npm
npm install @tech-zjf/gesture-js

# 使用 yarn
yarn add @tech-zjf/gesture-js

# 使用 pnpm
pnpm add @tech-zjf/gesture-js
```

## 快速开始

```javascript
import GestureJs from '@tech-zjf/gesture-js';

const gesture = new GestureJs({
    el: '#gesture-area',  // 目标元素选择器或 DOM 元素
    triggerNum: 60,       // 触发阈值（像素）
    events: {
        // 基础滑动事件
        upwardSliding: (offset) => {
            console.log('上滑距离:', offset);
        },
        downwardSliding: (offset) => {
            console.log('下滑距离:', offset);
        },
        leftSliding: (offset) => {
            console.log('左滑距离:', offset);
        },
        rightSliding: (offset) => {
            console.log('右滑距离:', offset);
        },
        
        // 滚轮事件
        upwardScroll: () => {
            console.log('向上滚动');
        },
        downwardScroll: () => {
            console.log('向下滚动');
        },
        
        // 多点触控事件
        pinchZoom: (zoomType) => {
            console.log('缩放类型:', zoomType); // 'enlarge' 或 'narrow'
        },
        rotate: (angle) => {
            console.log('旋转角度:', angle);
        },
        
        // 其他触控事件
        longPress: () => {
            console.log('长按事件');
        },
        doubleTap: () => {
            console.log('双击事件');
        }
    }
});

// 在组件卸载时记得销毁实例
gesture.uninstall();
```

## API 文档

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| el | string \| HTMLElement | - | 目标元素的选择器或 DOM 元素 |
| triggerNum | number | 60 | 触发手势的阈值（像素） |
| events | object | - | 手势事件回调配置对象 |

### 事件回调

| 事件名 | 参数 | 说明 |
|--------|------|------|
| upwardSliding | (offset: number) | 上滑事件，返回滑动距离 |
| downwardSliding | (offset: number) | 下滑事件，返回滑动距离 |
| leftSliding | (offset: number) | 左滑事件，返回滑动距离 |
| rightSliding | (offset: number) | 右滑事件，返回滑动距离 |
| upwardScroll | () | 向上滚动事件 |
| downwardScroll | () | 向下滚动事件 |
| pinchZoom | (zoomType: 'enlarge' \| 'narrow') | 缩放事件，返回缩放类型 |
| rotate | (angle: number) | 旋转事件，返回旋转角度 |
| longPress | () | 长按事件 |
| doubleTap | () | 双击事件 |

### 实例方法

| 方法名 | 说明 |
|--------|------|
| uninstall | 销毁实例，移除所有事件监听 |

## 浏览器支持

- Chrome >= 49
- Firefox >= 52
- Safari >= 10
- Edge >= 14
- iOS Safari >= 10
- Android Browser >= 4.4

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/my-feature`
3. 提交改动：`git commit -am '添加新特性'`
4. 推送分支：`git push origin feature/my-feature`
5. 提交 Pull Request

## 开发

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建
npm run build

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 许可证

[MIT](LICENSE)

## 更新日志

### 1.0.1
- 修复移动端触摸事件处理问题
- 优化事件监听机制
- 添加单元测试

### 1.0.0
- 首次发布
- 支持基础手势操作
- 支持 PC 和移动端
