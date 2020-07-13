import Vue from 'vue';
import Router from 'vue-router';

import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import Game from '../components/Game'
import Dev from '../components/Dev'
import Devs from '../components/Devs'
import Favs from '../components/Favs'
import Platforms from '../components/Platforms'
import Platform from '../components/Platform'
import Pub from '../components/Pub'
import Pubs from '../components/Pubs'
import Reviews from '../components/Reviews'
import User from '../components/User'
import P404 from '../components/404'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/game/:id',
            name: 'game',
            component: Game
        },
        {
            path: '/dev/:id',
            name: 'dev',
            component: Dev
        },
        {
            path: '/devs/',
            name: 'devs',
            component: Devs
        },
        {
            path: '/favs',
            name: 'favs',
            component: Favs
        },
        {
            path: '/platforms',
            name: 'platforms',
            component: Platforms
        },
        {
            path: '/platform/:id',
            name: 'platform',
            component: Platform
        },
        {
            path: '/pub/:id',
            name: 'pub',
            component: Pub
        },
        {
            path: '/pubs',
            name: 'pubs',
            component: Pubs
        },
        {
            path: '/reviews',
            name: 'reviews',
            component: Reviews
        },
        {
            path: '/settings',
            name: 'user',
            component: User
        },
        {
            path: '*',
            name: 'notFound',
            component: P404
        }

    ]
});

export default router