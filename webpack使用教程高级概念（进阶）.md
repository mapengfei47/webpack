# Webpack的高级概念

[TOC]



## 一. tree shaking

### 1.1 概念

> 在打包过程中，用来删除没有被使用到的文件，减小bundle.js的体积

### 1.2 使用

- **在生产环境下**
  - tree shaking默认已经配置好了，只需要添加如下配置即可
  - `sideEffects`配置的作用是，用来排除打包的时候，不需要使用 tree shaking的文件，
  - 当`sideEffects`设置为false的时候，是告诉webpack，所有文件都使用tree shaking

~~~json
//package.json
//...
//sideEffects: ["*.css","./src/some.js"]
"sideEffects":false
~~~



- **在开发环境下**

  - 需要我们手动配置 tree shaking

  ~~~js
  // webpack.config.js
  module.exports = {
      // ...
      optimization: {
          usedExports: true
      }
  }
  ~~~

  ~~~json
  //package.json
  "sideEffects": false
  ~~~



## 二. 开发和生产模式下的打包模式区分

> 可以分别配置开发和生产环境各自独立的配置文件
>
> 在打包的时候，通过package.json的scripts分别配置生产环境和开发环境各自的打包命令

~~~js
// webpack.common.js

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname,'./src/index.js'),
    output:{
        path: path.resolve(__dirname,'./dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            title: 'prouction'
        })
    ]
}
~~~

~~~js
// webpack.dev.js
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
})
~~~

~~~js
// webpack.prod.js
const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common,{
    mode: 'production',
    plugins: [
        new  UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_env': JSON.stringify('production')
        })
    ]
})
~~~

~~~json
// package.json

scripts:{
    "dev": "webpack-dev-server --config webpack.dev.js",
    "prod": "webpack --config webpack.prod.js"
}
~~~



## 三. code splitting

> **作用：**代码分割，通过合理的代码分割，可以使代码性能更高
>
> **核心：**提取不会更改的核心内库，避免修改后重复加载，影响页面响应性能

**示例：**

~~~js
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks:{
            chunks: 'all'
        }
    }
}  
~~~

