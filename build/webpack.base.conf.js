var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var glob = require('glob')
var entries = getEntry('./src/modules/**/*.js')	//获得js文件

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

function getEntry(globPath) {
	var entries = {}, basename, tmp, pathname;

	glob.sync(globPath).forEach(function(entry) {
		// console.log(entry)
		basename = path.basename(entry, path.extname(entry));
		tmp = entry.split('/').splice(-3)
		pathname = tmp.splice(0,1) + '/' + basename	//正确输出js和html路径
		console.log('llllllllllllllllllllllllllllllllllllllllllll')
		console.log(pathname)
		entries[pathname] = entry;
	})
	console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
	// console.log(entries);
	return entries;
}
module.exports = {
	entry: entries,
	output: {
		path: config.build.assetsRoot,
		filename: '[name]'.js,
		publicPath: process.env.NODE_ENV === "production"
		  ? config.build.assetsPublicPath
		  : config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		modules: [
			resolve('src'),
			resolve('node_modules')		
		],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'src': resolve('src'),
			'assets': resolve('src/assets'),
			'components': resolve('src/components')		
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: "pre",
				include: [resolve('src'),resolve('test')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}
