<template>
	<view class="tBody">
		<view class="tabBox" v-if="navShow">
			<scroll-view class="tab" scroll-x='true' show-scrollbar='false'>
				<view class="tabItem" :class="{iconList:active == index,iconOne:activeOne}" v-for="(item,index) in navTab" :key="index"
				 @click="tabIons(index)">
					<text>{{item.title}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 对应列表内容 -->
		<view class="tabCont" :class="{noNav:navShow}">
			<view class="tabCont-item" v-for="(item,index) in adumList" @click="getUrl(item)">
				<image :src="item.pic" mode="aspectFit"></image>
				<view class="tabCont-bottom">
					<view class="title">
						{{item.title}}
					</view>
					<view class="price">
						<view class="priceLeft"><text>￥</text>{{item.endprice}}</view>
						<view class="juan">
							<image class="imgJuan" src="/static/new/juan.png" mode="aspectFill"></image>
							<view class="text">{{item.coupon_money}}元</view>
						</view>
					</view>
					<view class="overPrice">
						<view class="overPrice-left">￥{{item.price}}</view>
						<view class="overPrice-right">已抢{{item.format_volume}}件</view>
					</view>
				</view>
			</view>
		</view>
		<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		<load v-if="loading"></load>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import load from '@/components/load/load.vue'
	export default {
		components: {
			load
		},
		data() {
			return {
				active: false,
				activeOne: true,
				scrollLeft: 0,
				goodsNum: 0,
				paging: 1,
				navTab: [],
				adumList: [],
				albumId:1,
				
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				loading: true,
				navShow:true,
				cid:'',
				loadTime:0
			};
		},
		onLoad(option){
			if(typeof option.albumId != 'undefined'){
				this.albumId = option.albumId
			}
		},
		mounted() {
			// 加载loading
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
				// uni.pageScrollTo({
				// 	scrollTop: 0,
				// 	duration: 300
				// });
				this.activeOne = false
				this.active = index
				this.scrollLeft = (index - 2) * 60;
				this.paging = 1
				//清空数据
				this.adumList = []
				this.goodsNum = index
				this.getAdumList()

			},
			// tab数据
			getAlbumNav() {
				ajax.get({
					url: 'SaveMoneyShop/albumNav',
					data: {
						albumId: this.albumId
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.albumId = res.data.data.albumId
						this.navTab = res.data.data.list
						if(res.data.data.list.length == 0){
							this.navShow = false
						}
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
						cid:this.navTab.length == 0?'':this.navTab[this.goodsNum].cid,
						p: this.paging
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach(item => {
							this.adumList.push(item)
						})
						if (res.data.data.list.length) {
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
		box-sizing: border-box;
		padding: 0 30rpx;
		background: #339EF9;
		height: 86rpx;
		position: fixed;
		top: 0;
	}

	.tab {
		width: 100%;
		box-sizing: border-box;
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}

		.tabItem {
			margin-right: 130rpx;
			display: inline-block;
			position: relative;
			height: 80rpx;
			line-height: 80rpx;

			&:nth-last-child(1) {
				margin: 0;
			}

			text {
				font-size: 28rpx;
				color: #EDF5FF;
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
			bottom: 10rpx;
			left: 0;
			display: block;
			width: 100%;
			height: 4rpx;
			background: #fff;
			border-radius: 2rpx;
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
				bottom: 10rpx;
				left: 0;
				display: block;
				width: 100%;
				height: 4rpx;
				background: #fff;
				border-radius: 2rpx;
			}
		}
	}

	.tabCont {
		margin: 0 30rpx 0;
		padding-top:30rpx ;
		display: flex;
		flex-wrap: wrap;
		&-item {
			width: 336rpx;
			margin:0 16rpx 16rpx 0;
			border-radius: 12rpx;
			overflow: hidden;
			background: #fff;
			&:nth-of-type(2n+0){
				margin-right: 0;
			}
			image{
				width: 336rpx;
				height: 336rpx;
			}
			.tabCont-bottom{
				padding: 0 20rpx 24rpx;
				.title{
					padding-top: 26rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					display:-webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp:2;
					height: 56rpx;
				}
				.price{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 22rpx;
					.priceLeft{
						font-size: 32rpx;
						color: #F84A23;
						text{
							font-size: 24rpx;
						}
					}
					.juan{
						width: 133rpx;
						height: 34rpx;
						border-radius: 4rpx;
						display: flex;
						overflow: hidden;
						.imgJuan{
							width: 44rpx;
							height: 34rpx !important;
							flex-shrink: 0;
						}
						.text{
							flex: 1;
							text-align: center;
							font-size: 20rpx;
							font-weight: 400;
							color: #F84A23;
							line-height: 34rpx;
							border: 2rpx solid #F84A23;
							border-left: none;
							border-radius:0 4rpx 4rpx 0;
						}
					}
				}
				.overPrice{
					padding-top: 16rpx;
					display: flex;
					justify-content: space-between;
					&-left{
						
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
						text-decoration:line-through ;
					}
					&-right{
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}
			
		}
	}

	.noNav{
		padding-top: 106rpx;
	}
</style>
