import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: () => import("@/views/Login"),
    },
    {
      path: "/login",
      component: () => import("@/views/Login"),
    },
    //以下为管理员端
    {
      path: "/admin",
      component: () => import("@/views/AdminIndex"),
      meta: {
        requireAuth: true, //添加该字段，表示访问该页面需要登录
        requireAdminAuth: true, //添加该字段，表示访问该页面需要登录管理员账号
      },
      children: [
        {
          name: "Home",
          path: "home",
          component: () => import("@/views/admin/Home"),
        },
        {
          name: "Post",
          path: "post",
          component: () => import("@/views/admin/PostList"),
        },
        {
          name: "Plate Manage",
          path: "plate",
          component: () => import("@/views/admin/PlateManage"),
        },
        {
          name: "Moderator Manage",
          path: "moderator",
          component: () => import("@/views/admin/Moderator"),
        },
        {
          name: "Apply",
          path: "apply",
          component: () => import("@/views/admin/Apply"),
        },
        {
          name: "UserManage",
          path: "user",
          component: () => import("@/views/admin/UserManage"),
        },
        {
          name: "Sensitive Word Filter",
          path: "sensitive",
          component: () => import("@/views/admin/Sensitive"),
        },
        {
          name: "Post Write",
          path: "write",
          component: () => import("@/views/WritePost"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "Message",
          path: "message",
          component: () => import("@/views/profile/Message"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "Profile",
          path: "profile",
          component: () => import("@/views/profile/Profile"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          name: "Account",
          path: "account",
          component: () => import("@/views/profile/Account"),
          meta: {
            requireAuth: true, //添加该字段，表示访问该页面需要登录
          },
        },
        {
          path: "*",
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
  },
});
