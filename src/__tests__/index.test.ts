import GestureJs from '../index';

describe('GestureJs', () => {
    let gestureJs: GestureJs;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it('should initialize with default options', () => {
        const events = {
            upwardSliding: jest.fn(),
            downwardSliding: jest.fn()
        };

        gestureJs = new GestureJs({
            el: container,
            events
        });

        expect(gestureJs).toBeDefined();
    });

    it('should throw error when no events provided', () => {
        expect(() => {
            new GestureJs({
                el: container,
                events: {}
            });
        }).toThrow('请传递手势事件');
    });

    it('should handle mouse swipe gestures', () => {
        const events = {
            rightSliding: jest.fn(),
            leftSliding: jest.fn(),
            upwardSliding: jest.fn(),
            downwardSliding: jest.fn()
        };

        gestureJs = new GestureJs({
            el: container,
            events,
            triggerNum: 40
        });

        // 模拟右滑
        const mouseDownEvent = new MouseEvent('mousedown', {
            clientX: 0,
            clientY: 0
        });
        const mouseUpEvent = new MouseEvent('mouseup', {
            clientX: 100,
            clientY: 0
        });

        container.dispatchEvent(mouseDownEvent);
        container.dispatchEvent(mouseUpEvent);

        expect(events.rightSliding).toHaveBeenCalledWith(100);
    });

    it('should handle mouse wheel events', () => {
        const events = {
            upwardScroll: jest.fn(),
            downwardScroll: jest.fn()
        };

        gestureJs = new GestureJs({
            el: container,
            events
        });

        // 模拟向上滚动
        const wheelEvent = new WheelEvent('wheel', {
            deltaY: -100
        });
        container.dispatchEvent(wheelEvent);

        expect(events.upwardScroll).toHaveBeenCalled();
    });

    it('should handle touch pinch gestures', () => {
        const events = {
            pinchZoom: jest.fn()
        };

        gestureJs = new GestureJs({
            el: container,
            events
        });

        // 模拟双指触摸
        const touchStartEvent = new TouchEvent('touchstart', {
            touches: [
                new Touch({
                    identifier: 1,
                    target: container,
                    clientX: 0,
                    clientY: 0
                }),
                new Touch({
                    identifier: 2,
                    target: container,
                    clientX: 50,
                    clientY: 0
                })
            ]
        });

        const touchMoveEvent = new TouchEvent('touchmove', {
            touches: [
                new Touch({
                    identifier: 1,
                    target: container,
                    clientX: 0,
                    clientY: 0
                }),
                new Touch({
                    identifier: 2,
                    target: container,
                    clientX: 100,
                    clientY: 0
                })
            ]
        });

        container.dispatchEvent(touchStartEvent);
        container.dispatchEvent(touchMoveEvent);

        expect(events.pinchZoom).toHaveBeenCalledWith('enlarge');
    });

    it('should clean up event listeners on uninstall', () => {
        const events = {
            upwardSliding: jest.fn()
        };

        gestureJs = new GestureJs({
            el: container,
            events
        });

        gestureJs.uninstall();

        // 验证事件监听器已被移除
        const mouseDownEvent = new MouseEvent('mousedown');
        container.dispatchEvent(mouseDownEvent);

        expect(events.upwardSliding).not.toHaveBeenCalled();
    });
});