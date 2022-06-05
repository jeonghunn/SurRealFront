import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [ './map.component.scss' ],
})
export class MapComponent implements OnInit, AfterViewInit {

  @ViewChild('canvasElement')
  public canvasElement: ElementRef;

  public canvasWidth: number = 0;

  private characterX: number = 0;
  private characterY: number = 0;
  private speed: number = 10;

  private subscriptions: Subscription[] = [];

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  public constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    this.updateCanvasWidth();
  }

  public ngAfterViewInit(): void {
    this.context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('2d');

    this.draw();
  }

  public updateCanvasWidth(): void {
    this.canvasWidth = this.elementRef.nativeElement.parentElement.offsetWidth;
  }

  public onResize(event: any): void {
    this.updateCanvasWidth();
  }

  public onKeyDown(event: any): void {

    switch (event?.keyCode) {
      case 38:
      case 87:
        this.characterY -= this.speed;
        break;
      case 40:
      case 83:
        this.characterY += this.speed;
        break;
      case 37:
      case 65:
        this.characterX -= this.speed;
        break;
      case 39:
      case 68:
        this.characterX += this.speed;
        break;
    }

    this.draw();
  }

  private draw(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasWidth);
    this.context.font = '24px Arial';
    this.context.textBaseline = 'top';
    this.context.textAlign = 'left';

    // this.context.canvas.width = this.elementRef.nativeElement?.width;
    // this.context.canvas.height = this.elementRef.nativeElement?.height;


    this.context.fillText('Working on progress...', 0, 0, 100);

    this.context.beginPath();
    this.context.arc(this.characterX, this.characterY, 8, 0, Math.PI * 2, true); // Outer circle
    this.context.moveTo(110, 75);
    this.context.fillStyle='rgba(250,0,0,0.4)';
    this.context.fill();
    this.context.stroke();
  }

}
