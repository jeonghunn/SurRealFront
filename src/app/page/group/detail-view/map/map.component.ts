import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
})
export class MapComponent implements AfterViewInit {

  @ViewChild('canvasElement') public canvasElement: ElementRef;

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  public constructor(
    private elementRef: ElementRef,
  ) { }

  public ngAfterViewInit(): void {
    this.context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('2d');

    this.draw();
  }

  private draw(): void {
    this.context.font = '30px Arial';
    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

    // this.context.canvas.width = this.elementRef.nativeElement?.width;
    // this.context.canvas.height = this.elementRef.nativeElement?.height;

    const x = (this.canvasElement.nativeElement as HTMLCanvasElement).width / 2;
    const y = (this.canvasElement.nativeElement as HTMLCanvasElement).height / 2;
    this.context.fillText('Working on progress...', x, y);
  }

}
