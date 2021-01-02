import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login'),
    },
    {
      path: '/',
      component: () => import('@/views/ForumIndex'),
      children: [
        {
          name: 'PostsList',
          path: '/',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Entertainment',
          path: 'ent',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'News and Notice',
          path: 'notice',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Study Communication',
          path: 'study',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Campus Chat',
          path: 'chat',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Flood',
          path: 'flood',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Flea Market',
          path: 'flea-market',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'NETM Communication',
          path: 'netm',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Campus Advice',
          path: 'advice',
          component: () => import('@/views/forum/PostsList'),
        },
        {
          name: 'Search',
          path: 'search',
          component: () => import('@/views/forum/Search')
        },
        {
          name: 'Post',
          path: 'post',
          component: () => import('@/views/forum/PostView'),
        },
        {
          name: 'Post View',
          path: 'write',
          component: () => import('@/views/WritePost'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Post View',
          path: 'edit',
          component: () => import('@/views/WritePost'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Message',
          path: 'message',
          component: () => import('@/views/profile/Message'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Profile',
          path: 'profile',
          component: () => import('@/views/profile/Profile'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Account',
          path: 'account',
          component: () => import('@/views/profile/Account'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        }
      ],
    },
    //以下为管理员端
    {
      path: '/admin',
      component: () => import('@/views/AdminIndex'),
      meta: {
        requireAuth: true, //添加该字段，表示访问该页面需要登录
        requireAdminAuth: true //添加该字段，表示访问该页面需要登录管理员账号
      },
      children: [
        {
          name: 'Home',
          path: 'home',
          component: () => import('@/views/admin/Home'),
        },
        {
          name: 'Post',
          path: 'post',
          component: () => import('@/views/admin/PostList'),
        },
        {
          name: 'Plate Manage',
          path: 'plate',
          component: () => import('@/views/admin/PlateManage'),
        },
        {
          name: 'Moderator Manage',
          path: 'moderator',
          component: () => import('@/views/admin/Moderator'),
        },
        {
          name: 'Apply',
          path: 'apply',
          component: () => import('@/views/admin/Apply'),
        },
        {
          name: 'UserManage',
          path: 'user',
          component: () => import('@/views/admin/UserManage'),
        },
        {
          name: 'Sensitive Word Filter',
          path: 'sensitive',
          component: () => import('@/views/admin/Sensitive'),
        },
        {
          name: 'Post Write',
          path: 'write',
          component: () => import('@/views/WritePost'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Message',
          path: 'message',
          component: () => import('@/views/profile/Message'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Profile',
          path: 'profile',
          component: () => import('@/views/profile/Profile'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          name: 'Account',
          path: 'account',
          component: () => import('@/views/profile/Account'),
          meta: {
            requireAuth: true //添加该字段，表示访问该页面需要登录
          }
        },
        {
          path: '*',
          redirect: "home",
        },
      ],

    },
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log(to);
    console.log(from);
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
})
