import ajax from './ajax.js';
import store from '@/store.js';
let whitelist = {};
let showAdTime = 0;
let syncAdList = [];
module.exports = {
	dateFtt: function(fmt, val) { //author: meizz  
		let date = 0;
		if (typeof(val) === 'string') {
			val = parseInt(val);
		}
		if (typeof(val) === 'number') {
			date = new Date(val * 1000);
		} else {
			date = val;
		}

		var o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	adJump(ad, that) {
		if (ad.type == 0) { // 空
			return '';
		} else if (ad.type == 1) { // 链接跳转
			if (ad.url.substr(0, 18) == 'https://tb.ele.me/' || ad.url.substr(0, 22) == 'https://s.click.ele.me') {
				my.navigateToMiniProgram({
					appId: '2018090761255717',
					path: 'pages/webview-redirect/webview-redirect',
					extraData: {
						url: ad.url
					}
				});
			} else {
				uni.navigateTo({
					url: "/pages/webview/webview?url=" + ad.url
				})
			}

		} else if (ad.type == 2) { // 跳转小程序
			let extraData = {};
			let u = ad.extra_data.split("&");
			for (var i in u) {
				var j = u[i].split("=");
				extraData[j[0]] = j[1];
			}
			my.navigateToMiniProgram({
				appId: ad.appid,
				path: ad.path,
				extraData: extraData
			});
		} else if (ad.type == 3) { // 跳转页面
			if (ad.path === '/pages/welfare/welfare' || ad.path === '/pages/index/index' || ad.path === '/pages/my/my') {
				uni.switchTab({
					url: ad.path + "?" + ad.extra_data
				})
			} else {
				uni.navigateTo({
					url: ad.path + "?" + ad.extra_data
				})
			}
		} else if (ad.type == 5) { // 跳转插件页面
			uni.navigateTo({
				url: ad.url
			})
		} else if (ad.type == 6) { // 跳转生活号
			my.ap.navigateToAlipayPage({
				path: ad.url
			})
		} else if (ad.type == 7) { // 跳转指定页面
			my.ap.navigateToAlipayPage({
				path: encodeURIComponent(
					'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
					encodeURIComponent(ad.url))
			});
		} else if (ad.type == 8) { // 加群
			that.showbcGroup = true
		} else if (ad.type == 9) { // 分享
			my.showSharePanel();
		}
		this.adClickLog(ad);

	},
	upUserInfo() {
		ajax.login2()
	},
	upTaskInfo() {
		ajax.get({
			url: 'Task/list',
			data: {
				is_filter: 0,
				filter: getApp().globalData.filter
			},
			login: false,
			loading: true,
		}).then((res) => {
			if (res.data.code == 200) {
				let tmp = {};
				for (let item of res.data.data) {
					if (typeof(tmp[item.id]) == 'undefined') {
						tmp[item.id] = item;
						item.tagMap = {};
					}
					tmp[item.id].tagMap[item.tag] = item.category_id;
				}
				let list = {};
				for (let item of res.data.data) {
					if (typeof(list[item.tag]) == 'undefined') {
						list[item.tag] = [];
					}
					list[item.tag].push(tmp[item.id])
				}
				store.commit('upTaskList', list)
			}
		}).catch((error) => {})
	},
	taskLog(tag, task) {
		let app = getApp();
		ajax.get({
			url: 'public/tasklog',
			data: {
				'adzoneId': app.globalData.adzoneId,
				'cid': typeof(task.tagMap[tag]) == 'undefined' ? 0 : task.tagMap[tag],
				'task_id': task.id,
				'owner_id': task.owner_id
			}
		}, (res) => {

		})
	},
	taskShowLog(tag, taskList) {
		if (!taskList) {
			return;
		}
		//找出没有显示过的任务
		let upTmp = [];
		taskList.forEach((item) => {
			if (typeof(whitelist[tag]) == 'undefined') {
				whitelist[tag] = {};
			}
			if (typeof(whitelist[tag][item.id]) == 'undefined') {
				whitelist[tag][item.id] = 1;
				upTmp.push(item);
			}
		})
		if (upTmp.length == 0) {
			return;
		}
		let app = getApp();
		let ids = [];
		let ownerids = [];
		upTmp.forEach((item) => {
			ids.push(item.id);
			ownerids.push(item.owner_id)
		})
		ajax.post({
			url: 'public/taskShowLog',
			data: {
				'adzoneId': app.globalData.adzoneId,
				'cid': typeof(upTmp[0].tagMap[tag]) == 'undefined' ? 0 : upTmp[0].tagMap[tag],
				'task_ids': ids.join(','),
				'task_owner': ownerids.join(',')
			}
		}, (res) => {

		})
	},
	addAdShowLog(ad) {
		syncAdList.push(ad)
		if (!showAdTime) {
			showAdTime = setInterval(() => {
				if (syncAdList.length < 1) {
					return;
				}
				let adList = Object.assign([], syncAdList);
				syncAdList = [];
				this.adShowLog(adList);
			}, 2e3)
		}
	},
	adShowLog(adList) {
		if (!adList) {
			return;
		}
		//找出没有显示过的任务
		let app = getApp();
		let ids = [];
		let ownerids = [];
		let cids = [];
		adList.forEach((item) => {
			ids.push(item.id);
			ownerids.push(item.owner_id)
			cids.push(item.slot_id)
		})
		ajax.post({
			url: 'public/adShowLog',
			data: {
				'adzoneId': app.globalData.adzoneId,
				'cids': cids.join(','),
				'ad_ids': ids.join(','),
				'ad_owner': ownerids.join(',')
			}
		}, (res) => {

		})
	},
	adClickLog(ad) {
		if (!ad) {
			return;
		}
		//找出没有显示过的任务
		let app = getApp();
		ajax.post({
			url: 'public/adClickLog',
			data: {
				'adzoneId': app.globalData.adzoneId,
				'cid': ad.slot_id,
				'ad_id': ad.id
			}
		}, (res) => {

		})
	},
	editTask(task) {
		store.commit('editTask', task)
	},
	getAdList() {
		ajax.get({
			url: 'Ad/getAd',
			data: {
				miniprog_id: 2021001167643261,
				filter:getApp().globalData.filter
			}
		}).then((res) => {
			if (res.data.code == 200) {
				store.commit('incover', res.data.data);
				// console.log('广告请求', res.data.data)
			}
		}).catch(() => {

		})
	},
	parseQuery(query) {
		let params = {}
		if (query.indexOf('?') !== false) {
			let tmp = query.substr(query.indexOf('?'))
			let tmp1 = '';
			if (tmp.indexOf('&query') !== -1) {
				tmp1 = tmp.substring(0, tmp.indexOf('&query'));
			} else {
				tmp1 = tmp;
			}
			query = query.replace(tmp1, encodeURIComponent(tmp1))
		}
		for (let item of query.split('&')) {
			var tmp = item.split('=')
			params[tmp[0]] = decodeURIComponent(tmp[1])
		}
		return params
	},
	// 授权
	setRelationId(state) {
		let url = 'https://oauth.taobao.com/authorize?response_type=token&client_id=21444329&state=' + state +
			'&view=wap&redirect_uri=https://mobile.yhshapp.com/callback/taobao';
		my.ap.navigateToAlipayPage({
			path: encodeURIComponent(
				'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
				encodeURIComponent(encodeURIComponent(url)))
		});
	},
	// 获取大牛统计白名单
	getDnWhitelist(adzone_id, callback) {
		ajax.get({
			url: 'public/getDnWhitelist',
			data: {
				adzone_id,
			}
		}).then((res) => {
			if (res.data.code == 200) {
				callback(res)
			}
		})
	},
	// 大牛页面打开统计
	dnOpenLog(adzoneId) {
		if (!adzoneId) return

		let app = getApp();

		let pages = getCurrentPages();
		let currentPages = pages[pages.length - 1]
		let route = currentPages.route
		let query = currentPages.$vm.$mp.query
		if (Object.keys(query)[0]) {
			route = route + "?" + Object.keys(query)[0] + "=" + query[Object.keys(query)[0]]
		}


		if (app.globalData.whitelist.indexOf(route) != -1) {
			ajax.post({
				url: 'public/dnOpenLog',
				data: {
					'adzoneId': adzoneId,
					'pages': route,
				}
			})
		}
	},
	// 大牛商品点击统计
	dnClickLog(goodsId) {
		if (!goodsId) return
		let app = getApp();

		// 当前页面路由
		let pages = getCurrentPages();
		let currentPages = pages[pages.length - 1]
		let route = currentPages.route
		let query = currentPages.$vm.$mp.query
		if (Object.keys(query)[0]) {
			route = route + "?" + Object.keys(query)[0] + "=" + query[Object.keys(query)[0]]
		}
		if (app.globalData.whitelist.indexOf(route) != -1) {
			ajax.post({
				url: 'public/dnClickLog',
				data: {
					'adzoneId': app.globalData.adzoneId,
					'pages': route,
					'goodsId': goodsId,
				}
			})
		}
	},
	// 获取当前页面路由
	getCurrentPagesRoute() {
		let pages = getCurrentPages();
		let currentPages = pages[pages.length - 1]
		return currentPages.route
	}
}
