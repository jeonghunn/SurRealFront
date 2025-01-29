import {
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import {
  LiveCategory,
  Room,
  Topic,
} from 'src/app/model/type';

@Component({
    selector: 'app-detail-view',
    templateUrl: './detail-view.component.html',
    styleUrls: ['./detail-view.component.scss'],
    standalone: false
})
export class DetailViewComponent {

  @Input()
  public room: Room;

  @Input()
  public groupId: number;

  @Input()
  public topicId: number;

  @Input()
  public topic: Topic;

  public readonly liveCategoryType: typeof LiveCategory = LiveCategory;

  public category: LiveCategory = LiveCategory.NOW;

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  public getColor(category: LiveCategory): ThemePalette {
    return this.category === category ? 'primary' : null;
  }

  public onClick(category: LiveCategory): void {
    this.category = category;
    //this.changeDetectorRef.markForCheck();
  }

}
