declare module "locomotive-scroll" {
  interface LocomotiveScrollOptions {
    el: HTMLElement;
    smooth?: boolean;
  }

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);
    destroy(): void;
  }
}
