import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FriendListComponent } from 'src/app/components/friend-list/friend-list.component';

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

}
