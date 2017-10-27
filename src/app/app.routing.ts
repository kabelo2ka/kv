import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SongsComponent} from './songs.component/songs.component';
import {SongCreateComponent} from './song.create.component/song.create.component';
import {UserProfileComponent} from './user.component/user-profile.component';
import {AlbumsComponent} from './albums/albums.component';
import {GenresComponent} from './genres/genres.component';
import {ArtistsComponent} from './artists.component/artists.component';
import {ArtistShowComponent} from './artist-show/artist-show.component';
import {AlbumShowComponent} from './album-show/album-show.component';
import {AuthGuard} from './auth-guard.service';
import {SongEditComponent} from './song-edit/song-edit.component';
import {TestsComponent} from './tests/tests.component';
import {SongComponent} from './song/song.component';
import {SettingsComponent} from './settings.component/settings.component';
import {AlbumCreateComponent} from "./album-create/album-create.component";
import {AlbumEditComponent} from "./album-edit/album-edit.component";
import {PrivacyComponent} from "./policies/privacy/privacy.component";
import {TermsComponent} from "./policies/terms/terms.component";

const appRoutes: Routes = <Routes>[
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'policies/terms',
        component: TermsComponent,
    },
    {
        path: 'policies/privacy',
        component: PrivacyComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'users/:id',
        component: UserProfileComponent,
    },
    {
        path: 'songs',
        component: SongsComponent,
    },
    {
        path: 'songs/create',
        component: SongCreateComponent,
    },
    {
        path: 'songs/:slug',
        component: SongComponent,
    },
    {
        path: 'songs/:slug/edit',
        component: SongEditComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'albums',
        component: AlbumsComponent,
    },
    {
        path: 'albums/create',
        component: AlbumCreateComponent,
    },
    {
        path: 'albums/:slug',
        component: AlbumShowComponent,
    },
    {
        path: 'albums/:slug/edit',
        component: AlbumEditComponent,
    },
    {
        path: 'artists',
        component: ArtistsComponent,
    },
    {
        path: 'artists/:slug',
        component: ArtistShowComponent,
    },
    {
        path: 'genres',
        component: GenresComponent,
    },
    {
        path: 'tests',
        component: TestsComponent
    },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
