import $ from 'jquery'
import './css/index.css'
import './css/index.less'
import './css/index.scss'
import 'bootstrap/dist/css/bootstrap.css'
import Vue from 'vue'
// import Vue from '../node_modules/vue/dist/vue.js'


import login from './login.vue'
// $(function(){
//     $("li:odd").css("backgroundColor","pink")
//     $("li:even").css("backgroundColor","tomato")

//     class Person{
//         static info = {name:'babel',age:18}
//     }
//     console.log(Person.info)
// })

// var login = {
//     template:`<h1>login success</h1>`
// }

var vm = new Vue({
    el:'#box',
    // components:{
    //     login
    // }
    // render: function (createElement, context) {
    //     return createElement(login)
    // }
    render: c => c(login)
})