<template>
	<view class="content">
		<view class="bg-white" :style="{'padding-top':NAV_HEIGHT}">
			<swiper class="swiper" :autoplay="true" :indicator-dots="true" indicator-color="rgb(255,255,255)"
			 indicator-active-color="#FF6A40" interval="3000">
				<swiper-item v-for="(item,index) in swiper" :key="index">
					<image class="swiper-item" :src="item.image" mode="aspectFill" @click="jump(item.url)"></image>
				</swiper-item>
			</swiper>

			<view class="big-title">
				<image class="big-title__img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/fire.png" mode="aspectFill"></image>
				<view class="big-title__text">天天淘卖 必买特款</view>
			</view>

			<view class="hot">
				<view class="hot__item" v-for="(item,index) in top" :key="index" @click="getUrl" :data-id="item.id">
					<image class="item__image" :src="item.pic" mode="aspectFill"></image>
					<view class="item__title">{{item.title}}</view>
					<view class="item__price quanhou-price">
						<view class="quanhou-price__text">券后￥</view>
						<view class="quanhou-price__price"><text>{{item.endprice.split('.')[0]}}</text>.{{item.endprice.split('.')[1]}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="goods-list">
			<view class="nav—box">
				<scroll-view class="nav" :class="menuFixed ? 'fixed': ''" :style="{'top':NAV_HEIGHT}" :scroll-x="true">
					<view class="nav__item" :class="active == -1 ? 'nav__item--active':''" @click="onNavTap" :data-index="-1">热门</view>
					<view class="nav__item" :class="active == index ? 'nav__item--active':''" v-for="(item,index) in nav" :key="index"
					 @click="onNavTap" :data-index="index">{{item.title}}</view>
				</scroll-view>
			</view>
			<view class="goods-list__item" v-for="(item,index) in list" :key="index" @click="getUrl" :data-id="item.id">
				<image class="item__image" :src="item.pic" mode="aspectFill"></image>
				<view class="item__info">
					<view class="item__info__title">{{item.title}}</view>
					<view class="item__info__tip">
						<view class="tip__quan">{{item.coupon_money.split(".")[0]+".00"}}元</view>
						<view class="tip__sales">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/fire.png" mode="aspectFill"></image>
							爆卖{{item.format_volume}}件
						</view>
					</view>

					<view class="item__info__ft">
						<view class="item__info__ft__left">
							<view class="quanhou-price">
								<view class="quanhou-price__text">券后￥</view>
								<view class="quanhou-price__price"><text>{{item.endprice.split('.')[0]}}</text>.{{item.endprice.split('.')[1]}}</view>
							</view>
							<view class="ft__through">
								¥{{item.price}}
							</view>
						</view>
						<view class="item__info__ft__right">
							<text>马上抢</text>
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/right.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>
			<loading v-if="!noData" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	import utils from "@/utils/utils.js"
	
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				NAV_HEIGHT: "92px",

				loadingMore: false,
				noMoreData: false,
				noData: false,
				currentPageNumber: 1,

				active: '-1',
				nav: [],
				list: [],

				top: [],

				swiper: [],

				menuFixed: false
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (systemInfo) => {
					this.STATUS_BAR_HEIGTH = systemInfo.statusBarHeight
					this.TITLE_BAR_HEIGTH = systemInfo.titleBarHeight
					this.NAV_HEIGHT = systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px"
				}
			})
		},
		onPageScroll(e) {
			uni.createSelectorQuery().select('.goods-list').boundingClientRect(data => { //目标节点
				if (data.top < this.STATUS_BAR_HEIGTH + this.TITLE_BAR_HEIGTH + 1) {
					this.menuFixed = true
				} else {
					this.menuFixed = false
				}
			}).exec()
		},
		onReachBottom() {
			this.getGoods()
		},
		mounted() {
			this.getSwiper()
			this.getTopGoods()
			this.getNav()
			this.getGoods()
		},
		methods: {
			onNavTap(e) {
				this.active = e.currentTarget.dataset.index

				uni.createSelectorQuery()
					.select('.goods-list').boundingClientRect()
					.select('.content').boundingClientRect()
					.exec((ret) => {
						my.pageScrollTo({
							scrollTop: ret[0].top - ret[1].top - (this.STATUS_BAR_HEIGTH + this.TITLE_BAR_HEIGTH),
							duration: 100,
						});
					})

				this.list = []
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.currentPageNumber = 1
				this.getGoods()
			},
			getNav() {
				ajax.get({
					url: 'TaoBaoKe/nav'
				}).then((res) => {
					if (res.data.code == 200) {
						this.nav = res.data.data
					}
				}).catch((error) => {})
			},
			getGoods() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'TaoBaoKe/getList',
					data: {
						adData: '',
						channelId: '',
						cid: this.active != '-1' ? this.nav[this.active]['cid'] : '',
						materialId: '',
						order: 0,
						p: this.currentPageNumber,
						sellerId: '',
						userNick: '',
					}
				}).then((res) => {
					if (res.data.code == 200) {
						if (this.active == '-1' && this.currentPageNumber == 1)
							res.data.data.list = res.data.data.list.slice(3)
						res.data.data.list.forEach((item, index, array) => {
							this.list.push(item)
						})
						if (res.data.data.list.length > 0) {
							this.currentPageNumber++
						} else {
							if (this.currentPageNumber == 1 && res.data.data.list.length == 0) {
								this.noMoreData = true
								this.noData = true
							} else {
								this.noMoreData = true
							}
						}
					}
					this.loadingMore = false;
				}).catch((error) => {
					this.loadingMore = false;
				})
			},
			getTopGoods() {
				ajax.get({
					url: 'TaoBaoKe/getList',
					data: {
						adData: '',
						channelId: '',
						cid: '',
						materialId: '',
						order: 5,
						p: 1,
						sellerId: '',
						userNick: '',
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.top = res.data.data.list.slice(0, 3)
					}
				}).catch((error) => {})
			},
			getSwiper() {
				ajax.get({
					url: 'TaoBaoKe/swiper'
				}).then((res) => {
					if (res.data.code == 200) {
						this.swiper = res.data.data
					}
				}).catch((error) => {})
			},
			getUrl(e) {
				let id = e.currentTarget.dataset.id
				// 获取领券链接
				ajax.get({
					url: 'TaoBaoKe/jumpUrl',
					data: {
						id: id,
						gtype: 0
					}
				}).then((res) => {
					if (res.data.code == 200) {
						// 跳转到领券地址
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=' + encodeURIComponent(
									'alipays://platformapi/startapp?saId=20000067&url=' + encodeURIComponent(res.data.data.url)))
						});
					}
				}).catch((error) => {})

			},
			// 跳转页面
			jump(e) {
				if (!e) {
					return;
				}
				if (e.search(/^http:\/\//) === 0 || e.search(/^https:\/\//) === 0 || e.search(/^\/\//) === 0) {
					// 页面跳转
					uni.navigateTo({
						url: "/pages/webview/webview?url=" + e,
					})
				} else if ((e.search(/^alipays:\/\//) === 0)) {
					// 小程序跳转
					let query = e.substr(e.indexOf('?') + 1);
					let params = this.parseQuery(query)

					uni.navigateToMiniProgram({
						appId: params.appId,
						path: params.page,
						extraData: params.query
					})
				} else if ((e.search(/^plugin:\/\//) === 0)) {
					uni.navigateTo({
						url: e
					})
				} else {
					// 生活号
				}
			},
			parseQuery(query) {
				let params = {}
				if (query.indexOf('?') !== false) {
					let tmp = query.substr(query.indexOf('?'))
					let tmp1 = '';
					if (tmp.indexOf('&query') !== -1) {
						tmp1 = tmp.substring(0, tmp.indexOf('&query'));
					} else {
						tmp1 = tmp;
					}
					query = query.replace(tmp1, encodeURIComponent(tmp1))
				}
				for (let item of query.split('&')) {
					var tmp = item.split('=')
					params[tmp[0]] = decodeURIComponent(tmp[1])
				}
				return params
			},
		}
	}
</script>

<style lang="scss" scoped>
	.fixed {
		position: fixed;
	}

	.bg-white {
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/bg.png);
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #FFFFFF;
		overflow: auto;
	}

	.swiper {
		margin: 5rpx 0 40rpx;
		height: 260rpx;

		.swiper-item {
			width: 690rpx;
			height: 260rpx;
			margin: 0 auto;
			border-radius: 20rpx;
			display: block;
			box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0, 0, 0, 0.32);
		}
	}


	.big-title {
		padding: 0 30rpx;
		margin-bottom: 24rpx;
		display: flex;
		align-items: center;

		&__img {
			width: 30rpx;
			height: 39rpx;
			margin-right: 19rpx;
		}

		&__text {
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
		}
	}

	.hot {
		height: 350rpx;
		padding: 0 30rpx 5px;
		display: flex;
		justify-content: space-between;

		&__item {
			width: 224rpx;
			background-color: #ffffff;
			box-shadow: 0rpx 3rpx 10rpx 0rpx rgba(0, 0, 0, 0.15);
			border-radius: 8rpx;

			.item__image {
				width: 224rpx;
				height: 224rpx;
			}

			.item__title {
				font-size: 26rpx;
				color: #333333;
				padding: 15rpx 16rpx 17rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.item__price {
				padding: 0 16rpx 17rpx;
			}
		}
	}

	.quanhou-price {
		color: #f84a23;
		display: flex;
		align-items: baseline;

		&__text {
			font-size: 24rpx;
		}

		&__price {
			font-weight: bold;
			font-size: 20rpx;

			text {
				font-size: 34rpx;
			}
		}
	}

	.nav {
		width: 750rpx;
		white-space: nowrap;
		padding: 10rpx 0 10rpx;
		background-color: #FFFFFF;
		z-index: 1;

		.nav__item {
			height: 56rpx;
			font-size: 28rpx;
			font-weight: bold;
			padding: 30rpx 25rpx 0;
			display: inline-block;
			color: #333333;
			background-size: 21rpx 10rpx;
			background-repeat: no-repeat;
			background-position: center bottom;
		}

		.nav__item--active {
			color: #f84a23;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/active.png);
		}
	}


	.nav::-webkit-scrollbar {
		display: none;
	}

	.goods-list {
		min-height: 100vh;

		.nav—box {
			height: 97rpx;
		}

		.goods-list__item {
			margin: 20rpx 30rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			padding: 16rpx 18rpx;

			display: flex;
			justify-content: space-between;

			.item__image {
				width: 228rpx;
				height: 228rpx;
				border-radius: 10rpx;
			}

			.item__info {
				width: 400rpx;

				.item__info__title {
					width: 402rpx;
					height: 84rpx;
					font-size: 28rpx;
					line-height: 42rpx;

					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item__info__tip {
					display: flex;
					margin-top: 24rpx;

					.tip__quan {
						width: 76rpx;
						height: 35rpx;
						line-height: 35rpx;
						background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/taobao/quan.png);
						background-repeat: no-repeat;
						background-size: 100%;

						font-size: 20rpx;
						color: #f84a23;

						padding: 0 9rpx 0 52rpx;
						margin-right: 16rpx;
					}

					.tip__sales {
						padding: 0 14rpx;
						height: 35rpx;
						line-height: 35rpx;
						background-color: rgba($color: #ff542e, $alpha: 0.1);
						border-radius: 4rpx;

						font-size: 20rpx;
						color: #f84a23;

						image {
							width: 20rpx;
							height: 22rpx;
							vertical-align: middle;
							margin-right: 7rpx;
						}
					}
				}

				.item__info__ft {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 42rpx;

					.item__info__ft__left {
						display: flex;
						align-items: baseline;

						.ft__through {
							margin-left: 20rpx;
							font-size: 20rpx;
							color: #999999;
							text-decoration: line-through;
						}
					}

					.item__info__ft__right {
						margin-right: -18rpx;
						width: 131rpx;
						height: 50rpx;
						line-height: 50rpx;
						background-color: #f84a23;
						border-radius: 25rpx 0rpx 0rpx 25rpx;
						font-size: 24rpx;
						color: #ffffff;
						text-align: center;
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 11rpx;
							height: 20rpx;
							margin-left: 8rpx;
						}
					}
				}
			}
		}
	}
</style>
