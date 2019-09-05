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

