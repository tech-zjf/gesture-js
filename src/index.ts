interface GestureOptions {
    el: Window | HTMLElement | string;
    events: GestureEvents;
    triggerNum?: number;
    config?: GestureConfig;
}

interface GestureEvents {
    upwardSliding?: (offset: number) => void;
    downwardSliding?: (offset: number) => void;
    leftSliding?: (offset: number) => void;
    rightSliding?: (offset: number) => void;
    upwardScroll?: () => void;
    downwardScroll?: () => void;
    pinchZoom?: (zoomType: 'enlarge' | 'narrow') => void;
    rotate?: (angle: number) => void;
    longPress?: () => void;
    doubleTap?: () => void;
}

interface GestureConfig {
    isEnd: boolean;
    startPosition: {
        offsetX: number;
        offsetY: number;
    };
    touchFinger: number;
    initialDistance: number;
    initialAngle: number;
    lastTapTime: number;
    longPressTimer: number | null;
    rotationAngle: number;
}

const defaultOptions: GestureOptions = {
    el: window,
    events: {},
    triggerNum: 40,
    config: {
        isEnd: true,
        startPosition: {
            offsetX: 0,
            offsetY: 0
        },
        touchFinger: 1,
        initialDistance: 0,
        initialAngle: 0,
        lastTapTime: 0,
        longPressTimer: null,
        rotationAngle: 0
    }
};

function isMobileBrowser(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

class GestureJs {
    private el: HTMLElement;
    private events: GestureEvents;
    private triggerNum: number;
    private config: GestureConfig;

    constructor(options: GestureOptions) {
        const opt = { ...defaultOptions, ...options };
        this.el =
            typeof opt.el === 'string' ? (document.querySelector(opt.el) as HTMLElement) : (opt.el as HTMLElement);
        this.events = opt.events;
        // 确保 triggerNum 有默认值，避免 undefined
        this.triggerNum = opt.triggerNum !== undefined ? opt.triggerNum : defaultOptions.triggerNum!;
        // 确保 config 有默认值，避免 undefined
        this.config = opt.config !== undefined ? opt.config : defaultOptions.config!;
        this.init();
    }

    private init(): void {
        if (!Object.keys(this.events).length) {
            throw new Error('请传递手势事件');
        }
        if (isMobileBrowser()) {
            this.observeTouchGesture();
        } else {
            // 添加鼠标事件监听
            this.el.addEventListener('mousedown', this.handleMouseDown);
            this.el.addEventListener('mouseup', this.handleMouseUp);
            this.el.addEventListener('wheel', this.handleWheel);
        }
    }

    public uninstall(): void {
        if (isMobileBrowser()) {
            this.unObserveTouchGesture();
        } else {
            this.unObserveMouseGesture();
        }
    }

    private unObserveMouseGesture(): void {
        this.el.removeEventListener('mousedown', this.handleMouseDown);
        this.el.removeEventListener('mouseup', this.handleMouseUp);

        this.el.removeEventListener('wheel', this.handleWheel);
    }

    private unObserveTouchGesture(): void {
        this.el.removeEventListener('touchstart', this.handleTouchStart);
        this.el.removeEventListener('touchmove', this.handleTouchMove);
        this.el.removeEventListener('touchend', this.handleTouchEnd);
    }

    private debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
        let timeout: number | null = null;
        return ((...args: any[]) => {
            if (timeout) clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                func.apply(this, args);
                timeout = null;
            }, wait);
        }) as T;
    }

    private validateEvent(event: Event): boolean {
        if (!event || !this.el || !this.events) {
            console.warn('无效的事件或配置');
            return false;
        }
        return true;
    }

    private handleMouseDown = (event: MouseEvent): void => {
        if (!this.validateEvent(event) || !this.config.isEnd) return;
        try {
            this.config = {
                ...this.config,
                isEnd: false,
                startPosition: {
                    offsetX: event.offsetX,
                    offsetY: event.offsetY
                }
            };
        } catch (error) {
            console.error('处理鼠标按下事件失败:', error);
            this._resetConfig();
        }
    };

    private handleMouseUp = this.debounce((event: MouseEvent): void => {
        if (!this.validateEvent(event) || this.config.isEnd) return;
        try {
            const deltaX = Math.floor(event.offsetX - this.config.startPosition.offsetX);
            const deltaY = Math.floor(event.offsetY - this.config.startPosition.offsetY);
            this._detectSwipeDirection(deltaX, deltaY);
        } catch (error) {
            console.error('处理鼠标抬起事件失败:', error);
        } finally {
            this._resetConfig();
        }
    }, 16);

    private handleWheel = this.debounce((event: WheelEvent): void => {
        if (!this.validateEvent(event)) return;
        try {
            if (event.deltaY > 0) {
                this._downwardScroll();
            } else if (event.deltaY < 0) {
                this._upwardScroll();
            }
        } catch (error) {
            console.error('处理滚轮事件失败:', error);
        }
    }, 16);

    private _detectSwipeDirection(deltaX: number, deltaY: number): void {
        try {
            if (Math.abs(deltaX) < this.triggerNum && Math.abs(deltaY) < this.triggerNum) {
                return;
            }

            const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
            const absDelta = isHorizontal ? Math.abs(deltaX) : Math.abs(deltaY);

            if (isHorizontal) {
                deltaX > 0 ? this._rightSliding(absDelta) : this._leftSliding(absDelta);
            } else {
                deltaY > 0 ? this._downwardSliding(absDelta) : this._upwardSliding(absDelta);
            }
        } catch (error) {
            console.error('检测滑动方向失败:', error);
        }
    }

    private handleTouchStart = (event: TouchEvent): void => {
        try {
            if (!this.validateEvent(event) || !this.config.isEnd) return;
            this.config.touchFinger = event.touches.length;

            if (event.touches.length === 1) {
                const touch = event.touches[0];
                this.config = {
                    ...this.config,
                    isEnd: false,
                    startPosition: {
                        offsetX: touch.clientX,
                        offsetY: touch.clientY
                    }
                };

                this.config.longPressTimer = window.setTimeout(() => {
                    this.events.longPress?.();
                }, 750);

                const now = Date.now();
                if (now - this.config.lastTapTime < 300) {
                    this.events.doubleTap?.();
                }
                this.config.lastTapTime = now;

                return;
            }

            if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];

                this.config = {
                    ...this.config,
                    initialDistance: Math.sqrt(
                        Math.pow(touch1.screenX - touch2.screenX, 2) + Math.pow(touch1.screenY - touch2.screenY, 2)
                    ),
                    initialAngle:
                        (Math.atan2(touch2.screenY - touch1.screenY, touch2.screenX - touch1.screenX) * 180) / Math.PI
                };
            }
        } catch (error) {
            console.error('处理触摸开始事件失败:', error);
            this._resetConfig();
        }
    };

    private handleTouchMove = (event: TouchEvent): void => {
        try {
            if (!this.validateEvent(event) || this.config.isEnd || event.touches.length !== this.config.touchFinger)
                return;

            if (this.config.longPressTimer) {
                clearTimeout(this.config.longPressTimer);
                this.config.longPressTimer = null;
            }

            if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];

                const currentDistance = Math.sqrt(
                    Math.pow(touch1.screenX - touch2.screenX, 2) + Math.pow(touch1.screenY - touch2.screenY, 2)
                );
                const deltaDistance = currentDistance - this.config.initialDistance;

                if (Math.abs(deltaDistance) > 10) {
                    if (deltaDistance > 0) {
                        this._pinchZoom('enlarge');
                    } else {
                        this._pinchZoom('narrow');
                    }
                }

                const currentAngle =
                    (Math.atan2(touch2.screenY - touch1.screenY, touch2.screenX - touch1.screenX) * 180) / Math.PI;
                const deltaAngle = currentAngle - this.config.initialAngle;

                if (Math.abs(deltaAngle) > 5) {
                    this.config.rotationAngle = deltaAngle;
                    this.events.rotate?.(deltaAngle);
                }
            }
        } catch (error) {
            console.error('处理触摸移动事件失败:', error);
        }
    };

    private handleTouchEnd = (event: TouchEvent): void => {
        try {
            if (!this.validateEvent(event) || this.config.isEnd || event.touches.length !== this.config.touchFinger)
                return;

            if (event.touches.length === 1) {
                const deltaX = Math.floor(event.touches[0].clientX - this.config.startPosition.offsetX);
                const deltaY = Math.floor(event.touches[0].clientY - this.config.startPosition.offsetY);
                this._detectSwipeDirection(deltaX, deltaY);
            }
        } catch (error) {
            console.error('处理触摸结束事件失败:', error);
        } finally {
            this._resetConfig();
        }
    };

    private observeTouchGesture(): void {
        this.el.addEventListener('touchstart', this.handleTouchStart);
        this.el.addEventListener('touchmove', this.handleTouchMove);
        this.el.addEventListener('touchend', this.handleTouchEnd);
    }

    private _upwardSliding(offset: number): void {
        this.events.upwardSliding?.(offset);
    }

    private _downwardSliding(offset: number): void {
        this.events.downwardSliding?.(offset);
    }

    private _leftSliding(offset: number): void {
        this.events.leftSliding?.(offset);
    }

    private _rightSliding(offset: number): void {
        this.events.rightSliding?.(offset);
    }

    private _pinchZoom(zoomType: 'enlarge' | 'narrow'): void {
        this.events.pinchZoom?.(zoomType);
    }

    private _upwardScroll(): void {
        this.events.upwardScroll?.();
    }

    private _downwardScroll(): void {
        this.events.downwardScroll?.();
    }

    private _resetConfig(): void {
        this.config = {
            isEnd: true,
            startPosition: {
                offsetX: 0,
                offsetY: 0
            },
            touchFinger: 1,
            initialDistance: 0,
            initialAngle: 0,
            lastTapTime: this.config.lastTapTime,
            longPressTimer: null,
            rotationAngle: 0
        };
    }
}

export default GestureJs;
