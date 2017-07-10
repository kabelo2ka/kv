import {Component, OnInit} from '@angular/core';
import {AudioAPIWrapper} from "../audio/audio-api-wrapper";
import * as io from 'socket.io-client';
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Component({
    selector: 'app-tests',
    templateUrl: './tests.component.html',
    styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

    count:number = 0;
    SOCKET_URL = 'http://www.kasivibe.com:3000';
    socket: any;

    constructor(private http: Http) {
        this.socket = io(this.SOCKET_URL).connect();
    }

    ngOnInit() {
        Observable.fromEvent(this.socket, 'songs-channel:App\\Events\\UserPlayedSong').subscribe(
            res => {
                this.count++;
                console.log(res);
            }
        );
        /*this.socket.on('song-channel:UserPlayedSong', res => {
            this.count++;
            console.log(res);
        });*/
    }

    PlaySong(){
        this.http.get('http://www.kasivibe.com/api/v1/songs/8/plays').subscribe(
            res => console.log(res.statusText)
        );
    }

    testEmit(){
        this.socket.emit('songs-channel:App\\Events\\UserPlayedSong', {
            username: 'kabelo',
            song_id: 888
        })
    }


}
