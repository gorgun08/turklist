import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Leaderboard2 from './pages/Leaderboard2.js';
import Roulette from './pages/Roulette.js';
import Challenge from './pages/Challenge.js';
import uptotheceilingdowntothefloor from './pages/uptotheceilingdowntothefloor.js';
import ListPacks from './pages/ListPacks.js'

export default [
    { path: '/', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/leaderboard2', component: Leaderboard2 },
    { path: '/roulette', component: Roulette },
    { path: '/challenge', component: Challenge },
    { path: '/uptotheceilingdowntothefloor', component: uptotheceilingdowntothefloor },
    { path: '/list-packs', component: ListPacks },
];
