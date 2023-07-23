import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Guard } from './guard/guard';
import { DragDirective } from './directive/drag-drop.directive';
import { TextareaAutoResizeDirective } from './directive/textarea-autoresize.directive';

@NgModule({
  declarations: [
    DragDirective,
    TextareaAutoResizeDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DragDirective,
    TextareaAutoResizeDirective,
  ],
})
export class CoreModule { }
