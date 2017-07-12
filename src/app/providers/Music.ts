import {Injectable} from "@angular/core";
import {Song} from "../songs.component/song";

@Injectable()
export class Music {
    album_id = 'create';
    album_name = '';
    songs: Song[];
}