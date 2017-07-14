
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


export class Comment {
    id = 0;
    body = '';
    created_at_ago = 'Just now';
    author: any;
}
