<template>
	<view id="walkPage" class="page">
		<navbar customStyle="borderBottom:0px;backgroundColor:#49A3FF;color:#FFF;">
			<view class="ui-row" style="height:46px;">
				<view class="ui-col-content align-center valign-middle">
					<view>
						走路钱多多
					</view>
				</view>
			</view>
		</navbar>
		<view :style="{height:NAV_HEIGHT}"></view>
		<view class="head" v-if="bulletin">
			<view class="headLeft">
				<image class="leftpic" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/gong.png"></image>
				<uni-notice-bar v-if="bulletin.length>0" class="tests" color="#888888" backgroundColor="#fffff5" :text="bulletin"
				 scrollable="true" single="true"></uni-notice-bar>
			</view>
			<image class="headRight" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/back.png" @click="closeBulletin"></image>
		</view>
		<view class="main" :style="'margin-top:-'+NAV_HEIGHT">
			<!-- 图 -->
			<view class="head_main">
				<!-- <image class="mian_bg" src="/static/walk/bg.png"></image> -->
				<view class="mian_bg"></view>
				<view class="progress">
					<image class="progress_left" src="/static/walk/panda.png"></image>
					<view class="progress_right">{{user.walk_integral||0}}</view>
				</view>
				<view class="main-contents">
					<view class="nums" @click="updateRunData">{{step}}
						<text class="tips">步</text>
					</view>
					<view class="jd_num">
						<view class="tips">0</view>
						<view class="jd_box">
							<view class="ok_jd" :style="'width:'+okJd+'%'"></view>
						</view>
						<view class="tips">30000</view>
					</view>
					<view :class="isLogin?'duihuan':'btns'" @click="exchangeStep">
						<view v-if="isLogin">步数兑换</view>
						<view v-if="!isLogin">登陆</view>
					</view>
				</view>

				<view class="picLeft">
					<view class="lefta" v-if="typeof task_bubble[0] != 'undefined'" @click="onTaskTap(task_bubble[0])">
						<view class="leftTop">
							<image mode="widthFix" :src="task_bubble[0].image_bubble"></image>
							<view class="titles">{{task_bubble[0].title}}</view>
						</view>
					</view>
					<view class="leftb" v-if="typeof task_bubble[2] != 'undefined'" @click="onTaskTap(task_bubble[2])">
						<view class="leftBottom">
							<image mode="widthFix" :src="task_bubble[2].image_bubble"></image>
							<view class="titles">{{task_bubble[2].title}}</view>
						</view>
					</view>
					<view class="leftc" v-if="typeof task_bubble[4] != 'undefined'" @click="onTaskTap(task_bubble[4])">
						<view class="leftBottom">
							<image mode="widthFix" :src="task_bubble[4].image_bubble"></image>
							<view class="titles">{{task_bubble[4].title}}</view>
						</view>
					</view>
				</view>
				<view class="picRight">
					<view class="rightsa" v-if="typeof task_bubble[1] != 'undefined'" @click="onTaskTap(task_bubble[1])">
						<view class="rightTop">
							<image mode="widthFix" :src="task_bubble[1].image_bubble"></image>
							<view class="titles">{{task_bubble[1].title}}</view>
						</view>
					</view>
					<view class="rightsb" v-if="typeof task_bubble[3] != 'undefined'" @click="onTaskTap(task_bubble[3])">
						<view class="rightBottom">
							<image mode="widthFix" :src="task_bubble[3].image_bubble"></image>
							<view class="titles">{{task_bubble[3].title}}</view>
						</view>
					</view>
					<view class="rightsc" v-if="typeof task_bubble[5] != 'undefined'" @click="onTaskTap(task_bubble[5])">
						<view class="rightBottom">
							<image mode="widthFix" :src="task_bubble[5].image_bubble"></image>
							<view class="titles">{{task_bubble[5].title}}</view>
						</view>
					</view>
				</view>

				<view class="seeing">
					<view class="amin"></view>
				</view>

				<view class="adLeft" v-if="adList.indexLeftAd.length > 0" @click="adClick(adList.indexLeftAd[0])">
					<image class="adLeft_img" :src="adList.indexLeftAd[0].image" mode="aspectFill"></image>
				</view>

				<view class="adRight" v-if="adList.indexRightAd.length > 0" @click="adClick(adList.indexRightAd[0])">
					<image class="adRight_img" :src="adList.indexRightAd[0].image" mode="aspectFill"></image>
				</view>

			</view>

			<view class="nav" v-if="adList.indexNav.length > 0">
				<view class="nav__bd">
					<view class="nav__bd__item" v-for="(item,index) in adList.indexNav" :key="index" @click="adClick(item)">
						<image :src="item.image" mode="aspectFill"></image>
						<view class="nav__bd__name">{{item.title}}</view>
					</view>
				</view>
			</view>
			<view class="nav_box" v-if="adList.indexNav.length > 0"></view>

			<!-- 支付宝广告插件 -->
			<view class="card aliad" v-if="adUnitId">
				<view class="aliad_head" v-if="showali">
					<image class="aliad_head_l" src="../../static/index/xsjf.png?v2" mode="aspectFill"></image>
					<view class="aliad_head_r">
						<image src="../../static/index/redbag.png" mode="aspectFill"></image>
						<view>点击浏览广告,可随机获得<text>0.01-0.5元红包</text></view>
					</view>
				</view>
				<view class="aliad_body" @click="onAliTaskTap()">
					<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
				</view>
			</view>

			<!-- 任务 -->
			<view class="card task">
				<view class="task__hd">
					<view class="task__hd__left">
						<image lazy-load="ture" class="task__hd__left__title" src="/static/index/wzjb.png" mode="widthFix"></image>
					</view>
					<view class="task__hd__right" @click="jumpMoreTask">
						<view class="task__hd__right__more">查看全部</view>
						<image lazy-load="ture" class="task__hd__right__image" src="/static/index/more.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="task__bd">
					<task-list ref="task" tag="morestep" :size="10" :isFilters="true" @share="onShowSharePanelTap"></task-list>
				</view>
			</view>
			<!-- 兑换积分弹窗 -->
			<uni-popup class="popup" ref="popup1" type="center" :maskClick='false'>
				<view class="popups">
					<view class="exchange-success">
						<view class="exchange-success__hd">恭喜获得多多币</view>
						<view class="exchange-success__bd">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/task/jb.png" mode="aspectFill"></image>
							<text>+{{receive}}</text>
						</view>
						<view class="exchange-success__ft">
							<view>更多多多币可兑换现金红包</view>
							<view>还可兑换优质商品</view>
						</view>
						<view class="exchange-success__button" @click="onClose">继续做任务</view>
					</view>
				</view>
			</uni-popup>
			<!-- 完成任务弹窗 -->
			<uni-popup class="popup" ref="popup2" type="center" :maskClick='false'>
				<view class="popups">
					<view class="complete">
						<view class="complete__hd" v-if="task.reward_type == 1">恭喜获得多多币</view>
						<view class="complete__hd" v-if="task.reward_type == 2">恭喜获得步数</view>
						<view class="complete__bd">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/golds.png" mode="aspectFill"></image>
							<text v-if="task.reward_type == 1">+{{task.integral}}</text>
							<text v-if="task.reward_type == 2">+{{task.step}}</text>
						</view>
						<view class="complete__ft">
							<view>获取更多多多币，可兑换现金红包哦！</view>
						</view>
						<view class="complete__button" @click="completeClose">继续做任务</view>
					</view>
				</view>
				<view class="complete__close">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="completeClose"></image>
				</view>
			</uni-popup>
			<view class="rectangle" v-if="showTips" @click="tipsClick" :style="'top:'+NAV_HEIGHT">
				<view class="shape"></view>
				<view class="box">
					<image class="img" src="../..https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/logo.png"></image>
					<text class="content">把“走路钱多多”添加到首页,以后使用更方便</text>
				</view>
			</view>

			<!-- 弹窗 -->
			<uni-popup class="butieBox" ref="butie" type="center" :maskClick='false'>
				<view class="butie">
<!-- 					<image @click="adClick(adList.indexPopup[0],true)" class="butie_bt" lazy-load="ture" :src="adList.indexPopup[0].image"
					 mode="widthFix"></image>
					 -->
					
					<image @click="adClick(adList.indexPopup[0],true)" class="butie_bt" lazy-load="ture" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/23/11/0e728f201fd516ec4d10f0bb3a1aa858.gif"
					 	 mode="widthFix"></image>
					 
					<image class="close" @click="closeBtn" src="/static/close.png" mode="widthFix"></image>
				</view>
			</uni-popup>

			<view class="indexfloatad" v-if="adList.indexFloatAd.length>0" :key="index" @click="adClick(adList.indexFloatAd[0])">
				<image lazy-load="ture" :src="adList.indexFloatAd[0].image+'_xcx200n'" mode="widthFix"></image>
			</view>

			<view class="devBox" v-if="isdev">
				<button @click="devBox('clearCache')">清除缓存</button>
			</view>
		</view>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync()

	let app = getApp()
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import cache from '../../utils/cache.js'
	import taskList from '@/components/task-list/task-list.vue'
	import {
		aui
	} from '@/common/aui/js/aui.js';
	import auiLoading from '@/components/aui-loading/aui-loading.vue';


	export default {
		components: {
			taskList,
			uniPopup,
			auiLoading
		},
		data() {
			let rate = systemInfo.windowWidth / systemInfo.windowHeight;
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",
				showTips: false,
				step: 0,
				allStep: 0,
				receive: 0,
				okJd: 0,
				bulletin: "",
				ad_more: [],

				ruleList: [
					"1. 每邀请1位新用户，步数加0.5%~2%, 加速上限为100%",
					"2. 加速奖励=实际步数x加速系数",
					"3. 加速奖励每天24点过期，记得及时领取哦~"
				],

				task: '',
				activeTask: '',
				activeDate: '',

				showLoading: false,
				showCount: 0,

				getRunDataLock: false,
				// 阿里广告
				adUnitId: 'ad_tiny_2021001167680229_202010172200004266',
				aliAdTaskId: 368,
				isShowAliAd: 0,
			};
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof option.invite_id == "string") {
				cache.set('invite_id', option.invite_id)
			}
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		mounted() {
			setTimeout(() => {
				this.getBulletin()
				this.getRedPacketList()
			})

			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
		},
		methods: {
			devBox(type) {
				if (type == 'share') {
					uni.navigateTo({
						url: '/pages/invite/share'
					})
				} else if (type == 'clearCache') {
					uni.clearStorage();
					uni.showToast({
						title: '清除成功'
					})
				}
			},
			closeBtn() {
				this.$refs.butie.close()
			},
			init() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				}).catch((error) => {})
				this.getTask()
				this.updateRunData()
			},
			onTaskTap(task, tag = 'bubble') {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task, tag);
				}
			},
			onCloseTap() {

			},
			jumpMoreTask() {
				uni.navigateTo({
					url: '/pages/my/task'
				})
			},
			tipsClick() {
				this.showTips = false;
			},
			// 获取任务
			getTask() {
				// 气泡任务
				this.getMoreStep()
				this.hideLoading()
			},

			// 获取任务列表
			getMoreStep() {
				ajax.get({
					url: 'Task/list',
					data: {
						category_tag: 'morestep',
						is_filter: '0'
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.ad_more = res.data.data
					}
				}).catch((error) => {})
			},

			// 兑换步数
			exchangeStep() {
				if (!ajax.isLogin()) {
					ajax.login(() => {
						this.init()
					})
				} else {
					if (this.getRunDataLock) {
						return
					}
					this.getRunDataLock = true
					my.getRunData({
						countDate: utils.dateFtt('yyyy-MM-dd', new Date()),
						timeZone: 'Asia/Shanghai',
						success: (res) => {
							let that = this;
							ajax.post({
								url: 'Run/exchangeStep',
								data: {
									sign: res.sign,
									encryptContent: res.response
								},
								login: true,
								loading: true,
							}).then((res) => {
								if (res.data.code == 200) {
									this.receive = res.data.data
									this.$refs.popup1.open()
									this.upUserInfo()
									this.updateRunData()
								} else {
									uni.showToast({
										title: res.data.msg,
									});
								}
							}).catch((error) => {
								uni.showModal({
									title: '提示',
									content: '网络请求超时，请稍后再试',
								})
							})
						},
						fail: (res) => {
							if (res.error == 1003) {
								uni.showModal({
									title: '提示',
									content: '取消授权,可能会使部分服务无法使用，或者页面信息不完整',
									cancelText: '我知道了',
									confirmText: '重新授权',
									success: (res) => {
										if (res.confirm) {
											this.updateRunData()
										} else if (res.cancel) {}
									},
									fail(e) {
										console.info(e)
									}
								})
							} else {
								uni.showToast({
									title: res.errorMessage,
								})
							}
						},
						complete: (res) => {
							setTimeout(() => {
								this.getRunDataLock = false
							}, 300)
						}
					})
				}
			},


			// 获取红包规格
			getRedPacketList() {
				ajax.get({
					url: 'Redeem/getRedPacketList',
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.redList = res.data.data
					}
					this.showCount++
					this.hideLoading()
				}).catch((error) => {
					this.showCount++
					this.hideLoading()
				})
			},

			// 获取网站公告
			getBulletin() {
				ajax.get({
					url: 'Public/getBulletin',
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.bulletin = res.data.data
					}
				}).catch((error) => {})
			},

			// 兑换现金
			redeem(format) {
				ajax.post({
					url: 'Redeem/redeem',
					data: {
						format: format
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
						});
						this.upUserInfo();
					} else {
						uni.showToast({
							title: res.data.msg,
						});
					}
				}).catch((error) => {})
			},
			upUserInfo() {
				ajax.login2();
			},
			hideLoading() {
				if (this.showCount >= 2) {
					//this.$refs.ccc.hide()
					setTimeout(() => {
						this.showTips = true;
						setTimeout(() => {
							this.showTips = false;
						}, 4000)
					}, 2000)
				}
			},
			onClose() {
				this.$refs.popup1.close()
			},
			onRule() {
				uni.navigateTo({
					url: '/pages/walk/strategy'
				})
			},
			onKnow() {
				this.$refs.popup.close()
			},
			onCancel() {
				this.$refs.popup.close()
			},
			// 关闭公告
			closeBulletin() {
				this.bulletin = '';
			},
			// 点击帮助
			onHelpTap() {
				this.$refs.popup.open()
			},
			// 点击排行榜
			onRankTap() {
				uni.navigateTo({
					url: '/pages/rank/rank'
				})
			},
			// 邀请
			onShowSharePanelTap() {
				my.showSharePanel();
			},

			// 点击广告
			adClick(ad, closePopup = false) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad);
				if (typeof(this.$refs.butie) !== 'undefined' && typeof(this.$refs.butie.close) == 'function' && closePopup) {
					this.$refs.butie.close();
					cache.set('isPopup', new Date().getDate())
				}
			},

			completeClose() {
				this.$refs.popup2.close()
			},

			// 更新步数
			updateRunData() {
				if (!this.isLogin) {
					return
				}
				my.getRunData({
					countDate: utils.dateFtt('yyyy-MM-dd', new Date()),
					timeZone: 'Asia/Shanghai',
					success: (res) => {
						let that = this;
						ajax.post({
							url: "Run/updateStep",
							data: {
								sign: res.sign,
								encryptContent: res.response
							}
						}).then((res) => {
							if (res.data.code == 200) {
								this.step = res.data.data.count
								this.allStep = res.data.data.all
								this.okJd = (this.allStep / 30000) * 100;
							} else {
								uni.showToast({
									title: res.data.msg,
									duration: 1e4
								});
							}
						}).catch((error) => {})
					},
					fail: (res) => {
						if (res.error == 1003) {
							uni.showModal({
								title: '提示',
								content: '取消授权,可能会使部分服务无法使用，或者页面信息不完整',
								cancelText: '我知道了',
								confirmText: '重新授权',
								success: (res) => {
									if (res.confirm) {
										this.updateRunData()
									} else if (res.cancel) {}
								},
								fail(e) {
									console.info(e)
								}
							})
						} else {
							uni.showToast({
								title: res.errorMessage,
							})
						}
					}
				})
			},
			// 阿里广告 - 点击
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.task_ali && this.onTaskTap(this.task_ali)
			},
			// 阿里广告 - 调用成功回调
			onRenderSuccess(e) {
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},
			// 阿里广告 - 调用失败回调
			onRenderFail(e) {
				this.adUnitId = ''
			},
		},
		computed: {
			adList() {
				let tmp = this.$store.state.adList;
				if (!tmp) {
					tmp = [];
				} else {
					if (!cache.get('isPopup') || cache.get('isPopup') != new Date().getDate()) {
						if (typeof(tmp.indexPopup) != 'undefined' && tmp.indexPopup.length > 0) {
							console.info(1111);
							let interval = setInterval(() => {
								if (typeof(this.$refs.butie) != 'undefined' && typeof(this.$refs.butie.open) == 'function') {
									this.$refs.butie.open()
									clearInterval(interval);
								}
							}, 10)
						}
					}
				}
				return tmp;
			},
			taskList() {
				let tmp = this.$store.state.taskList;
				if (!tmp) {
					tmp = [];
				}
				return tmp;

			},
			user() {
				return typeof(this.$store.state.user.uid) !== 'undefined' ? this.$store.state.user : {
					integral: 0
				}
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			task_ali() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
			},
			task_bubble() {
				let tmp = typeof(this.$store.state.taskList.bubble) == 'undefined' ? [] : this.$store.state.taskList.bubble;
				let ret = [];
				for (let item of tmp) {
					if (!item.isComplete) {
						ret.push(item)
					}
				}
				//任务展示量统计
				utils.taskShowLog('bubble', ret.slice(0, 5));
				return ret;
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.task_ali && (this.task_ali.isComplete == false)) {
					return true
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.butieBox{
		z-index: 599;
	}
	.butie {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;


		.butie_bt {
			width: 640rpx;
		}

		.close {			
			width: 60rpx;
			margin-top: 30rpx;
		}
	}

	.indexfloatad {
		position: fixed;
		right: 26rpx;
		bottom: 200rpx;

		image {
			width: 126rpx;
			height: 130rpx;
		}
	}

	@keyframes rainbow {
		0% {
			background-position-x: 750rpx;
		}

		100% {
			background-position-x: 100%;
		}
	}

	.life_box {
		background-color: rgb(255, 255, 255);
		margin: 0px 0.32rem 0.27rem;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		border-radius: 16rpx;

		.img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.content {
			flex: 1;
		}

		.life {}

	}

	.clearCache {
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
	}

	.rectangle {
		position: fixed;
		right: 20rpx;
		z-index: 1000;
		width: 400rpx;

		.shape {
			width: 0rpx;
			height: 0px;
			position: relative;
			right: -280rpx;
			border-left: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-bottom: 8rpx rgba($color: #000000, $alpha: 0.75) solid;
		}

		.box {
			display: flex;
			align-items: center;
			background-color: rgba($color: #000000, $alpha: 0.75);
			padding: 15rpx;

			.img {
				width: 60rpx;
				height: 60rpx;
				margin-right: 10rpx;
			}

			.content {
				flex: 1;
				font-size: 25rpx;
				color: white
			}
		}

	}

	.seeing {
		position: absolute;
		top: 65%;
		left: 50%;
		transform: translateX(-50%);

		.amin {
			background-image: url(/static/walk/sprite.gif);
			background-size: auto 100%;
			background-repeat: no-repeat;
			width: 128rpx;
			height: 240rpx;
			margin: 0 auto;
			// animation: move 1s steps(20) infinite;
		}
	}

	.adLeft {
		position: absolute;
		left: 20rpx;
		bottom: 70rpx;
		display: flex;
		justify-content: space-between;

		&_img {
			width: 98rpx;
			height: 114rpx;
		}

		&_close {
			width: 29rpx;
			height: 29rpx;
			margin-top: -20rpx;
		}
	}

	.adRight {
		position: absolute;
		right: 20rpx;
		bottom: 70rpx;
		display: flex;
		justify-content: space-between;

		&_img {
			width: 116rpx;
			height: 116rpx;
		}
	}

	@keyframes move {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: calc(-4000rpx) 0;
		}
	}

	@keyframes breath {
		0% {
			-webkit-transform: scale(0.9);
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		30% {
			-webkit-transform: scale(0.9);
			transform: scale(0.9);
		}

		45% {
			-webkit-transform: scale(1);
		}

		to {
			-webkit-transform: scale(0.9);
		}
	}

	#walkPage {
		margin: 0;
		padding: 0;
		background-color: #F2F2F2;
		display: flex;
		flex-direction: column;

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			background-color: #fffff5;

			.headLeft {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.leftpic {
					width: 21rpx;
					height: 18rpx;
					display: block;
				}

				/deep/ .uni-noticebar {
					margin-bottom: 0;
					width: 87vw;

				}
			}

			.headRight {
				width: 13rpx;
				height: 13rpx;
				display: block;
			}
		}

		.main {
			position: relative;
			flex: 1;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;

			.head_main {
				position: relative;
				height: 870rpx;
				background-image: url(/static/walk/bg_top.png);
				background-size: 100%;

				.mian_bg {
					width: 100vw;
					height: 252rpx;
					display: block;
					position: absolute;
					left: 0;
					top: 619rpx;

					background-image: url(../..//static/walk/bg.png);
					background-repeat: repeat-x;
					background-size: auto 100%;
					background-position-x: -100px;

					animation: rainbow 20s linear infinite;

				}

				.main-fix {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						position: absolute;
						top: 0;
						left: 0;
						padding-left: 32rpx;
						padding: 22rpx 0 22rpx 32rpx;
						font-size: 26rpx;
						font-weight: bold;
						color: #666666;
					}

					.right {
						position: absolute;
						top: 0;
						right: 0;
						padding: 22rpx 32rpx 22rpx 0;
						display: flex;
						align-items: center;
						justify-content: center;

						.rightTit {
							font-weight: bold;
							font-size: 24rpx;
							color: #666666;
							margin-right: 15rpx;
						}

						.rightImg {
							width: 9rpx;
							height: 18rpx;
							display: block;
						}
					}
				}

				.progress {
					position: absolute;
					top: 170rpx;
					left: 0;
					min-width: 100rpx;
					background-color: rgba(0, 0, 0, 0.25);
					border-radius: 0px 26rpx 26rpx 0px;
					display: flex;
					align-items: center;

					.progress_left {
						width: 38rpx;
						height: 38rpx;
						display: block;
						margin-left: 8rpx;
					}

					.progress_right {
						height: 52rpx;
						line-height: 52rpx;
						font-weight: bold;
						font-size: 30rpx;
						letter-spacing: 0rpx;
						color: #ffffff;
						margin-left: 6rpx;
						margin-right: 10rpx;
					}
				}

				.main-contents {
					text-align: center;
					position: absolute;
					top: 25%;
					left: 50%;
					transform: translateX(-50%);


					.steps {
						font-weight: bold;
						font-size: 30rpx;
						letter-spacing: 1rpx;
						color: #fff;
						margin-bottom: 20rpx;

					}

					.nums {
						font-weight: bold;
						font-size: 80rpx;
						color: #fff;

						.tips {

							font-size: 30rpx;
						}
					}

					.jd_num {
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 24rpx;
						margin-top: 30rpx;

						.tops {
							display: inline-block;
						}

						.jd_box {
							position: relative;
							width: 220rpx;
							height: 20rpx;
							background: #FFFFFF;
							border-radius: 6px;
							margin: 0 10rpx;

							.ok_jd {
								position: absolute;
								width: 0;
								height: 20rpx;
								background: #FBD551;
								border-radius: 6px;
							}
						}
					}

					.btns {
						margin: 40rpx auto 16rpx;
						width: 340rpx;
						background-image: linear-gradient(90deg,
							#00af97 0%,
							#2fd883 100%),
							linear-gradient(#2ea799,
							#2ea799);
						background-blend-mode: normal,
							normal;
						border-radius: 40rpx;

						padding: 22rpx 0;
						font-weight: bold;
						font-size: 30rpx;
						color: #ffffff;
						text-align: center;
						font-weight: bold;
					}

					.duihuan {
						margin: 40rpx auto 16rpx;
						width: 340rpx;
						padding: 22rpx 0;
						background-image: url(../../static/walk/btn.gif);
						background-size: 100% 100%;
						border-radius: 0;
						color: #73472C;
						font-weight: bold;
					}

					.spams {
						font-size: 22rpx;
						color: #818181;
					}
				}

				.picLeft {
					position: absolute;
					top: 15%;
					left: 0;

					.leftTop,
					.leftBottom {
						width: 140rpx;
						min-height: 110rpx;
						display: block;
						text-align: center;
						animation: breath 1.2s ease-in-out infinite;

						image {
							width: 110rpx;
							min-height: 110rpx;
						}

						.titles {
							text-align: center;
							width: 140rpx;
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #FFFFFF;
							line-height: 14rpx;
							padding: 6rpx 0;
						}

						text {
							width: 140rpx;
							text-align: center;
							font-size: 20rpx;
							position: absolute;
							z-index: 1;
							top: 16rpx;
						}
					}

					.lefta {
						padding-left: 84rpx;
						margin-top: 61rpx;
					}

					.leftb {
						padding-left: 28rpx;
						margin-top: 22rpx;
					}

					.leftc {
						padding-left: 84rpx;
						margin-top: 22rpx;
					}
				}

				.picRight {
					position: absolute;
					top: 15%;
					right: 0;

					.rightTop,
					.rightBottom {
						width: 140rpx;
						min-height: 110rpx;
						display: block;
						text-align: center;
						animation: breath 1.2s ease-in-out infinite;

						image {
							width: 110rpx;
							min-height: 110rpx;
						}

						.titles {
							text-align: center;
							width: 140rpx;
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #FFFFFF;
							line-height: 14rpx;
							padding: 6rpx 0;
						}

						text {
							width: 140rpx;
							text-align: center;
							font-size: 20rpx;
							position: absolute;
							z-index: 1;
							top: 16rpx;
						}
					}

					.rightsa {
						padding-right: 87rpx;
						margin-top: 61rpx;
					}

					.rightsb {
						margin-left: 57rpx;
						margin-top: 22rpx;
					}

					.rightsc {
						padding-right: 87rpx;
						margin-top: 22rpx;
					}
				}
			}

			.inviteding {
				margin: 0 32rpx 27rpx;
				background-color: #ffffff;
				border-radius: 16rpx;

				.inviteFix {
					padding: 36rpx 32rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.inviteLeft {
						.leftTops {
							display: flex;
							align-items: center;
							justify-content: flex-start;

							.blacktet,
							.orangetet {
								font-weight: bold;
								font-size: 33rpx;
								color: #000000;
							}

							.orangetet {
								color: #ff7f01;
							}

							.inviteImg {
								width: 26rpx;
								height: 26rpx;
								display: block;
							}
						}

						.leftBottoms {
							display: flex;
							align-items: center;
							justify-content: flex-start;
							margin-top: 18rpx;

							.bottoms {
								color: #000000;
								font-size: 26rpx;
							}

							.bottomimg {
								width: 18rpx;
								height: 30rpx;
								display: block;
							}
						}
					}

					.inviteRight {
						width: 194rpx;
						background-image: linear-gradient(90deg,
							#ffb033 0%,
							#ff8400 100%),
							linear-gradient(#46991c,
							#46991c);
						background-blend-mode: normal,
							normal;
						border-radius: 40rpx;

						.rightTit {
							padding: 24rpx;
							text-align: center;
							font-size: 27rpx;
							color: #ffffff;
							letter-spacing: 3rpx;
						}
					}
				}

				.invitess {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 30rpx;

					.ess {
						font-size: 24rpx;
						color: #777777;
					}

					.longs {
						color: #ff7f01;
					}

					.lis {
						margin-left: 5rpx;
					}

					.seeImg {
						width: 7rpx;
						height: 14rpx;
						display: block;
						margin-left: 4rpx;
					}
				}

			}

			.nav_box {
				width: 100vw;
				height: 154rpx;
			}

			.nav {
				width: 94.7vw;
				background-color: #ffffff;
				border-radius: 16rpx;
				position: absolute;
				top: 820rpx;
				left: 2.7vw;

				&__bd {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					padding: 32rpx 22rpx;

					&__item {
						width: 120rpx;
						text-align: center;

						image {
							width: 90rpx;
							height: 90rpx;
						}

						.nav__bd__name {
							width: 120rpx;
							font-size: 24rpx;
							margin-top: 12rpx;
							color: #555555;
						}
					}
				}
			}

			.cash {
				margin: 0rpx 32rpx 27rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 36rpx 32rpx;

				.cashTit {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.cashLeft {
						color: #000000;
						font-size: 33rpx;
						font-weight: bold;
					}

					.cashRight {
						display: flex;
						align-items: center;
						justify-content: flex-start;

						.cashpro,
						.cashnum {
							font-size: 25rpx;
							color: #777777;
						}

						.cashnum {
							color: #ff7f01;
						}
					}
				}

				.ress {
					margin: 61rpx 0 39rpx;

					.redList {
						display: flex;
						align-items: flex;
						justify-content: flex-start;
						overflow-x: scroll;

						.reds {
							position: relative;
							margin-right: 17rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;

							.redImg {
								width: 134rpx;
								height: 179rpx;
								display: block;
							}

							.price {
								position: absolute;
								top: 10%;
								letter-spacing: 1rpx;
								color: #ffffff;
								font-size: 26rpx;
								font-weight: bold;
							}

							.listFixd {
								display: flex;
								align-items: center;
								justify-content: center;
								position: absolute;
								bottom: 8%;

								.pandaes {
									width: 21rpx;
									height: 21rpx;
									display: block;
									margin-right: 5rpx;
								}

								.money {
									letter-spacing: 1rpx;
									color: #feeb7f;
									font-size: 26rpx;
									font-weight: bold;
									line-height: 15rpx;
								}
							}
						}
					}

				}

				.Tips {
					display: flex;
					align-items: center;
					justify-content: center;

					.tiptire {
						color: #ff7f01;
						font-size: 24rpx;

					}

					.tipsImgs {
						width: 20rpx;
						height: 20rpx;
						display: block;
					}
				}
			}

			.stepNumber {
				margin: 0 32rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 36rpx 32rpx 0;

				.stepTit {
					font-weight: bold;
					font-size: 33rpx;
					color: #000000;
				}

				.stepList {
					.mainFix {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin: 36rpx 0;
						border-bottom: 2rpx solid #f5f5f5;

						.gixLeft {
							.bigTit {
								font-weight: bold;
								font-size: 30rpx;
								letter-spacing: -1rpx;
								color: #333333;
							}

							.smlTit {
								font-size: 26rpx;
								color: #808080;
								margin: 21rpx 0;
							}
						}

						.gixRight {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 176rpx;
							height: 62rpx;
							background-image: linear-gradient(90deg,
								#ffc02a 0%,
								#ff9102 100%),
								linear-gradient(#df8d37,
								#df8d37);
							background-blend-mode: normal,
								normal;
							border-radius: 31rpx;

							.pandas {
								width: 37rpx;
								height: 37rpx;
								display: block;
							}

							.times {
								font-weight: bold;
								font-size: 28rpx;
								color: #ffffff;
							}
						}
					}

					.mainFix:last-child {
						border: none
					}

				}
			}
		}
	}

	.pop-content {
		color: #000000;
		width: 600rpx;
		position: relative;
		margin-top: 140rpx;

		.tanbg {
			width: 600rpx;
			height: 712rpx;
			display: block;
		}

		.rule_Tips {
			position: absolute;
			top: 0;
			left: 0;

			.rulees {
				font-weight: bold;
				font-size: 58rpx;
				letter-spacing: -1rpx;
				color: #0c5560;
				text-align: center;
				margin: 56rpx 0 39rpx;
			}

			.ruleList {
				padding: 0 40rpx;

				.rules {
					font-size: 30rpx;
					line-height: 48rpx;
					color: #666666;
				}

			}

		}

		.knows {
			position: absolute;
			bottom: 16%;
			left: 15%;

			.knowImg {
				width: 415rpx;
				height: 86rpx;
				display: flex;
				margin: 0 auto;
			}

		}

		.cancel {
			.cancelPic {
				width: 58rpx;
				height: 58rpx;
				display: block;
				margin: 30rpx auto 0;
			}
		}
	}

	// 兑换成功
	.exchange-success {
		width: 677rpx;
		height: 884rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/exchange-success-popup-bg.png);
		background-size: 100% 100%;
		border-radius: 20rpx;

		&__hd {
			font-size: 50rpx;
			color: #333333;
			text-align: center;
			padding-top: 370rpx;
		}

		&__bd {
			margin-top: 20rpx;
			text-align: center;

			image {
				width: 83rpx;
				height: 64rpx;
				vertical-align: middle;
				margin-top: 10rpx;
			}

			text {
				font-size: 80rpx;
				font-weight: bold;
				vertical-align: middle;
				color: #ff9000;
			}
		}

		&__ft {
			margin-top: 20rpx;
			font-size: 35rpx;
			color: #888888;
			text-align: center;

			view {
				margin-bottom: 21rpx;
			}
		}

		&__button {
			margin: 30rpx auto;
			width: 450rpx;
			height: 100rpx;
			line-height: 100rpx;
			background-image: linear-gradient(90deg,
				#fdad00 0%,
				#fc8200 100%),
				linear-gradient(#46991c,
				#46991c);
			background-blend-mode: normal,
				normal;
			border-radius: 50rpx;
			font-size: 42rpx;
			font-weight: 500;
			color: #ffffff;
			text-align: center;
		}
	}

	// 领取成功
	.complete {
		width: 610rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		position: relative;
		padding-bottom: 58rpx;

		&__hd {
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/complete_bg.png);
			background-size: 343rpx 234rpx;
			background-repeat: no-repeat;
			background-position: top;

			font-size: 44rpx;
			color: #333333;
			text-align: center;
			padding: 245rpx 0 0;
			position: relative;
			top: -112rpx;
		}

		&__bd {
			margin-top: -42rpx;
			margin-bottom: 79rpx;
			text-align: center;

			image {
				width: 83rpx;
				height: 64rpx;
				vertical-align: middle;
				margin-right: 10rpx;
			}

			text {
				font-size: 90rpx;
				font-weight: bold;
				color: #ff9102;
				vertical-align: middle;
			}
		}

		&__ft {
			text-align: center;
			font-size: 30rpx;
			color: #8c8c8c;
			margin-bottom: 43rpx;
		}

		&__button {
			width: 500rpx;
			height: 96rpx;
			line-height: 96rpx;
			background-image: linear-gradient(90deg,
				#fb9400 0%,
				#ff4f02 100%),
				linear-gradient(#111111,
				#111111);
			background-blend-mode: normal,
				normal;
			border-radius: 48rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #ffffff;
			margin: 0 auto;
		}

		&__close {
			margin: 42rpx 0 0;
			text-align: center;

			image {
				width: 66rpx;
				height: 66rpx;
			}
		}
	}

	// 任务
	.task {
		&__hd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 28rpx 20rpx;

			&__left {
				display: flex;
				align-items: center;
				justify-content: center;

				&__title {
					// font-size: 32rpx;
					// font-weight: 500;
					// color: #111111;
					width: 150rpx;
				}

				&__record {
					width: 183rpx;
					height: 24rpx;
					padding: 16rpx 48rpx 7rpx 50rpx;
					background-image: url(/static/index/task_more.png);
					background-size: 100%;
					font-size: 22rpx;

					swiper {
						height: 24rpx;

						swiper-item {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}

			&__right {
				display: flex;
				align-items: center;

				&__more {
					font-size: 26rpx;
					color: #999999;
					margin-right: 8rpx;
				}

				&__image {
					width: 10rpx;
					height: 19rpx;
				}
			}

		}

		&__bd {
			background-color: #fff;
			border-radius: 0 0 16rpx 16rpx;
		}


		/deep/.task-list__item {
			padding: 20rpx 10rpx !important;
			border-radius: 10rpx;
			margin-bottom: 15rpx;

			border-bottom: solid 1rpx #F2F2F2;

			.item__info {
				.item__info__hd__subtitle {
					view {
						font-size: 24rpx;
					}
				}
			}
		}

		/deep/.task-list__item.complete {
			background-position: 100% -160% !important;

		}

	}

	.aliad {
		width: 94vw;
		margin: 0 auto;
		margin-top: 18rpx;


		.aliad_head {
			display: flex;
			justify-content: space-between;
			padding: 25rpx 17rpx 0;
			align-items: baseline;

			.aliad_head_l {
				width: 227rpx;
				height: 27rpx;
			}

			.aliad_head_r {
				display: flex;

				image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 7rpx;
				}

				view {
					font-size: 22rpx;
					color: #333333;

					text {
						color: #f70707;
					}
				}
			}
		}

		.aliad_body {
			padding: 17rpx 17rpx;
		}
	}

	.devBox {
		position: fixed;
		bottom: 20rpx;
		left: 20rpx;
		background-color: #00BFFF;

		button {
			width: 160rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 22rpx;
		}

		button:nth-child(odd) {
			background-color: #f0ad4e;
		}

		button:nth-child(even) {
			background-color: #007aff;
		}
	}
</style>
