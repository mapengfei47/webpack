
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import app from './App.vue'
import router from './router.js'
// import login from './comp1/login.vue'
// import register from './comp1/register.vue'
// import account from './comp2/account.vue'
// import money from './comp2/money.vue'

// var router = new VueRouter({
//     routes:[
//         {path:'/login',component:login,children:[
//             {path:'account',component:account},
//             {path:'money',component:money},
//         ]},
//         {path:'/register',component:register}
//     ]
// })

var vm = new Vue({
    el:'#app',
    render: c => c(app),
    router
})