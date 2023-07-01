import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Guard } from './guard/guard';
import { DragDirective } from './directive/drag-drop.directive';

@NgModule({
  declarations: [
    DragDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DragDirective,
  ],
})
export class CoreModule { }
