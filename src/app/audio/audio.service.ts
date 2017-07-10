import {Injectable} from "@angular/core";
import {Song} from "../songs.component/song";

import {Subject}    from 'rxjs/Subject';


@Injectable()
export class AudioService {

    private SONG_PATH = 'http://www.kasivibe.com/uploads/songs';

    // Observable string sources
    private active_song = new Subject<Song>();
    private is_playing = new Subject<boolean>();
    private is_paused = new Subject<boolean>();
    private status = new Subject<string>(); // pause | play | stop

    // @todo Finish current queue (playlist)
    private queue = new Subject<any>();


    // Observable string streams
    active_song_selected$ = this.active_song.asObservable();
    is_playing$ = this.is_playing.asObservable();
    is_paused$ = this.is_paused.asObservable();
    status$ = this.status.asObservable();

    // Service message commands
    setActiveSong(song: Song) {
        this.active_song.next(song);
        //console.log(song);
    }

    isPlaying(isPlaying) {
        this.is_playing.next(isPlaying);
    }

    isPaused(isPaused) {
        this.is_paused.next(isPaused);
    }

    /**
     * Set Audio Status
     * @param status pause | play | stop
     */
    setStatus(status: string) {
        this.status.next(status);
    }

    getActiveSong() {
        return this.active_song;
    }

    private test = new Subject<any>();
    test$ = this.test.asObservable();

    setTest(data: any) {
        this.test.next(data);
        //console.log(song);
    }






}