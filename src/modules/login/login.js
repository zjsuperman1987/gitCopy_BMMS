// The Vue build version to load with the 'import' command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
new Vue({
	el: '#app',
	template: '<App ref="app"/>',
	components: {App},
	mounted: function() {
		this.$refs.app.showm=false;
	}
})