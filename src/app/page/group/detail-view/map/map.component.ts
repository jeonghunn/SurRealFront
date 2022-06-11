import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomService } from 'src/app/core/room.service';

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

  private canvasBoundary: any = {
    xMin: 12,
    xMax: 90,
    yMin: 4,
    yMax: 79,
    width: 78,
    height: 75,
  };

  private mapBoundary: any = {
    xMax: 9.28,
    xMin: -8.62,
    yMin: -12.89,
    yMax: 4.5,
    width: 17.9,
    height : 17.39,
  };

  private speed: number = 10;

  private subscriptions: Subscription[] = [];

  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;

  public constructor(
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private roomService: RoomService,
  ) {
    this.subscriptions = [
      this.roomService.liveRoomContent$.subscribe((data: any) => {
        this.updateObjectPositions(data[0].x, data[0].y);

        if (this.context) {
          this.draw();
        }

      }),
    ];
  }

  public ngOnInit(): void {
    this.updateCanvasWidth();
  }

  public ngAfterViewInit(): void {
    this.context = (this.canvasElement.nativeElement as HTMLCanvasElement).getContext('2d');

    this.draw();
  }

  public updateObjectPositions(x: number, y: number): void {
    this.characterX = this.getPosition(
      x,
      this.mapBoundary.xMin,
      this.mapBoundary.width,
      this.canvasBoundary.xMin,
      this.canvasBoundary.width,
      );
    this.characterY = this.getPosition(
      y,
      this.mapBoundary.yMin,
      this.mapBoundary.height,
      this.canvasBoundary.yMin,
      this.canvasBoundary.height,
    );
  }

  public getPosition(
    source: number,
    min: number,
    length: number,
    targetMin: number,
    targetLength: number,
    ): number {
    return (this.canvasWidth * (targetMin / 100)) + (this.canvasWidth * (targetLength / 100) * ((source - min) / length));
  }

  public updateCanvasWidth(): void {
    this.canvasWidth = Math.min(
      this.elementRef.nativeElement.parentElement.offsetWidth,
      this.elementRef.nativeElement.parentElement.offsetHeight,
      ) ;
  }

  public onResize(event: any): void {
    this.canvasWidth = 100;
    this.changeDetectorRef.detectChanges();
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

    this.context.fillText(`X : ${Math.round(this.characterX * 100) / 100}, Y : ${Math.round(this.characterY * 100) / 100}`, 0, 0, 100);

    this.context.beginPath();
    this.context.arc(this.characterX, this.characterY, 8, 0, Math.PI * 2, true); // Outer circle
    this.context.moveTo(110, 75);
    this.context.fillStyle='rgba(250,0,0,0.4)';
    this.context.fill();
    this.context.stroke();
  }

}
