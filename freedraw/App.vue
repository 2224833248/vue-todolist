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
			appKey: '5f65e9bba4ae0a7f7d08c386', //由友盟分配的APP_KEY
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
		onLaunch(option) {
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
			ajax.get({
				url: 'Base/getSetUp'
			}).then(res => {
				if (res.data.code == 200) {
					this.globalData.setUp = res.data.data
				}
			})
		},
		onShow(option) {
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
			}else{
				let data = my.getStorageSync({
					key:'adid'
				});
				if(data && data.data){
					if(data.data.time>(new Date).getTime()){
						adzoneId = data.data.adzoneId;
					}
				}
			}
			
			this.globalData.adzoneId1 = adzoneId1;
			
			if (this.globalData.adzoneId !== adzoneId) {
				if(adzoneId!=0){
					my.setStorage({
						key:'adid',
						data:{
							adzoneId:adzoneId,
							time:(new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400000)).getTime()
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
		},
		globalData: {
			__call: [],
			scene: 0,
			adzoneId: '',
			filter: 0,
			setUp:{},
			whitelist:[]
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* common */
	page {
		min-height: 100vh;
		overflow: auto;
		background-color: #f5f5f5;
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
		border-radius: 0;
	}
</style>
