<template>
	<view class="tBody">
		<view class="banner" :style="{'background-image':'url('+album.img+')'}"></view>

		<view class="scorllBox" :style="{height:tabBox?'60rpx':'90rpx'}">
			<view class="tabBox" :style="{'top':!tabBox?'':(STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px')}" :class="{tabTops:tabBox,contList:tabBox}">
				<view class="cat-box">
					<scroll-view class="scroll-view-cat" scroll-x="true" :scroll-left="scrollLeft" :show-scrollbar="true">
						<view class="list" v-for="(item,index) in album.cat" :key="index" @click="ckCid(item,index)">
							<view class="cat" :class="item.cid==cid?'active':''">{{item.title}}</view>
						</view>
					</scroll-view>
					<view class="cat-icon" @click="ckShowCat">
						<view class="icons"></view>
						<image :class="isDowCat?'active':''" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/32d43ce9ac3eebbb8c5aa0f841d8db47.png"
						 mode="aspectFill"></image>
					</view>
				</view>

				<view class="cat_list" :class="isDowCat?'show':''">
					<view class="list" v-for="(item,index) in album.cat" :key="index" @click="ckCid(item,index)">
						<image :src="item.dir_img" mode="aspectFill"></image>
						<view class="cat">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="goodsDetails" :class="{scrollPadd:menuFixed}">

			<view class="lisDetails" v-for="(item,index) in albumList" :key="index" @click="toDatails(index)">

				<view class="lisImgBox">
					<view class="leftImg">
						<image lazy-load="true" :src="item.pic" mode="aspectFit"></image>
					</view>
					<view class="imgText">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/oneMoney/huo.png" mode="aspectFill"></image><text>热卖{{item.format_volume}}件</text>
					</view>
				</view>
				<view class="listRight">
					<view class="listText">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/myOrder/tbIcon.png" mode="aspectFill"></image>
						<view class="text">{{item.title}}</view>
					</view>
					<view class="listIcon">

						<view class="DetailsBottomText">
							<text>到手价￥</text>
							<text class="listBig">{{item.endprice}}</text>
						</view>

						<view class="originalBox">
							<view class="originalL">
								<text>原价</text>
								<text class="ListDelet">￥{{item.promotion_price}}</text>
							</view>
						</view>
					</view>



					<view class="listDetailsB">

						<view class="listIconL" v-if="item.coupon_money">
							<text class="juan">劵</text>
							<text>{{item.coupon_money}}元</text>
						</view>
						<view class="DetailsBottomBtn">
							<text>马上抢</text>
						</view>
					</view>
				</view>
			</view>
			<loading v-if="!noData && isInit" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: 0,
				TITLE_BAR_HEIGTH: 237.5,
				goodsList: [],
				oneGoods: [],
				albumId: 0,
				album: [],
				albumList: [],
				isDowCat: false,
				cid: 0,
				menuFixed: false,
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				paging: 1,
				tabBox: false,
				navTop: 535,
				navHeihgt: 0,
				scrollTopLis: 0,
				scrollLeft: 0,
				relationId:'',
			};
		},
		onLoad(option) {
			if(typeof option.relationId !== "undefined") this.relationId = option.relationId
			// uni.createSelectorQuery().select('.banner').boundingClientRect(data => {
			// 	console.log("h22",data.height)
			// })
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
					this.navHeihgt = 475 / (750 / res.windowWidth) - this.STATUS_BAR_HEIGTH - this.TITLE_BAR_HEIGTH - 30 / (750 /
						res.windowWidth)
					this.scrollTopLis = 90 / (750 / res.windowWidth)
				},
			})
			if (typeof(option.albumId) == 'string') {
				this.albumId = option.albumId
			}
		},
		mounted() {
			this.postAlbum()
			this.isInit = true

			uni.createSelectorQuery().select('.banner').boundingClientRect(data => {
				console.log("h22", data.height)
			})
		},
		methods: {
			onPageScroll(e) {
				console.log(e.scrollTop)
				if (e.scrollTop >= this.navHeihgt) {
					this.tabBox = true
					// this.STATUS_BAR_HEIGTH = 24
					// this.TITLE_BAR_HEIGTH: 48
				} else {
					this.tabBox = false
					// this.STATUS_BAR_HEIGTH: 0,
					// this.TITLE_BAR_HEIGTH: 48,
				}
			},
			toDatails(index) {
				utils.dnClickLog(this.albumList[index].num_iid)
				let url = '../listDatails/listDatails?iid=' + this.albumList[index].num_iid + '&gtype=' + this.albumList[index].goods_type
				if(this.relationId){
					url += "&relationId="+this.relationId
				}
				uni.navigateTo({
					url: url
				})
			},
			ckShowCats() {
				if (this.isDowCats) {
					this.isDowCats = false;
				} else {
					this.isDowCats = true;
				}
			},
			ckShowCat() {
				if (this.isDowCat) {
					this.isDowCat = false;
				} else {
					this.isDowCat = true;
				}
			},
			ckCid(item, index) {
				this.albumList = []
				this.cid = item.cid
				this.isDowCat = false
				this.paging = 1
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.postAlbumList();
				this.scrollLeft = (index - 2) * this.scrollTopLis;
			},
			//获取专场数据
			postAlbum() {
				$axios.post({
					url: 'Album/getBase',
					data: {
						albumId: this.albumId
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.album = res.data.data
						uni.setNavigationBarTitle({
							title: this.album.show_title
						})
						this.postAlbumList()
					}
				}).catch(err => {})


			},
			postAlbumList() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				$axios.post({
					url: 'Album/getList',
					data: {
						p: this.paging,
						albumId: this.albumId,
						cid: this.cid
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item, index, array) => {
							this.albumList.push(item)
						})
						if (res.data.data.list.length > 0) {
							this.paging++
							// if(res.data.data.endPage){
							// 	this.noMoreData = true
							// }
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
			}
		},
		onReachBottom() {
			this.postAlbumList()
		}
	}
</script>

<style lang="less">
	.banner {
		width: 100%;
		height: 475rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/oneMoney/banner.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	// .bannerTops{
	// 	height: 235rpx;
	// 	background: #;
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	z-index: 9;
	// }
	.tabBox {
		width: 100%;
		height: 90rpx;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		margin-top: -30rpx;
		// overflow: hidden;
		position: relative;
		background: #fff;
	}

	.tabTops {
		position: fixed;
		top: 106px;
		left: 0;
		z-index: 9;
	}

	.cat-box {
		width: 710rpx;
		margin: 0 auto;
		// background-color: #FFF;
		display: flex;

		::-webkit-scrollbar {
			display: none;
		}

		.scroll-view-cat {
			width: 620rpx;
			height: 90rpx;
			line-height: 90rpx;
			white-space: nowrap;
			font-size: 28rpx;
			text-align: center;

			.list {
				width: 92rpx;
				height: 90rpx;
				display: inline-block;

				.cat.active {
					width: 90rpx;
					height: 86rpx;
					line-height: 96rpx;
					margin: 0 auto;
					font-size: 30rpx;
					border-bottom: 4rpx solid #ff4844;
					color: #ff4844;
				}
			}
		}

		.cat-icon {
			width: 90rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 0rpx 0rpx 16rpx 0rpx;

			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;

			.icons {
				width: 10rpx;
				height: 85rpx;
				background-color: #ffffff;
				box-shadow: -4rpx 0rpx 10rpx 0rpx rgba(169, 169, 169, 0.15);
				border-radius: 0rpx 0rpx 10rpx 0rpx;
			}

			image {
				width: 36rpx;
				height: 18rpx;
			}

			image.active {
				transform: rotate(180deg);
			}
		}
	}

	.cat_list {
		position: absolute;
		width: 750rpx;
		padding-top: 30rpx;
		background-color: #FFF;
		display: none;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		text-align: center;
		z-index: 9;
		overflow: hidden;

		.list {
			width: 125rpx;
			height: 138rpx;
			margin-right: 25rpx;
			font-size: 24rpx;
			padding-bottom: 28rpx;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 180rpx;
			}
		}

	}

	.cat_list.show {
		display: flex;
		animation: catshow 1s;
		animation-fill-mode: forwards;
	}

	.goodsDetails {

		width: 100%;
		min-height: 1200rpx;
		box-sizing: border-box;
		padding: 18rpx 20rpx 0 20rpx;
		background: rgba(245, 245, 245, 1);

		.lisDetails {
			width: 100%;
			background: #fff;
			box-sizing: border-box;
			padding: 20rpx 0 20rpx 18rpx;
			border-radius: 16rpx;
			display: flex;
			margin-top: 18rpx;

			.lisImgBox {
				width: 220rpx;
				height: 220rpx;
				position: relative;

				.leftImg {
					width: 220rpx;
					height: 220rpx;
					border-radius: 10rpx;
					overflow: hidden;

					image {
						width: 220rpx;
						height: 220rpx;
					}
				}

				.imgText {
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 46rpx;
					overflow: hidden;
					background: linear-gradient(90deg, #FF6662, #FF433E);
					border-radius: 0rpx 0rpx 10rpx 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 26rpx;
						height: 30rpx;
						margin-right: 7rpx;
					}

					text {
						font-size: 23rpx;
						color: #fff;
					}
				}
			}

			.listRight {
				margin-left: 20rpx;
				padding-top: 10rpx;
				width: 100%;

				.listText {
					display: flex;
					align-items: center;
					position: relative;

					image {
						position: absolute;
						width: 32rpx;
						height: 32rpx;
						top: 0;
					}

					.text {
						color: #111;
						font-size: 26rpx;
						line-height: 36rpx;
						overflow: hidden;
						text-indent: 42rpx;
						height: 70rpx;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 2;
					}
				}

				.listIcon {
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;
					padding-right: 20rpx;

					.DetailsBottomText {
						text {
							color: #ff4844;
							font-size: 24rpx;
							line-height: 55rpx;
						}

						.listBig {
							font-size: 40rpx;
							font-weight: bold;
						}

						.textBig {
							font-size: 28rpx;
							font-weight: bold;
						}

						.ListDelet {
							font-size: 20rpx;
							color: #999;
							text-decoration: line-through;
						}
					}

					.originalBox {
						display: flex;
						justify-content: space-between;
						margin-top: 10rpx;

						.originalL {
							text {
								color: #999;
								font-size: 22rpx;
							}

							.ListDelet {
								font-size: 20rpx;
								color: #999;
								text-decoration: line-through;
							}
						}

						.listIconR {

							// image{
							// 	width: 16rpx;
							// 	height: 18rpx;
							// }
							view {
								display: inline-block;
								color: #888;
								font-size: 18rpx;
								margin-right: 10rpx;

								text {
									color: #999;
								}
							}
						}
					}


					.listIconR {
						background: rgba(255, 200, 68, 0.12);
						border-radius: 8rpx;
						padding: 0 10rpx;
						margin-left: 14rpx;
						// height: 40rpx;
						line-height: 40rpx;

						text {
							color: #ff3a00;
							font-size: 22rpx;
						}

						// image {
						// 	width: 20rpx;
						// 	height: 23rpx;
						// 	margin: 0 8rpx 0 14rpx;
						// }

						// text {
						// 	font-size: 20rpx;
						// 	color: #ff4844;
						// }
					}
				}


				.listDetailsB {
					display: flex;
					justify-content: space-between;
					margin-top: 15rpx;
					padding-right: 20rpx;

					.listIconL {
						width: 140rpx;
						height: 40rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
						background-size: 100% 100%;
						line-height: 40rpx;
						display: flex;

						text {
							color: #ff4844;
							font-size: 22rpx;
							flex: 1;
							text-align: center;
							display: block;
						}

						.juan {
							width: 40rpx;
							// height: 40rpx;
							line-height: 40rpx;
							color: #fff;
							flex: none;
							// margin: 0 20rpx 0 10rpx;
						}
					}


					.DetailsBottomBtn {
						width: 150rpx;
						height: 56rpx;
						background: linear-gradient(90deg, #FF6662, #FF433E);
						border-radius: 29rpx;
						line-height: 55rpx;
						text-align: center;

						text {
							font-size: 26rpx;
							color: #fff;
						}
					}
				}
			}
		}

		.lisDetails:nth-child(1) {
			margin-top: 0;
		}
	}

	.contList {
		margin-top: 0;
		border-radius: 0;
	}
</style>
