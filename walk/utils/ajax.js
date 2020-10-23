import cache from './cache.js'

import store from '@/store'
import {
	hexMD5
} from "./md5.js"
import {
	Base64
} from './base64.js';

var host = "https://flhz.yhshapp.com";
// var host = "http://flhz.tg.com";
var api_version = '2.1.1';
var device_type = 'aliapp';
var appid = 'youhui';

var showLoading = null;
var tryingLogin = false;

var _login = false;

var _user = null;
try {
	_user = my.getStorageSync({
		key: 'userinfo'
	}).data;
} catch (e) {
	_user = null;
}
let _token = ''
if (_user && typeof(_user) != 'undefined' && typeof(_user.uid) != 'undefined') {
	_token = _user.token;
	_login = true;
	uni.$emit('login', {
		success: _login
	})
	store.commit('increment', _user)
}

module.exports = {
	HOST: host,
	API_ROOT: host + '/',
	API_VERSION: api_version,
	DEVICE_TYPE: device_type,
	APP_ID: appid,
	get(options) {
		options.method = 'GET';
		return this.request(options);
	},
	post(options) {
		options.method = 'POST';
		return this.request(options);
	},
	delete(options) {
		options.method = 'DELETE';
		return this.request(options);
	},
	put(options) {
		options.method = 'PUT';
		return this.request(options);
	},
	request(options) {
		//初始化默认值
		options = Object.assign({
			data: {}
		}, options);

		var timestamp = (Date.parse(new Date()) / 1000) + '';
		var nonce = Math.ceil(Math.random() * 10000) + '';
		// 获取token
		var token = _token;
		if (options.url.indexOf('Ad/record') !== -1) {
			options.data.filter = getApp().globalData.filter;
		}

		// 获取get参数
		let params = {};
		var u = options.url.split('?');
		if (typeof(u[1]) == "string") {
			u = u[1].split("&");
			for (var i in u) {
				var j = u[i].split("=");
				params[j[0]] = j[1];
			}
			options.url = u[0];
		}
		Object.assign(options.data, params);
		Object.keys(options.data).forEach(function(key) {
			let item = options.data[key];
			if (typeof(item) == 'undefined') {
				options.data[key] = '';
			}
		})

		// 计算签名
		var params1 = {};
		Object.assign(params1, options.data);
		params1['appid'] = this.APP_ID;
		params1['nonce'] = nonce;
		params1['timestamp'] = timestamp;
		params1['os'] = this.DEVICE_TYPE;
		params1['v'] = this.API_VERSION;
		params1['token'] = token;
		params1['_url'] = this.API_ROOT + options.url.split('?')[0]

		var signstring = '';
		Object.keys(params1).sort().forEach(function(key) {
			signstring += key + params1[key]
		});
		var sign = hexMD5(Base64.encode(signstring))


		return new Promise((resolve, reject) => {
			uni.request({
				url: this.API_ROOT + options.url,
				data: options.data,
				method: options.method ? options.method : 'POST',
				header: {
					'Cache-Control': 'no-cache',
					'Content-Type': 'application/x-www-form-urlencoded',
					'os': this.DEVICE_TYPE,
					'appid': this.APP_ID,
					'nonce': nonce,
					'v': this.API_VERSION,
					'timestamp': timestamp,
					'token': token,
					'sign': sign,
				},
				success: (res) => {
					// clearTimeout(showLoading)
					// uni.hideLoading()
					// uni.hideToast()
					if (res.data.code == -2000) {
						this.login(() => {
							return this.request(options)
						})
						uni.showToast({
							content: '需要授权登录'
						})
					} else {
						resolve(res)
					}
				},
				fail: (error) => {
					// clearTimeout(showLoading)
					// uni.hideLoading()
					// uni.hideToast()
					reject(error)
				}
			})
		})
	},
	login(callback, scopes = 'auth_user') {
		my.getAuthCode({
			scopes: scopes,
			success: ({
				authCode
			}) => {
				uni.getStorage({
					key: 'invite_id',
					success: (invite_id) => {
						if (invite_id.data) {
							invite_id = invite_id.data
						} else {
							invite_id = 0;
						}

						this.post({
							url: 'public/login',
							data: {
								code: authCode,
								scopes: scopes,
								invite_id
							}
						}).then((res) => {
							if (res.data.code == 200) {
								if (scopes == 'auth_user') {
									uni.showToast({
										title: '登录成功!',
										icon: 'success',
										duration: 1000
									});
								}
								let old = _login;
								_login = true
								_token = res.data.data.token
								res.data.data.user.token = _token;
								uni.setStorage({
									key: 'userinfo',
									data: res.data.data.user,
								})
								store.commit('increment', res.data.data.user)
								if (!old) {
									uni.$emit('login', {
										success: true
									})
								}
								callback()
							}
							tryingLogin = false;
						}).catch((error) => {
							tryingLogin = false;
						})
					}
				})
			},
			fail: () => {
				if (scopes == 'auth_user') {
					uni.showModal({
						title: '提示',
						content: '取消授权,可能会使部分服务无法使用，或者页面信息不完整',
						cancelText: '我知道了',
						confirmText: '重新授权',
						success: (res) => {
							if (res.confirm) {
								this.login(callback)
							} else if (res.cancel) {}
						}
					})
				}
			}
		});
	},
	login2(authCode = '') {
		this.post({
			url: 'Public/userInfo',
			data: {
				code: authCode
			},
			loaing: true
		}).then((res) => {
			if (res.data.code == 200) {
				_login = true
				_token = res.data.data.token
				res.data.data.user.token = _token;
				uni.setStorage({
					key: 'userinfo',
					data: res.data.data.user,
				})
				store.commit('increment', res.data.data.user)
				uni.$emit('login', {
					success: true
				})
			} else {
				uni.setStorage({
					key: 'userinfo',
					data: {
						alipay_uid: res.data.data
					},
				})
				uni.$emit('login', {
					success: false
				})
			}
		})
	},

	upload(options) {

		//初始化默认值
		options = Object.assign({
			data: {}
		}, options);

		var timestamp = (Date.parse(new Date()) / 1000) + '';
		var nonce = Math.ceil(Math.random() * 10000) + '';
		// 获取token
		var token = _token;

		if (typeof options.login != 'undefined' && options.login == true) {
			if (token == '') {
				this.login(() => {
					return this.request(options)
				})
			}
		}


		var requireLogin = false;
		if (typeof options.login == 'undefined' || options.login == true) {
			requireLogin = true;
		} else {
			requireLogin = false;
		}

		// 获取get参数
		let params = {};
		var u = options.url.split('?');
		if (typeof(u[1]) == "string") {
			u = u[1].split("&");
			for (var i in u) {
				var j = u[i].split("=");
				params[j[0]] = j[1];
			}
			options.url = u[0];
		}
		Object.assign(options.data, params);

		//处理undefined
		for (let item of options.data) {
			if (typeof(item.value) == 'undefined') {
				item.value = '';
			}
		}


		// 计算签名
		var params1 = {};
		Object.assign(params1, options.data);
		params1['appid'] = this.APP_ID;
		params1['nonce'] = nonce;
		params1['timestamp'] = timestamp;
		params1['os'] = this.DEVICE_TYPE;
		params1['v'] = this.API_VERSION;
		params1['token'] = token;
		params1['_url'] = this.API_ROOT + options.url.split('?')[0]

		var signstring = '';
		Object.keys(params1).sort().forEach(function(key) {
			signstring += key + params1[key]
		});

		var sign = hexMD5(Base64.encode(signstring))


		if (typeof options.loading != 'undefined' && options.loading == true) {
			// clearTimeout(showLoading)
			// showLoading = setTimeout(function() {
			// 	uni.showToast({
			// 		title: "加载中",
			// 		icon: "loading",
			// 		duration: 1e4
			// 	});
			// }, 500)
		}

		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: this.API_ROOT + options.url,
				data: options.data,
				//method: options.method ? options.method : 'POST',
				header: {
					'Cache-Control': 'no-cache',
					'Content-Type': 'application/x-www-form-urlencoded',
					'os': this.DEVICE_TYPE,
					'appid': this.APP_ID,
					'nonce': nonce,
					'v': this.API_VERSION,
					'timestamp': timestamp,
					'token': token,
					'sign': sign
				},
				fileType: 'image',
				fileName: 'image',
				filePath: options.path,
				success: (res) => {
					resolve(res)
				},
				fail: (error) => {
					reject(error)
				},
			});
		})
	},

	isLogin() {
		return _login;
	}
}
