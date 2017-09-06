import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";

import "rxjs/add/operator/toPromise";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {AuthService} from "../auth/authService";
import {Subject} from "rxjs";


@Injectable()
export class SongService {

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    //private SONGS_URL = 'http://localhost/kasivibe2/public/api/v1/songs?fields=id,name,file_name,genre{id,name},artist{id,name,verified},album{id,name,image}';
    //private SONGS_URL = 'http://localhost/kasivibe2/public/api/songs';
    private SONGS_URL = 'http://www.kasivibe.com/api/v1/songs';
    private SONG_LIKE_URL = 'http://www.kasivibe.com/api/v1/song/like';
    // URL to web api

    // Like button
    private like_song_btn = new Subject<number>();
    like_song_btn$ = this.like_song_btn.asObservable();

    constructor(private http: Http,
                public authHttp: AuthHttp,
                private authService: AuthService) {
    }

    updateLike(id: number) {
        this.like_song_btn.next(id);
    }

    getSongs(query?: string) {
        query = (query && query.trim() !== '' || query !== undefined) ? '?query=' + query : '';
        return this.authHttp.get(this.SONGS_URL + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    searchSongs(query: string) {
        return this.http.get(this.SONGS_URL + '/search?q=' + query)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createSong(song) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.post(this.SONGS_URL, song, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSong(id: number) {
        return this.authHttp.get(this.SONGS_URL + '/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSong(song){
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.patch(this.SONGS_URL + '/' + song.id, song, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteSong(id: number) {
        const options = new RequestOptions({headers: this.headers});
        return this.http.delete(this.SONGS_URL + '/' + id, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    likeSong(id: number) {
        this.updateLike(id); // Update Client Side
        const options = new RequestOptions({headers: this.headers});
        return this.http.post(this.SONG_LIKE_URL + '?token=' + this.authService.getToken(), {'id': id})
            .map(this.extractData)
            .catch(this.handleError);
    }

    postPlay(song_id: number) {
        return this.http.post(this.SONGS_URL + '/plays', {'song_id': song_id})
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }


    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    saveMusic(data: any) {
        console.log(data);
    }


}
