import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Guard } from './guard/guard';
import { DragDirective } from './directive/drag-drop.directive';
import { TextareaAutoResizeDirective } from './directive/textarea-autoresize.directive';
import { FormatText } from './pipe/format-text';

@NgModule({
  declarations: [
    DragDirective,
    TextareaAutoResizeDirective,
    FormatText,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DragDirective,
    TextareaAutoResizeDirective,
    FormatText,
  ],
})
export class CoreModule { }
