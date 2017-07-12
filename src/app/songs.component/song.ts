export class Song {
    id?: number;
    name: string;
    user?: any;
    file_name: string;
    lyrics?: string;
    genre_id?: string;
    genre?: any;
    album?: any;
    artists?: any[];
    plays_count?: number;
    likes?: any[];
    likes_count?: number;
    is_liked?: boolean;
    is_admin?: boolean;
}