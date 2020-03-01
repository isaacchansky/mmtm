import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import firebase from 'firebase';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Notes from '../views/Notes.vue';
import Actions from '../views/Actions.vue';
import NoteDetail from '../views/NoteDetail.vue';
import Settings from '../views/Settings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/actions',
    name: 'actions',
    component: Actions,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/notes',
    name: 'notes',
    component: Notes,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '/notes/:id',
        name: 'note.detail',
        component: NoteDetail,
        props: (route: Route) => ({ id: route.params.id }),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const { currentUser } = firebase.auth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next('/login');
    return;
  }
  next();
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    router.replace('/notes');
  }
});

export default router;
