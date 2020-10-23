<template>
	<view class="tbody">
		<view class="cont">
			<view class="title">提现金额(元)</view>
			<view class="withdra">
				<text>¥</text>
				<input type="digit" v-model="money" value="" />
			</view>
			<view class="balance">钱包余额:{{user.funcard_money}}元</view>
			<view class="btns" @click="getWithd">确认提现</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				money: '',
				isPull: false
			};
		},
		//获取用户信息
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					money: 0,
					jfb: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		},
		methods: {
			getWithd() {
				if (!this.isPull) {
					this.isPull = true;
					ajax.post({
						url: 'FunCard/setWithdrawal',
						data: {
							money: this.money
						}
					}).then(res => {
						this.isPull = false;
						if (res.data.code == 200) {
							uni.showToast({
								title: res.data.msg
							})
							utils.upUserInfo()
						} else {
							uni.showToast({
								title: res.data.msg
							})
						}
					}).catch(err => {
						this.isPull = false;
					})
				}
			}
		}
	}
</script>

<style lang="less">
	.cont {
		padding: 60rpx 30rpx 80rpx 30rpx;
		background: #fff;

		.title {
			font-size: 32rpx;
			color: #343434;
		}

		.withdra {
			padding: 60rpx 0 24rpx 0;
			border-bottom: 1rpx solid #E4E4E4;
			display: flex;
			align-items: center;

			text {
				font-size: 56rpx;
				color: #343434;
				font-weight: bold;
				font-family: PingFang SC;
			}

			input {
				flex: 1;
				border: 0;
				font-size: 56rpx;
				height: 76rpx;
			}
		}

		.balance {
			padding-top: 24rpx;
			color: #9A9A9A;
			font-size: 22rpx;
		}

		.btns {
			margin-top: 80rpx;
			width: 100%;
			height: 78rpx;
			border-radius: 40rpx;
			background: #349EF9;
			color: #fff;
			font-size: 28rpx;
			text-align: center;
			line-height: 78rpx;
		}
	}
</style>
