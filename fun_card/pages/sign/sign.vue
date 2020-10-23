<template>
	<view class="SignPage" :style="{'padding-top':NAV_HEIGHT}">
		<!-- banner -->
		<!-- <view class="banner"></view> -->

		<view class="first">
			<view class="title-head">
				<text class="left">天天领钱</text>
				<text class="right">连续打卡{{signDay}}/7天</text>
			</view>
			<view class="items">
				<view :class="(!item.receive && !item.sign)?'disable item':'item'" v-for="(item,index) in signData">
					<image class="img" v-if="item.sign" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/c4ca4238a0b923820dcc509a6f75849b.png_xcx100"></image>
					<image class="img" v-else-if="item.receive" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/4dfa3b47e701c7581cb8dda9c8eadb6f.png_xcx100"></image>
					<image class="img" v-else src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/eccbc87e4b5ce2fe28308fd9f2a7baf3.png_xcx100"></image>
					<text :class="item.receive?'active title':'title'">{{item.title=='今天'?'拆红包':item.title}}</text>
				</view>
			</view>

			<form @submit="sign" :report-submit="true">
				<button class="firstBtn" :class="(allowSignCount>0)?'heartbeat':''" formType="submit">{{signButtonText}}</button>
			</form>
			<!-- <view @submit="sign" ></view> -->
		</view>

		<!-- 红包 -->

		<view class="red-tab">
			<red-tab ref="redTab"></red-tab>
		</view>


		<view class="task">
			<view class="task-title">
				<image src="/static/index/title.png" mode="widthFix"></image>
			</view>
			<view class="task-list">
				<task-list ref="task" tag="funcardSign" :size="10"></task-list>
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
						<template v-if="type=='jfb'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/jfb.png" mode="aspectFill"></image>
							<text>+{{number}}</text>
						</template>
					</view>
					<view class="taskpopupscomplete__ft">
						<view>我们还为您准备了以下福利：</view>
					</view>

					<view class="taskpopupscomplete__ad">
						<image :src="popupAd.image" mode="aspectFill" v-if="!isGoods" class="adimage"></image>
						<view class="adgoods" v-if="isGoods">
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
	let interval;
	let lock;
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
				jfbId: '0',
				isGoods: false,
				popupAd: [],
				swiper: [],
				recordOnly: {},
				tag: 'funcardSign',

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

				STATUS_BAR_HEIGTH: 44,
				TITLE_BAR_HEIGTH: 48,
				NAV_HEIGHT: '92px',
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

		},
		onLoad() {
			uni.getSystemInfo({
				success: (systemInfo) => {
					this.STATUS_BAR_HEIGTH = systemInfo.statusBarHeight
					this.TITLE_BAR_HEIGTH = systemInfo.titleBarHeight
					this.NAV_HEIGHT = systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px"
				}
			})
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
				};
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
			taskList() {
				let tmp = [];
				if (this.tag == '@all') {
					let allList = {};
					for (let item of this.$store.state.taskList) {
						if (item.key.indexOf('ubble') !== -1) {
							continue;
						}
						for (let item1 of item.value) {
							allList[item1.id] = item1;
						}
					}
					for (let item of allList) {
						tmp.push(item.value);
					}
				} else if (this.tag == '' || typeof(this.$store.state.taskList[this.tag]) == 'undefined') {
					tmp = [];
				} else {
					tmp = this.$store.state.taskList[this.tag];
				}
				if (this.isFilter) {
					let ret = [];
					for (let item of tmp) {
						if (!item.isComplete) {
							ret.push(item)
						}
					}
					tmp = ret;
				}
				if (this.tag != '@all') {
					if (tmp.length > this.size) {
						tmp = tmp.slice(0, this.size)
					}
				}
				// 任务展示量统计
				utils.taskShowLog(this.tag, tmp);
				return tmp;
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success:()=>{
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
					success:()=>{
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		methods: {
			init() {
				this.getSignData()
				this.getSignInfo()
				this.getSwiper()
				this.getOnlyAd()
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
					url: 'FuncardSign/getSignInfo'
				}).then((res) => {
					if (res.data.code == 200) {
						this.allowSignCount = res.data.data.allowSignCount
						this.lastSignTime = res.data.data.lastSignTime

						if (this.allowSignCount > 0) {
							if (!interval) {
								interval = setInterval(() => {
									let time = this.lastSignTime - Math.ceil((new Date()).getTime() / 1000)
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
								}, 1000)
							}
						} else {
							this.signButtonText = "今日签到上限，明天再来"
						}
					}
				})
			},
			getSignData() {
				ajax.get({
					url: 'FuncardSign/getBase'
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
					url: 'FuncardSign/draw',
					data: {
						jfbId: this.jfbId
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
				ajax.get({
					url: 'FuncardSign/sign',
					data: {
						formId: e.detail.formId
					}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.getAd()
						this.number = resp.data.data.number
						this.type = resp.data.data.type
						this.jfbId = resp.data.data.jfbId
						if (resp.data.data.type == "integral") {
							this.$refs.popup.open();
						} else if (resp.data.data.type == "jfb") {
							this.$refs.popup2.open()
						}
						clearInterval(interval)
						this.getSignInfo()
						this.getSignData()
						ajax.login2();
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
		}
	}
</script>

<style lang="scss" scoped>
	.SignPage {
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner1.png)no-repeat;
		background-size: 100%;
	}

	// .banner {
	// 	width: 100%;
	// 	height: 343rpx;
	// 	background: url(../../static/banner/banner1.png)no-repeat;
	// 	background-size: 100% 100%;
	// }

	.red-tab {
		width: 690rpx;
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
		padding: 34rpx 30rpx 42rpx 30rpx;
		box-sizing: border-box;
		width: 690rpx;
		flex-direction: column;
		background-color: #ffffff;
		margin-top: 20rpx;
		margin-left: auto;
		margin-right: auto;
		border-radius: 14rpx;

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
			height: 144rpx;
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

		.firstBtn {
			width: 630rpx;
			height: 74rpx;
			border-radius: 37rpx;
			font-size: 28rpx;
			text-align: center;
			line-height: 74rpx;
			background: #349EF9;
			color: #ffffff;
			margin: 0 auto;
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
		height: 912rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/13/16/624bff11053ee987901896395e8772a1.gif_xcxwep);
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

	// @keyframes heartbeat {
	// 	0% {
	// 		transform: scale(0.8, 0.8);
	// 		opacity: 1;
	// 	}

	// 	25% {
	// 		transform: scale(1, 1);
	// 		opacity: 0.8;
	// 	}

	// 	100% {
	// 		transform: scale(0.8, 0.8);
	// 		opacity: 1;
	// 	}
	// }


	// 任务
	.task {
		.task-title {
			padding: 30rpx 0;
			text-align: center;

			image {
				width: 408rpx;
			}

			text {
				color: #349EF9;
				font-size: 32rpx;
			}
		}

		&-list {
			margin: 0 30rpx;
			margin-bottom: 48rpx;
			border-radius: 16rpx;
			overflow: hidden;
			background: #fff;
			padding: 20rpx 30rpx;
		}
		/deep/.task-list__item {
				padding: 20rpx 10rpx !important;
				border-radius: 10rpx;
				margin-bottom: 15rpx;
				.item__info{
					.item__info__hd__subtitle{
						view{
							font-size: 24rpx;
						}
					}
				}
			}
		/deep/.task-list__item.complete{
			background-position:100% -160%!important;
			
		}
	}
</style>
