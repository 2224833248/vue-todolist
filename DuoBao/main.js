Object.prototype[Symbol.iterator] = function*() {
	let index = 0;
	let arr = Object.entries(this);
	let length = arr.length;
	let _this = this;
	while (true) {
		if (index >= length) {
			return false
		} else {
			let key = arr[index] && arr[index][0];
			let text = arr[index] && arr[index][1];
			let value = {
				key: key,
				get value() {
					return _this[this.key]
				},
				set value(val) {
					_this[this.key] = val;
				}
			};
			index++;
			yield value
		}
	}
};
if (!Object.entries) {
	Object.entries = function(obj) {
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];

		return resArray;
	};
}

// let a = my.setStorage.bind(my);
// my.setStorage=(b)=>{
// 	a(b);
// 	if(b.data==undefined){
// 		debugger
// 	}
// }

import Vue from 'vue'
import App from './App'
import store from './store'
import jiuaiDebounce from '@/js_sdk/jiuai-debounce/jiuai-debounce.js'

Vue.config.productionTip = false
Vue.prototype.$jiuaiDebounce=jiuaiDebounce;
Vue.config.errorHandler = function(err, vm, info) {
	
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
