var path = require('path');
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var glob = require('glob')
// console.log(baseWebpackConfig.entry)
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  console.log(baseWebpackConfig.entry[name])
	baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function getEntry(globPath) {
	var entries = {}, basename, tmp, pathname;
    // console.log(glob.sync(globPath));
    // console.log('1=====================')
	glob.sync(globPath).forEach(function(entry) {
    // console.log('2=====================')
		basename = path.basename(entry,path.extname(entry));
		tmp = entry.split('/').splice(-3);
		pathname = tmp.splice(0,1) + '/' + basename	//正确输出js和html的路径
    // console.log(pathname);
		entries[pathname] = entry;
	});
  // console.log('3=============');
  // console.log(entries);
	return entries;
}

module.exports = merge(baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
	},
	//cheap-module-eval-source-map is faster for development
	devtool: '#cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': config.dev.env
		}),
		//使用ProvidePlugin加载使用频率高的模块
		// new webpack.ProvidePlugin({
		// 	$: "webpack-zepto"
		// }),
		//	http://github.com/glenjamin/webpack-hot-middleware#installation--usage
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		// new HtmlWebpackPlugin({
		//   filename: 'index.html',
		//   template: 'index.html',
		//   inject: true
		// }),	
		new FriendlyErrorsPlugin()
	]
})

// function getEntry(globPath) {
// 	var entries = {},
// 		basename,tmp, pathname;

// 	glob.sync(globPath).forEach(function(entry) {
// 		basename = path.basename(entry,path.extname(entry));
// 		tmp = entry.split('/').splice(-3);
// 		pathname = tmp.splice(0,1) + '/' + basename;

// 		entries[pathname] = entry;
// 	});

// 	return entries;
// }

var pages = getEntry('./src/modules/**/*.html');

for(var pathname in pages) {
	// 配置生成的html文件， 定义路径等
  // console.log('aaaaaaaaaaaaaaaaaaaaaaa')
	var conf = {
		filename: pathname + '.html',
		template: pages[pathname],
		inject: true,
		// necessary to consistently work with multiple chunks via CommonsChunkPlugin
		chunksSortMode: 'dependency'
	};
  // console.log('bbbbbbbbbbbbbb');
	if(pathname in module.exports.entry) {
		conf.chunks = ['manifest', 'vendor', pathname];
		conf.hash = true;
	}
  // console.log('ccccccccccccccccccccccccccccc');
	module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}