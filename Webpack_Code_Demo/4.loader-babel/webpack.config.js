
const path = require('path')

const webpack = require('webpack')

const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    devServer:{
        open:true,
        port:3000,
        contentBase:'src',
        hot:true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']},
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},
            {test:/\.(png|jpg|jepg|gif)$/,use:'url-loader?limit=1000&name=[hash:8]-[name]-[ext]'},
            {test:/\.(eot|svg|woff|woff2|ttf)$/,use:'url-loader'},
            {test:/\.js$/,use:'babel-loader',exclude:/node_modules/},
        ]
    }
}