import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FriendListComponent } from 'src/app/components/friend-list/friend-list.component';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-addition',
    templateUrl: './addition.component.html',
    styleUrls: ['./addition.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        FriendListComponent,
        TranslateModule,
    ],
})
export class AdditionComponent {

    public constructor(
        private router: Router,
    ) {
    }


    public go(url: string): void {
        this.router.navigateByUrl(url);
    }
    
}
