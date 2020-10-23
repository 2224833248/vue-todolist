<template>
	<view class="page">
		<view class="haeder">
			<view class="haeder__card">
				<view class="haeder__card__header">
					我的余额 (元）
				</view>
				<view class="moneyBox">
					<view class="haeder__card__body">
						<text class="body_unit">￥</text>
						<text class="body_number">{{user.walk_money}}</text>
					</view>
					<view class="datails" @click="myGold">
						<text>余额明细</text>
						<image src="/static/fffleft.png" mode="widthFix"></image>
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
				</view>
			</view>
			<view class="form__button" @click="onSubmitTap">提现到支付宝</view>
		</view>

		<view class="rule">
			<view class="rule__title">—— 提现说明 ——</view>
			<view class="rule__body">
				<view v-for="(item,index) in withdrawal_desc" :key="index">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'

	let systemInfo = wx.getSystemInfoSync()
	export default {
		components: {},
		data() {
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",
				current: 0,
				format: [],
				types:1,
			}
		},

		onLoad() {
			this.getWithdrawFormat();
		},
		onShow() {},
		methods: {
			// 余额明细
			myGold() {
				uni.navigateTo({
					url: '/pages/balance/balance?types='+this.types
				})
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
			withdrawal_desc(){
				return this.$store.state.setUp.zlzq_withdrawal_desc;
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
	}

	.haeder {
		height: 510rpx;
		background: linear-gradient(0deg, #3899FF, #3899FF, #73C4FF);
		box-sizing: border-box;
		padding-top: 160rpx;

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
				border: none;
				// position: relative;
				background: url(/static/withdraw/xzk.png)no-repeat;
				background-size: 100% 100%;
			}
		}

		&__button {
			text-align: center;
			line-height: 100rpx;
			background: linear-gradient(270deg, #3899FF, #3899FF, #73C4FF);
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
</style>
