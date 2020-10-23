<template>
	<view id="Pay" class="page">
		<view class="pay-status">
			<view class="time-icon_title">
				<image class="time_icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/time.png"></image>
				<text class="title">{{detail.statusName}}</text>
			</view>
			<view class="end-time">
				<view v-if="detail.status == -1">订单已失效，请重新下单</view>
				<view v-else-if="detail.status > 0 ">等待发货</view>
				<view v-else>
					还剩
					<text class="times">{{shi}}</text>:
					<text class="times">{{min}}</text>:
					<text class="times">{{miao}}</text>
					自动关闭
				</view>
			</view>
		</view>
		<view class="address-box border-top">
			<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/address.png"></image>
			<view class="text-box" @click="onAddress">
				<view class="name-mobile" v-if="detail.address.length>0">
					<text class="name">{{detail.name}}</text>
					<text class="mobile">{{detail.mobile}}</text>
				</view>
				<text class="address" :class="detail.address==''?'noadd':''">{{detail.address==''?'新建收货地址':detail.address}}</text>
			</view>
		</view>
		<view class="goods-box border-top">
			<view class="seller">
				<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/seller_logo.png"></image>
				<view class="seller-name">
					<text class="title">有惠生活商城</text>
					<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/seller_jt.png"></image>
				</view>
			</view>
			<view class="goods">
				<image class="pic" :src="detail.pic"></image>
				<view class="data-box">
					<view class="title">{{detail.title}}</view>
					<view class="price-num">
						<view class="integral-box">
							<template v-if="detail.money>0">
								<text class="jb">￥</text>
								<text class="money">{{detail.money}}</text>
								<text class="jia">+</text>
							</template>
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jb.png"></image>
							<text class="num">{{detail.integral}}</text>
						</view>
						<!-- <view class="price">
							<text class="biao">x</text>
							<text class="money">{{detail.integral}}</text>
						</view> -->
						<view class="num">
							<text>x1</text>
						</view>
					</view>
					<view class="sku-box">
						<!-- <view class="sku">白色</view>
						<view class="sku">均码</view> -->
					</view>
					<view class="send-time">
						<text>下单后5天内发货</text>
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="service-box border-top">
			<view class="box-list">
				<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/lx.png"></image>
				<text class="title">联系商家</text>
			</view>
			<view class="box-list">
				<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/kf.png"></image>
				<text class="title">官方客服</text>
			</view>
		</view> -->
		<view class="payprice-box border-top">
			<view class="title-money">
				<view class="title">
					<text>待支付</text>
				</view>
				<view class="integral-box">
					<template v-if="detail.money>0">
						<text class="jb">￥</text>
						<text class="money">{{detail.money}}</text>
						<text class="jia">+</text>
					</template>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jb.png"></image>
					<text class="num">{{detail.integral}}</text>
				</view>
				<!-- <view class="money">
					<text class="biao">x</text>
					<text class="num">{{detail.integral}}</text>
				</view> -->
			</view>
			<view class="send-money">
				<view class="send">
					<text>订单运费</text>
				</view>
				<view class="money">
					<text>包邮</text>
				</view>
			</view>
		</view>
		<view class="order-box border-top">
			<view class="title">
				<text>详细信息</text>
			</view>
			<view class="list">
				<view class="title">
					<text>订单编号</text>
				</view>
				<view class="item">
					<text>{{detail.id}}</text>
				</view>
			</view>
			<view class="list">
				<view class="title">
					<text>下单时间</text>
				</view>
				<view class="item">
					<text>{{detail.addtime|dateFtt()}}</text>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn-class modifyAddress" @click="onAddress" v-if="detail.status>1">
				<text>修改地址</text>
			</view>
			<view class="btn-class cancelOrder" @click="cancelOrder" v-if="detail.status==0">
				<text>取消订单</text>
			</view>
			<view class="btn-class goPay" @click="goPay" v-if="detail.status==0">
				<text>立即支付</text>
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
		data() {
			return {
				type: 'success',
				message: '',
				canReset: false,
				id: 0,
				shi: '00',
				min: '00',
				miao: '00',
				detail: {
					addtime: 0
				}
			}
		},
		components: {
			uniPopupMessage
		},
		onLoad: function(option) {
			this.id = option.id;
			this.getDetail();
		},
		onShow() {
			this.canReset && this.getDetail()
			this.canReset = true
		},
		methods: {
			onAddress() {
				if (this.detail.status > 1) {
					return;
				}
				uni.navigateTo({
					url: '/pages/address/list?id=' + this.id
				})
			},
			cancelOrder() {
				ajax.post({
					url: 'gift/cancelOrder',
					data: {
						id: this.detail.id
					},
					login: false,
				}).then(ret => {
					if (ret.data.code == 200) {
						this.type = 'success';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
						this.detail.status = -1;
						this.detail.statusName = '已失效';
					} else {
						this.type = 'error';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
					}
				})
			},
			goPay() {
				if (this.detail.address == '') {
					this.type = 'error';
					this.message = '请选择收货地址';
					this.$refs.messagePopup.open()
				} else {
					if (this.detail.money > 0) {
						if (this.detail.alipay_num == '') {
							ajax.post({
								url: 'gift/aliPayInfo',
								data: {
									id: this.detail.id,
								},
								login: true,
							}).then(ret => {
								if (ret.data.code == 200) {
									this.detail.alipay_num = ret.data.data;
									this.goPays(this.detail.alipay_num);
								} else {
									this.type = 'error';
									this.message = ret.data.msg;
									this.$refs.messagePopup.open()
								}
							})
						} else {
							this.goPays(this.detail.alipay_num);
						}
					} else {
						this.payOrder();
					}
				}
			},
			goPays(alipay_num) {
				my.tradePay({
					tradeNO: alipay_num,
					success: (res) => {
						if (res.resultCode == 9000) {
							this.payOrder();
						} else {
							this.type = 'error';
							this.message = '支付错误,请重试';
							this.$refs.messagePopup.open()
						}
					},
					fail: (res) => {
						this.type = 'error';
						this.message = '支付错误,请重试';
						this.$refs.messagePopup.open()
					}
				});
			},
			payOrder() {
				ajax.post({
					url: 'gift/payOrder',
					data: {
						id: this.detail.id
					},
					login: true,
				}).then(ret => {
					if (ret.data.code == 200) {
						this.type = 'success';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
						this.detail.status = 1;
						this.detail.statusName = '已支付';
						ajax.login2();
					} else {
						this.type = 'error';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
					}
				})
			},

			getDetail() {
				ajax.get({
					url: 'gift/getOrder',
					data: {
						id: this.id
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
					} else {
						this.type = 'error';
						this.message = res.data.msg;
						this.$refs.messagePopup.open()
					}
				}).catch((error) => {})
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			}
		},
		filters: {
			dateFtt(val) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', val);
			},
		},
		mounted() {

			var interval = setInterval(() => {
				if (this.detail.status == 0 && this.detail.pay_endtime > 0) {
					let modulo = this.detail.pay_endtime--;
					let hours = Math.floor(modulo / (60 * 60));
					modulo = modulo % (60 * 60);
					let minutes = Math.floor(modulo / 60);
					let seconds = modulo % 60;

					this.shi = this.timeFormat(hours);
					this.min = this.timeFormat(minutes);
					this.miao = this.timeFormat(seconds);
				} else {
					if (this.detail.status == 0 && this.detail.pay_endtime == 0) {
						this.detail.status = -1;
						this.detail.statusName = '已失效';
					}
					this.shi = '00';
					this.min = '00';
					this.miao = '00';
					clearInterval(interval);
				}
			}, 1000)
		},
	}
</script>
<style lang="scss" scoped>
	.border-top {
		border-top: 18rpx #f5f5f5 solid;
	}

	.btn-box {
		padding: 32rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		text-align: center;

		.btn-class {
			width: 190rpx;
			height: 68rpx;
			line-height: 68rpx;
			font-size: 28rpx;
			border-radius: 34rpx;
			color: #888888;
			border: solid 2rpx #e0e0e0;
			margin-left: 14rpx;
		}

		.modifyAddress {}

		.cancelOrder {}

		.goPay {
			background-image: linear-gradient(90deg,
				#fb9400 0%,
				#ff4f02 100%),
				linear-gradient(#111111,
				#111111);
			background-blend-mode: normal,
				normal;
			color: #ffffff;
		}
	}



	.order-box {
		border-bottom: 2px #f5f5f5 solid;
		min-height: 200rpx;
		padding: 38rpx 32rpx 0rpx 32rpx;

		>.title {
			height: 26rpx;
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 21rpx;
			letter-spacing: -1rpx;
			color: #000000;
			margin-bottom: 45rpx;
		}

		.list {
			height: 25rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			font-family: PingFang-SC-Medium;
			font-size: 26rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 25rpx;
			margin-bottom: 26rpx;

			.title {
				letter-spacing: 0rpx;
				color: #777777;
			}

			.item {
				letter-spacing: 1rpx;
				color: #666666;
			}
		}
	}

	.payprice-box {
		height: 80rpx;
		padding: 45rpx 32rpx;

		.title-money {
			height: 26rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: -1rpx;
				color: #000000;
			}

			.integral-box {
				color: #fb8201;

				.jb {
					font-size: 27rpx;
				}

				.money {
					font-size: 39rpx;
					letter-spacing: -1rpx;
				}

				.jia {
					font-size: 32rpx;
					color: #999999;
				}

				image {
					width: 28rpx;
					height: 23rpx;
				}

				.num {
					font-size: 27rpx;
				}
			}

			// .money {
			// 	font-family: PingFang-SC-Bold;
			// 	font-weight: normal;
			// 	font-stretch: normal;
			// 	letter-spacing: 0rpx;
			// 	color: #ff5002;

			// 	.biao {
			// 		font-size: 24rpx;
			// 	}

			// 	.num {
			// 		font-size: 32rpx;
			// 	}
			// }
		}

		.send-money {
			margin-top: 30rpx;
			height: 25rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-family: PingFang-SC-Medium;
			font-size: 26rpx;
			line-height: 25rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 0rpx;

			.send {
				color: #777777;
			}

			.money {
				color: #000000;
			}
		}
	}

	.service-box {
		height: 74rpx;
		display: flex;
		padding: 18rpx 0;

		.box-list {
			width: 375rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.icon {
				width: 30rpx;
				height: 30rpx;
			}

			.title {
				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: -1rpx;
				color: #000000;
				margin-left: 16rpx;
			}
		}

		.box-list:last-child {
			border-left: #f5f5f5 solid 2rpx;
		}
	}

	.goods-box {
		width: 686rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		padding: 26rpx 32rpx;

		.seller {
			width: 686rpx;
			display: flex;
			align-items: center;

			>.icon {
				width: 50rpx;
				height: 50rpx;
			}

			.seller-name {
				margin-left: 11rpx;

				.title {
					height: 25rpx;
					font-family: PingFang-SC-Medium;
					font-size: 26rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 25rpx;
					letter-spacing: 0rpx;
					color: #5e5e5e;
				}

				.icon {
					width: 10rpx;
					height: 18rpx;
					margin-left: 8rpx;
				}
			}

		}

		.goods {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;

			.pic {
				width: 180rpx;
				height: 180rpx;
				border-radius: 10rpx;
			}

			.data-box {
				width: 488rpx;
				margin-left: 18rpx;

				.title {
					height: 28rpx;
					font-family: PingFang-SC-Medium;
					font-size: 28rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 28rpx;
					letter-spacing: 0rpx;
					color: #000000;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.price-num {
					display: flex;
					justify-content: space-between;
					margin-top: 17rpx;
					color: #fb8201;

					.integral-box {

						.jb {
							font-size: 27rpx;
						}

						.money {
							font-size: 39rpx;
							letter-spacing: -1rpx;
						}

						.jia {
							font-size: 32rpx;
							color: #999999;
						}

						image {
							width: 28rpx;
							height: 23rpx;
						}

						.num {
							font-size: 27rpx;
						}
					}

					.price {
						.biao {
							height: 30rpx;
							font-family: PingFang-SC-Medium;
							font-size: 24rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 30rpx;
							letter-spacing: 0rpx;
							color: #000000;
						}

						.money {
							height: 30rpx;
							font-family: PingFang-SC-Medium;
							font-size: 30rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 30rpx;
							letter-spacing: 0rpx;
							color: #000000;
						}
					}

					.num {
						height: 50rpx;
						font-family: PingFang-SC-Medium;
						font-size: 30rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 50rpx;
						letter-spacing: 0rpx;
						color: #fb8201;
					}
				}

				.sku-box {
					display: flex;
					height: 28rpx;
					text-align: center;
					margin-top: 17rpx;

					.sku {
						width: 64rpx;
						height: 28rpx;
						background-color: #f2f2f2;
						border-radius: 6rpx;
						font-family: PingFang-SC-Medium;
						font-size: 23rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 28rpx;
						letter-spacing: 0rpx;
						color: #999999;
						margin-right: 16rpx;

					}
				}

				.send-time {
					height: 23rpx;
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 21rpx;
					letter-spacing: 0rpx;
					color: #666666;
					margin-top: 20rpx;
				}
			}
		}

	}

	.address-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 92rpx;
		background-color: #ffffff;

		padding: 36rpx 32rpx;

		.icon {
			width: 28rpx;
			height: 32rpx;
		}

		.text-box {
			width: 638rpx;
			margin-left: 22rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;

			.name-mobile {
				.name {
					height: 30rpx;
					font-family: PingFang-SC-Medium;
					font-size: 32rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 30rpx;
					letter-spacing: 1rpx;
					color: #000000;
				}

				.mobile {
					height: 18rpx;
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 18rpx;
					letter-spacing: 0rpx;
					color: #595959;
					margin-left: 21rpx;
				}
			}

			.address {
				font-family: PingFang-SC-Medium;
				font-size: 24rpx;
				white-space: nowrap;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				color: #000000;
				margin-top: 20rpx;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.noadd {
				margin-top: 0rpx;
			}
		}
	}

	.pay-status {
		width: 686rpx;
		height: 94rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/pay_bg.png);
		background-repeat: no-repeat;
		background-size: 100%;
		padding: 53rpx 32rpx;

		.time-icon_title {
			display: flex;
			align-items: center;

			.time_icon {
				width: 31rpx;
				height: 31rpx;
			}

			.title {
				height: 33rpx;
				font-family: PingFang-SC-Medium;
				font-size: 35rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 33rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
				margin-left: 10rpx;
			}
		}

		.end-time {
			height: 32rpx;
			font-family: PingFang-SC-Medium;
			font-size: 24rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 32rpx;
			letter-spacing: 1rpx;
			color: #ffffff;
			margin-top: 28rpx;

			.times {
				width: 32rpx;
				height: 32rpx;
				background-color: #ffffff;
				border-radius: 4rpx;
				margin: 0 10rpx;
				padding: 0 5rpx;
				text-align: center;

				font-family: PingFang-SC-Bold;
				font-size: 24rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 32rpx;
				letter-spacing: 0rpx;
				color: #00b578;
			}
		}
	}
</style>
