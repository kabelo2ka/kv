import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AuthService} from '../auth/authService';
import {Subject} from 'rxjs';
import {AppService} from '../app.service';


@Injectable()
export class SongService {

    private headers = new Headers({
        'Content-Type': 'application/json',
    });
    private SONGS_URL = '//kasivibe.com/api/v1/songs';
    private SONGS_TRENDING_URL = '//kasivibe.com/api/v1/trending-songs';
    private USER_URL = '//kasivibe.com/api/v1/user';
    private SONG_LIKE_URL = '//kasivibe.com/api/v1/song/like';
    // URL to web api

    // Like button
    private like_song_btn = new Subject<number>();
    like_song_btn$ = this.like_song_btn.asObservable();

    constructor(private http: Http,
                public authHttp: AuthHttp,
                private authService: AuthService,
                private appService: AppService) {
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

    getTrendingSongs(limit= 3) {
        return this.authHttp.get(this.SONGS_TRENDING_URL + '?limit=' + limit)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAuthSongs(query?: string) {
        query = (query && query.trim() !== '' || query !== undefined) ? '?query=' + query : '';
        return this.authHttp.get(this.USER_URL + '/songs' + query)
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

    getSong(slug: string) {
        return this.authHttp.get(this.SONGS_URL + '/' + slug)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSong(song) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.patch(this.SONGS_URL + '/' + song.id, song, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteSong(slug: number) {
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.delete(this.SONGS_URL + '/' + slug, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    likeSong(id: number) {
        // @todo If user not logged in, show login modal
        if ( ! this.authService.loggedIn()) {
            this.appService.showSignInModal(true);
            // if user is successfully logged in, like the song
        }

        this.updateLike(id); // Update Client Side
        const options = new RequestOptions({headers: this.headers});
        return this.authHttp.post(this.SONG_LIKE_URL , {'id': id})
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


}
