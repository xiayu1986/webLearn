var webpack=require("webpack"),
    path=require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),//用于将样式文件打包面独立的css文件
    commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common');//CommonsChunkPlugin插件用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用
module.exports = {
    entry: {//entry 是页面入口文件配置
        "page":"./page/entry.js"
        //"main":["page1.js","page2.js"]//可支持数组形式,例如这样的形式
    },
    output: {//output是对应输出项配置(即入口文件最终要生成什么名字的文件、存放到哪里)
        path:"./main/",
        filename: "[name].js"
    },
    module: {
        loaders: [//loaders是最关键的一块配置。它告知 webpack 每一种文件都需要使用什么加载器来处理
            {test: require.resolve('jquery'), loader: 'expose?jQuery'},//暴露全局JQ
            { test: /\.css$/, loader: "style!css" },//loader: "style-loader!css-loader","-loader"其实是可以省略不写的，多个loader之间用'!'连接起来。
            {test:/\.(jpg|png|gif|woff|woff2|svg|eot|ttf)\??.*$/,loader:"url-loader?limit=50000&name=[path][name].[ext]"}
            //,{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'}//scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
        ]
    },
    resolve:{
        //root: 'E:/github/flux-example/src', //表示查找module的话从这里开始查找
        extensions:['.js','.css'],//自动扩展文件的后缀名，这样我们在require的时候可以不用写后缀了
        alias:{//模块别名定义，方便后续直接引用别名，无须多写长长的地址
            bootstrapCss:'../css/bootstrap',
            jquery:path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            bootstrapJs:'../js/bootstrap',
            pageMain:'../js/page'
        }
    },
    plugins:[]//插件配置项
};

