export interface UserPreferences {
    volume: number;
    muted: boolean;
    notify: boolean;
    repeatMode: 'REPEAT_ONE' | 'NO_REPEAT' | 'REPEAT_ALL';
    showInfoPanel: boolean;
    artistsViewMode?: 'LIST' | 'GRID';
    albumsViewMode?: 'LIST' | 'GRID';
}
