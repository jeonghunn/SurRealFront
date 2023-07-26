import {
    Pipe,
    PipeTransform,
} from "@angular/core";
import {
    DomSanitizer,
    SafeHtml,
} from "@angular/platform-browser";
import sanitizeHtml from 'sanitize-html';

@Pipe({ name: 'formatText', })
export class FormatText implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  public transform(value: any, type?: string): any {
    return this.textToLinks(value);
  }

  public textToLinks(value: string): SafeHtml {
    const linkRegex = /https?:\/\/\S+/gm;
    return sanitizeHtml(
        value,
        {
            allowedTags: [],
            disallowedTagsMode: 'escape',
        }).replace(
            linkRegex,
            (m, $1) => `<a href="${m}" target="_blank">${m}</a>`,
            );
  }
}