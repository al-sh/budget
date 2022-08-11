/* eslint-disable @typescript-eslint/ban-ts-comment */
import { makeAutoObservable } from 'mobx';

function throttle(f: (args: unknown) => void, ms: number) {
  return function (args: unknown) {
    // @ts-ignore
    const previousCall = this.lastCall;
    // @ts-ignore
    this.lastCall = Date.now();
    // @ts-ignore
    if (previousCall === undefined || this.lastCall - previousCall > ms) {
      f(args);
    }
  };
}

class UiSizeService {
  private static instance: UiSizeService;

  public static getInstance(): UiSizeService {
    if (!UiSizeService.instance) {
      UiSizeService.instance = new UiSizeService();
    }

    return UiSizeService.instance;
  }

  private constructor() {
    makeAutoObservable(this);
  }

  private _height = window.innerHeight;

  public get height() {
    return this._height;
  }

  private _width = window.innerWidth;

  public get width() {
    return this._width;
  }

  private handleResize = throttle(() => {
    this._height = window.innerHeight;
    this._width = window.innerWidth;
  }, 50);

  public destroy() {
    window.removeEventListener('resize', this.handleResize);
  }

  public init() {
    window.addEventListener('resize', this.handleResize);
  }
}

export const getUiSizeService = () => UiSizeService.getInstance();
