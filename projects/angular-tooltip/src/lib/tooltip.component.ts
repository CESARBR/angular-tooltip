import { Component, ElementRef, HostBinding, Input, Renderer2} from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  host: {
    class: 'tooltip',
  },
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  @Input() data: any;

  @HostBinding('style.top') hostStyleTop: string;
  @HostBinding('style.left') hostStyleLeft: string;
  @HostBinding('style.width') hostStyleWidth: string;
  @HostBinding('style.word-break') hostWordBreak: string;
  @HostBinding('style.text-align') hostStyleTextAlign: string;
  @HostBinding('class.tooltip-show') hostClassShow: boolean;

  @Input() set show(show: boolean) {
    if (show) {
      this.setPosition();
    }
    this.hostClassShow = show;
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
    const vertScroll = window.pageYOffset;

    let top, left;

    if (placement === 'top') {
      top = this.elementPosition.top + vertScroll - (tooltipHeight + this.tooltipOffset) + this.topOffset;
      left = this.elementPosition.left + elementWidth / 2 - tooltipWidth / 2 + this.leftOffset;
    }

    if (placement === 'bottom') {
      top = this.elementPosition.top + vertScroll + elementHeight + this.tooltipOffset + this.topOffset;
      left = this.elementPosition.left + elementWidth / 2 - tooltipWidth / 2 + this.leftOffset;
    }

    if (placement === 'left') {
      top = this.elementPosition.top + vertScroll + elementHeight / 2 - tooltip.clientHeight / 2 + this.topOffset;
      left = this.elementPosition.left - tooltipWidth - this.tooltipOffset + this.leftOffset;
    }

    if (placement === 'right') {
      top = this.elementPosition.top + vertScroll + elementHeight / 2 - tooltip.clientHeight / 2 + this.topOffset;
      left = this.elementPosition.left + elementWidth + this.tooltipOffset + this.leftOffset;
    }

    this.hostStyleTop = top + 'px';
    this.hostStyleLeft = left + 'px';
  }

  setCustomStyles() {
    this.hostStyleWidth = this.data.customWidth ? this.data.customWidth : '';
    if (this.wordBreak) {
      this.hostWordBreak = this.wordBreak;
    }
    if (this.textAlign) {
      this.hostStyleTextAlign = this.textAlign;
    }
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

  get leftOffset(): number {
    return Number(this.data.leftOffset);
  }

  get topOffset(): number {
    return Number(this.data.topOffset);
  }

  get wordBreak(): string {
    return this.data.wordBreak;
  }

  get textAlign(): string {
    return this.data.textAlign;
  }
}
