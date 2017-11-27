var merge = require('webpack-merge')
var prodEnv = reuire('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"'
})