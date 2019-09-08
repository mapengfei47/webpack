# Webpack学习二

[TOC]



## 一. loader的使用

### 1.1 打包图片

#### 1.1.1 file-loader

> file-loader 可以用来打包图片资源
>
> **安装：**`npm i file-loader -D`
>
> **使用：**
>
> -  默认情况下（未添加options配置），
>   - 图片将打包到dist目录或者是output指定的输出目录
>   - 打包之后的文件名为随机生成的Hash值
> - 配置options
>   - 指定输出的文件名
>   - 指定输出的地址（在dist目录下）
> -  配置项说明
>    -  如下示例设置了几种常见的name输出方式
>    -  [path] ：代表该图片资源原始路径的目录层次，会原样输出到指定目录
>    -  [name] : 原图片的文件名
>    -  [hash] ：hash值，通常用来和图片文件名拼装，防止文件名的重复
>    -  [ext] : 图片的后缀名
>    -  outputPath：打包的文件在dist（或output指定路径）目录下的路径，默认直接输出在dist目录下

~~~js
module:{
    rules:[
        {
            test:/\.(png|jpg|gig|jepg)$/,
            loader:'file-loader',
            options: {
                //name:'[path][name].[ext]',
                //name:'[path][contenthash].[ext]',
                name:'[name]_[hash].[ext]',
                outputPath:'images'
            }
        }
    ]
}
~~~



#### 1.1.2 url-loader

> url-loader也可以用来打包图片
>
> **安装：**`npm install url-loader -D`
>
> **使用：**
>
> - 默认情况下，
>   - url-loader会以Base64的方式打包图片资源，即直接写入入口的js函数中，而不会生成我们看到的资源
>   - 优点：当资源文件较小的时候，可以省去http请求，优化页面加载
>   - 缺点：当资源文件较大的时候，会影响js文件的加载，造成页面响应时间增加，影响用户体验
>   - 解决方法：通过配置options的limit属性，指定以Base64打包的最大资源文件大小，超过指定的大小，即以之前的方式打包，否则，以Base64的方式打包
>   - limit属性的单位是 b(1000b = 1kb)

~~~js
//当图片的大小小于1024kb（即1M）的时候，以Base64的方式打包，否则，以之前的方式打包
module:{
    rules:[
        {
            test:/\.(png|jpg|gig|jepg)$/,
            loader:'url-loader',
            options: {
                name:'[name]_[hash].[ext]',
                outputPath:'images',
                limit:1024000
            }
        }
    ]
}
~~~



### 1.2 打包样式

#### 1.2.1 打包CSS

> 打包CSS需要使用 style-loader，css-loader
>
> **安装：**`npm i css-loader style-loader -D`

~~~js
module:{
    rules:[
        {
            test:/\.css$/,
            use:['style-loader','css-loader']
        }
    ]
}
~~~

#### 1.2.2 打包less

- 略

#### 1.2.3 打包sass

> 打包sass需要使用 sass-loader，node-sass
>
> **安装：**`npm i sass-loader node-sass -D`
>
> **使用：**
>
> - 打包sass的时候，我们在css-loader里面配置了一个options
>   - modules：将打包之后的CSS文件模块化（需要在引入的时候使用变量来接收），防止污染全局CSS文件
>   - importLoaders：在使用sass的时候，经常会在某一个sass文件中引入其它样式表，该属性作用是将引入的其它样式表也以同样的方式做打包处理 



webpack.config.js

~~~js
module:{
    rules:[
        {
            test:/\.scss$/,
            use:[
                'style-loader',
                {
                    loader:'css-loader',
                    options:{
                        modules:true,
                        importLoaders:2,
                    }
                },
                'scss-loader'
            ]
        }
    ]
}
~~~

main.js

~~~js
import style from './index.scss'
//...
someDom.addClass(style.someClass)
~~~

#### 1.2.4 打包字体图标

> 可以使用 file-loader 打包字体图标
>
> **使用：**

~~~js
module:{
    rules:[
        {
            test:/\.(eot|woff|ttf|svg|woff2)$/,
            use['file-loader']
        }
    ]
}
~~~

main.js

~~~js
import './inconFont.css'

dom.innerHtml = "<div class='iconfont icon-notebook'></div>"
~~~



## 二. plugin的使用

### 2.1 html-webpack-plugin

- **作用：**在打包结束之后自动生成一个HTML文件，并把打包生成的js自动引入到HTML界面中
  - 无需我们手动在页面中引入打包的js文件
- **用法**

~~~js
const htmlWebpackPlugin = require('html-webpack-plugin')

plugins:[
    new htmlWebpackPlugin(
    	{template:'./src/index.html'}
    )
]
~~~

### 2.2 clean-webpack-plugin

- **作用：**在打包之前，删除dist目录下的所有文件，使得dist目录下面存放的只是最近一次打包的文件
- **用法**

~~~js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

plugins:[
    new CleanWebpackPlugin()
]
~~~



devtool：配置js文件的映射，当我们的js文件有错误的时候，会直接定位到指定文件的指定行

webpack --watch：打包并监控的命令，每当我们文件修改，会自动帮我们打包



hmr：Hot-module-replacement（热模块更新）

作用：在修改完文件之后，在界面上只更新相应修改的部分，不会将页面重新渲染



## 三. webpack-dev-server的使用

> 实现每次修改完文件之后，自动打包的方法有三种

### 3.1 webpack --watch命令

> 使用 webpack --watch命令进行打包之后，每次我们文件修改，都会自动帮我们打包，但是要我们主动刷新浏览器界面才会生效

### 3.2 webpack-dev-server

- 推荐使用方法

> 使用webpack-dev-server是webpack自带的服务器类型模块，常用来实现如下功能
>
> - 文件修改后自动打包
> - 通过设置端口，自动在服务器打开HTML界面
> - 热加载
> - ...

**安装**

~~~shell
npm install webpack-dev-server -D
~~~

**配置**

- 有两种方法可以配置webpack-dev-server

1. 通过package.json里面的scripts命令行
   - --port ：指定服务端口号
   - --contentBase：指定打开基础目录
   - --hot ：开启热加载
   - --open：自动打开浏览器

~~~json
//package.json

scripts:{
    "dev": "webpack-dev-server --port 3000 --contentBase ./dist --hot --open"
}
~~~

2. 通过webpack.config.js配置

~~~json
//package.json
scripts:{
    "dev": "webpack-dev-server"
}
~~~

~~~js
//webpack.config.js
module.expotrs = {
   //... 
    devServer: {
        port: '3000',
        open: true,
        contentBase: './dist',
        hot: true,
        hotOnly: true
    }
}
~~~

### 3.3 自定义服务器

- 知道即可，实现略