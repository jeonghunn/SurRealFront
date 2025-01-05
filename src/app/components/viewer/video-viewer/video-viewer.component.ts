import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import videojs from 'video.js';

@Component({
    selector: 'app-video-viewer',
    templateUrl: './video-viewer.component.html',
    styleUrls: ['./video-viewer.component.scss'],
    standalone: false
})
export class VideoViewerComponent implements OnInit, OnDestroy {


  @Input()
  public src: string;

  @Input()
  public posterSrc: string;

  @Input()
  public width: number;

  @Input()
  public height: number;

  @Input()
  public mimeType: string;

  public player: any;

  public videoJsConfigObj = {
    preload: "metadata",
    controls: true,
    autoplay: true,
    overrideNative: true,
    techOrder: ["html5"],
    width: null,
    height: null,
    sources: [
      { 
      src: null,
      type: null,
      },
  ], 
    html5: {
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
        hls: {
            withCredentials: false,
            overrideNative: true,
            debug: false,
        }
    }
};

  public get type(): string {
    if (this.mimeType !== 'video/webm') {
      return 'video/mp4';
    }

    return this.mimeType;
  }

  public ngOnInit(): void {
    console.log(this.src);
    console.log(this.mimeType);
    //this.videoJsConfigObj.width = this.width;
    //this.videoJsConfigObj.height = this.height;
    this.videoJsConfigObj.sources[0].src = this.src;
    this.videoJsConfigObj.sources[0].type = this.type;
    this.player = videojs('my-video', this.videoJsConfigObj);
  }

  public ngOnDestroy(): void {
    this.player.dispose();
  }

}
