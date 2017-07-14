import {Component, ViewChild} from '@angular/core';
import {TabsetComponent} from 'ngx-bootstrap';
import {AudioService} from "../audio/audio.service";
import {CommentService} from "../comment/comment.service";
import {AuthService} from "../auth/authService";


@Component({
    selector: 'right-sidebar',
    templateUrl: './sidebar.right.component.html',
    styleUrls: ['./sidebar.right.component.css'],
    providers: [CommentService]
})

export class RightSidebarComponent {

    @ViewChild('staticTabs') staticTabs: TabsetComponent;

    user: any;
    song: any;

    //comments: any = [];
    comment: any;

    errors: any;

    constructor(private audioService: AudioService,
                private commentService: CommentService,
                private authService: AuthService
    ) {
        this.comment = {
            id: 0,
            body: '',
            created_at_ago: 'Just now',
        };
        this.errors = {
            error: null,
            email: null,
            password: null,
        };
        this.authService.user$.subscribe(
            user => {
                this.user = user
            }
        );
    }

    ngOnInit(): void {
        this.audioService.active_song_selected$.subscribe(
            active_song => {
                this.song = active_song;
            }
        );
    }

    onComment() {
        this.comment.author = this.user;
        this.song.comments.push((<any>Object).assign({}, this.comment));
        this.commentService.addComment(this.comment, this.song.id).subscribe(
            () => {
                //@todo Reset form after a successful comment
                this.comment.body = '';
            },
            errors => this.errors = errors
        )
    }

    selectTab(tab_id: number) {
        this.staticTabs.tabs[tab_id].active = true;
    }

    disableEnable() {
        this.staticTabs.tabs[2].disabled = !this.staticTabs.tabs[2].disabled
    }

}
