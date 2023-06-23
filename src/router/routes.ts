import type { RouteRecordRaw } from 'vue-router';
import { loginRoutesHook } from './guards'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/home/index.vue"),
    meta: {
      needAuth: false,
      title: '首页'
    }
  },
  {
    path: '/discover',
    name: 'discover',
    component: () => import("@/views/discover/index.vue"),
    meta: {
      needAuth: false,
      title: '发现'
    },
    redirect: '/discover/hot',
    children: [
      {
        path: '/discover/hot',
        name: 'discover-hot',
        component: () => import("@/views/discover/children/hot/index.vue"),
        meta: {
          needAuth: false,
          title: '发现热帖'
        },
      },
      {
        path: '/discover/bar',
        name: 'discover-bar',
        component: () => import("@/views/discover/children/bar/index.vue"),
        meta: {
          needAuth: false,
          title: '发现吧'
        },
      },
      {
        path: '/discover/comment',
        name: 'discover-comment',
        component: () => import("@/views/discover/children/comment/index.vue"),
        meta: {
          needAuth: false,
          title: '发现热评'
        },
      },
      {
        path: '/discover/article',
        name: 'discover-article',
        component: () => import("@/views/discover/children/article/index.vue"),
        meta: {
          needAuth: true,
          title: '发现帖子'
        },
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/views/login/index.vue"),
    meta: {
      needAuth: false,
      title: '登录'
    },
    beforeEnter: loginRoutesHook
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/views/register/index.vue"),
    meta: {
      needAuth: false,
      title: '注册'
    }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import("@/views/my/index.vue"),
    meta: {
      needAuth: true,
      title: '我的'
    }
  }
]

export default routes