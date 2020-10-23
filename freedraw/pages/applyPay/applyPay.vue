<template>
	<view class="tbody">
		<view class="money">
			<view class="title">报名{{type == 'card' ? '早起' : '运动'}}打卡</view>
			<view class="price">{{money}}.00<text>元</text></view>
		</view>
		<view class="payManner">
			<view class="title">请选择支付方式</view>
			<view class="payment">
				<view class="zfb" @click="isZfbClick(1)">
					<view class="zfbBox">
						<image src="/static/icon/zfb.png" mode="widthFix"></image>
						<view class="textName">支付宝</view>
					</view>
					<view class="imgBox" :class="payType == 1?'':'isZfbSelect'"></view>
				</view>
				<view class="zfb" @click="isZfbClick(2)">
					<view class="zfbBox">
						<image src="/static/icon/ye.png" mode="widthFix"></image>
						<view class="textName">余额（{{user.funcard_money}}元）</view>
					</view>
					<view class="imgBox" :class="payType == 2?'':'isZfbSelect'"></view>
				</view>
			</view>
		</view>

		<view class="apply-discount" v-show='isCoupon'>
			<view class="left">报名劵</view>
			<view class="right">
				<view class="discountText">{{coupon.title}}x1</view>
				<view class="discountIcon" :class="isCouponShow?'':'isCouponShow'" @click="ckCoupon"></view>
			</view>
		</view>
		<!-- 费用 -->
		<view class="leftPrice"><text>需要支付金额</text><text class="isMoney">￥{{money}}.00</text></view>
		<!-- 用户协议 -->
		<view class="agreement" @click="consent()">
			<view class="rule" :class="actconsent?'isconsent':''"></view>
			<view class="text">我已阅读并同意<text @click.stop="agreement()">活动规则</text></view>
		</view>
		<!-- 立即支付 -->
		<view class="bottomBtn">
			<view class="btn" @click="btnPay">
				立即支付
			</view>
		</view>
	
		<!-- 活动说明 -->
		<view class="explain">
			<view v-for="(item,index) in rule" :key="index">
				<view class="title">{{item.title}}</view>
				<view class="text" v-for="(items,indexs) in item.list" :key="indexs">{{items}}</view>
			</view>
		</view>
		
		
		<uni-popup ref="messagePopup" type="center">
			<uni-popup-message :type="type" :message="message" :duration="1500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	export default {
		onLoad: function(option) {
			this.type = option.type
			this.money = option.money
			uni.setNavigationBarTitle({
				title: this.type == 'card' ? '早起打卡挑战赛' : '运动挑战赛'
			})
			if (this.type == 'card') {
				this.rule = getApp().globalData.setUp.funcardRule.card;
			} else {
				this.rule = getApp().globalData.setUp.funcardRule.motion;
			}
			// this.getApplyData()
		},
		components: {
			uniPopupMessage
		},
		data() {
			return {
				msgType: 'success',
				message: '',
				payType: 1,
				isCoupon: false,
				isCouponShow: false,
				cid: 0,
				money: 0,
				type: '',
				coupon: {},
				actconsent: false,
				rule: []
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
		methods: {

			// cesi(){
			// 	uni.navigateBack({
			// 		delta:2
			// 	});
			// },
			consent() {
				this.actconsent = !this.actconsent
			},
			// 活动规则
			agreement() {
				uni.navigateTo({
					url: '../ruleDateils/ruleDateils?type=' + this.type
				})
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
			// 按钮点击时候
			btnPay() {
				if (this.actconsent) {
					this.setPay()
				} else {
					uni.showToast({
						title: '请先同意活动规则'
					})
				}
			},
			// 提交报名
			setPay() {
				ajax.post({
					url: 'FunCard/apply',
					data: {
						aliPayType: this.payType,
						type: this.type,
						num: this.money,
						cid: this.calcmoney == 0 ? this.cid : 0
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.goPays(res.data.data);
					} else if (res.data.code == 201 || res.data.code == 202) {
						this.msgType = 'success';
						this.message = res.data.msg;
						this.$refs.messagePopup.open()
						ajax.login2();
						setTimeout(() => {
							uni.navigateBack({
								delta: 2
							});
						}, 1000);
					} else {
						this.msgType = 'error';
						this.message = res.data.msg;
						this.$refs.messagePopup.open()
					}
				}).catch(err => {})
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
		}
	}
</script>

<style lang="less">
	.money {
		width: 690rpx;
		height: 160rpx;
		padding-top: 50rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin: 0 auto;
		margin-top: 20rpx;

		.title {
			font-size: 24rpx;
			color: #666666;
			text-align: center;
		}

		.price {
			font-size: 64rpx;
			color: #343434;
			font-weight: 500;
			text-align: center;
			margin-top: 20rpx;

			text {
				font-size: 24rpx;
			}
		}
	}

	.payManner {
		width: 690rpx;
		margin: 20rpx auto 0;

		.title {
			font-size: 22rpx;
			color: #9A9A9A;
		}

		.payment {
			// height: 514rpx;
			// width: 100%;
			box-sizing: border-box;
			border-radius: 14rpx;
			background: #fff;
			padding: 0 30rpx;
			margin-top: 20rpx;

			.zfb{
				padding: 31rpx 0;
				box-sizing: border-box;
				border-bottom: 1px solid #ECECEC;
				display: flex;
				justify-content: space-between;
				align-items: center;

				&:nth-last-child(1) {
					border-bottom: none;
				}

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

			// .btn {
			// 	width: 690rpx;
			// 	height: 74rpx;
			// 	margin: 50rpx auto 0;
			// 	background: #339EF9;
			// 	border-radius: 37rpx;
			// 	text-align: center;
			// 	line-height: 74rpx;
			// 	color: #fff;
			// 	font-size: 28rpx;
			// }
		}
	}

	.apply-discount {
		width: 690rpx;
		height: 114rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		border-radius: 14rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin-top: 20rpx;

		.left {
			font-size: 28rpx;
			color: #343434;
		}

		.right {
			display: flex;
			align-items: center;

			.discountText {
				font-size: 28rpx;
				color: #000000;
				margin-right: 15rpx;
			}

			.discountIcon {
				width: 34rpx;
				height: 34rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/xz.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 50%;
			}

			.isCouponShow {
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/weixz.png)no-repeat;
				background-size: 100% 100%;
			}
		}
	}

	.explain {
		width: 690rpx;
		box-sizing: border-box;
		margin: 20rpx auto 0;
		// background: #FFFFFF;
		border-radius: 14rpx;
		padding: 34rpx 30rpx 30rpx 30rpx;
		.title{
			
			font-size: 26rpx;
			color: #9A9A9A;
			margin-bottom: 23rpx;
			font-weight: 600;
		}

		.text {
			font-size: 26rpx;
			line-height: 42rpx;
			color: #9A9A9A;
			margin-bottom: 16rpx;
		}
	}

	.agreement{
		width: 690rpx;
		box-sizing: border-box;
		padding: 20rpx 0 20rpx 30rpx;
		box-sizing: border-box;
		margin: 51rpx auto 0;
		
		display: flex;
		align-items: center;

		.rule {
			width: 26rpx;
			height: 26rpx;
			background: url(../../static/icon/none.png)no-repeat;
			background-size: 100% 100%;
		}

		.isconsent {
			background: url(../../static/icon/consent.png)no-repeat;
			background-size: 100% 100%;
		}

		.text {
			font-size: 24rpx;
			color: #343434;
			margin-left: 10rpx;

			text {
				color: #51ABFA;
			}
		}
	}
	// 费用
	.leftPrice{
		width: 690rpx;
		box-sizing: border-box;
		padding: 0 30rpx;
		line-height: 114rpx;
		background: #fff;
		border-radius: 14rpx;
		margin: 20rpx auto 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text{
			font-size: 28rpx;
			color: #343434;
		}
		.isMoney{
			color: #349EF9;
			font-size: 32rpx;
		}
	}

	.bottomBtn{
		padding-top: 20rpx;
		.btn{
			width: 690rpx;
			height:78rpx;
			margin: 0 auto;
			background: #349EF9;
			border-radius: 39rpx;
			color: #fff;
			text-align: center;
			font-size: 26rpx;
			line-height: 78rpx;
		}
	}
</style>
