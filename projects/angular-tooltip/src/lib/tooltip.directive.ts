import { Directive, ElementRef, HostListener, Input, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, Injector, Output, EventEmitter, Inject, Optional, ViewChild } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

export interface AdComponent {
  data: any;
  show: boolean;
  events: any;
}

@Directive({
  selector: '[tooltip]',
  exportAs: 'tooltip',
})
export class TooltipDirective {
  componentRef: any;
  elementPosition: any;

  @Input('tooltip') tooltipValue: string;
  @Input('placement') placement = 'left';
  @Input('content-type') contentType = 'string';
  @Input('trigger') trigger = 'hover';
  @Input('tooltip-class') tooltipClass = '';
  @Input('offset') offset = 8;
  @Input('leftOffset') leftOffset = 0;
  @Input('topOffset') topOffset = 0;
  @Input('customWidth') customWidth: string;
  @Input('wordBreak') wordBreak: string;
  @Input('textAlign') textAlign: string;
  @Input('showOnlyIfOverflowEllipsis') showOnlyIfOverflowEllipsis: boolean;

  get isTooltipDestroyed() {
    return this.componentRef && this.componentRef.hostView.destroyed;
  }

  constructor(
    private elementRef: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  @HostListener('focusin')
  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipValue) return;
    if (this.showOnlyIfOverflowEllipsis && this.elementRef.nativeElement.offsetWidth >= this.elementRef.nativeElement.scrollWidth) return;
    this.show();
  }

  @HostListener('focusout')
  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.trigger === 'hover') {
      this.destroyTooltip();
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroyTooltip();
  }

  getElementPosition(): void {
    this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
  }

  createTooltip(): void {
    this.getElementPosition();

    this.appendComponentToBody(TooltipComponent);
    window.setTimeout(() => {
      this.showTooltipElem();
    }, 0);
  }

  destroyTooltip(): void {
    if (this.isTooltipDestroyed == false) {
      this.hideTooltip();

      if (!this.componentRef || this.isTooltipDestroyed) {
        return;
      }

      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
    }
  }

  showTooltipElem(): void {
    (<AdComponent>this.componentRef.instance).show = true;
  }

  hideTooltip(): void {
    if (!this.componentRef || this.isTooltipDestroyed) {
      return;
    }

    (<AdComponent>this.componentRef.instance).show = false;
  }

  appendComponentToBody(component: any, data: any = {}): void {
    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    (<AdComponent>this.componentRef.instance).data = {
      tooltipValue: this.tooltipValue,
      element: this.elementRef.nativeElement,
      elementPosition: this.elementPosition,
      placement: this.placement,
      offset: this.offset,
      leftOffset: this.leftOffset,
      topOffset: this.topOffset,
      customWidth: this.customWidth,
      wordBreak: this.wordBreak,
      textAlign: this.textAlign
    };

    this.appRef.attachView(this.componentRef.hostView);

    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }

  public show() {
    if (!this.componentRef || this.isTooltipDestroyed) {
      this.createTooltip();
    } else if (!this.isTooltipDestroyed) {
      this.showTooltipElem();
    }
  }

  public hide() {
    this.destroyTooltip();
  }
}
