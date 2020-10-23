<template>
	<view class="page">
		<view class="haeder">
			<view class="haeder__card">
				<view class="haeder__card__header">
					当前收益余额
				</view>
				<view class="moneyBox">
					<view class="haeder__card__body">
						<text class="body_unit">￥</text>
						<text class="body_number">{{user.capture_money}}</text>
					</view>
					<view class="datails" @click="toGold()">
						<text>余额明细</text>
						<image src="/static/icon/right.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="form">
			<view class="form__title">
				提现余额
			</view>
			<view class="form__format">
				<view class="form__format__item" v-for="(item,index) in format" :key="index" :class="current == index ? 'form__format__item--select' : ''"
				 @click="onFormatTap(index)">
					<text>{{item.money}}</text>元
					<!-- <view class="imgBg"></view> -->
					<!-- <image src="/static/withdraw/xz.png" mode="widthFix"></image> -->
				</view>
			</view>
			<view class="form__button" @click="onSubmitTap">提现到支付宝</view>
		</view>

		<view class="rule">
			<view class="rule__title">—— 提现说明 ——</view>
			<view class="rule__body">
				<view>1.每日只可提现一次，单次最少提现0.1元，最大可提现5元;</view>
				<view>2.提现预计10秒内到账(如提现是遇到高峰期，提现可能会有延迟，我们会在一个工作日内处理，请耐心等待);</view>
				<view>3.提现清零:自2019-11-01起， 如果您连续60日未登录，您可提现金额将会自动清零，系统会在清零前向用户发送提现提醒，如用户仍未提现，则视为用户自愿放弃提现的权利;</view>
				<view>4.提现到账查询:支付宝->我的->账单。若有名称为[有惠生活提现]的账单，即为成功到账；您也可以点击"余额明细"查看提现是否成功;</view>
				<view>5.若提现遇到问题，您可以通过"我的"->"意见反馈"联系我们，我们会在一个工作日内处理您反馈的问题;</view>
			</view>
		</view>

		<uni-popup ref="popup" type="center">
			<view class="bind-popup">
				<view class="bind-popup__hd">
					绑定支付宝账号
				</view>
				<view class="bind-popup__bd">
					<form @submit="onBindAliPaySubmit">
						<input name="alipay_account" type="text" placeholder="请填写支付宝账号(手机或邮箱)" value="" />
						<input name="alipay_name" type="text" placeholder="请填写您的真实姓名" value="" />
						<view class="tip">我们将通过以下手机通知您转账详情</view>
						<input name="alipay_notice_phone" type="text" placeholder="请填写提现通知手机号" value="" />
						<button class="button" formType="submit">提交</button>
					</form>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'

	export default {
		components: {
			uniPopup,
		},

		data() {
			return {
				current: 0,
				format: [],
				type:'babance'
			}
		},
		mounted() {
			// this.getInfo();
			this.getWithdrawFormat();
		},
		onShow() {},
		methods: {
			toGold() {
				uni.navigateTo({
					url: '../myGold/myGold?type=' + this.type
				})
			},
			// 绑定支付宝
			onBindAliPayTap() {
				this.$refs.popup.open()
			},
			// 绑定支付宝提交
			onBindAliPaySubmit(e) {
				ajax.post({
					url: 'Profile/bindingAliPay',
					data: e.detail.value,
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg
						});
						this.$refs.popup.close()
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				}).catch((error) => {})
			},

			// 获取提现规格
			getWithdrawFormat() {
				ajax.get({
					url: 'Withdraw/getFormat',
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.format = res.data.data
					}
				}).catch((error) => {})
			},
			// 点击提现金额规格
			onFormatTap(index) {
				this.current = index
			},
			// 提交表单
			onSubmitTap() {
				if (typeof(this.format[this.current]) == 'undefined') {
					return;
				}
				let money = this.format[this.current].money;
				ajax.post({
					url: 'FunCard/setWithdrawal',
					data: {
						money: money
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
							success: () => {
								ajax.login2();
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				}).catch((error) => {})
			}
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					money: 0,
					capture_money: 0,
					jfb: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
	}

	.haeder {
		height: 510rpx;
		background: url(/static/withdraw/bannerBg.png)no-repeat;
		background-size: 100% 100%;
		box-sizing: border-box;
		padding-top: 160rpx;
		// background-color: #ffffff;
		// padding: 28rpx 32rpx;
		// margin-bottom: 18rpx;
		// line-height: 1;

		&__card {
			padding: 35rpx 21rpx;
			color: #ffffff;

			&__header {
				font-size: 26rpx;
			}

			.moneyBox {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;

				.haeder__card__body {
					line-height: 1;
					margin-top: 30rpx;

					.body_unit {
						font-size: 35rpx;
					}

					.body_number {
						font-size: 60rpx;
						font-weight: 600;
					}
				}

				.datails {
					text {
						font-size: 26rpx;
						color: #ffffff;
					}

					image {
						width: 9rpx;
						margin-left: 10rpx;
					}
				}
			}


			&__footer {
				font-size: 24rpx;
				margin-top: 62rpx;
				display: flex;
				justify-content: space-between;

				.footer__left {}

				.footer__rigth {
					padding-right: 15rpx;
					color: #555555;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/arrow.png);
					background-repeat: no-repeat;
					background-size: 9rpx 18rpx;
					background-position: right;
				}
			}
		}
	}

	.form {
		background-color: #FFFFFF;
		padding: 40rpx 16rpx;
		margin: -160rpx 16rpx 0;
		border-radius: 16rpx;

		&__title {
			font-size: 34rpx;
			font-weight: bold;
			color: #323232;
		}

		&__format {
			margin-top: 37rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			&__item {
				width: 220rpx;
				height: 88rpx;
				box-sizing: border-box;
				line-height: 88rpx;
				margin-bottom: 30rpx;
				text-align: center;
				background-color: #ffffff;
				border-radius: 20rpx;
				border: solid 2rpx #cecece;
				font-size: 32rpx;
				color: #222;

				text {
					font-size: 40rpx;
					font-weight: bold;
				}
			}

			&__item--select {
				border:none;
				// position: relative;
				background: url(/static/withdraw/xzk.png)no-repeat;
				background-size: 100% 100%;
				// .imgBg {
				// 	position: absolute;
				// 	background: #ff6347;
				// 	border: 10rpx solid #ff6347;
				// 	right: 0rpx;
				// 	bottom: 0rpx;
				// 	image{
				// 		width: 20rpx;
				// 		height: 14rpx;
				// 	}
				// }
			}
		}

		&__button {
			text-align: center;
			line-height: 100rpx;
			background-image: linear-gradient(90deg, 
					#ff754a 0%, 
					#ff4936 100%), 
				linear-gradient(
					#df8d37, 
					#df8d37);
			border-radius: 50rpx;
			font-size: 34rpx;
			letter-spacing: 1rpx;
			color: #ffffff;
		}
	}

	.rule {
		padding: 35rpx 33rpx;

		&__title {
			text-align: center;
			font-size: 30rpx;
			font-weight: 500;
			color: #333333;
		}

		&__body {
			margin-top: 37rpx;
			font-size: 22rpx;
			font-weight: 500;
			line-height: 35rpx;
			letter-spacing: 0rpx;
			color: #666666;

			view {
				margin-bottom: 20rpx;
			}
		}
	}

	.bind-popup {
		background-color: #ffffff;
		width: 550rpx;
		padding: 45rpx 50rpx 49rpx;
		border-radius: 20rpx;

		&__hd {
			font-size: 40rpx;
			font-weight: bold;
			color: #333333;
			text-align: center;
			margin-bottom: 44rpx;
		}

		&__bd {

			input {
				width: 471rpx;
				background-color: #f3f3f3;
				border-radius: 16rpx;
				padding: 25rpx 47rpx 25rpx 32rpx;
				font-size: 34rpx;
				color: #111111;
				margin-bottom: 16rpx;
			}

			.tip {
				margin: 20rpx 0 36rpx;
				font-size: 30rpx;
				letter-spacing: -1rpx;
				color: #333333;
			}

			.button {
				margin-top: 37rpx;
				background-image: linear-gradient(90deg,
					#4ddb5e 0%,
					#01c48a 100%),
					linear-gradient(#df8d37,
					#df8d37);
				background-blend-mode: normal,
					normal;
				border-radius: 50rpx;

				font-size: 34rpx;
				font-weight: bold;
				line-height: 28rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
				text-align: center;
				padding: 34rpx 0;
			}
		}
	}
</style>
