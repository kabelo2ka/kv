import {Injectable} from '@angular/core';
import {UserPreferences} from "./user-preferences";


@Injectable()
export class UserPreferencesService {

    readonly KEY = 'kv.local::preferences';

    static readonly VOLUME = 'volume';
    static readonly MUTED = 'muted';
    static readonly NOTIFY = 'notify';
    static readonly REPEAT_MODE = 'repeatMode';
    static readonly SHOW_INFO_PANEL = 'showInfoPanel';
    static readonly ARTISTS_VIEW_MODE = 'artistsViewMode';
    static readonly ALBUMS_VIEW_MODE = 'albumsViewMode';

    private preferences: UserPreferences;
    private defaults: UserPreferences;


    constructor() {
        this.defaults = Object.assign({}, {
            volume: '80',
            muted: false,
            notify: true,
            repeatMode: 'REPEAT_ONE',
            showInfoPanel: false,
            artistsViewMode: 'grid',
            albumsViewMode: 'grid',
        });

        if (this.getLocalPreferences()) {
            this.preferences = Object.assign({}, this.defaults, this.getLocalPreferences());
        }else{
            this.preferences = this.defaults;
        }
    }


    setPreference(attribute: string, value :any) {
        this.preferences[attribute] = value;
        this.savePreferences();
    }


    protected savePreferences() {
        // Save to local storage
        localStorage.setItem(this.KEY, JSON.stringify(this.preferences));

    }

    getDefaultPreferences(): UserPreferences {
        return this.defaults;
    }

    getPreference(attribute) {
        return this.preferences[attribute];
    }

    getPreferences(): UserPreferences {
        return this.preferences;
    }

    resetPreferences() {
        localStorage.removeItem(this.KEY);
    }


    getLocalPreferences(): UserPreferences {
        const localPreferences = localStorage.getItem(this.KEY);
        if (localPreferences) {
            return JSON.parse(localPreferences);
        }
    }

}