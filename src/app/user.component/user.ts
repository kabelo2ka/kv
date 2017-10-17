import {Album} from "../albums/album";
import {Song} from "../songs.component/song";

export class User {
    id: number;
    username: string;
    avatar: string;
    slug: string;
    confirmed: number;
    artist_name?: string;
    phone_number?: number;
    songs_count?: number;
    albums_count?: number;
    albums?: Album[];
    songs?: Song[];
}
