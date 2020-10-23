<template>
	<view class="banner_box">
		<view class="top_bc_img">

		</view>
		<view class="bto_content_box">
			<view class="hot_good_box">
				<view class="top_title_box">
					<image class="hot_icon" src="../../static/freedraw/banner/fire.png" mode="aspectFit"></image>
					<view class="hot_title">
						活动热门榜
					</view>
				</view>
				<view class="hot_good_lists">
					<view class="hot_good_item" v-for="(item,index) in hotList.list" :key="index" @click="getUrl(item)">
						<view class="left_good_img">
							<image class="good_img" :src="item.pic" mode="aspectFit"></image>
							<image class="index_icon" :src="(index == 0 ? '../../static/freedraw/banner/fir.png' : index == 1 ? '../../static/freedraw/banner/sec_new.png' : '../../static/freedraw/banner/thrid.png')"
							 mode="aspectFit"></image>
						</view>
						<view class="right_good_text">
							<view class="good_name_shop">
								<text class="shop_name">{{item.nick}}</text>
								<text class="good_name">{{item.title}}</text>
							</view>
							<view class="juan">
								<image class="imgJuan" src="/static/freedraw/icon/juan.png" mode="aspectFill"></image>
								<view class="text">{{item.coupon_money}}元</view>
							</view>
							<view class="good_price">
								<view class="good_price_text">
									到手约:<text class="real_price">￥{{item.endprice}}</text><text class="origin_price">￥{{item.promotion_price}}</text>
								</view>
							</view>
							<view class="volume_btn">
								<view class="volume">
									月销售量<text class="volume_num">{{item.day_volume}}</text>件
								</view>
								<view class="buy_btn">
									立即抢
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="recommend_goods">
				<view class="recommend_title">
					推荐 <image class="title_dz" src="../../static/freedraw/banner/thumbs-up.png" mode="aspectFit"></image> 好货
				</view>

				<view class="tabCont">
					<view class="tabCont-item" v-for="(item,index) in recommend" @click="getUrl(item)">
						<image :src="item.pic" mode="widthFix"></image>
						<view class="tabCont-bottom">
							<view class="title">
								{{item.title}}
							</view>
							<view class="price">
								<view class="priceLeft"><text>￥</text>{{item.endprice}}</view>
								<view class="juan">
									<image class="imgJuan" src="/static/freedraw/icon/juan.png" mode="aspectFill"></image>
									<view class="text">{{item.coupon_money}}元</view>
								</view>
							</view>
							<view class="overPrice">
								<view class="overPrice-left">￥{{item.price}}</view>
								<view class="overPrice-right">已抢{{item.format_volume}}件</view>
							</view>
						</view>
					</view>
					<loading v-if="!noData && load" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				</view>
			</view>
		</view>
		<load v-if="loading"></load>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import load from '../../components/load/load.vue'
	import utils from '../../utils/utils.js'
	let clickLock = false
	export default {
		components:{
			load
		},
		onLoad(option) {
			this.albumId = option.albumId
			this.getRecommend()
		},
		components: {
			load,
		},
		data() {
			return {
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				load: false,

				albumId: '',
				recommend: [],
				hotList:[],
				paging:1,
				loading:true,
				loadTime:0
			}
		},
		mounted() {
			// 加载loading
			let time = setInterval(() =>{
				if(this.loadTime >= 1){
					this.loading = false
					clearInterval(time)
				}
			},10)
			this.gethotList()
		},
		methods: {
			// 跳转
			getUrl(e) {
				if(clickLock)return;
				clickLock = true
				setInterval(()=> {
					clickLock = false
				},3000);
				ajax.get({
					url: 'SaveMoneyShop/getUrl',
					data: {
						iid: e.num_iid,
						gtype: e.goods_type,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(encodeURIComponent(res.data.data.url)))
						});
					}
				}).catch((error) => {})
			},
			// 热门榜
			gethotList(){
				ajax.get({
					url:'SaveMoneyShop/getHotGoodsList',
					data:{
						albumId:this.albumId
					}
				}).then(res =>{
					if(res.data.code == 200){
						this.hotList = res.data.data
					}
				}).catch(err =>{})
			},
			// 推荐好货
			getRecommend() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'SaveMoneyShop/getGoodRecommendList',
					data: {
						albumId: this.albumId,
						page:this.paging
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach(item => {
							this.recommend.push(item)
						})
						if (res.data.data.list) {
							this.paging++
						} else {
							if (this.paging == 1 && res.data.data.list.length == 0) {
								this.noMoreData = true
								this.noData = true
							} else {
								this.noMoreData = true
							}
						}
					}
				this.loadingMore = false;
				}).catch(err => {
					this.loadingMore = false;
				})
				this.loadTime++;
			}
		},
		
		onReachBottom() {
			this.getRecommend()
		}
	}
</script>

<style lang="less" scoped>
	image{
		display: block;
	}
	.top_bc_img {
		width: 100%;
		height: 695rpx;
		background-image: url(../../static/freedraw/banner/banner_top_bc.png);
		background-size: 100%;
	}

	.bto_content_box {
		margin-top: -180rpx;
		padding: 0 28rpx;
	}

	.hot_good_box {
		background: #FFFFFF;
		border-radius: 14rpx;

		.top_title_box {
			background: linear-gradient(90deg, #FF5258 0%, #FC684C 100%);
			border-radius: 14rpx 14rpx 0rpx 0rpx;
			display: flex;
			align-items: center;
			padding: 19rpx 0 18rpx 24rpx;

			.hot_icon {
				width: 25rpx;
				height: 33rpx;
				margin-right: 16rpx;
			}

			.hot_title {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
			}
		}

		.hot_good_lists {
			padding: 20rpx;
			box-sizing: border-box;

			.hot_good_item {
				border-radius: 4rpx;
				overflow: hidden;
				display: flex;
				margin: 0 0 41rpx 0;

				.left_good_img {
					position: relative;
					margin: 0 21rpx 0 0;

					.good_img {
						display: block;
						width: 200rpx;
						height: 200rpx;
						border-radius:4rpx;
						flex-shrink: 0;
					}

					.index_icon {
						position: absolute;
						top: -2rpx;
						left: -2rpx;
						display: block;
						width: 34rpx;
						height: 37rpx;
					}
				}

				.right_good_text {
					flex: 1;
					.good_name_shop {
						display: flex;
						align-items: center;

						.shop_name {
							background: #FFE4D2;
							border-radius: 13rpx;

							font-size: 18rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #B9845E;
							margin: 0 6rpx 0 0;
							box-sizing: border-box;
							padding: 6rpx 13rpx;
						}

						.good_name {
							flex: 6;
							height: 28rpx;
							font-size: 26rpx;
							line-height: 30rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #343434;
							// overflow: hidden;
							// text-overflow:ellipsis;
							// white-space: nowrap;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}
					}
					
					.juan {
						margin-top: 20rpx;
						width: 133rpx;
						height: 34rpx;
						border-radius: 4rpx;
						display: flex;
						overflow: hidden; 	
					
						.imgJuan {
							width: 44rpx;
							height: 34rpx !important;
							flex-shrink: 0;
						}
					
						.text {
							flex: 1;
							text-align: center;
							font-size: 20rpx;
							font-weight: 400;
							color: #F84A23;
							line-height: 34rpx;
							border: 2rpx solid #F84A23;
							border-left: none;
							border-radius: 0 4rpx 4rpx 0;
						}
					}
					.coupon {
						position: relative;
						display: inline-block;
						margin: 16rpx 0 0 0;

						.coupon_img {
							display: block;
							width: 133rpx;
							height: 34rpx;
						}

						.coupon_price {
							position: absolute;
							z-index: 10;
							right: 7%;
							top: 20%;
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #F84A24;
						}
					}

					.good_price {
						margin: 10rpx 0 12rpx 0;

						.good_price_text {
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #9A9A9A;

							.real_price {
								font-size: 28rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: #FF2C32;
								margin-right: 8rpx;
							}

							.origin_price {
								position: relative;
							}

							.origin_price::after {
								display: block;
								content: '';
								position: absolute;
								width: 100%;
								height: 0;
								border-top: 2rpx solid #9A9A9A;
								top: 50%;
								left: 0;
							}
						}
					}

					.volume_btn {
						display: flex;

						.volume {
							flex: 7;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #5C381A;

							background: #FFEDE5;
							border-radius: 0 27rpx 27rpx 0;
							padding: 16rpx 0;
							padding-left: 20rpx;

							.volume_num {
								color: #FE5E52;
							}
						}

						.buy_btn {
							position: relative;
							left: -20rpx;
							flex: 4;
							text-align: center;
							// background: linear-gradient(90deg, #FF5258 0%, #FC684C 100%);
							background: linear-gradient(90deg, #FF5258 0%, #FC684C 100%);
							border-radius: 0 30rpx 30rpx 0;
							padding: 16rpx 0;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #FFFFFF;
						}

						.buy_btn::after {
							display: block;
							content: "";
							position: absolute;
							width: 0;
							height: 0;
							left: 0;
							top: 0;


							border-color: transparent;
							border-left: 30rpx solid #FFEDE5;
							border-bottom: 60rpx solid transparent;
						}
					}
				}
			}

			.hot_good_item:last-child {
				margin-bottom: 0;
			}
		}
	}

	.recommend_goods {
		text-align: center;
		padding: 29rpx 0 0 0;

		.recommend_title {
			display: inline-block;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #343434;
			margin-bottom: 29rpx;

			.title_dz {
				display: inline-block;
				width: 32rpx;
				height: 33rpx;
				margin: 0 8rpx;
			}
		}
	}

	.tabCont {
		display: flex;
		flex-wrap: wrap;

		&-item {
			width: 336rpx;
			margin: 0 16rpx 16rpx 0;
			border-radius: 12rpx;
			overflow: hidden;
			background: #fff;

			&:nth-of-type(2n+0) {
				margin-right: 0;
			}

			image {
				width: 336rpx;
				height: 336rpx;
			}

			.tabCont-bottom {
				padding: 0 20rpx 24rpx;

				.title {
					padding-top: 26rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2;
					text-align: left;
					min-height: 56rpx;
				}

				.price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 22rpx;

					.priceLeft {
						font-size: 32rpx;
						color: #F84A23;

						text {
							font-size: 24rpx;
						}
					}

					.juan {
						width: 133rpx;
						height: 34rpx;
						border-radius: 4rpx;
						display: flex;
						overflow: hidden;

						.imgJuan {
							width: 44rpx;
							height: 34rpx!important;
						}

						.text {
							flex: 1;
							text-align: center;
							font-size: 20rpx;
							font-weight: 400;
							color: #F84A23;
							line-height: 34rpx;
							border: 2rpx solid #F84A23;
							border-left: none;
							border-radius: 0 4rpx 4rpx 0;
						}
					}
				}

				.overPrice {
					padding-top: 16rpx;
					display: flex;
					justify-content: space-between;

					&-left {

						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
						text-decoration: line-through;
					}

					&-right {
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}

		}
	}
</style>
