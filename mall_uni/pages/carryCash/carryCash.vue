<template>
	<view class="tbody">

		<!-- TO-DO余额 -->
		<view class="balance">
			<view class="balance-title">当前收益集分宝</view>
			<view class="balance-price">{{user.jfb*1000/10}}</view>
			<view class="balance-hint" v-show="hintMoney>0">还差{{hintMoney}}即可提现哦，和好友分享特权赚现金</view>
		</view>

		<!-- TO-DO 提现金额 -->
		<view class="cashMoney">
			<view class="cashMoney-title">提现集分宝</view>
			<view class="cashMoney-cont">
				<view class="cashMoney-cont-item" :class="{clsMoney:actMoney == index}" @click="isMoney(index)" v-for="(items,index) in moneys"
				 :key='index'>{{items.numMoney}}</view>
			</view>
			<view class="mobile" v-if="user.mobile != null">
				提现支付号账号: <text>{{user.mobile}}</text>
			</view>

			<view v-if="user.mobile != null" class="cashMoney-btn" @click="embody">提现到支付宝</view>
			<button v-if="user.mobile == null" class="cashMoney-btn" open-type="getAuthorize" @getAuthorize="onGetAuthorize"
			 @error="onAuthError" scope='phoneNumber'>
				提现到支付宝
			</button>
		</view>


		<!-- TO-DO提现说明 -->

		<view class="explain">
			<view class="explain-title">
				<view class="explain-title-border"></view>
				<view class="explain-title-text">提现说明</view>
				<view class="explain-title-border"></view>
			</view>
			<view class="explain-cont">
				<view class="explain-cont-item" v-for="(expla,inExpla) in explain" :key='inExpla'>{{expla}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	let app = getApp()
	export default {
		data() {
			return {
				actMoney: 0,
				balance: 0,
				moneys: [{
					numMoney: 10
				}, {
					numMoney: 100
				}, {
					numMoney: 500
				}, {
					numMoney: 1000
				}],
				carry: [],
				price: 10,
				hintMoney: 0,
				hintText: true,
				explain: getApp().globalData.setUp.withdrawal_desc
			};
		},
		mounted() {
			this.hint()
		},
		methods: {
			onGetAuthorize(res) {
				let thiss = this;
				my.getPhoneNumber({
					success: (res) => {
						let encryptedData = res.response;
						$axios.post({
							url: 'User/bindingMobile',
							data: {
								encryptedData: encryptedData
							}
						}).then(res => {
							$axios.login2();
							setTimeout(() => {
								thiss.embody()
							}, 1000)

						}).catch(err => {})
					},
					fail: (res) => {
						console.log('getPhoneNumber_fail');
					},
				});
			},
			onAuthError(res) {
				uni.showToast({
					content: '拒绝授权后,将无法提现集分宝'
				});
			},
			// 提示
			hint() {
				this.hintMoney = this.price - this.user.money*1000/10
			},
			isMoney(index) {
				this.actMoney = index
				this.price = this.moneys[index].numMoney
				// if(this.hintMoney)
				// this.getCarry()
				this.hint()
			},
			// 提现
			embody() {
				if ((this.user.jfb * 1000 / 10) < this.price) {
					uni.showToast({
						content: '当前账户集分宝不足以提取' + this.price
					});
				} else {
					$axios.get({
						url: 'User/setWithdrawal',
						data: {
							money: this.price
						}
					}).then(res => {
						uni.showToast({
							content: res.data.msg
						});
						if (res.data.code) {
							this.hint()
							$axios.login2();
						}
						utils.upUserInfo()
					}).catch(err => {})
				}
			},

		},
		//获取用户信息
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					jfb:0,
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		}
	}
</script>

<style lang="less">
	.tbody {
		.balance {
			background: #fff;
			padding: 36rpx 38rpx;
			margin-bottom: 18rpx;

			&-title {
				color: #111;
				font-size: 28rpx;
			}

			&-price {
				font-size: 50rpx;
				color: #111;
				font-weight: bold;
				padding: 39rpx 0 34rpx 0;

				text {
					font-size: 30rpx;
				}
			}

			&-hint {
				height: 60rpx;
				font-size: 24rpx;
				color: #ff3632;
				padding-left: 16rpx;
				line-height: 60rpx;
				background-color: #ffe7e6;
				border-radius: 12rpx;
			}
		}

		// TO-DO提现金额
		.cashMoney {
			padding: 36rpx 38rpx 47rpx 38rpx;
			background: #fff;

			.mobile {

				font-size: 28rpx;
				margin: 20rpx 0;

				text {
					font-size: 30rpx;
					color: red;
				}
			}

			&-title {
				color: #111;
				font-size: 28rpx;
				padding-bottom: 35rpx;
			}

			&-cont {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				&-item {
					width: 328rpx;
					height: 90rpx;
					border-radius: 16rpx;
					color: #111;
					font-size: 32rpx;
					text-align: center;
					line-height: 90rpx;
					box-sizing: border-box;
					border: 2rpx solid #dadada;
					margin-bottom: 20rpx;
				}

				.clsMoney {
					border: 2rpx solid rgba(200, 200, 200, 0);
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/price.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			&-btn {
				height: 100rpx;
				background-image: linear-gradient(90deg,
					#ff6662 0%,
					#ff423e 100%),
					linear-gradient(#ff3632,
					#ff3632);
				border-radius: 50rpx;
				color: #fff;
				font-size: 36rpx;
				line-height: 100rpx;
				text-align: center;
				margin-top: 30rpx;
			}
		}

		// TO-DO提现说明
		.explain {
			padding: 36rpx 38rpx 54rpx 38rpx;

			&-title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				&-border {
					width: 276rpx;
					height: 1px;
					background-color: #d5d5d5;
				}

				&-text {
					font-size: 26rpx;
					color: #555;
				}
			}

			&-cont {
				&-item {
					font-size: 24rpx;
					color: #666;
					line-height: 38rpx;
					padding: 30rpx 0;

					&:nth-last-child(1) {
						padding-bottom: 0;
					}
				}
			}
		}
	}
</style>
