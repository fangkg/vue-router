# vue-router-demo

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

一、核心原理
1、前端路由：在web前端单页应用SPA(Single Page Application)中，路由描述的是URL和UI之间的映射关系，这种映射是单向的，即URL变化引起UI更新，无需刷新页面。
2、实现：
    2-1：改变URL不引起页面刷新
    2-2：检测URL变化
    hash实现
        hash是URL中hash(#)及后面的那部分，常用作锚点在页面内进行导航，改变URL中的hash部分不会引起页面刷洗。
        通过浏览器前进后退改变URL
        通过<a>标签改变URL
        通过window.location改变URL
    history实现
        history提供了pushState和replaceState两个方法，这两个方法改变URL的path部分不会引起页面刷新。
        history提供类似hashchange事件的popstate事件，但popstate事件有些不同：
        通过浏览器前进后退改变URL时会触发popstate事件
        通过pushState/replaceState或<a>标签改变URL不会触发popstate事件
        可以拦截pushState/replaceState的调用和<a>标签的点击事件来检测URL变化
        通过js调用history的back，go, forward方法触发该事件

二、原生js实现前端路由

基于hash实现
1、通过<a>标签的href属性改变URL的hash值
   触发浏览器的前进后退按钮改变URL的hash值
   在控制台输入window.location赋值来改变hash
2、监听hashchange事件，一旦事件触发，就改变routerView的内容，在vue中改变的是router-view这个组件的内容。
3、监听load事件，页面第一次加载完不会触发hashchange,因而用load事件来监听hash值，再将视图渲染成对应的内容。

基于history实现
通过<a>标签的href属性来改变URL的path值
触发浏览器的前进后退按钮改变URL的path值
在控制台输入history.go,back,forward赋值来触发popState事件
注意：当改变path值时，默认会触发页面的跳转，所有需要拦截<a>标签点击事件默认行为，点击时使用pushState修改URL并手动更新UI,从而实现点击链接更新URL和UI的效果。
监听popState事件，一旦事件触发就改变routerView内容
load事件监听popState事件，一旦事件触发就改变routerView的内容。

hash模式也可用用history.go,back,forward来触发hashchange事件，不管什么模式，浏览器为保存记录都会有一个栈。

三、基于Vue实现VueRouter
1、安装VueRouter,再通过import VueRouter from 'vue-router'引入
2、创建VueRouter实例 const router = new VueRouter({...}) =>说明VueRouter是一个类
3、把router作为参数的一个属性值 new Vue({router})
4、通过Vue.use(VueRouter)注册VueRouter组件，使得每个组件都可以拥有VueRouter实例。=>Vue.use的一个原则是执行对象的install方法

Vue.use(plugin) 
{Object | Function} plugin
安装Vue.js插件，如果插件是一个对象，必须提供install方法。如果插件是一个函数，会被作为install方法。调用install方法时，会将Vue作为参数传入。install方法被同一插件多次调用时，插件只会被安装一次。保证插件列表中不能有重复的插件。
注册插件只需要调用install方法并将Vue作为参数传入即可。

在Vue.js新增use方法，并接收一个参数plugin
首先判断插件是否已注册过，如果被注册过，终止方法的执行 indexOf()
toArray()将类数组转成真正的数组。const args = toArray(arguments,1); args.unshift(this);toArray方法得到arguments。除了第一个参数之外，剩余的所有参数将得到的列表赋值给args,然后将Vue添加到args列表的最前面。这样做的目的是保证install方法被执行时第一个参数是Vue,其余参数是注册插件时传入的参数。
由于plugin参数支持对象和函数类型，所以通过判断plugin.install和plugin哪个是函数，即可知道使用哪种方式注册插件，然后执行用户编写的插件并将args作为参数传入。
最后将插件添加到installedPlugins中，保证相同的插件不会反复被注册。

install() 给每个组件添加$route 和 $router
$router是VueRouter的实例对象，$route是当前路由对象。 => $route是$router的一个属性  每个组件添加的$route 和 $router是同一个，所有组件是共享的。
参数Vue
minxin的作用是将mixin的内容混合到Vue的初始参数options中
使用beforeCreate不是created 因为如果是created $options已经初始化好了
判断当前组件是根组件传入的router和_root挂载到根组件实例上
判断当前组件是子组件，将_root根组件挂载到子组件，应用复制，每个组件都拥有了同一个_root根组件挂载。
判断当前组件是子组件就可以直接从父组件拿到_root根组件，父组件和子组件执行顺序：父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted     => 执行子组件的beforeCreate的时候，父组件已经执行完beforeCreate了，此时父组件已经有了_root了。


vue响应式原理
利用Vue提供的API: defineReactive 使得this._router.history对象得到监听
因此当第一次渲染router-view这个组件的时候，会获取到this._router.history这个对象，从而会被监听获取this._router.history。会把router-view组件的依赖wacther收集到this._router.history对应的收集器dep中。因此this._router.history每次改变的时候，this._router.history对应的收集器dep就会通知router-view的组件依赖wacther执行update(),从而使得router-view重新渲染。





