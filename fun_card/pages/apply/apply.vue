<template>
	<view class="tbody">
		<view class="banner">
			<view class="text">{{applyArr.subTitle}}</view>
			<view class="money">{{applyArr.applyMoney}}</view>
		</view>
		<!-- 报名 -->
		<view class="apply">
			<!-- <view class="apply-title">请选择挑战{{type == 'card'? '金额':'步数'}}</view> -->
			<view class="apply-title">
				<view class="left">{{type == 'card'? '早起':'运动'}}挑战</view>
				<view class="right" @click="hdgzClick"><text>活动规则</text>
					<image src="/static/icon/gz.png" mode="widthFix"></image>
				</view>
			</view>
			<!-- <view class="apply-stepNum">
				<view class="StepNum-item" :class="{applyLick:item.active}" @click="apply(item)" v-for="(item) in applyArr.applyItems">
					{{type == 'card'? item.num+'元':item.step}}
				</view>
			</view> -->

			<!-- 优惠券 -->
			<view class="apply-discount" v-show='isCoupon'>
				<view class="discountText">{{coupon.title}}x1</view>
				<!-- @click="ckCoupon" -->
				<view class="discountIcon" :class="isCouponShow?'':'isCouponShow'"></view>
			</view>

			<view class="apply-pay">
				<!-- <view class="payText">需支付：{{calcmoney}}元</view> -->
				<view class="payText">{{type == 'card'? '明早6-9点回来打卡':'挑战步数:5000步'}}</view>
				<view class="payChallenge" @click="postApply">去挑战</view>
			</view>

		</view>
		<view class="tishi">
			{{funCardPullRule}}
		</view>

		<!-- 领劵 -->
		<view class="discount">
			<view class="discount-top">
				<view class="discount-top-title">免费赚报名券({{applyArr.taskNum}}/5)</view>
				<view class="discount-top-text">任意完成五个即可获得一张报名券</view>
			</view>
			<view class="discount-list">
				<task-list ref="task" tag="funcardCardEnroll" @update="update" :size="10"></task-list>
			</view>
		</view>


		<uni-popup ref="messagePopup" type="center">
			<uni-popup-message :type="msgType" :message="message" :duration="1500"></uni-popup-message>
		</uni-popup>

		<uni-popup ref="applyTc" :maskClick='false' :animation='false' type="center">
			<view class="applyTc">
				<view class="title">活动规则</view>
				<view class="cont">
					<view class="list" v-for="(item,index) in rule" :key="index">
						<view class="texts">{{item.title}}</view>
						<view class="desc" v-for="(items,indexs) in item.list" :key="indexs">{{items}}</view>
					</view>
				</view>
				<view class="btn" @click="btnsClick">我知道了</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import taskList from '@/components/task-list/task-list.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'

	export default {
		onLoad: function(option) {
			this.type = option.type
			uni.setNavigationBarTitle({
				title: this.type == 'card' ? '早起打卡' : '打卡挑战'
			})
			this.getApplyData()
			if (this.type == 'card') {
				this.rule = getApp().globalData.setUp.funcardRule.card;
			} else {
				this.rule = getApp().globalData.setUp.funcardRule.motion;
			}
			this.funCardPullRule = getApp().globalData.setUp.funCardPullRule;
			console.log(this.rule)
		},
		data() {
			return {
				msgType: 'success',
				message: '',
				type: '',
				isPull: false,
				applyArr: {
					taskNum: 0
				},
				cid: 0,
				money: 0,
				coupon: {}, //优惠券
				isCoupon: false,
				isCouponShow: true,
				zfbClick: true, //选中支付宝
				yueClick: true, //未选余额
				isTmp: [],
				payType: 1,
				rule: [],
				funCardPullRule: ''

			};
		},
		mounted() {

			if (this.isLogin) {
				this.getCoupon();
			} else {
				uni.$on('login', (res) => {
					this.getCoupon();
				})
			}
		},
		components: {
			uniPopupMessage
		},

		onShow() {
			if (typeof(this.$refs.task) !== 'undefined') {
				this.$refs.task.completeTask();
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
		methods: {
			btnsClick() {
				this.$refs.applyTc.close()
			},
			// 活动规则
			agreement() {

				// uni.navigateTo({
				// 	url: '../ruleDateils/ruleDateils?type=' + this.type
				// })
			},

			hdgzClick() {
				this.$refs.applyTc.open()
			},

			isZfbClick(type) {
				this.payType = type
				this.isCouponShow = false
			},
			ckCoupon() {
				if (this.isCouponShow == true) {
					this.cid = 0
					this.isCouponShow = false
				} else {
					this.cid = this.coupon.id
					this.isCouponShow = true
					this.payType = false
				}
			},
			//优惠券
			getCoupon() {
				ajax.get({
					url: 'FunCard/getCoupon',
					data: {
						type: this.type
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.coupon = res.data.data
						if (res.data.data.length != 0) {
							this.isCoupon = true
							this.cid = this.coupon.id
						} else {
							this.isCoupon = false
						}
					}

				}).catch(err => {})
			},
			apply(item) {
				this.applyArr.applyItems.forEach(item => {
					item.active = false
				})
				item.active = true
				this.money = item.num
				if (typeof(this.coupon.money) !== 'undefined') {
					if (this.money > this.coupon.money) {
						this.isCoupon = false;
					} else {
						this.isCoupon = true;
					}
				}
			},
			update(data) {
				if (data == 5) {
					this.getCoupon();
				}
				this.getApplyData();
			},
			//步数金额
			getApplyData() {
				ajax.get({
					url: 'FunCard/getInfo',
					data: {
						type: this.type
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.applyArr = res.data.data
						this.money = this.applyArr.applyItems[0].num
					}
				}).catch(err => {})
			},
			//报名
			postApply() {
				// uni.navigateTo({
				// 	url: '../applyPay/applyPay?type=' + this.type + '&money=' + this.money
				// })
				this.setPay()

			},
			// 提交报名
			setPay() {
				if (!this.isPull) {
					this.isPull = true;
					ajax.post({
						url: 'FunCard/apply',
						data: {
							aliPayType: this.payType,
							type: this.type,
							num: this.money,
							cid: this.calcmoney == 0 ? this.cid : 0
						}
					}).then(res => {
						this.isPull = false;
						if (res.data.code == 200) {
							this.goPays(res.data.data);
						} else if (res.data.code == 201 || res.data.code == 202) {
							this.msgType = 'success';
							this.message = res.data.msg;
							this.$refs.messagePopup.open()
							ajax.login2();
							setTimeout(() => {
								uni.navigateBack();
							}, 1000);
						} else {
							this.msgType = 'error';
							this.message = res.data.msg;
							this.$refs.messagePopup.open()
							// uni.showToast({
							// 	title: '暂无优惠劵，做任务可获取'
							// })
						}
					}).catch(err => {						
						this.isPull = false;
					})
				}
			},
			goPays(alipay_num) {
				my.tradePay({
					tradeNO: alipay_num,
					success: (res) => {
						if (res.resultCode == 9000) {
							// 倒计时
							var interval = setInterval(() => {
								this.payOrder(interval);
							}, 1000)
						} else {
							this.msgType = 'error';
							this.message = '支付错误,请重试';
							this.$refs.messagePopup.open()
						}
					},
					fail: (res) => {
						this.msgType = 'error';
						this.message = '支付错误,请重试';
						this.$refs.messagePopup.open()
					}
				});
			},
			payOrder(interval) {
				ajax.post({
					url: 'FunCard/payOrder',
					data: {
						type: this.type
					},
					login: true,
				}).then(ret => {
					if (ret.data.code == 200) {
						clearInterval(interval);
						this.msgType = 'success';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
						ajax.login2();

						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							});

						}, 1000);
					}
				})
			},
		},
		loadData() {
			utils.upTaskInfo();
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: ''
				};
			},
			calcmoney() {
				if (!this.isCouponShow || typeof(this.coupon.money) == 'undefined' || this.money > this.coupon.money) {
					return this.money;
				} else {
					return 0;
				}
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			adList() {
				let tmp = this.$store.state.adList;
				if (tmp.signFloatAd && tmp.signFloatAd.length > 0) {
					utils.addAdShowLog(tmp.signFloatAd[0]);
				}
				return tmp;
			}
		},
	}
</script>

<style lang="less">
	/deep/.task-list__item {
		padding: 20rpx 10rpx !important;
		border-radius: 10rpx;
		margin-bottom: 15rpx;
	}

	.banner {
		width: 100%;
		height: 461rpx;
		box-sizing: border-box;
		padding-top: 164rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner1.png)no-repeat;
		background-size: 100% 100%;

		.text {
			text-align: center;
			color: #fff;
			font-size: 28rpx;
		}

		.money {
			font-size: 94rpx;
			color: #FFF;
			font-weight: 500;
			margin-top: 30rpx;
			text-align: center;
		}
	}

	.apply {
		width: 690rpx;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 34rpx 24rpx 30rpx 24rpx;
		background: #FFFFFF;
		// border-radius: 12rpx;
		border-radius: 12rpx 12rpx 0 0;
		margin-top: -113rpx;

		&-title {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				font-size: 30rpx;
				color: #343434;
				font-weight: bold;
			}

			.right {
				display: flex;
				align-items: center;

				text {
					color: #339EF9;
					font-size: 22rpx;
					padding-right: 5rpx;
				}

				image {
					width: 25rpx;
				}

			}
		}

		&-stepNum {
			padding: 35rpx 0;
			// border-bottom: 1px dashed #execec;
			border-bottom: 1px dashed #ececec;
			display: flex;
			justify-content: space-between;

			.StepNum-item {
				width: 150rpx;
				height: 90rpx;
				background: #F3F5F9;
				color: #343434;
				border-radius: 8rpx;
				text-align: center;
				line-height: 90rpx;
			}

			.applyLick {
				background: #349EF9;
				color: #fff;
			}
		}

		&-discount {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 35rpx;

			.discountText {
				font-size: 28rpx;
				color: #000000;
			}

			.discountIcon {
				width: 34rpx;
				height: 34rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/xz.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 50%;
				margin-right: 40rpx;
			}

			.isCouponShow {
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/weixz.png)no-repeat;
				background-size: 100% 100%;
			}
		}

		&-pay {
			padding-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.payText {
				font-size: 28rpx;
				color: #343434;
			}

			.payChallenge {
				width: 115rpx;
				height: 55rpx;
				border-radius: 28rpx;
				text-align: center;
				line-height: 55rpx;
				color: #fff;
				font-size: 24rpx;
				background: #349EF9;
			}
		}

	}

	// 提示
	.tishi {
		width: 690rpx;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 24rpx 16rpx;
		color: #F50707;
		font-size: 22rpx;
		background-color: #FEFCE0;
		line-height: 34rpx;
	}


	// 报名支付
	.uni-popup__wrapper-box {
		padding-bottom: 0 !important;

		.payment {
			height: 514rpx;
			width: 100%;
			box-sizing: border-box;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			background: #fff;
			padding: 30rpx;

			.titleBox {
				padding: 10rpx 0 50rpx 0;
				box-sizing: border-box;
				border-bottom: 1px solid #ECECEC;
				position: relative;

				.title {
					font-size: 34rpx;
					color: #333;
					text-align: center;
					font-weight: bold;
				}

				image {
					position: absolute;
					width: 33rpx;
					right: 0;
					top: 0;
				}
			}

			.zfb,
			.yue {
				padding: 31rpx;
				padding-right: 0;
				box-sizing: border-box;
				border-bottom: 1px solid #ECECEC;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.zfbBox {
					display: flex;
					justify-content: space-between;
					align-items: center;

					image {
						width: 52rpx;
					}

					.textName {
						margin-left: 22rpx;
						color: #333333;
						font-size: 28rpx;
					}
				}

				.imgBox {
					width: 34rpx;
					height: 34rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/xz.png)no-repeat;
					background-size: 100% 100%;
				}

				.isZfbSelect {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/weixz.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.yue {
				.imgBox {
					width: 34rpx;
					height: 34rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/weixz.png)no-repeat;
					background-size: 100% 100%;
				}

				.isYueSelect {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/xz.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.btn {
				width: 690rpx;
				height: 74rpx;
				margin: 50rpx auto 0;
				background: #339EF9;
				border-radius: 37rpx;
				text-align: center;
				line-height: 74rpx;
				color: #fff;
				font-size: 28rpx;
			}
		}
	}


	.discount {
		width: 690rpx;
		box-sizing: border-box;
		margin: 0 auto;
		margin-top: 24rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		padding: 34rpx 25rpx 40rpx 25rpx;
		margin-bottom: 48rpx;

		&-top {
			&-title {
				color: #343434;
				font-size: 30rpx;
				font-weight: bold;
				display: inline-block;
				vertical-align: bottom;
			}

			&-text {
				color: #9A9A9A;
				font-size: 22rpx;
				display: inline-block;
				vertical-align: bottom;
				margin-left: 10rpx;
			}
		}

		&-list {
			padding-top: 15rpx;

			&-item {
				margin-top: 34rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.imgBox {
						width: 79rpx;
						height: 79rpx;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 79rpx;
							height: 79rpx;
						}
					}

					.textBox {
						display: flex;
						height: 79rpx;
						box-sizing: border-box;
						padding: 4rpx 0;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 20rpx;

						.title {
							font-size: 28rpx;
							color: #343434;
						}

						.text {
							font-size: 24rpx;
							color: #9A9A9A;
						}
					}
				}

				.right {
					width: 145rpx;
					height: 55rpx;
					background: #349EF9;
					border-radius: 28rpx;
					text-align: center;
					line-height: 55rpx;
					color: #fff;
					font-size: 24rpx;
				}
			}
		}
	}

	.applyTc {
		width: 530rpx;
		// height: 628rpx;
		background: url(../../static/icon/tc.png)no-repeat;
		background-size: 100% 100%;
		border-radius: 14rpx;
		position: relative;

		.title {
			text-align: center;
			font-size: 38rpx;
			font-weight: 800;
			color: #FFFFFF;
			padding-top: 36rpx;
		}

		.text {
			font-size: 26rpx;
			line-height: 42rpx;
			color: #333;
			margin-bottom: 16rpx;
		}

		.cont {
			padding: 0 38rpx 120rpx;
			margin-top: 140rpx;

			.list {
				margin-bottom: 16rpx;

				.texts {
					font-size: 24rpx;
					color: #333;
					padding-bottom: 10rpx;
				}

				.desc {
					line-height: 38rpx;
					font-size: 24rpx;
					color: #333;
				}
			}
		}

		.btn {
			position: absolute;
			width: 404rpx;
			height: 60rpx;
			background: linear-gradient(180deg, #65B1FF, #2F94F1);
			border-radius: 30rpx;
			bottom: 32rpx;
			left: 50%;
			transform: translateX(-50%);


			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
			line-height: 60rpx;
		}
	}
</style>
