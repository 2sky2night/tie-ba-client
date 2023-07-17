import type { RouteRecordRaw } from 'vue-router';
import { loginRoutesHook, userRoutesHooks } from './guards'

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
        component: () => import("@/views/discover/children/hot-article/index.vue"),
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
        component: () => import("@/views/discover/children/hot-comment/index.vue"),
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
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import("@/views/edit/index.vue"),
    meta: {
      needAuth: true,
      title: '编辑'
    }
  },
  {
    path: '/user/:uid',
    name: 'user',
    component: () => import("@/views/user/index.vue"),
    meta: {
      needAuth: false,
      title: '用户'
    },
    beforeEnter: userRoutesHooks
  },
  {
    path: '/article/:aid',
    name: 'article',
    component: () => import("@/views/article/index.vue"),
    meta: {
      needAuth: false,
      title: '帖子详情'
    }
  },
  {
    path: '/bar/:bid',
    name: 'bar',
    component: () => import("@/views/bar/index.vue"),
    meta: {
      needAuth: false,
      title: '吧'
    }
  },
  {
    path: '/fans/:uid',
    name: 'fans',
    component: () => import("@/views/fans/index.vue"),
    meta: {
      needAuth: false,
      title: '粉丝'
    }
  },
  {
    path: '/follow/:uid',
    name: 'follow',
    component: () => import("@/views/follow/index.vue"),
    meta: {
      needAuth: false,
      title: '关注'
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/history/index.vue'),
    meta: {
      needAuth: false,
      title: '历史'
    }
  },
  {
    path: '/post-article',
    name: 'post-article',
    component: () => import('@/views/post-article/index.vue'),
    meta: {
      needAuth: true,
      title: '发帖'
    }
  },
  {
    path: '/create-bar',
    name: 'create-bar',
    component: () => import('@/views/create-bar/index.vue'),
    meta: {
      needAuth: true,
      title: '创吧'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue'),
    meta: {
      needAuth: false,
      title: '搜索'
    },
    redirect:'/search/article',
    children: [
      {
        path: '/search/article',
        name: 'search-title',
        component: () => import('@/views/search/children/article/index.vue'),
        meta: {
          needAuth: false,
          title: '搜索帖子'
        },
      },
      {
        path: '/search/bar',
        name: 'search-bar',
        component: () => import('@/views/search/children/bar/index.vue'),
        meta: {
          needAuth: false,
          title: '搜索吧'
        },
      },
      {
        path: '/search/comment',
        name: 'search-comment',
        component: () => import('@/views/search/children/comment/index.vue'),
        meta: {
          needAuth: false,
          title: '搜索评论'
        },
      },
      {
        path: '/search/user',
        name: 'search-user',
        component: () => import('@/views/search/children/user/index.vue'),
        meta: {
          needAuth: false,
          title: '搜索用户'
        },
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      needAuth: false,
      title: '404'
    }
  },
]

export default routes