import Vue from 'vue'
import VueRouter from './fvue-router'
import Home from '../views/Home.vue'


// VueRouter为一个插件 使用use()绑定到Vue原型上作为一个全局插件
Vue.use(VueRouter)

// 定义路由表
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router