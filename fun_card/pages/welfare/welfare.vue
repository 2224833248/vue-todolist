<template>
	<view class="tbody">
		<view class="banner" :style="{'padding-top':NAV_HEIGHT}">
			<view class="banner2">
				<view class="center">
					<view class="title">我的金币</view>
					<view class="money">{{user.funcard_integral}}</view>
					<view class="btn" @click="welfareTo">立即兑换</view>
				</view>
				<form class="header_bubble" @submit="onSubmit" :report-submit="true">
					<view class="bubbleBox" v-for="(item,index) in taskBubble" :key="index" @click="onTaskTap(item)">
						<view class="bubble">
							<image :src="item.image_bubble" mode="widthFix"></image>
							<text class="title">{{item.bubble_title}}</text>
						</view>
					</view>
				</form>
			</view>
		</view>

		<view class="aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
				<view class="aliad_head_r">
					<image src="/static/index/jfb.png" mode="widthFix"></image>
					<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>


		<view class="task">
			<view class="task-title">
				<text>任务赚金币</text>
				<view class="rightAll">
					<text @click="allTask">全部任务</text>
					<image src="../../static/icon/more.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="task-list">
				<task-list ref="task" tag="funcardWelfare" :isFilters="true" :size="10"></task-list>
			</view>
		</view>

		<uni-popup class="popups" ref="popup" type="center" :maskClick='false'>
			<view v-if="adListPop" class="popus">
				<image :src="adListPop.image" @click="adClick(adListPop)" mode="widthFix"></image>
				<image class="popClose" @click="popuClose()" src="/static/newImg/close.png" mode="widthFix"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	import cache from '@/utils/cache.js'
	import taskList from '@/components/task-list/task-list.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			taskList
		},
		data() {
			return {
				STATUS_BAR_HEIGTH: 44,
				TITLE_BAR_HEIGTH: 48,
				NAV_HEIGHT: '112px',
				// 阿里广告
				isShowAliAd: 1,
				adUnitId: 'ad_tiny_2021001167643261_202009262200004062',
				aliAdTaskId: 229,
				popsDar: true,
				isPopup: false,
				timePop: ''
			};
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		computed: {
			aliAdTask() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.aliAdTask && (this.aliAdTask.isComplete == false)) {
					return true
				} else {
					return false
				}
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					integral: 0,
					nickname: ''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			adList() {
				let tmp = this.$store.state.adList['welfare'] ? this.$store.state.adList['welfare'].splice(0, 4) : [];
				tmp.forEach(item => {
					utils.addAdShowLog(item);
				})
				return tmp;
			},
			adListPop() {
				if (typeof(this.$store.state.adList.popup) == 'undefined' || this.$store.state.adList.popup.length == 0) {
					return null
				}
				let tmp = this.$store.state.adList.popup[0];
				return tmp;
			},
			taskBubble() {
				let tmp = typeof(this.$store.state.taskList.funcardBubble) == 'undefined' ? [] : this.$store.state.taskList.funcardBubble;
				let ret = [];
				for (let item of tmp) {
					if (!item.isComplete) {
						ret.push(item)
					}
				}
				ret = ret.slice(0, 4);
				//任务展示量统计
				utils.taskShowLog('funcardBubble', ret);
				return ret;
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		onLoad() {
			this.isPopup = true;
			uni.getSystemInfo({
				success: (systemInfo) => {
					this.STATUS_BAR_HEIGTH = systemInfo.statusBarHeight
					this.TITLE_BAR_HEIGTH = systemInfo.titleBarHeight
					this.NAV_HEIGHT = systemInfo.statusBarHeight + systemInfo.titleBarHeight + 10 + "px"
				}
			})
		},
		methods: {
			timePopHanlder() {
				this.timePop = setInterval(() => {
					this.$refs.popup.open()
				}, 1000)
			},
			// 弹出点击关闭
			popuClose() {
				this.$refs.popup.close()
			},
			// 获取是否显示广告状态
			getAliAdShow() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				})
			},

			// 点击阿里广告
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.aliAdTask && this.onTaskTap(this.aliAdTask)
			},

			// 用户点击广告
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
			},

			// 广告打开成功
			onRenderSuccess(e) {
				console.info(e)
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},

			// 广告打开失败
			onRenderFail(e) {
				console.info(e)
				this.adUnitId = ''
			},
			allTask() {
				uni.navigateTo({
					url: '../allTask/allTask'
				})
			},
			// 跳转兑换红包
			welfareTo() {
				uni.navigateTo({
					url: '../exchange/exchange'
				})
			},
			// 点击广告
			adClick(ad) {
				cache.set('isPopup', new Date().getDate())
				this.$refs.popup.close()
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
			onSubmit(e) {
				if (this.$refs.task && this.$refs.task.onSubmit) {
					this.$refs.task.onSubmit(e);
				}
			},
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task, 'funcardBubble');
				}
			}
		},
		mounted() {
			this.getAliAdShow()
		},
		watch: {
			'adListPop': function(newVal) {
				if (!cache.get('isPopup') || cache.get('isPopup') != new Date().getDate()) {

					if (this.isPopup && newVal != null) {
						let interval = setInterval(() => {
							if (typeof(this.$refs.popup) != 'undefined' && typeof(this.$refs.popup.open) == 'function' ) {
								this.$refs.popup.open()
								clearInterval(interval);
								
								// cache.set('isPopup', new Date().getDate())
							}
						}, 10)
					}
				}
			}
		}

	}
</script>

<style lang="less" scoped>
	.tbody {
		background-color: #F7F7F7;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner2.png?v1)no-repeat;

		background-size: 100% auto;
	}

	.banner2 {
		position: relative;
	}

	@keyframes bubbl {
		0% {
			padding-bottom: 0rpx;
		}

		50% {
			padding-bottom: 20rpx;
		}
	}

	.banner {
		width: 100%;
		box-sizing: border-box;
		padding-bottom: 20rpx;

		.center {
			.title {
				font-size: 30rpx;
				color: #fff;
				text-align: center;
			}

			.money {
				font-size: 64rpx;
				color: #fff;
				margin: 20rpx 0;
				text-align: center;
			}

			.btn {
				width: 200rpx;
				height: 54rpx;
				text-align: center;
				line-height: 54rpx;
				font-size: 28rpx;
				color: #BF432A;
				background: linear-gradient(0deg, #FFB504 0%, #FFE6A8 100%);
				border-radius: 27rpx;
				margin: 0 auto;
				margin-bottom: 40rpx;
			}
		}

		.bubbleBox {
			position: absolute;
			left: 50rpx;
			bottom: 72rpx;

			.bubble {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;

				image {
					width: 80rpx;
				}

				.title {
					margin-top: 18rpx;
					font-size: 20rpx;
				}
			}

			.title {
				// padding-top: 10rpx;
				font-size: 20rpx;
				color: #fff;
				text-align: center;
				animation: bubbl 1.5s infinite;
			}

			&:nth-of-type(2) {
				left: 153rpx;
				bottom: -30rpx;
			}

			&:nth-of-type(3) {
				left: inherit;
				right: 50rpx;
				bottom: 72rpx;
			}

			&:nth-of-type(4) {
				left: inherit;
				right: 153rpx;
				bottom: -30rpx;
			}
		}
	}

	.aliad {
		width: 690rpx;
		margin: 0 auto;
		background: #fff;
		margin-top: -20rpx;
		border-radius: 14rpx;

		.aliad_head {
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
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

	// 任务
	.task {
		background: #F7F7F7;

		.task-title {
			width: 690rpx;
			box-sizing: border-box;
			padding: 30rpx 30rpx 30rpx;
			margin: 20rpx auto 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			border-radius: 14rpx 14rpx 0 0;

			text {
				color: #343434;
				font-size: 30rpx;
				font-weight: bold;
			}

			.rightAll {
				display: flex;
				align-items: center;

				text {
					color: #343434;
					font-size: 26rpx;
					font-weight: 500 !important;
					margin-left: 20rpx;
					margin-right: 5rpx;
				}

				image {
					width: 12rpx;

				}
			}
		}

		.task-list {
			margin: 0 30rpx 30rpx 30rpx;
			padding: 0 25rpx;
			padding-bottom: 16rpx;
			border-radius: 0 0 14rpx 14rpx;
			overflow: hidden;
			background-color: #fff;

			/deep/.task-list__item {
				padding-left: 10rpx;
				padding-right: 10rpx;
				border-radius: 10rpx;
				margin-bottom: 15rpx;

				.item__info {
					.item__info__hd__subtitle {
						view {
							font-size: 24rpx;
						}
					}
				}
			}

			/deep/.task-list__item~view {
				// border-top: 1px solid #ECECEC;
			}

			/deep/.task-list__item.complete {
				background-position: 100% -50% !important;

			}
		}

	}

	.popus {
		position: relative;
	}

	.popClose {
		position: absolute;
		width: 60rpx;
		left: 50%;
		transform: translateX(-50%);
		bottom: -40rpx;
	}
</style>
