<template>
	<view class="tbody">
		<!-- TD DO 导航栏 -->
		<view class="tabBox">
			<scroll-view class="tab" scroll-x='true' show-scrollbar='false'>
				<view class="tabItem" :class="{iconList:active == index,iconOne:activeOne}" v-for="(item,index) in navTab" :key="index"
				 @click="tabIons(index)">
					<text>{{item.title}}</text>
				</view>
			</scroll-view>
		</view>

		<view class="cont">
			<view class="contItem" v-for="(item,index) in adumList" @click="getUrl(item)">
				<view class="imgBox">
					<image :src="item.pic" mode="widthFix"></image>
					<view class="discount">{{item.discount}}折</view>
				</view>

				<view class="contRight">
					<view class="contCenter">
						<text class="storeName">
							{{item.nick}}
						</text>
						<text class="title">
							{{item.title}}
						</text>
					</view>
					<view class="price">
						<text>￥{{item.endprice}}</text>
						<text>￥{{item.price}}</text>
					</view>
				</view>
				<view class="coupons">
					<view class="text">{{item.coupon_money}}元</view>
				</view>
			</view>
			<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
		<load v-if="loading"></load>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import load from '@/components/load/load.vue'
	export default {
		components:{
			load
		},
		data() {
			return {
				active: false,
				activeOne: true,
				scrollLeft: 0,
				goodsNum: 0,
				paging: 1,
				albumId:1,
				title: '',
				navTab: [],
				adumList: [],

				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				loading:true,
				loadTime:0
			};
		},
		onLoad(option){
			if(typeof option.albumId != 'undefined'){
				this.albumId = option.albumId
			}
		},
		mounted() {
			let time = setInterval(() =>{
				if(this.loadTime >= 2){
					this.loading = false
					clearInterval(time)
				}
			},10)
			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
		},
		methods: {
			init(){
				this.getAlbumNav()
			},
			getUrl(e) {
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
			
			tabIons(index) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				this.activeOne = false
				this.active = index
				this.scrollLeft = (index - 2) * 60;
				this.paging = 1
				//清空数据
				this.adumList = []
				this.goodsNum = index
				this.getAdumList()

			},
			getAlbumNav() {
				ajax.get({
					url: 'SaveMoneyShop/albumNav',
					data: {
						albumId: this.albumId,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.albumId = res.data.data.albumId
						this.navTab = res.data.data.list
						uni.setNavigationBarTitle({
							title: res.data.data.title
						})
					}
					this.getAdumList()
				}).catch(err => {})
				this.loadTime++;
			},
			// 商品列表数据
			getAdumList() {
				this.isInit = true
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'SaveMoneyShop/albumGoods',
					data: {
						albumId: this.albumId,
						cid: this.navTab[this.goodsNum].cid,
						p: this.paging
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach(item => {
							this.adumList.push(item)
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
			this.getAdumList()
		}
	}
</script>

<style lang="less">
	image{
		display: block;
	}
	.tabBox {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #FF2C32;
		height: 86rpx;
		position: fixed;
		top: 0;
		z-index: 9;
	}

	.tab {
		width: 100%;
		box-sizing: border-box;
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}

		.tabItem {
			margin-right: 62rpx;
			display: inline-block;
			position: relative;
			height: 80rpx;
			line-height: 80rpx;

			&:nth-last-child(1) {
				margin: 0;
			}

			text {
				font-size: 28rpx;
				color: #FFE8EA;
				font-weight: bold;
			}
		}

		.iconOne:nth-of-type(1) {
			text {
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
			}
		}

		.iconOne:nth-of-type(1)::before {
			content: '';
			position: absolute;
			display: block;
			width: 26rpx;
			height: 8rpx;
			background: url(/static/freedraw/sqg/tab2.png)no-repeat;
			background-size: 100% 100%;
			bottom: 12rpx;
			left: 50%;
			transform: translateX(-50%);
		}

		.iconList {
			text {
				font-size: 30rpx;
				font-weight: bold;
				color: #fff;
			}

			::before {
				content: '';
				position: absolute;
				display: block;
				width: 26rpx;
				height: 8rpx;
				background: url(/static/freedraw/sqg/tab2.png)no-repeat;
				background-size: 100% 100%;
				bottom: 13rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}


	.cont {
		padding: 106rpx 30rpx 0;

		.contItem {
			background: #FFFFFF;
			border-radius: 14rpx;
			display: flex;
			padding: 20rpx;
			position: relative;
			margin-bottom: 20rpx;

			.imgBox {
				position: relative;
				
				image {
					width: 138rpx;
					border-radius: 4rpx;
				}

				.discount {
					width: 64rpx;
					line-height: 26rpx;
					position: absolute;
					left: 0;
					top: 0;
					color: #fff;
					font-size: 18rpx;
					background: #FF2C32;
					text-align: center;
					border-radius: 4rpx 0rpx 12rpx 0rpx;
				}
			}

			.contRight {
				margin-left: 20rpx;
				border-right: 1px solid #ECECEC;
				padding-right: 34rpx;

				.contCenter {
					display: flex;
					width: 336rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #343434;
					line-height: 42rpx;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2;

					.storeName {
						padding: 4rpx 14rpx;
						margin-right: 6rpx;
						font-size: 18rpx;
						background: #FFE4D2;
						border-radius: 12rpx;
						color: #B9845E;
						text-align: center;
						vertical-align: top;
					}
					.title{
						vertical-align: middle;
					}

				}

				.price {
					padding-top: 36rpx;

					text {
						font-size: 28rpx;
						font-weight: bold;
						color: #FF2C32;

						&:nth-of-type(2) {
							font-size: 22rpx;
							font-weight: 400;
							color: #9A9A9A;
							margin-left: 12rpx;
							text-decoration: line-through;
						}
					}
				}
			}

			.coupons {
				width: 100rpx;
				height: 90rpx;
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				background: url(../../static/freedraw/sqg/yhq.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 0rpx 0rpx 6rpx 6rpx;

				.text {
					width: 100%;
					font-size: 24rpx;
					font-weight: bold;
					color: #FF2C32;
					position: absolute;
					left: 50%;
					bottom: 14rpx;
					text-align: center;
					transform: translateX(-50%);
				}
			}
		}
	}
</style>
