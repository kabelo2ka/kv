import {Component, OnInit} from '@angular/core';
import {Song} from "../songs.component/song";
import {Subscription} from "rxjs";
import {SongService} from "../songs.component/song.service";
import {Params, ActivatedRoute} from "@angular/router";

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

    loading: Subscription;
    song: Song;

    constructor(
        private activatedRoute: ActivatedRoute,
        private songService: SongService
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
    }

    getSong(id: number){
        this.loading = this.songService.getSong(id).subscribe(
            (res:Res) => this.song = res.data
        );
    }

}
