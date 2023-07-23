import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appTextareaAutoResize]'
})
export class TextareaAutoResizeDirective implements OnInit, OnChanges {

  @Input()
  public multiline: boolean = false;

  @Output()
  public heightUpdate: EventEmitter<number> = new EventEmitter<number>();

  public height: number;

  constructor(
    private elementRef: ElementRef,
  ) {

  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.multiline) {
      setTimeout(() => this.resize());
    }
  }

  public ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  @HostListener(':input')
  public onInput() {
    if (this.multiline) {
      this.resize();
    }
  }

  public resize() {
    this.elementRef.nativeElement.style.height = '0';

    const scrollHeight: number = this.elementRef.nativeElement.scrollHeight;
    this.elementRef.nativeElement.style.height = scrollHeight + 'px';

    if (this.height !== scrollHeight) {
      this.height = scrollHeight;
      this.heightUpdate.emit(scrollHeight);
    }

}

}
