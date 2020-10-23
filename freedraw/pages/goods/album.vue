<template>
	<view class="content">
		<view class="goods">
			<view class="box">
				<view class="goods-box">
					<view class="pic">
						<image :src="goods.pic" mode="aspectFill"></image>
						<image class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/6ffc7318ed734846e259c3b767ec1028.png"
						 mode="aspectFill"></image>
					</view>
					<view class="item">
						<view class="title">{{goods.title}}</view>
						<view class="coupon_volume">
							<view class="coupon">{{goods.coupon_money}}元</view>
							<view class="volume">
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/44ed75fb6be4c489fce5598f92aa97c5.png"
								 mode="aspectFill"></image>
								<view class="text">爆卖{{goods.format_volume}}件</view>
							</view>
						</view>
						<view class="price">
							<view class="tips">到手价¥</view>
							<view class="num">{{goods.endprice}}</view>
							<view class="old">¥{{goods.promotion_price}}</view>
						</view>
					</view>
				</view>
				<view class="btns" @click="getUrl(goods)">马上抢</view>
			</view>
		</view>
		<view class="rec-box">
			<image class="top-bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/f96c2985d6f5d2df373a9af7f027fc5a.png"
			 mode="aspectFill"></image>
			<view class="rec-list">
				<view class="item" v-for="(item,index) in recGoods" :key="index" @click="getUrl(item)">
					<view class="pic">
						<image :src="item.pic" mode="aspectFill"></image>
					</view>
					<view class="bottom_box">
						<view class="title">{{item.title}}</view>
						<view class="price">
							<view class="tips">到手价¥</view>
							<view class="num">{{item.endprice}}</view>
							<view class="old">¥{{item.promotion_price}}</view>
						</view>
						<view class="coupon_volume">
							<view class="coupon">{{item.coupon_money}}元</view>
							<view class="volume">
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/44ed75fb6be4c489fce5598f92aa97c5.png"
								 mode="aspectFill"></image>
								<view class="text">爆卖{{item.format_volume}}件</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	export default {
		data() {
			return {
				iid: 0,
				goods: {
					title: '',
					coupon_money: 0,
					volume: 0,
					endprice: 0,
					promotion_price: 0,
				},
				recGoods: [],
			}
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof option.iid == "string") {
				this.iid = option.iid;
			}
		},
		mounted() {
			this.getGoods();
			this.getRecGoods();
		},
		methods: {
			getGoods() {
				if (this.iid != 0) {
					ajax.get({
						url: 'Goods/detail',
						data: {
							iid: this.iid,
							gtype: 0
						}
					}).then((res) => {
						if (res.data.code == 200) {
							this.goods = res.data.data
						}
					}).catch((error) => {})
				} else {
					uni.showModal({
						title: '提示',
						content: '数据不存在',
						showCancel: false,
						confirmText: "知道了"
					})
				}
			},
			getRecGoods() {
				ajax.get({
					url: 'Goods/similarRec',
					data: {
						iid: this.iid
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.recGoods = res.data.data.list
					}
				}).catch((error) => {})
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
		}
	}
</script>

<style lang="scss" scoped>
	.content {

		.rec-box {
			padding: 20rpx;
			margin-top: 34rpx;
			text-align: center;

			.top-bg {
				width: 230rpx;
				height: 27rpx;

				image {
					width: 230rpx;
					height: 27rpx;
				}
			}

			.rec-list {
				margin-top: 30rpx;

				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;

				.item {
					width: 346rpx;
					background-color: #fff;
					border-radius: 16rpx;

					font-size: 26rpx;
					color: #111111;
					letter-spacing: 0rpx;
					font-family: PingFang-SC-Medium;
					font-weight: normal;
					font-stretch: normal;
					margin-bottom: 18rpx;

					.pic {
						width: 346rpx;
						height: 346rpx;
						border-radius: 16rpx 16rpx 0rpx 0rpx;

						image {
							width: 346rpx;
							height: 346rpx;
							border-radius: 16rpx 16rpx 0rpx 0rpx;

						}
					}

					.bottom_box {
						padding: 20rpx 20rpx 0 20rpx;

						.title {
							text-align: left;
							height: 60rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.coupon_volume {
							height: 40rpx;
							margin: 26rpx 0;
							display: flex;
							align-items: flex-end;

							.coupon {
								width: 95rpx;
								height: 36rpx;
								background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/b1121fe3afeed12736eeaf63e8ffab1c.png');
								background-repeat: no-repeat;
								background-size: 44rpx 40rpx;
								border: 2rpx solid #ff4844;
								border-radius: 10rpx;
								font-size: 22rpx;
								line-height: 40rpx;
								text-align: center;
								color: #ff4844;
								padding-right: 8rpx;
								padding-left: 44rpx;
							}

							.volume {
								width: 164rpx;
								height: 40rpx;
								background-color: #ffeae9;
								border-radius: 8rpx;
								margin-left: 20rpx;

								display: flex;
								justify-content: center;
								align-items: center;

								image {
									width: 20rpx;
									height: 23rpx;
								}

								.text {
									font-size: 20rpx;
									color: #ff4844;
									margin-left: 8rpx;
								}
							}
						}

						.price {
							height: 40rpx;
							color: #ff4844;
							display: flex;
							align-items: baseline;

							.tips {
								font-size: 24rpx;
							}

							.num {
								font-size: 40rpx;
								margin-left: 8rpx;
							}

							.old {
								font-size: 20rpx;
								color: #999999;
								margin-left: 8rpx;
								text-decoration: line-through;
							}
						}

					}
				}
			}
		}

		.goods {
			width: 750rpx;
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/bc8a16bd5563cb1cd978c6ba7100990d.png');
			background-repeat: no-repeat;
			background-size: 750rpx 507rpx;
			padding-top: 223rpx;

			.box {
				width: 710rpx;
				height: 424rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				margin: 0 auto;


				.goods-box {
					padding: 30rpx 27rpx 46rpx 18rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					position: relative;

					.pic {
						width: 220rpx;
						height: 220rpx;
						border-radius: 10rpx;
						position: relative;

						image {
							width: 220rpx;
							height: 220rpx;
							border-radius: 10rpx;
						}

						.icon {
							width: 50rpx;
							height: 59rpx;
							position: absolute;
							top: 0;
							left: 9rpx;
						}
					}

					.item {
						width: 425rpx;
						margin-left: 20rpx;
						font-size: 26rpx;
						color: #111111;
						letter-spacing: 0rpx;
						font-family: PingFang-SC-Medium;
						font-weight: normal;
						font-stretch: normal;


						.title {
							height: 80rpx;
						}

						.coupon_volume {
							height: 40rpx;
							margin: 18rpx 0;
							display: flex;
							align-items: flex-end;

							.coupon {
								width: 95rpx;
								height: 36rpx;
								background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/b1121fe3afeed12736eeaf63e8ffab1c.png');
								background-repeat: no-repeat;
								background-size: 44rpx 40rpx;
								border: 2rpx solid #ff4844;
								border-radius: 10rpx;
								font-size: 22rpx;
								line-height: 40rpx;
								text-align: center;
								color: #ff4844;
								padding-right: 8rpx;
								padding-left: 44rpx;

							}

							.volume {
								width: 164rpx;
								height: 40rpx;
								background-color: #ffeae9;
								border-radius: 8rpx;
								margin-left: 20rpx;

								display: flex;
								justify-content: center;
								align-items: center;

								image {
									width: 20rpx;
									height: 23rpx;
								}

								.text {
									font-size: 20rpx;
									color: #ff4844;
									margin-left: 8rpx;
								}

								// background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/18/15/44ed75fb6be4c489fce5598f92aa97c5.png');
							}
						}

						.price {
							height: 40rpx;
							color: #ff4844;
							display: flex;
							align-items: baseline;

							.tips {
								font-size: 24rpx;
							}

							.num {
								font-size: 40rpx;
								margin-left: 8rpx;
							}

							.old {
								font-size: 20rpx;
								color: #999999;
								margin-left: 8rpx;
								text-decoration: line-through;
							}
						}
					}
				}

				.btns {
					width: 640rpx;
					height: 84rpx;
					line-height: 84rpx;
					margin: 0 auto;
					font-size: 34rpx;
					text-align: center;
					background-image: linear-gradient(90deg,
						#ff5a3c 0%,
						#ff322d 100%),
						linear-gradient(#f84a23,
						#f84a23);
					background-blend-mode: normal,
						normal;
					box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(255, 71, 67, 0.5);
					border-radius: 42rpx;
					letter-spacing: 1rpx;
					color: #ffffff;
					font-weight: 600;

					-webkit-animation: breath 1.2s ease-in-out infinite;
					animation: breath 1.2s ease-in-out infinite;
				}
			}
		}
	}


	@-webkit-keyframes breath {
		0% {
			-webkit-transform: scale(.9)
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}

		30% {
			-webkit-transform: scale(.9);
			transform: scale(.9)
		}

		45% {
			-webkit-transform: scale(1)
		}

		to {
			-webkit-transform: scale(.9)
		}
	}

	@keyframes breath {
		0% {
			-webkit-transform: scale(.9)
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}

		30% {
			-webkit-transform: scale(.9);
			transform: scale(.9)
		}

		45% {
			-webkit-transform: scale(1)
		}

		to {
			-webkit-transform: scale(.9)
		}
	}
</style>
