import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',      //访问路径不带井号
    linkActiveClass: "active",
    routes: [
        /*前台展示*/
        {
            path: '/',
            name: 'home',
            component: resolve => require(['@/view/client/home/home.vue'], resolve)   //使用懒加载
        },
        {
            path: '/client/home',
            name: 'home',
            component: resolve => require(['@/view/client/home/home.vue'], resolve)
        },
        {
            path: '/client/result',
            name: 'result',
            component: resolve => require(['@/view/client/result/result.vue'], resolve)
        },
        {
            path: '/client/goodsList',
            name: 'goodsList',
            component: resolve => require(['@/view/client/goodsList/goodsList.vue'], resolve),
            children:[
                {
                    path: 'good',
                    name: 'good',
                    component: resolve => require(['@/view/client/goodsList/good/good.vue'], resolve)
                }
            ]
        },
        {
            path: '/client/shopCart',
            name: 'shopCart',
            component: resolve => require(['@/view/client/shopCart/shopCart.vue'], resolve),
            children:[
                {
                    path: 'checkout',
                    name: 'checkout',
                    component: resolve => require(['@/view/client/shopCart/checkout/checkout.vue'], resolve)
                }
            ]
        },
        {
            path: '/client/personalPage',
            name: 'personalPage',
            component: resolve => require(['@/view/client/personalPage/personalPage.vue'], resolve),
            children: [
                {
                    path: 'setting',
                    name: 'setting',
                    component: resolve => require(['@/view/client/personalPage/setting/setting.vue'], resolve),
                    meta: {
                        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: 'personalInfo',
                    name: 'personalInfo',
                    component: resolve => require(['@/view/client/personalPage/personalInfo/personalInfo.vue'], resolve),
                    meta: {
                        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: 'address',
                    name: 'address',
                    component: resolve => require(['@/view/client/personalPage/address/address.vue'], resolve),
                    meta: {
                        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                    },
                },
                {
                    path: 'order',
                    name: 'order',
                    component: resolve => require(['@/view/client/personalPage/order/order.vue'], resolve),
                    meta: {
                        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                    },
                    children:[{
                        path: 'orderInfo',
                        name: 'orderInfo',
                        component: resolve => require(['@/view/client/personalPage/orderInfo/orderInfo.vue'], resolve),
                        meta: {
                            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                        },
                    }]
                },
                {
                    path: 'editAddress',
                    name: 'editAddress',
                    component: resolve => require(['@/view/client/personalPage/editAddress/editAddress.vue'], resolve),
                    meta: {
                        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                    },
                }
            ]
        },
        {
            path: '/client/login',
            name: 'login',
            component: resolve => require(['@/view/client/login/login.vue'], resolve)
        },
        {
            path: '/client/register',
            name: 'register',
            component: resolve => require(['@/view/client/register/register.vue'], resolve)
        },

        /*后台管理*/
        {
            path: '/management/login',
            name: 'login',
            component: resolve => require(['@/view/management/login/login.vue'], resolve),
        },
        {
            path:'/management/index',
            redirect: '/management/goodList'
        },
        {
            path: '/management/goodList',
            name: 'goodsList',
            component: resolve => require(['@/view/management/goodList/goodList.vue'], resolve),
            meta: {
                requireButh: true,  // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/management/createGood',
            name: 'createGood',
            component: resolve => require(['@/view/management/createGood/createGood.vue'], resolve),
            meta: {
                requireButh: true,  // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/management/classifyList',
            name: 'classifyList',
            component: resolve => require(['@/view/management/classifyList/classifyList.vue'], resolve),
            meta: {
                requireButh: true,  // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/management/createClassify',
            name: 'createClassify',
            component: resolve => require(['@/view/management/createClassify/createClassify.vue'], resolve),
            meta: {
                requireButh: true,  // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/management/orderList',
            name: 'orderList',
            component: resolve => require(['@/view/management/orderList/orderList.vue'], resolve),
            meta: {
                requireButh: true,  // 添加该字段，表示进入这个路由是需要登录的
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
        if (sessionStorage.getItem('userName')) {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/client/login',
                query: {redirect: to.fullPath}
            })
        }
    }else if (to.matched.some(res => res.meta.requireButh)) {// 判断是否需要登录权限
        if (sessionStorage.getItem('adminName')) {// 判断是否登录
            next()
        } else {// 没登录则跳转到登录界面
            next({
                path: '/management/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
})

export default router;
