<template>
	<view class="page">
		<view class="haeder">
			<view class="haeder__card">
				<view class="haeder__card__header">
					当前收益余额
				</view>
				<view class="haeder__card__body">
					<text class="body_unit">￥</text>
					<text class="body_number">{{user.money}}</text>
				</view>
				<view class="haeder__card__footer">
					<view class="footer__left">到账支付宝</view>
					<view class="footer__rigth" @click="onBindAliPayTap">绑定支付宝账号</view>
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
				</view>
			</view>
			<view class="form__button" @click="onSubmitTap">提现到支付宝</view>
		</view>

		<view class="rule">
			<view class="rule__title">—— 提现说明 ——</view>
			<view class="rule__body">
				<view>1.每日可提现一次，(快速提现机会不算在内)，单次最大可提现100元;</view>
				<view>2.快速提现10分钟内可到账，如遇高峰期，可能延迟到账，请耐心等候，查询提现进度请前往提现明细;</view>
				<view>3.普通提现将在3个工作日内审批到账，如遇高峰期，可能延迟到账，请耐心等候，查询提现进度请前往提现明细;</view>
				<view>4.推荐使用支付宝提现，速度较快;</view>
				<view>5.提现到账查询:支付宝->我的->账单。若有名称为[有惠生活提现]的账单，即为成功到账;</view>
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

	let systemInfo = wx.getSystemInfoSync()
	export default {
		components: {
			uniPopup,
		},

		data() {
			return {
				current: 0,
				format: [],
				user: {
					money: 0
				}
			}
		},

		onLoad() {
			this.getInfo();
			this.getWithdrawFormat();
		},
		onShow() {},
		methods: {
			// 获取页面数据
			getInfo() {
				ajax.post({
					url: 'Profile/userInfo',
					data: {
						field: 'jfb'
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.user.jfb = res.data.data
					}
				}).catch((error) => {})
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
				if(typeof(this.format[this.current]) == 'undefined'){
					return;
				}
				let money = this.format[this.current].money;
				ajax.post({
					url: 'Withdraw/withdraw',
					data: {
						format: money
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
							success: () => {
								this.getInfo();
							}
						});
					}else{
						uni.showToast({
							title: res.data.msg
						});
					}
				}).catch((error) => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
	}

	.haeder {
		background-color: #ffffff;
		padding: 28rpx 32rpx;
		margin-bottom: 18rpx;
		line-height: 1;

		&__card {
			padding: 35rpx 21rpx;
			background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/withdraw/card_bg.png) 0 0 / 100% auto;
			color: #ffffff;

			&__header {
				font-size: 26rpx;
			}

			&__body {
				margin-top: 33rpx;

				.body_unit {
					font-size: 35rpx;
				}

				.body_number {
					font-size: 60rpx;
					font-weight: 600;
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
		padding: 41rpx 38rpx;

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
				width: 320rpx;
				height: 100rpx;
				line-height: 100rpx;
				margin-bottom: 34rpx;
				text-align: center;
				background-color: #ffffff;
				border-radius: 10rpx;
				border: solid 2rpx #cecece;
				font-size: 30rpx;
				color: #323232;

				text {
					font-size: 40rpx;
					font-weight: bold;
				}
			}

			&__item--select {
				background-color: #ccf3e2;
				border: solid 2rpx #02bc85;
			}
		}

		&__button {
			text-align: center;
			line-height: 100rpx;
			background-image: linear-gradient(90deg, #4ddb5e 0%, #01c48a 100%), linear-gradient(#df8d37, #df8d37);
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
