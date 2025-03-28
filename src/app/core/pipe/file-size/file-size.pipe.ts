import {
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    filesize,
    FileSizeReturnArray,
    FileSizeReturnObject,
} from 'filesize';

@Pipe({
  name: 'filesize'
})
export class FileSizePipe implements PipeTransform {
  private static transformOne(value: number, options?: any): string | number | FileSizeReturnArray | FileSizeReturnObject{
    return filesize(value, options);
  }

  transform(value: number | number[], options?: any) {
    if (Array.isArray(value)) {
      return value.map(val => FileSizePipe.transformOne(val, options));
    }

    return FileSizePipe.transformOne(value, options);
  }
}