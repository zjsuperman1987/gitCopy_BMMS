var merge = reuqire('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
	NODE_ENV: '"testing"'
})