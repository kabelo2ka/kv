export class Music {
    album_id = 'create';
    album_name = '';
    songs: Song[];
}

export class Song {
    name = '';
    genre_id = 0;
    file_name = '';
    lyrics = '';
}