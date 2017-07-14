import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {Song} from "../songs.component/song";
import {Subscription} from "rxjs";
import {SongService} from "../songs.component/song.service";
import {Params, ActivatedRoute} from "@angular/router";
import {User} from "../user.component/user";
import {AuthService} from "../auth/authService";

class Res {
    data: any;
    meta?: any;
}

@Component({
    selector: 'app-song',
    templateUrl: './song.component.html',
    styleUrls: ['./song.component.css']
})

export class SongComponent implements OnInit {
    @ViewChild('comments') comments;
    commentBody: string = '';

    loading: Subscription;
    song: Song;
    user: User;


    constructor(
        private activatedRoute: ActivatedRoute,
        private songService: SongService,
        private authService: AuthService
    )
    {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let id = params['id'];
            // Load Song
            this.loading = this.songService.getSong(id).subscribe(
                (res:Res) => this.song = res.data
            );
        });
        this.authService.user$.subscribe(
            res => this.user = res
        );
    }

    getSong(id: number){
        this.loading = this.songService.getSong(id).subscribe(
            (res:Res) => this.song = res.data
        );
    }

    onComment(){
        this.comments.onComment(this.commentBody, this.user);
    }



}
