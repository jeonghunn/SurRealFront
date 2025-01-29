import {
  ChangeDetectorRef,
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
    selector: '[appTextareaAutoResize]',
    standalone: false
})
export class TextareaAutoResizeDirective implements OnInit, OnChanges {

  @Input()
  public defaultHeight: number = 24;

  @Input()
  public multiline: boolean = false;

  @Output()
  public heightUpdate: EventEmitter<number> = new EventEmitter<number>();

  public height: number;

  constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
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

  @HostListener(':input', ['$event'])
  public onInput(event: any) {
    if (!this.multiline && !event.data) {
      this.reset();
      return;
    }
    
    this.resize();
  }

  public reset() {
    this.elementRef.nativeElement.style.height = this.defaultHeight + 'px';
    this.heightUpdate.emit(this.defaultHeight);
    this.height = this.defaultHeight;
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
