import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FriendListComponent } from 'src/app/components/friend-list/friend-list.component';

@Component({
    selector: 'app-group-create',
    templateUrl: './group-create.component.html',
    styleUrls: ['./group-create.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        FriendListComponent,
    ],
})
export class GroupCreateComponent {

}
