// 引入Vue构造函数
let Vue

class VueRouter {
    constructor(options) {
        // 保存选项备用
        this.$options = options

        // 创建current保存当前url
        // 使用current的组件重新渲染 current 应该是响应式的
        const initial = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'current', initial)

        // 监听hashChange事件
        window.addEventListener('hashchange', this.onHashChange.bind(this))

        // 缓存路由映射关系
        this.routeMap = {}
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })
    }

    onHashChange() {
        this.current = window.location.hash.slice(1)
    }
}



// 实现install方法
VueRouter.install = function (_Vue) {
    // 保存构造函数
    Vue = _Vue

    // 挂载VueRouter实例
    // 为了能够拿到Vue根实例中router实例，利用全局混入
    Vue.mixin({
        beforeCreate() {
            // 上下文已经是组件实例了 this指代组件实例
            if (this.$options.router) {
                // 挂载
                Vue.prototype.$router = this.$options.router
            }
        }
    })


    // 注册两个组件 router-view   router-link
    // 组件容器
    Vue.component('router-view', {
        render(h) {
            const {routeMap, current} = this.$router
            const component = routeMap[current] ? routeMap[current].component : null
            return h(component)
        }
    })


    // 浏览器解析成<a></a>
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                default: ''
            }
        },
        render(h) {
            return h('a', { attrs: {href: '#' + this.to } }, this.$slots.default)
        }
    })
}


export default VueRouter