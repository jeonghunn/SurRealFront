import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';
import { IdentityService } from '../identity.service';

@Injectable()
export class Guard  {
  public constructor(
        private router: Router,
        private identityService: IdentityService,
    ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.identityService.verify()
            .pipe(
                map(() => true),
                catchError(error => {
                  this.identityService.remove();
                  this.router.navigateByUrl(`/intro?return=${window.location.pathname}`);
                  return of(false);
                }),
            );
  }
}
