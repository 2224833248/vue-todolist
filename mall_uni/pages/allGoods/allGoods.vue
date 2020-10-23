<template>
	<view class="tBody">
		<!-- TO-DO店铺 -->
		<view class="theStore">
			<view class="storeTop">
				<view class="storeName">
					<view class="imgBox">
						<image :src="datail.seller_logo" mode="aspectFit"></image>
					</view>
					<view class="iconBox">
						<text>{{datail.nick}}</text>
						<view class="iconLis">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/iconLis.png" mode="aspectFit"></image>
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/iconLis.png" mode="aspectFit"></image>
						</view>
					</view>
				</view>

				<view class="storeBtn">
					<view class="intoShop" @click="sellerHander">进店逛逛</view>
				</view>
			</view>
			<view class="dscribe">
				<view class="dscribeList">
					<text>宝贝描述{{datail.describe_score}}</text>
					<text class="gao" :style="cowryStyle">{{cowry}}</text>
				</view>
				<view class="dscribeList">
					<text>卖家服务{{datail.service_score}}</text>
					<text class="gao" :style="serveStyle">{{serve}}</text>
				</view>
				<view class="dscribeList">
					<text>物流服务{{datail.logistics_score}}</text>
					<text class="gao" :style="logisticsStyle">{{logistics}}</text>
				</view>
			</view>
		</view>



		<!-- TO-DO 商品详情 -->
		<view class="goodsDatails">
			<view class="goodsDatailsBox">
				<view class="dataLis" v-for="(xItem,xIndex) in allGoods.list" :key='xIndex' @click="datails(xItem)">
					<view class="imagBoxLis">
						<image :src="xItem.pic" mode="aspectFit"></image>
					</view>
					<view class="dataLisCont">
						<view class="text">
							{{xItem.title}}
						</view>
						<view class="price">
							<view class="priceNum">到手价￥<text>{{xItem.endprice}}</text></view>
							<view class="pricNum">
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
								<view class="text" style="display: inline-block;">爆卖<text>{{xItem.format_volume}}</text>件</view>
							</view>
						</view>
						<view class="priceBtn">
							<view class="volume" v-if="xItem.coupon_money >0">
								<text class="juan">券</text>
								<text>{{xItem.coupon_money}}元</text>
							</view>
							<view class="pricNum">
								<text>返{{user.is_team==1?Number(xItem.up_money_fraction):Number(xItem.user_money_fraction)}}集分宝</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	let toNavas = false
	import $axios from '../../utils/ajax.js'
	export default {
		onLoad: function(option) {
			if(typeof option.relationId !== "undefined") this.relationId = option.relationId
			this.option = option.datail;
		},
		data() {
			return {
				option: '',
				// option: {
				// 	iid: 0,
				// 	gtype: 0,
				// 	sellerId: 0,
				// },
				datail: {},
				allGoods: [],
				cowry: '',
				cowryStyle: '',
				serve: '',
				serveStyle: '',
				logistics: '',
				logisticsStyle: '',
				relationId: '',
			};
		},
		mounted() {
			this.getDatails();
		},
		methods: {
			sellerHander() {
				this.postSellerUrl()
			},
			// 商品详情
			getDatails() {
				this.datail = JSON.parse(this.option);
				this.getAllGoods()
				if (this.datail.describe_highgap == 1) {
					this.cowry = '高'
					this.cowryStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
				} else if (this.datail.describe_highgap == 0) {
					this.cowry = '平'
					this.cowryStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
				} else if (this.datail.describe_highgap == -1) {
					this.cowry = '低'
					this.cowryStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
				}
				if (this.datail.service_highgap == 1) {
					this.serve = '高'
					this.serveStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
				} else if (this.datail.service_highgap == 0) {
					this.serve = '平'
					this.serveStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
				} else if (this.datail.service_highgap == -1) {
					this.serve = '低'
					this.serveStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
				}

				if (this.datail.logistics_highgap == 1) {
					this.logistics = '高'
					this.logisticsStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
				} else if (this.datail.logistics_highgap == 0) {
					this.logistics = '平'
					this.logisticsStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
				} else if (this.datail.logistics_highgap == -1) {
					this.logistics = '低'
					this.logisticsStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
				}
			},
			// 点击跳转详情页面
			datails(item) {
				if (toNavas) {
					return
				}
				toNavas = true
				setTimeout(() => {
					toNavas = false
				}, 500)
				let url = '../listDatails/listDatails?iid=' + item.num_iid + '&type=' + item.goods_type
				if(this.relationId){
					url += "&relationId="+this.relationId
				}
				uni.navigateTo({
					url: url
				})
			},
			// 获取店铺链接
			postSellerUrl() {
				$axios.post({
					url: 'Goods/sellerUrl',
					data: {
						sellerId: this.datail.seller_id
					}
				}).then(res => {
					if (res.data.code == 200) {
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(encodeURIComponent(res.data.data.url))),
						});
					}
				}).catch(err => {

				})
			},
			getAllGoods() {
				$axios.get({
					url: 'Goods/getList',
					data: {
						sellerId: this.datail.seller_id
					}
				}).then((res) => {
					console.log(res)
					if (res.data.code == 200) {
						this.allGoods = res.data.data
					}
				}).catch((err) => {

				})
			}
		},
		//获取用户信息
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: ''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
				console.log(this.$store.state.user)
			},
		}
	}
</script>

<style lang="less">
	@red: #fd424d;

	.tBody {
		.theStore {
			width: 100%;
			margin-top: 18rpx;
			padding: 22rpx 28rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			background: #fff;

			.storeTop {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.storeName {
					display: flex;

					.imgBox {
						image {
							width: 95rpx;
							height: 95rpx;
						}
					}

					.iconBox {
						padding: 12rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						text {
							font-size: 30rpx;
							color: #000;
						}

						.iconLis {
							image {
								width: 25rpx;
								height: 25rpx;
								margin-right: 5rpx;
							}
						}
					}
				}

				.storeBtn {
					display: flex;

					view {
						width: 130rpx;
						// height: 50rpx;
						border-radius: 25rpx;
						box-sizing: border-box;
						text-align: center;
						line-height: 50rpx;
						font-size: 24rpx;
					}

					.intoShop {
						border: solid 1rpx @red;
						color: @red;
						margin-right: 5rpx;
					}

					.allGoods {
						color: #fff;
						background-image: linear-gradient(90deg,
							#ff6662 0%,
							#ff423e 100%),
							linear-gradient(#ff4666,
							#ff4666);
					}
				}
			}

			.dscribe {
				display: flex;
				justify-content: space-between;
				padding-top: 25rpx;

				.dscribeList {
					display: flex;
					align-items: center;

					text {
						font-size: 22rpx;
						color: #999;

					}

					.gao {
						margin-left: 5rpx;
						color: #ff4052;
						background-color: #ffdde0;
						display: inline-block;
						font-size: 18rpx;
						width: 28rpx;
						line-height: 28rpx;
						text-align: center;
						border-radius: 50%;
						overflow: hidden;
					}
				}
			}
		}

		// TO-DO 评价
		.evaluation {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 28rpx 40rpx 20rpx 20rpx;
			margin-top: 18rpx;

			.evaluationTop {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.evalLeft {
					display: flex;

					.border {
						margin-right: 10rpx;
						width: 6rpx;
						height: 32rpx;
						background-image: linear-gradient(0deg,
							#ffaeac 0%,
							#ff423e 100%),
							linear-gradient(#ff4844,
							#ff4844);
						background-blend-mode: normal,
							normal;
						border-radius: 3rpx;
					}

					text {
						font-size: 28rpx;
						color: #111;
					}
				}

				.evalRight {
					text {
						color: @red;
						font-size: 22rpx;
						margin-right: 10rpx;
					}

					image {
						width: 8rpx;
						height: 16rpx;
					}
				}
			}

			.labelCont {
				padding-top: 30rpx;
				display: flex;

				.labelLis {
					margin: 0 12rpx;
					padding: 0 38rpx;
					height: 60rpx;
					font-size: 26rpx;
					line-height: 60rpx;
					color: #444;
					background-color: #ffeded;
					border-radius: 30rpx;
				}
			}

			.evalList {
				padding: 0 15rpx;

				.evalUser {
					display: flex;
					align-items: center;
					padding-top: 20rpx;

					image {
						width: 44rpx;
						height: 44rpx;
					}

					text {
						font-size: 24rpx;
						color: #888;
						margin-left: 10rpx;
					}
				}

				.userText {
					margin-top: 25rpx;
					font-size: 24rpx;
					color: #333;
					line-height: 40rpx;
				}
			}
		}

		// TO-DO 商品详情
		.goodsDatails {
			margin-top: 18rpx;
			padding-bottom: 120rpx;

			.goodsTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 90rpx;
				box-sizing: border-box;
				padding: 0 38rpx 0 20rpx;
				background-color: #ffffff;
				border-radius: 16rpx;

				.evalLeft {
					display: flex;

					.border {
						margin-right: 10rpx;
						width: 6rpx;
						height: 32rpx;
						background-image: linear-gradient(0deg,
							#ffaeac 0%,
							#ff423e 100%),
							linear-gradient(#ff4844,
							#ff4844);
						background-blend-mode: normal,
							normal;
						border-radius: 3rpx;
					}

					text {
						font-size: 28rpx;
						color: #111;
					}
				}

				.evalRight {
					text {
						color: #666;
						font-size: 22rpx;
						margin-right: 10rpx;
					}

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}
			}

			.imagBox {
				padding-top: 33rpx;
				width: 100%;
				text-align: center;

				image {
					width: 199rpx;
					height: 29rpx;
				}
			}

			.goodsDatailsBox {
				padding: 0 20rpx;
				// padding-top: 30rpx;
				display: flex;
				flex-wrap: wrap;

				.dataLis {
					width: 346rpx;
					border-radius: 16rpx;
					margin-right: 18rpx;
					margin-bottom: 22rpx;
					background: #fff;
					overflow: hidden;

					&:nth-of-type(2n) {
						margin-right: 0;
					}

					.imagBoxLis {
						image {
							width: 346rpx;
							height: 346rpx;
						}
					}

					.dataLisCont {
						padding: 20rpx 18rpx;

						.text {
							font-size: 24rpx;
							color: #111;
							margin-right: 8rpx;
							line-height: 36rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box; //作为弹性伸缩盒子模型显示。
							-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
							-webkit-line-clamp: 1;
						}

						.price {
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding-top: 20rpx;

							.priceNum {
								color: #ff4844;
								font-size: 20rpx;

								text {
									font-size: 32rpx;
								}
							}

							.pricNum {
								height: 38rpx;
								height: 38rpx;
								display: flex;
								align-items: center;
								border-radius: 8rpx;

								image {
									width: 19rpx;
									height: 22rpx;
									margin: 0 5rpx 0 0;
								}

								.text {
									font-size: 20rpx;
									color: #888888;
									margin-top: 5rpx;

									text {
										color: #FF4844;
									}
								}
							}
						}

						.priceBtn {
							padding-top: 30rpx;
							display: flex;
							justify-content: space-between;

							.volume {
								width: 130rpx;
								height: 38rpx;
								display: flex;
								align-items: center;
								// justify-content: center;
								background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
								background-size: 100% 100%;
								line-height: 38rpx;
								position: relative;

								text {
									font-size: 20rpx;
									color: #ff4844;
									margin-left: 50%;
								}

								.juan {
									color: #fff;
									position: absolute;
									left: 10rpx;
									top: 40%;
									margin: 0;
									transform: translateY(-50%);
								}

							}

							.pricNum {
								height: 38rpx;
								width: 157rpx;
								height: 38rpx;
								display: flex;
								align-items: center;
								background-color: rgba(255, 200, 68, 0.12);
								border-radius: 8rpx;
								text-align: center;
								justify-content: center;

								text {
									font-size: 20rpx;
									color: #FF3A00;
									margin-top: 5rpx;
								}
							}
						}
					}
				}
			}

		}

	}
</style>
