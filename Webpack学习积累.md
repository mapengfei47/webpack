# Webpack学习积累

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



### 2.3 SplitChunksPlugin

> **作用：**该插件通常用来配置webpack的代码分割

**SplitChunksPlugin的默认配置**

~~~js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',	//指定要优化的模块，取值为initial（同步），async（异步），all（全部）。
      minSize: 30000,	// 打包文件的最小大小
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',		//生成名称的分隔符，eg:vendors~main.js
      automaticNameMaxLength: 30,		//生成块名称的最大字符数
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
~~~













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



## 四. Eslint的使用

### 4.1 Eslint介绍

> **Eslint是什么：**在一个团队协作的项目里面，每个人的代码风格会有所差异，为了指定统一的编程风格，提高团队代码的规范性，我们就需要使用Eslint



### 4.2 Eslint基本使用

**安装：**

```shell
npm install eslint -D
```

**配置文件：**

```shell
npx eslint --init
```

- 以问答形式的方式，选择响应的规则

- 完成配置之后，在项目目录下会多出一个`.eslintrc.js`文件，即Eslint的配置文件

**代码检测：**

> 执行代码检测的方法有好几种，接下来我们来一个个学习

- 在执行代码检测之前，我们来更换一下Eslint的默认解析器，将其替换为 `babel-eslint`

~~~js
// .eslintrc.js

module.exports = {
	"extends": "airbnb",
    "parser": "babel-eslint",
};
~~~

1. 通过命令行查看代码检测结果

   - 在项目目录下运行如下命令即可，控制台会将我们所有不合规范的代码打印出来
   - 缺点：使用控制控制台查看错误警告不方便

   ~~~shell
   npx eslint src
   ~~~

2. 使用 VsCode的Eslint插件
   
   - 在安装了Eslint插件的前提下，如果我们的项目中使用了Eslint规范，并且项目目录中配置了 .eslintrc.js文件夹，那么，不符合我们Eslint的代码会直接在我们的代码中提示出来，方便修改



### 4.3 在Webpack中使用Eslint

> **eslint-loader：**可以在webpack中安装 eslint-loader 来实现代码规范检测的功能
>
> **注意：**使用eslint-loader之前，需要完成上述的Eslint配置

**1. 安装 eslint-loader**

**2. 使用 eslint-loader**

- 在webpack.config.js文件中添加如下配置即可
  - 在devServer中添加
  - 在js相关的loader中，添加 eslint-loader
  - 在该模式下，如果我们的代码不符合规范，则当我们打开浏览器访问我们的界面的时候，会有一个错误弹出层，告诉我们具体的错误信息，直到我们解决完所有的错误，界面才会显示出来

~~~js
// webpack.config.js

module.exports = {
    //...
    devServer: {
        overlay: true
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: ['babel-loader', 'eslint-loader']
            }
        ]
	}
}


~~~



### 4.4 Eslint 配置参考

[Eslint官网配置](https://eslint.org/docs/user-guide/configuring)

[webpak: Eslint-loader配置](https://webpack.js.org/loaders/eslint-loader/)



## 五. webpack性能优化

### 5.1 提升webpack打包速度

1. **跟上技术的迭代，使用新版本的工具**
   - Node，Npm，Yarn

2. **在尽可能少的模块上使用loader**
   - 减少loader的作用范围

3. **合理的使用插件，最好是官网推荐的，一般性能会好一些**

4. **resolve参数合理配置**

5. **控制包文件大小**

6. **thread-loader，parallel-webpak，happypack多进程打包**
7. **合理使用 sourceMap**
8. **结合 stats 分析打包结果**
9. **开发环境内存编译**

10. **开发环境无用插件剔除**



## 六. webpack调试小技巧

> 在我们开发loader或者plugin或者开发自己的代码的时候，我们可以使用如下技巧来实现断点调试的功能

**1. 在package.json文件中添加如下打包命令**

~~~json
// package.json
//依然使用webpack命令进行打包，只不过我们增加了 --inspect --inspect-brk参数

"scripts": {
    "debuge": "node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"
}
~~~

**2.我们可以在我们要打断点的地方添加上如下代码**

~~~js
// webpack打包过程中，任意你想打断点的文件

//在你想要打断点的位置
debugger;
~~~

**3. 打好断点之后，我们使用 npm run debuge打包文件，控制台会显示断点调试已开启**

**4. 打开任意的浏览器界面，打开调试台，会看增加了如下图标，点击即可进入我们的代码断点调试界面**

![](./imgs/webpack-debuge-skill.jpg)



## 七. 在React和Vue中使用webpack

### 7.1 React

> **脚手架：create-react-app**
>
> **描述：**通过脚手架创建React项目之后，脚手架会隐藏webpack的默认配置，我们可以通过 `npm run eject`命令来让Webpack的配置显示到项目文件夹，然后根据自己的需要，手动的修改配置webpack的配置
>
> **注意：**在React中，可以直接操作webpack的配置，这点不同于Vue

**使用：**

略；详情参考如下

[Create React App官网](https://create-react-app.dev/docs/getting-started)

[webpack官网](https://webpack.js.org/)



### 7.2 Vue

> **脚手架：vue-cli**
>
> **描述：**与React不同的是，通过Vue脚手架创建的Vue项目，我们无法查看webpack的配置，但是，Vue帮我们封装了webpack，我们可以通过Vue封装的配置，来实现对webpack配置的修改
>
> **配置文档：**Vue-cli配置参考（即对webpack的封装，底层操作的还是webpack）

**使用：**

- 在项目根目录创建 `vue.config.js`
- 根据Vue-cli配置参考中的配置，修改webpack的配置

- 具体使用略，详情可参考如下文档

[Vue-cli配置参考](https://cli.vuejs.org/zh/config/)

