export class Song {
    id?: number;
    name: string;
    slug: string;
    user?: any;
    file_name: string;
    lyrics?: string;
    genre_id?: string;
    genre?: any;
    plays_count?: number;
    likes?: any[];
    likes_count?: number;
    is_liked?: boolean;
    is_admin?: boolean;
    album?: any;
    artists?: any[];
    comments?: any[];
    downloadable: boolean;
    download_link: string;
    commentable: boolean;
    private: boolean;
}
