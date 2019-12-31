import VueRouter from 'vue-router'

import login from './comp1/login.vue'
import register from './comp1/register.vue'
import account from './comp2/account.vue'
import money from './comp2/money.vue'

var router = new VueRouter({
    routes:[
        {path:'/login',component:login,children:[
            {path:'account',component:account},
            {path:'money',component:money},
        ]},
        {path:'/register',component:register}
    ]
})

export default router