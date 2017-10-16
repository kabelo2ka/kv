export class Album {
    id: number;
    name: string;
    image: string;
    slug: string;
    user_id: number;
    active: boolean;
    user?: any;
    songs?: any;
    artist?: any;
}
