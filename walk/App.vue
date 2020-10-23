<script>
	import ajax from './utils/ajax.js'
	import utils from './utils/utils.js'
	import cache from './utils/cache.js'
	//#ifdef MP-ALIPAY
	import 'umtrack-alipay';
	let oldApp = App;

	function R(t, n, e) {
		var i = t[n];
		t[n] = function(t) {
			e.call(this, t);
			i && i.call(this, t)
		}
	}

	App = function(config) {
		R(config, 'onLaunch', function(options) {
			if (options.scene == "1037" && options.referrerInfo != undefined && options.referrerInfo.extraData != undefined) {
				if (typeof(options.query) == 'undefined') {
					options.query = {};
				}
				Object.assign(options.query, options.referrerInfo.extraData);
			}
		});
		R(config, 'onShow', function(options) {
			if (options.scene == "1037" && options.referrerInfo != undefined && options.referrerInfo.extraData != undefined) {
				if (typeof(options.query) == 'undefined') {
					options.query = {};
				}
				Object.assign(options.query, options.referrerInfo.extraData);
			}
		});
		config.umengConfig = {
			appKey: '5f1511c3dbc2ec081357103f', //由友盟分配的APP_KEY
			debug: false, //是否打开调试模式
			uploadUserInfo: false // 自动上传用户信息，设为false取消上传，默认为false
		}
		oldApp(config)
	}
	//#endif

	function upData(adzone_id, scene, path) {
		ajax.get({
			url: 'public/xcxct',
			data: {
				adzone_id,
				scene,
				path
			}
		}).then((res) => {
			//console.info(res)
		})
	}

	function checkUpdate() {
		const updateManager = my.getUpdateManager()
		updateManager.onCheckForUpdate(function(res) {})
		updateManager.onUpdateReady(function() {
			my.confirm({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	}

	export default {
		onLaunch: function(option) {
			utils.getSetUp();

			if (typeof(option.query) == 'object' && typeof option.query.filter == "string") {
				this.globalData.filter = option.query.filter;
			}
			if (ajax.isLogin()) {
				//获取广告
				utils.getAdList();
				utils.upTaskInfo();
				ajax.login2()
				checkUpdate();
			} else {
				uni.$on('login', (res) => {
					//获取广告
					utils.getAdList();
					utils.upTaskInfo();
					checkUpdate();
				})
				//#ifdef MP-ALIPAY
				ajax.login(null, 'auth_base')
				//#endif
			}
		},
		onShow: function(option) {
			let scene = option.scene ? option.scene : 0;
			this.globalData.scene = scene;
			let path = '';
			if (option.path) {
				path = option.path;
			} else {
				let pages = getCurrentPages();
				path = pages[pages.length - 1].route;
			}
			this.globalData.ctUpload = false;
			if (typeof option.query == 'object') {
				// 保存邀请人ID
				if (typeof option.query.invite_id == "string") {
					uni.setStorage({
						key: 'invite_id',
						data: option.query.invite_id
					})
				}
			}


			let adzoneId = 0;
			let adzoneId1 = 0;
			if (option.query && (typeof(option.query.adzoneId) == "string")) {
				adzoneId = option.query.adzoneId;
				adzoneId1 = option.query.adzoneId;
			} else {
				let data = my.getStorageSync({
					key: 'adid'
				});
				if (data && data.data) {
					if (data.data.time > (new Date).getTime()) {
						adzoneId = data.data.adzoneId;
					}
				}
			}

			this.globalData.adzoneId1 = adzoneId1;

			if (this.globalData.adzoneId !== adzoneId) {
				if (adzoneId != 0) {
					my.setStorage({
						key: 'adid',
						data: {
							adzoneId: adzoneId,
							time: (new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400000)).getTime()
						}
					})
				}
				if (ajax.isLogin()) {
					upData(adzoneId, scene, path)
				} else {
					uni.$on('login', (res) => {
						upData(adzoneId, scene, path)
					})
				}
				this.globalData.adzoneId = adzoneId
			}

			// 设置大牛白名单
			// if (ajax.isLogin()) {
			// 	utils.getDnWhitelist(adzoneId1, (res) => {
			// 		this.globalData.whitelist = res.data.data
			// 		utils.dnOpenLog(adzoneId1)
			// 	})
			// } else {
			// 	uni.$on('login', (res) => {
			// 		utils.getDnWhitelist(adzoneId1, (res) => {
			// 			this.globalData.whitelist = res.data.data
			// 			utils.dnOpenLog(adzoneId1)
			// 		})
			// 	})
			// }
		},
		globalData: {
			__call: [],
			scene: 0,
			adzoneId: '',
			filter: 0,
			whitelist: []
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* common */
	.page {
		min-height: 100vh;
		background-color: #ffffff;
		overflow: hidden;
		/* font-family: -apple-system-font, Helvetica Neue, Helvetica, sans-serif; */
	}

	.card {
		margin: 18rpx 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;

	}

	/* 加载更多 */
	.ui-loadmore {
		padding: 40rpx 0;
		line-height: 24rpx;
		width: 100%;
		text-align: center;
		font-size: 24rpx;
		color: #9c9c9c;
		position: relative;
	}

	.ui-loadmore__tips_in-line:before,
	.ui-loadmore__tips_in-line:after {
		content: "";
		position: absolute;
		top: 50%;
		width: 238rpx;
		height: 2rpx;
		background-color: #d9d9d9;
	}

	.ui-loadmore__tips_in-line:before {
		left: 18rpx;
	}

	.ui-loadmore__tips_in-line:after {
		right: 18rpx;
	}

	.ui-loading {
		margin: 0 5px;
		width: 20px;
		height: 20px;
		display: inline-block;
		vertical-align: middle;
		animation: a 1s steps(12) infinite;
		background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
		background-size: 100%;
	}

	@keyframes a {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn);
		}
	}

	.ui-loadmore__tips {
		display: inline-block;
		vertical-align: middle;
	}

	/* 清楚按钮样式 */
	.clear_button {
		height: auto;
		line-height: normal;
		border: none;
		background-color: rgba(0, 0, 0, 0);
	}


	/* ui */
	.ui-nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		font-size: 36rpx;
		z-index: 490;
		user-select: none;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(231, 231, 231, 0.6);
		background-color: #fff;
	}

	.ui-nav-bar-content {
		display: flex;
	}

	.ui-row {
		position: relative;
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.ui-col.align-center {
		justify-content: center;
	}

	.ui-col.valign-middle {
		align-items: center;
	}

	.ui-col-align-center {
		text-align: center;
	}

	.ui-col {
		position: relative;
		min-width: 0;
		display: flex;
		flex: 1;
		height: 100%;
	}

	.ui-col-content.align-center {
		align-items: center;
	}

	.ui-col-content.valign-middle {
		justify-content: center;
	}

	.ui-col-content {
		height: 100%;
		min-width: 0;
		flex-direction: column;
		width: 100%;
		display: flex;
	}

	.ui-cells {
		position: relative;
		margin-top: 17rpx;
		background-color: #fff;
		line-height: 80rpx;
		font-size: 26rpx;
	}

	.ui-cells:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1rpx solid #eee;
		color: #eee;
	}

	.ui-cells:after {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1rpx solid #eee;
		color: #eee;
	}

	.ui-cells_after-title {
		margin-top: 0;
	}

	.ui-cell {
		padding: 10px 15px;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.ui-cell:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1rpx solid #eee;
		color: #eee;
		left: 15px;
	}

	.ui-cell:first-child:before {
		display: none;
	}

	.ui-cell--input {
		padding-top: 0;
		padding-bottom: 0;
	}

	.ui-label {
		width: 164rpx;
		color: #333;
		word-wrap: break-word;
		word-break: break-all;
	}

	.ui-cell__bd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}

	.ui-input {
		height: 80rpx;
		min-height: 80rpx;
		line-height: 80rpx;
	}

	.weui-btn-area {
		margin: 90rpx 18rpx 70rpx;
	}

	.weui-btn-default {
		border-radius: 200rpx;
		font-size: 26rpx;
	}

	.weui-btn-default::after {
		content: "";
		border-radius: 200rpx;
	}

	.ui-loadmore {
		padding: 40rpx 0;
		line-height: 24rpx;
		width: 100%;
		text-align: center;
		font-size: 24rpx;
		color: #9c9c9c;
		position: relative;
	}

	.ui-loadmore__tips_in-line:before,
	.ui-loadmore__tips_in-line:after {
		content: "";
		position: absolute;
		top: 50%;
		width: 238rpx;
		height: 2rpx;
		background-color: #d9d9d9;
	}

	.ui-loadmore__tips_in-line:before {
		left: 18rpx;
	}

	.ui-loadmore__tips_in-line:after {
		right: 18rpx;
	}

	.ui-loading {
		margin: 0 5px;
		width: 20px;
		height: 20px;
		display: inline-block;
		vertical-align: middle;
		animation: a 1s steps(12) infinite;
		background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
		background-size: 100%;
	}

	@keyframes a {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		to {
			-webkit-transform: rotate(1turn);
			transform: rotate(1turn);
		}
	}

	.ui-loadmore__tips {
		display: inline-block;
		vertical-align: middle;
	}

	/* 字体 */

	@font-face {
		font-family: "iconfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-appreciate:before {
		content: "\e644";
	}

	.icon-favorfill:before {
		content: "\e64b";
	}

	.icon-favor:before {
		content: "\e64c";
	}

	.icon-search:before {
		content: "\e65c";
	}

	.icon-comment:before {
		content: "\e667";
	}

	.icon-back:before {
		content: "\e679";
	}

	.icon-scan:before {
		content: "\e689";
	}

	.icon-top:before {
		content: "\e69e";
	}

	.icon-right:before {
		content: "\e6a3";
	}

	.icon-delete:before {
		content: "\e6b4";
	}

	.icon-home:before {
		content: "\e6b8";
	}

	.icon-homefill:before {
		content: "\e6bb";
	}

	.icon-vip:before {
		content: "\e6c3";
	}

	.icon-friend:before {
		content: "\e6cc";
	}

	.icon-goods:before {
		content: "\e6cd";
	}

	.icon-present:before {
		content: "\e6d3";
	}

	.icon-vipcard:before {
		content: "\e6ee";
	}

	.icon-share:before {
		content: "\e6f3";
	}

	.icon-service:before {
		content: "\e6ff";
	}

	.icon-notice:before {
		content: "\e70a";
	}

	.icon-clothes:before {
		content: "\e717";
	}

	.icon-rankfill:before {
		content: "\e721";
	}

	.icon-rank:before {
		content: "\e722";
	}

	.icon-mark:before {
		content: "\e731";
	}

	.icon-sponsor:before {
		content: "\e77d";
	}

	.icon-my:before {
		content: "\e78b";
	}

	.icon-myfill:before {
		content: "\e78c";
	}

	.icon-triangledownfill:before {
		content: "\e79b";
	}

	.icon-triangleupfill:before {
		content: "\e79c";
	}

	.icon-newshot:before {
		content: "\e7c5";
	}

	.icon-news:before {
		content: "\e7c6";
	}

	.icon-search_light:before {
		content: "\e7da";
	}

	.icon-hot_light:before {
		content: "\e7de";
	}

	.icon-share_light:before {
		content: "\e7e0";
	}

	.icon-round_close_fill_light:before {
		content: "\e7ee";
	}

	.icon-tubiao:before {
		content: "\e600";
	}
</style>
