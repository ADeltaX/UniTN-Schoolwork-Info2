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
            path: '/Game/:slug',
            name: 'game',
            component: Game
        },
        {
            path: '/Dev/:slug',
            name: 'dev',
            component: Dev
        },
        {
            path: '/Devs/',
            name: 'devs',
            component: Devs
        },
        {
            path: '/Favs',
            name: 'favs',
            component: Favs
        },
        {
            path: '/Platforms',
            name: 'platforms',
            component: Platforms
        },
        {
            path: '/Platform/:slug',
            name: 'platform',
            component: Platform
        },
        {
            path: '/Pub/:slug',
            name: 'pub',
            component: Pub
        },
        {
            path: '/Pubs',
            name: 'pubs',
            component: Pubs
        },
        {
            path: '/Reviews',
            name: 'reviews',
            component: Reviews
        },
        {
            path: '/Settings',
            name: 'user',
            component: User
        },
        {
            path: '*',
            name: 'catchAll',
            component: Home
        }

    ]
});

export default router