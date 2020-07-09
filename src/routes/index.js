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
            path: '/Game',
            name: 'game',
            component: Game
        },
        {
            path: '/Dev',
            name: 'dev',
            component: Dev
        },
        {
            path: '/Devs',
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
            path: '/Platform',
            name: 'platform',
            component: Platform
        },
        {
            path: '/Pub',
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

    ]
});

export default router