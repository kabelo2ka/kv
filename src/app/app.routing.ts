import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UsersComponent} from "./users.component";
import {HomeComponent} from "./home/home.component";
import {SongsComponent} from "./songs.component/songs.component";
import {SongCreateComponent} from "./song.create.component/song.create.component";
import {UserProfileComponent} from "./user.component/user-profile.component";
import {UserEditProfileComponent} from "./user.component/user-edit-profile.component";
import {AlbumsComponent} from "./albums/albums.component";
import {GenresComponent} from "./genres/genres.component";
import {ArtistsComponent} from "./artists.component/artists.component";
import {ArtistShowComponent} from "./artist-show/artist-show.component";
import {AlbumShowComponent} from "./album-show/album-show.component";
import {AuthGuard} from "./auth-guard.service";
import {SongEditComponent} from "./song-edit/song-edit.component";
import {TestsComponent} from "./tests/tests.component";
import {SongComponent} from "./song/song.component";

const appRoutes: Routes = <Routes>[
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'users/edit',
        component: UserEditProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'users/:id',
        component: UserProfileComponent
    },
    {
        path: 'songs',
        component: SongsComponent
    },
    {
        path: 'songs/create',
        component: SongCreateComponent
    },
    {
        path: 'songs/:id',
        component: SongComponent
    },
    {
        path: 'songs/:id/edit',
        component: SongEditComponent
    },
    {
        path: 'albums',
        component: AlbumsComponent
    },
    {
        path: 'albums/:id',
        component: AlbumShowComponent
    },
    {
        path: 'artists',
        component: ArtistsComponent
    },
    {
        path: 'artists/:id',
        component: ArtistShowComponent
    },
    {
        path: 'genres',
        component: GenresComponent
    },
    {
        path: 'tests',
        component: TestsComponent
    },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);