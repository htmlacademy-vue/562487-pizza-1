import { auth, isLoggedIn } from "@/middlewares";

export default [
  {
    path: "/",
    name: "IndexHome",
    component: () => import("../views/Index.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("../views/Login.vue"),
        meta: { middlewares: [isLoggedIn] },
      },
    ],
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/Orders.vue"),
    meta: {
      layout: "AppLayoutMain",
      middlewares: [auth],
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: { layout: "AppLayoutMain", middlewares: [auth] },
    children: [
      {
        path: "create",
        name: "ProfileCreate",
        component: () => import("../views/ProfileCreate.vue"),
        meta: { layout: "AppLayoutMain", middlewares: [auth] },
      },
      {
        path: "edit/:id",
        name: "ProfileEdit",
        component: () => import("../views/ProfileEdit.vue"),
        meta: { layout: "AppLayoutMain", middlewares: [auth] },
      },
    ],
  },
];
