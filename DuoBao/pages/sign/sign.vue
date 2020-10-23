<template>
	<view id="SignPage">
		<view class="first">
			<view class="title-head">
				<text class="left">天天领钱</text>
				<text class="right">已连续{{signDay}}/7天</text>
			</view>
			<view class="items">
				<view :class="(!item.receive && !item.sign)?'disable item':'item'" v-for="(item,index) in signData">
					<image class="img" v-if="item.sign" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/redok.png_xcx100"></image>
					<image class="img" v-else-if="item.receive" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/red.png_xcx100"></image>
					<image class="img" v-else src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/redfail.png_xcx100"></image>
					<text :class="item.receive?'active title':'title'">{{item.title=='今天'?'拆红包':item.title}}</text>
				</view>
			</view>
			<form @submit="sign" :report-submit="true">
				<button class="signButton" :class="(allowSignCount>0)?'heartbeat':''" formType="submit">{{signButtonText}}</button>
			</form>
		</view>

		<!-- 红包 -->
		<view class="red-tab">
			<red-tab ref="redTab"></red-tab>
		</view>

		<!-- 支付宝广告插件 -->
		<view class="card aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="../../static/index/xsjf.png" mode="aspectFill"></image>
				<view class="aliad_head_r">
					<image src="../../static/index/jfbb.png" mode="aspectFill"></image>
					<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>

		<view class="card task">
			<view class="task__hd">
				<view class="task__hd__left">
					<image class="task__hd__left__title" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/216e7041a2c69714351fa27b9ef983bb.png_100"
					 mode="widthFix"></image>
					<view class="task__hd__left__record">
						<swiper :autoplay="true" :interval="2000" :duration="300" :circular="true" :vertical="true">
							<swiper-item v-for="(text, index) in randUser" :key="index" :item-id="index">{{text}}</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="task__hd__right" @click="jumpMoreTask">
					<view class="task__hd__right__more">查看更多</view>
					<image class="task__hd__right__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/more.png_50"
					 mode="aspectFill"></image>
				</view>
			</view>
			<view class="task__bd">
				<task-list ref="task" :size="10" tag="sign" :isFilter="true" @share="onShowSharePanelTap"></task-list>
			</view>
		</view>

		<!-- 签到成功弹窗 -->
		<uni-popup ref="sign" type="center" :maskClick='false'>
			<view class="sign-popup">
				<image class="header" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/signheader.png_wep"></image>
				<view class="box">
					<text class="title">恭喜获得</text>
					<view class="integral">
						<image class="img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/gold.png_xcx50"></image>
						<text class="txt">+{{number}}</text>
					</view>
					<view class="btn" @click="close">
						<text class="txt">我知道了</text>
					</view>
				</view>
				<image class="close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/close.png_wep" @click="close"></image>
			</view>
		</uni-popup>

		<uni-popup class="popups" ref="popup" type="center" :maskClick='false'>
			<view class="popups">
				<view class="taskpopupscomplete">
					<view class="taskpopupscomplete__hd">— 恭喜获得 —</view>
					<view class="taskpopupscomplete__bd">
						<template v-if="type=='integral'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/gold.png" mode="aspectFill"></image>
							<text>+{{number}}</text>
						</template>
						<template v-if="type=='red'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/redbag.png" mode="aspectFill"></image>
							<text>+{{number}}元</text>
						</template>
					</view>
					<view class="taskpopupscomplete__ft">
						<view>我们还为您准备了以下福利：</view>
					</view>

					<view class="taskpopupscomplete__ad">
						<image :src="popupAd.image" mode="aspectFill" v-if="!isGoods" class="adimage" @click="adClick(popupAd)"></image>
						<view class="adgoods" v-if="isGoods" @click="adClick(popupAd)">
							<image :src="popupAd.image" mode="aspectFill"></image>
							<view class="title-box">
								<view class="title">{{popupAd.title}}</view>
								<view class="tips">{{popupAd.subtitle}}</view>
							</view>
						</view>
					</view>

					<view class="taskpopupscomplete__button" @click="adClick(popupAd)">立即领取</view>
				</view>
			</view>
			<view class="taskpopupscomplete__close">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png_wep" @click="this.$refs.popup.close();"></image>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="center" :maskClick="false">
			<view class="popup2" @click="draw"></view>
		</uni-popup>

		<!-- <uni-popup ref="popup3" type="center" :maskClick="false">
			<view class="popup3" @click="adClick(dayredad[0])">
				<image class="close" @tap.native.stop="this.$refs.popup3.close()" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/close.png"></image>
			</view>
		</uni-popup> -->

		<uni-popup ref="popup4" type="center" :maskClick="false">
			<view class="popup4" @click="adClick(recordOnly)">
				<image class="popup4__image" :src="recordOnly.image" mode="widthFix"></image>
				<image class="close" @tap.native.stop="this.$refs.popup4.close()" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/close.png"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '@/utils/ajax.js'
	import cache from '@/utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import taskList from '@/components/task-list/task-list.vue'
	import redTab from '@/components/red-tab.vue'
	import utils from '@/utils/utils.js'
	let interval = 0;
	let lock = false;
	export default {
		components: {
			uniPopup,
			taskList,
			redTab
		},
		data() {
			return {
				signData: [],
				signIntegral: 0,
				gift: [],
				lock: false,
				signButtonText: '立即签到',
				allowSignCount: 0,
				lastSignTime: 0,
				number: '0',
				type: '',
				redid: '0',
				isGoods: false,
				popupAd: [],
				swiper: [],
				recordOnly: {},

				randUser: [
					"贵*昂赚了100金币",
					"列*纬赚了100金币",
					"隆*晴赚了100金币",
					"相*盈赚了100金币",
					"洁*清赚了100金币",
					"鹏*峰赚了100金币",
					"冬*胜赚了100金币",
					"椒*恺赚了100金币",
					"联*霁赚了100金币",
					"星*智赚了100金币",
					"枫*峥赚了100金币"
				],

				goods: {},
				// dayredad:[]

				adUnitId: 'ad_tiny_2021001167652345_202009252200004059',
				aliAdTaskId: 224,
				isShowAliAd: 0,
			};
		},
		mounted() {
			if (!this.isLogin) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
			setInterval(this.upDate.bind(this), 1e3);

			// if(!cache.get('last_show_sign_in_time') || cache.get('last_show_sign_in_time') != new Date().getDate()){
			// 	ajax.get({
			// 		url: 'Ad/record',
			// 		data:{
			// 			slot_id:30,
			// 		}
			// 	}).then((res) => {
			// 		if (res.data.code == 200) {
			// 			this.dayredad = res.data.data
			// 		}
			// 	})
			// 	cache.set('last_show_sign_in_time',new Date().getDate())
			// }
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		computed: {
			signDay() {
				let num = 0;
				for (let item of this.signData) {
					if (item.sign == false) {
						break;
					}
					num++;
				}
				return num;
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
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
			showali() {
				if ((this.isShowAliAd === 1) && this.task_ali && (this.task_ali.isComplete == false)) {
					return true
				} else {
					return false
				}
			}
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		methods: {
			onUnload(){
				if(interval) clearInterval(interval)
				interval = 0
			},
			onRenderSuccess(e) {
				console.info(e)
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},
			onRenderFail(e) {
				console.info('onRenderFail')
				console.info(e)
				this.adUnitId = ''
			},
			init() {
				this.getSignData()
				this.getSignInfo()
				this.getSwiper()
				this.getOnlyAd()
				this.isShowAliAdf()
			},
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.task_ali && this.onTaskTap(this.task_ali)
			},
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task, 'kxzbBubble');
				}
			},
			isShowAliAdf() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				}).catch((error) => {})
			},
			getOnlyAd() {
				ajax.get({
					url: 'Ad/recordOnly',
					data: {
						slot_id: 30,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.recordOnly = res.data.data;
						utils.addAdShowLog(this.recordOnly);
						this.$refs.popup4.open()
					}
				})
			},
			getUrl(e) {
				ajax.get({
					url: 'Goods/getUrl',
					data: {
						iid: e.num_iid,
						gtype: e.goods_type,
						pid: 'mm_129925751_1961950382_110779650257'
					}
				}).then((res) => {
					if (res.data.code == 200) {
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(res.data.data.url))
						});
					}
				}).catch((error) => {})
			},
			getSwiper() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 26,
						var: 100
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.swiper = res.data.data
					}
				})
			},
			// 点击广告
			adClick(ad) {
				if (ad && typeof(ad.id) == 'undefined') {
					return;
				}
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
			getAd() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 27,
						ver: 100
					}
				}).then((res) => {
					if (res.data.code == 200) {
						if (res.data.data.isGoods == 1) {
							this.isGoods = true;
						}
						this.popupAd = res.data.data;
						utils.addAdShowLog(this.popupAd);
					}
				})
			},
			getSignInfo() {
				ajax.get({
					url: 'Sign/getSignInfo'
				}).then((res) => {
					if (res.data.code == 200) {
						this.allowSignCount = res.data.data.allowSignCount
						this.lastSignTime = res.data.data.lastSignTime

						if (this.allowSignCount > 0) {
							if(interval) return
							this.getSignButtonText()
							interval = setInterval(() => {
								this.getSignButtonText()
							}, 500)
						} else {
							this.signButtonText = "今日签到上限，明天再来"
						}
					}
				})
			},
			getSignButtonText(){
				let time = parseInt(this.lastSignTime) - Math.ceil((new Date()).getTime() / 1000)
				if (time < 1) {
					this.signButtonText = "立即签到 剩余" + this.allowSignCount + "次"
					clearInterval(interval)
					interval = 0
				} else {
					let min = parseInt(time / 60);
					let sec = time % 60;
					time = min + ':' + sec;
					this.signButtonText = time + "后 可领 剩余" + this.allowSignCount + "次"
				}
			},
			getSignData() {
				ajax.get({
					url: 'sign/getSignData'
				}).then((resp) => {
					if (resp.data.code == 200) {
						for (let item of resp.data.data) {
							if (item.receive) {
								this.signIntegral = item.data;
								break;
							}
						}
						this.signData = resp.data.data;
					}
				})
			},
			draw() {
				ajax.get({
					url: 'sign/draw',
					data: {
						redid: this.redid
					}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.$refs.popup2.close()
						this.$refs.popup.open()
					} else {
						uni.showToast({
							'content': resp.data.msg
						})
					}
				})

			},
			sign(e) {
				if (lock) return;
				lock = true
				setTimeout(res => {
					lock = false
				}, 3000)
				ajax.get({
					url: 'sign/sign2',
					data: {
						formId: e.detail.formId
					}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.getAd()
						this.number = resp.data.data.number
						this.type = resp.data.data.type
						this.redid = resp.data.data.redid
						// if (resp.data.data.type == "integral") {
						this.$refs.popup.open();
						// } else if (resp.data.data.type == "red") {
						// 	this.$refs.popup2.open()
						// }
						clearInterval(interval)
						ajax.login2();
						this.getSignInfo()
					} else {
						uni.showToast({
							'content': resp.data.msg
						})
					}
				})
			},
			close() {
				this.$refs.sign.close();
			},
			upDate() {
				if (this.lock) return;
				for (let item of this.gift) {
					item.datestr = this.calcDate(item.end);
				}
			},
			calcDate(time) {
				time = time - Math.ceil((new Date()).getTime() / 1000)
				let day = parseInt(time / 86400);
				time = time % 86400;
				let hour = parseInt(time / 3600);
				time = time % 3600;
				let min = parseInt(time / 60);
				let sec = time % 60;
				return day + '天' + hour + '小时' + min + '分钟' + sec + '秒';
			},
			jumpGiftRecord() {
				uni.navigateTo({
					url: '/pages/gift/record'
				})
			},
			jumpGift() {
				uni.navigateTo({
					url: '/pages/gift/index'
				})
			},
			jumpDetail(item) {
				uni.navigateTo({
					url: '/pages/gift/detail?id=' + item.id
				})
			},
			jumpRule() {
				uni.navigateTo({
					url: '/pages/sign/rule'
				})
			},
			jumpMoreTask() {
				uni.navigateTo({
					url: '/pages/my/task'
				})
			},
			onShowSharePanelTap() {
				my.showSharePanel();
			}
		},
		// watch:{
		// 	dayredad(val){
		// 		if(val && val.length>0){
		// 			this.$refs.popup3.open()
		// 		}
		// 	}
		// }
	}
</script>

<style lang="scss" scoped>
	.red-tab {
		width: 716rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		background-color: #FFF;
		border-radius: 14rpx;
	}

	/deep/.aa {
		border: 1px red solid;
	}

	#SignPage {
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		width: 100vw;
		min-height: 100vh;
	}

	.block {
		padding: 20rpx;
		margin: 0rpx 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
	}

	.first {
		display: flex;
		padding: 20rpx 40rpx;
		flex-direction: column;
		background-color: #ffffff;

		.title-head {
			display: flex;
			justify-content: space-between;

			.right {
				font-size: 26rpx;
				color: #555555;
			}

			.left {
				font-size: 32rpx;
				color: #000;
				font-weight: bold;
			}
		}

		.items {
			display: flex;
			width: 100%;
			justify-content: space-between;
			margin: 36rpx 0;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.img {
					width: 72rpx;
					height: 88rpx;
					margin: 16rpx 0;
				}

				.integral {
					font-size: 24rpx;
					line-height: 1;
					color: #ec4724;
				}

				.title {
					font-size: 24rpx;
					line-height: 1;
					color: #000000;
				}

				.active.title {
					font-size: 28rpx;
					color: #ec4724;
				}
			}

			.item.disable {
				.integral {
					color: #ec4724;
					opacity: 0.5;
				}

				.title {
					color: #888888;
				}
			}
		}

		.signButton {
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/btn.png_xcxwep');
			background-size: 100% 100%;
			width: 508rpx;
			height: 95rpx;
			box-shadow: inset 0rpx 3rpx 40rpx 0rpx #ffe981;
			border-radius: 48rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			align-self: center;

			font-size: 32rpx;
			color: #ffffff;
			margin: 0 auto;



			.txt {
				color: #ffffff;
			}
		}

		.gift {
			margin-top: 40rpx;
			padding: 22rpx;
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/giftbg.png');
			background-size: 100% 100%;

			>.title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					font-size: 26rpx;
					line-height: 1;
					color: #333333;
				}

				.right {
					display: flex;
					align-items: center;
					justify-content: center;

					.txt {
						font-size: 24rpx;
						line-height: 1;
						color: #666666;
					}

					.img {
						width: 9rpx;
						height: 18rpx;
					}
				}
			}

			.scroll::-webkit-scrollbar {
				display: none;
				/* Chrome Safari */
			}

			.goods {
				margin-top: 22rpx;
				display: flex;
				flex-wrap: nowrap;

				.item {
					~.item {
						margin-left: 20rpx;
					}

					background-color: #ffffff;
					border-radius: 10rpx;
					padding: 20rpx;
					;
					display: flex;
					width: 490rpx;

					.img {
						width: 131rpx;
						height: 131rpx;
						border-radius: 10rpx;
						flex-shrink: 0;
					}

					.right {
						display: flex;
						flex-wrap: nowrap;
						margin-left: 12rpx;
						flex: 1;

						.info {
							width: 240rpx;
							display: flex;
							margin-right: 12rpx;
							flex-direction: column;
							justify-content: space-between;

							.title {
								white-space: nowrap;
								text-overflow: ellipsis;
								overflow: hidden;
								word-break: break-all;
								color: #333333;
								font-size: 24rpx;
							}

							.integral {
								display: flex;

								.img {
									width: 27rpx;
									height: 21rpx;
									margin-right: 10rpx;
								}

								.txt {
									color: #ff7800;
									font-size: 26rpx;
									line-height: 1;
								}
							}

							.time {
								font-size: 16rpx;
								color: #333333;

								.datestr {
									color: #ec4724;
								}
							}

						}

						.btn {
							width: 103rpx;
							height: 103rpx;
							align-self: center;
						}
					}
				}
			}
		}
	}

	.last {
		margin-top: 20rpx;
		padding: 30rpx;

		.title {
			background-image: linear-gradient(to bottom, #fe9349 0%, #fe5633 100%);
			font-weight: bold;
			font-size: 33rpx;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}

	.sign-popup {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.box {
			margin-top: -60rpx;
			width: 530rpx;
			height: 500rpx;
			background-color: #ffffff;
			border-radius: 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.title {
				font-size: 40rpx;
				color: #333333;
				font-weight: bold;
			}

			.integral {
				margin: 60rpx 0rpx;
				display: flex;
				align-items: center;

				.img {
					width: 86rpx;
					height: 67rpx;
				}

				.txt {
					font-size: 66rpx;
					line-height: 1rpx;
					color: #ff7608;
				}
			}

			.btn {
				width: 369rpx;
				height: 90rpx;
				box-shadow: inset -3rpx 2rpx 40rpx 0rpx #ffe981;
				border-radius: 90rpx;
				background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/btn.png_xcxwep');
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.txt {
					font-size: 40rpx;
					line-height: 1;
					color: #ffffff;
				}
			}
		}

		.close {
			width: 58rpx;
			height: 58rpx;
			margin-top: 30rpx;
		}

		.header {
			width: 411rpx;
			height: 201rpx;
			z-index: 2;
		}
	}

	.popup2 {
		width: 652rpx;
		height: 700rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/8b8fc7b478d7773d17d77c0c5fbe6580.png_xcxwep);
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.popup3 {
		width: 600rpx;
		height: 772rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/c6c7861f8d04bce26f51cdec770ebcba.png_xcxwep);
		background-size: 100%;
		background-repeat: no-repeat;

		.close {
			width: 62rpx;
			height: 62rpx;
			position: absolute;
			top: 802rpx;
			left: 50%;
			margin-left: -31rpx;
		}
	}

	.popup4 {
		width: 600rpx;
		height: 772rpx;

		.popup4__image {
			width: 600rpx;
			height: 772rpx;
		}

		.close {
			width: 62rpx;
			height: 62rpx;
			position: absolute;
			top: 802rpx;
			left: 50%;
			margin-left: -31rpx;
		}
	}

	.swiper {
		width: 710rpx;
		height: 170rpx;
		background-color: #f74537;
		border-radius: 16px;
		margin: 20rpx auto 0;

		.swiper-item {
			width: 710rpx;
			height: 170rpx;
		}
	}

	.heartbeat {
		animation: heartbeat 1s infinite
	}

	@keyframes heartbeat {
		0% {
			transform: scale(0.8, 0.8);
			opacity: 1;
		}

		25% {
			transform: scale(1, 1);
			opacity: 0.8;
		}

		100% {
			transform: scale(0.8, 0.8);
			opacity: 1;
		}
	}


	// 任务
	.task {
		&__hd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 20rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/4297f44b13955235245b2497399d7a93.png_xcxwep);
			background-size: 100%;

			&__left {
				display: flex;
				align-items: center;
				justify-content: center;

				&__title {
					// font-size: 32rpx;
					// font-weight: 500;
					// color: #111111;
					width: 137rpx;
				}

				&__record {
					width: 183rpx;
					height: 24rpx;
					padding: 16rpx 48rpx 7rpx 50rpx;
					background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/task_more.png_xcxwep);
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
			background-color: rgb(255, 248, 224);
		}
	}

	.aliad {
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
</style>
