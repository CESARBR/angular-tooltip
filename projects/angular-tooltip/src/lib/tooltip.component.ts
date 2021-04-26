import { Component, ElementRef, HostListener, HostBinding, Input, EventEmitter, Renderer2} from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  host: {
    class: 'tooltip',
  },
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  _show: boolean = false;

  @Input() data: any;

  @HostBinding('style.top') hostStyleTop: string;
  @HostBinding('style.left') hostStyleLeft: string;
  @HostBinding('style.width') hostStyleWidth: string;
  @HostBinding('class.tooltip-show') hostClassShow: boolean;

  @Input() set show(show: boolean) {
    if (show) {
      this.setPosition();
    }
    this._show = show;
    this.hostClassShow = show;
  }

  get show(): boolean {
    return this._show;
  }

  get placement() {
    return this.data.placement;
  }

  get element() {
    return this.data.element;
  }

  get elementPosition() {
    return this.data.elementPosition;
  }

  get tooltipValue() {
    return this.data.tooltipValue;
  }

  get tooltipOffset(): number {
    return Number(this.data.offset);
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setCustomStyles();
  }

  setPosition(): void {
    this.setPlacement(this.placement)
    this.renderer.addClass(this.elementRef.nativeElement, 'tooltip-' + this.placement);
  }

  setPlacement(placement: string) {
    const isSvg = this.element instanceof SVGElement;
    const tooltip = this.elementRef.nativeElement;

    let elementHeight = isSvg ? this.element.getBoundingClientRect().height : this.element.offsetHeight;
    let elementWidth = isSvg ? this.element.getBoundingClientRect().width : this.element.offsetWidth;

    const tooltipHeight = tooltip.clientHeight;
    const tooltipWidth = tooltip.clientWidth;
    const scrollY = window.pageYOffset;

    let top, left;

    if (placement === 'top') {
      top = this.elementPosition.top + scrollY - (tooltipHeight + this.tooltipOffset);
    }

    if (placement === 'bottom') {
      top = this.elementPosition.top + scrollY + elementHeight + this.tooltipOffset;
    }

    if (placement === 'top' || placement === 'bottom') {
      left = this.elementPosition.left + elementWidth / 2 - tooltipWidth / 2;
    }

    if (placement === 'left') {
      left = this.elementPosition.left - tooltipWidth - this.tooltipOffset;
    }

    if (placement === 'right') {
      left = this.elementPosition.left + elementWidth + this.tooltipOffset;
    }

    if (placement === 'left' || placement === 'right') {
      top = this.elementPosition.top + scrollY + elementHeight / 2 - tooltip.clientHeight / 2;
    }

    this.hostStyleTop = top + 'px';
    this.hostStyleLeft = left + 'px';
  }

  setCustomStyles() {
    this.hostStyleWidth = this.data.customWidth ? this.data.customWidth : '';
  }
}
