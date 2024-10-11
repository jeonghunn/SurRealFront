import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  Observable,
  tap,
} from "rxjs";
import { DataService } from "../data.service";

@Injectable()
export class HttpProgressInterceptor implements HttpInterceptor {

  constructor(
    public dataService: DataService,
    
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      return next.handle(req).pipe(
        tap(event => {
          if (event.type === 3) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            this.dataService.setTransferProgress(req.url, percentDone);

            if (percentDone === 100) {
              this.dataService.removeTransferProgress(req.url);
            }
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }
}