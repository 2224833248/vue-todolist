<template>
	<view class="tbody">
		<view class="banner"></view>
		<view class="bannerCont">
			<view class="bannerContList">
				<view class="bannerCont-item">
					<view class="imgBox">
						<image :src="goods.pic" mode="aspectFill"></image>
					</view>
					<view class="contRight">
						<view class="title">{{goods.title}}</view>
						<view class="contCent">
							<view class="price"><text class="juan">券</text><text>{{goods.endprice}}元</text></view>
							<view class="centNumber">
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFill"></image><text>爆买{{goods.subsidy}}万件</text>
							</view>
						</view>
						<view class="obtainPrice">
							<view class="price">到手价￥<text>{{goods.promotion_price}}</text></view>
							<view class="priceDelet">￥{{goods.price}}</view>
						</view>
					</view>
				</view>
				<view class="bannerCont-btn" @click="clickFn(goods.goods_type,goods.iid)">
					马上抢
				</view>
			</view>

		</view>
		<view class="cont">
			<view class="cont-title"></view>
			<view class="cont-list">
				<view class="cont-list-item" v-for="(items,indexs) in recGoods" :key = 'indexs' @click="clickFn(items.goods_type,items.num_iid)">
					<view class="lisImgBox">
						<image :src="items.pic" mode="aspectFit"></image>
					</view>
					<view class="listRight">
						<view class="listText">
							{{items.title}}
						</view>
						<view class="listDetailsB">
							<view class="DetailsBottomText">
								到手价￥
								<text class="listBig">{{items.endprice}}</text>
								
							</view>
							<view class="delet">￥{{items.price}}</view>
						</view>
						<view class="listIcon">
							<view class="listIconL" v-if="items.coupon_money>0">
								<text class="juan">券</text>
								<text>{{items.coupon_money}}元</text>
							</view>
							<view class="centNumber">
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
								<text>爆卖{{items.subsidy}}万件</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	
	export default {
		data() {
			return {
				iid:0,
				goods:{pic:'',title:'',endprice:0,subsidy:0,promotion_price:0,price:0},
				recGoods:[],
				banners:[]
			};
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof option.iid == "string") {
				this.iid = option.iid;
				console.log(option.iid)
			}
		},
		mounted() {
			this.getGoods();
			this.getRecGoods();
		},
		methods:{
			// 链接跳转
			clickFn(type,iid){
				uni.navigateTo({
					url:'../listDatails/listDatails?type='+type+'&iid='+iid
				})
			},
			getGoods(){
					console.log(this.iid)
				if (this.iid != 0) {
					// console.log(this.iid)
					ajax.get({
						url: 'Goods/detail',
						data: {
							iid: this.iid,
							gtype: 1
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
			
		}
	}
</script>

<style lang="less">
	.tbody {
		position: relative;

		.banner {
			height: 507rpx;
			width: 100%;
			background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/limit/banner.png)no-repeat;
			background-size: 100% 100%;
		}

		.bannerCont {
			width: 100%;
			position: absolute;
			box-sizing: border-box;
			padding: 0 20rpx;
			top: 223rpx;

			.bannerCont-item {
				padding: 30rpx 18rpx;
				display: flex;

				.imgBox {
					width: 220rpx;
					height: 220rpx;

					image {
						width: 220rpx;
						height: 220rpx;
					}
				}

				.contRight {
					margin-left: 20rpx;
					padding-top: 9rpx;

					.title {
						font-size: 24rpx;
						color: #111;
						margin-right: 8rpx;
						line-height: 36rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 2;
					}

					.contCent {
						display: flex;
						margin-top: 20rpx;

						.price {
							width: 140rpx;
							height: 40rpx;
							border-radius: 8rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 40rpx;

							text {
								font-size: 22rpx;
								color: #ff4844;
							}

							.juan {
								color: #fff;
								margin: 0 20rpx 0 11rpx;
							}
						}

						.centNumber {
							width: 164rpx;
							height: 40rpx;
							background-color: rgba(255, 200, 68, .1);
							border-radius: 8rpx;
							margin-left: 20rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 8rpx;

							image {
								width: 20rpx;
								height: 23rpx;
							}

							text {
								font-size: 20rpx;
								color: #ff4844;
							}
						}
					}

					.obtainPrice {
						display: flex;
						align-items: center;
						padding-top: 20rpx;

						.priceDelet {
							font-size: 20rpx;
							color: #999;
							text-decoration: line-through;
							margin-left: 8rpx;
							margin-top: 10rpx;
						}

						.price {
							font-size: 24rpx;
							color: #ff4844;

							text {
								font-size: 40rpx;
							}
						}
					}
				}
			}

			.bannerContList {
				background: #fff;
				border-radius: 16rpx;
				padding-bottom: 44rpx;
			}

			&-btn {
				text-align: center;
				margin: 0 auto;
				line-height: 84rpx;
				color: #fff;
				font-size: 32rpx;
				width: 640rpx;
				height: 84rpx;
				margin-top: 15rpx;
				background-image: linear-gradient(90deg,
					#ff5a3c 0%,
					#ff322d 100%),
					linear-gradient(#f84a23,
					#f84a23);
				box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(255, 71, 67, 0.5);
				border-radius: 42rpx;
				animation: breath 1.2s ease-in-out infinite;
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
		}

		.cont {
			padding: 30rpx 20rpx;
			padding-top: 170rpx;
			
			&-title {
				width: 320rpx;
				height: 30rpx;
				margin: 0 auto;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/limit/xstj.png)no-repeat;
				background-size: 100% 100%;
			}

			&-list {
				padding-top: 30rpx;
				display: flex;
				flex-wrap: wrap;
				&-item {
					margin-right: 18rpx;
					width: 346rpx;
					background: #fff;
					border-radius: 16rpx;
					margin-bottom: 18rpx;
					&:nth-of-type(2n){
						margin-right: 0;
					}
					.lisImgBox {
						width: 346rpx;
						height: 346rpx;

						image {
							width: 346rpx;
							height: 346rpx;
						}
					}

					.listRight {
						padding: 20rpx 18rpx;

						.listText {
							line-height: 30rpx;
							font-size: 24rpx;
							height: 60rpx;
							color: #111111;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box; //作为弹性伸缩盒子模型显示。
							-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
							-webkit-line-clamp: 2;
						}

						.listDetailsB {
							display: flex;
							padding-top: 10rpx;
							.DetailsBottomText {
								font-size: 22rpx;
								color: #ff4844;

								.listBig {
									font-size: 38rpx;
								}
							}

							.delet {
								font-size: 20rpx;
								color: #999;
								text-decoration: line-through;
								margin-left: 8rpx;
								margin-top: 10rpx;
								text-align: center;
								
							}
						}

						.listIcon {
							padding-top: 30rpx;
							display: flex;
							.listIconL {
								width: 131rpx;
								height: 38rpx;
								background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
								background-size: 100% 100%;

								text {
									color: #ff4844;
									font-size: 22rpx;
								}

								.juan {
									color: #fff;
									margin: 0 20rpx 0 11rpx;
								}
							}

							.centNumber {
								width: 164rpx;
								height: 40rpx;
								background-color: rgba(255, 200, 68, .1);
								border-radius: 8rpx;
								margin-left: 20rpx;
								display: flex;
								align-items: center;
								text-align: center;
								justify-content: center;

								image {
									width: 20rpx;
									height: 23rpx;
									margin-right: 8rpx;
								}

								text {
									font-size: 20rpx;
									color: #ff4844;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
