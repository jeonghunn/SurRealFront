import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  standalone: true,
  imports: [PickerComponent],

})

export class EmojiPickerComponent {
  
  @Output()
  public readonly select: EventEmitter<any> = new EventEmitter();

  public selectEmoji(event: any): void {
    this.select.emit(event.emoji);
  }

}
