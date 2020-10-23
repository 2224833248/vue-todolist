<template>
	<view class="parBody">
		<view class="head">
			<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/cancel.png" mode="aspectFit"></image>
			<view class="headText">
				订单已提交成功，请付款
			</view>
		</view>
		<view class="cont">
			<view class="contList">
				<text class="moneyName">原价</text>
				<text class="money">￥{{price}}</text>
			</view>
			<view class="contList">
				<text class="moneyName">折扣价</text>
				<text class="money">￥{{pay_price}}</text>
			</view>
			<view class="contList">
				<text class="moneyName">订单编号</text>
				<text class="money">{{orderFrom}}</text>
			</view>
			<view class="contList">
				<text class="moneyName">需在线支付</text>
				<text class="money">￥{{pay_price}}</text>
			</view>
			<view class="contBottom">
				<view class="bottomLeft">
					<view class="bottomImg">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/zfb.png" mode="aspectFit"></image>
					</view>
					<view class="bottomText">
						<text>支付宝</text>
						<text>官方支付宝收款</text>
					</view>
				</view>
				<view class="bottomRight">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/confirm.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<!-- 立即支付 -->
		<view @click="payBtn" class="bottomBtn">
			立即支付
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	export default {
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数 
			this.orderFrom = option.orderFrom;
			this.price = option.price;
			this.pay_price = option.pay_price;
		},
		data() {
			return {
				orderFrom: 0,
				price: 0,
				pay_price:0
			}
		},
		methods: {
			payBtn() {
				my.tradePay({
					// 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
					tradeNO: this.orderFrom,
					success: (res) => {
						uni.navigateTo({
							url: 'search?orderFrom='+this.orderFrom+'&price='+this.price
						})
					},
					fail: (res) => {
						my.alert({
							content: JSON.stringify(res),
						});
					}
				});
			}
		},
		created() {

		}
	}
</script>

<style lang="less">
	.parBody {
		font-family: PingFangSC-Medium;

		.head {
			width: 100%;
			height: 500rpx;
			background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/bigBg.png)no-repeat;
			background-size: 100% 100%;
			text-align: center;

			image {
				width: 100rpx;
				height: 100rpx;
				margin: 56rpx 0 27rpx 0;
			}

			.headText {
				font-size: 32rpx;
				color: #ffffff;
			}
		}

		.cont {
			position: absolute;
			top: 270rpx;
			left: 30rpx;
			width: 690rpx;
			height: 593rpx;
			box-sizing: border-box;
			padding: 0 30rpx;
			padding-top: 20rpx;
			background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/p__di.png)no-repeat;
			background-size: 100% 100%;

			view {
				display: flex;
				justify-content: space-between;
			}

			.contList {
				height: 90rpx;
				line-height: 90rpx;
				border-bottom: 1px solid rgba(236, 236, 236, 1);

				.money {
					font-size: 30rpx;
					font-weight: bold;
					color: #fa2222;
				}

				.moneyName {
					font-size: 26rpx;
					color: #666;

				}
			}

			.contList:nth-of-type(2) .money {
				color: #07c53d;
			}

			.contList:nth-of-type(3) {
				padding-bottom: 30rpx;
				border-bottom: 1px dashed rgba(236, 236, 236, 1);

				.money {
					color: #333;
				}

			}

			.contList:nth-of-type(4) {
				height: 110rpx;
				line-height: 110rpx;

				.money {
					color: #ef4848;
					font-size: 40rpx;
				}

			}

			.contBottom {
				margin-top: 32rpx;
				display: flex;
				justify-content: space-between;

				.bottomLeft {
					display: flex;
					margin-right: 20rpx;

					.bottomImg {
						image {
							width: 70rpx;
							height: 70rpx;
						}
					}

					.bottomText {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 20rpx;

						text {
							font-size: 32rpx;
							color: #333;
							font-weight: bold;
						}

						text:nth-of-type(2) {
							font-size: 22rpx;
							color: #666;
							font-weight: 500;
						}
					}
				}

				.bottomRight {
					align-items: center;

					image {
						width: 35rpx;
						height: 35rpx;
					}

				}
			}
		}

		.bottomBtn {
			width: 500rpx;
			height: 80rpx;
			background-image: linear-gradient(90deg,
				#fc721c 0%,
				#ef1b5d 100%);
			border-radius: 40rpx;
			margin: 0 auto;
			margin-top: 534rpx;
			color: #fff;
			font-size: 28rpx;
			text-align: center;
			line-height: 80rpx;
		}
	}
</style>
