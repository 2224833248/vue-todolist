<template>
	<view class="tbody">
		<view class="nav"></view>
		<view class="cont">
			<!-- 幻灯片 -->
			<view class="banner">
				<swiper class="swiper" :indicator-dots='true' :autoplay="true" :interval="3000" :circular='true' :duration="duration">
					<swiper-item class="swiper-item" v-for="(item,index) in adList['sqg-slide']" :key='index'>
						<view class="swiper-itemList" @click="adClick(item)">
							<image :src="item.image" mode="widthFix"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 专题 -->
			<view class="itemBox">
				<view class="isItem" v-for="(item,index) in adList['sqg-album']" :key='index' @click="adClick(item)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>

			<!-- 广告分类 -->
			<view class="newWefa">
				<view class="imgBox" v-for="(item,index) in adList['sqg-nav']" :key='index' @click="adClick(item)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>

			<!-- 分栏 -->
			<view class="imgBoxBotom">
				<view class="icont" v-for="(item,index) in adList['sqg-column']" :key='index' @click="adClick(item)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>

			<!-- 阿里广告 -->
			<view class="aliad" v-if="adUnitId">
				<view class="aliad_head" v-if="showali">
					<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
					<view class="aliad_head_r">
						<image src="/static/index/jfb.png" mode="widthFix"></image>
						<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
					</view>
				</view>
				<view class="aliad_body" @click="onAliTaskTap()">
					<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
				</view>
			</view>

			<view class="tabBox">
				<!-- TD DO 导航栏 -->
				<scroll-view :class="{scroll:menuFixed}" :style="{'top':navTop}" class="goodsTabBox" scroll-x='true' show-scrollbar='false'>
					<view class="goodsTabList" :class="{iconList:active == index,iconOne:activeOne}" v-for="(item,index) in tabList"
					 :key="index" @click="tabIons(index)">
						<text>{{item.title}}</text>
					</view>
				</scroll-view>

				<!-- 对应列表内容 -->
				<view class="tabCont" :class="{scrollPadd:menuFixed}">
					<view class="tabCont-item" v-for="(item,index) in goodsList" @click="getUrl(item)">
						<image class="topImage" :src="item.pic" mode="widthFix"></image>
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
								<view class="overPrice-left">￥{{item.promotion_price}}</view>
								<view class="overPrice-right">已抢{{item.format_volume}}件</view>
							</view>
						</view>
					</view>

				</view>
				<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
			</view>
		</view>
		<load v-if="loading"></load>
	</view>

</template>

<script>
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	import load from '@/components/load/load.vue'
	let loding = false
	let clickLock = false
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
				tabList: [],
				goodsList: [],
				paging: 1,
				menuFixed: false,

				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				topHeight: 0,
				loading: true,

				STATUSHEIGHT: 0,
				TITLEHEIGHT: 0,
				navTop: 0,

				// 阿里广告
				isShowAliAd: 1,
				adUnitId: 'ad_tiny_2021001167643261_202009262200004062',
				aliAdTaskId: 453,
				
				popsDar: true,
				isPopup: false,
				timePop: '',
				loadTime:0,
				topHeight:''
			};
		},
		onLoad(option) {
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.STATUSHEIGHT = res.statusBarHeight + "px";
					this.TITLEHEIGHT = res.titleBarHeight + "px";
					this.navTop = (res.statusBarHeight + res.titleBarHeight) + 'px';
					this.topHeight = (res.statusBarHeight + res.titleBarHeight);
				}
			})
			// 保存邀请人ID
			if (typeof(option.invite_id) == "string") {
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
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
			// 判断是否登录
			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
			setInterval(() => {
				this.dateHandler()
			}, 1000)
		},
		methods: {
			/**
			 * 阿里广告
			 */
			
			// 获取是否显示广告状态
			getAliAdShow() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				})
			},
			
			// 点击阿里广告
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.aliAdTask && this.onTaskTap(this.aliAdTask)
			},
			
			// 用户点击广告
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
			},
			
			// 广告打开成功
			onRenderSuccess(e) {
				console.info(e)
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},
			
			// 广告打开失败
			onRenderFail(e) {
				console.info(e)
				this.adUnitId = ''
			},
			init() {
				this.getTabList()
			},
			// 获取时间倒计时
			dateHandler() {
				let isDate = parseInt((new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) -
					new Date()) / 1000)
				let dateTime = isDate % 3600
				let s = (isDate - dateTime) / 3600
				let m = dateTime % 60
				let f = (dateTime - m) / 60
				this.timeS = s < 10 ? '0' + s : s
				this.timeF = f < 10 ? '0' + f : f
				this.timeM = m < 10 ? '0' + m : m
			},
			// 锚点
			anchor() {
				uni.createSelectorQuery()
					.select('.tabBox').boundingClientRect()
					.select('.tbody').boundingClientRect()
					.exec((ret) => {
						my.pageScrollTo({
							scrollTop: ret[0].top - ret[1].top - this.topHeight
						});
					})

			},
			// 点击广告
			adClick(ad) {
				if (clickLock) return;
				clickLock = true
				setInterval(() => {
					clickLock = false
				}, 3000);
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
			getUrl(e) {
				if (clickLock) return;
				clickLock = true
				setInterval(() => {
					clickLock = false
				}, 3000);
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
				if(index == this.goodsNum){
					return
				}
				if (loding) return;
				this.anchor()
				this.activeOne = false
				this.active = index
				this.scrollLeft = (index - 2) * 60;
				this.paging = 1
				//清空数据
				this.goodsNum = index
				this.goodsList = []
					this.getGoodsList()
				// console.log(index)
				// console.log(this.goodsNum)
				

			},
			// 商品tab标题分类
			getTabList() {
				ajax.get({
					url: 'SaveMoneyShop/indexNav'
				}).then(res => {
					if (res.data.code == 200) {
						this.tabList = res.data.data
						this.getGoodsList()
					}
				}).catch(err => {})
				this.loadTime++;
			},
			// 商品数据
			getGoodsList() {
				loding = true;
				this.isInit = true
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'SaveMoneyShop/goodsList',
					data: {
						p: this.paging,
						cid: this.tabList[this.goodsNum].cid
					}
				}).then(res => {
					loding = false
					if (res.data.code == 200) {
						res.data.data.list.forEach(item => {
							this.goodsList.push(item)
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
					loding = false
					this.loadingMore = false;
				})
				this.loadTime++;
			},
		},
		computed: {
			adList() {
				let tmp = this.$store.state.adList;
				if (!tmp) {
					tmp = [];
				}
				return tmp;
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: ''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			aliAdTask() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
				return null
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.aliAdTask && (this.aliAdTask.isComplete == false)) {
					return true
				} else {
					return false
				}
			}
		},

		onReachBottom() {
			this.getGoodsList()
		}
	}
</script>
<style>
	page {
		overflow: initial;
	}
</style>
<style lang="less" scoped>
	image {
		display: block;
	}

	.tbody {
		width: 750rpx;

		.nav {
			height: 286rpx;
			background: url(/static/new/sqgBanner.png)no-repeat;
			background-size: 100% 100%;
		}

		&::-webkit-scrollbar {
			display: none;
		}

		.cont {
			width: 750rpx;
			box-sizing: border-box;
			padding: 0 30rpx;
			box-sizing: border-box;

			&::-webkit-scrollbar {
				display: none;
			}

			.banner {
				margin-top: -120rpx;

				.swiper {
					height: 220rpx;
					border-radius: 14rpx;
					overflow: hidden;

					.swiper-item {
						height: 100%;
						border-radius: 14rpx;
						overflow: hidden;

						.swiper-itemList {
							height: 100%;
							border-radius: 14rpx;
							overflow: hidden;

							image {
								width: 100%;
								border-radius: 14rpx;
							}
						}
					}
				}
			}


			.itemBox {
				display: flex;
				justify-content: space-between;
				margin-top: 20rpx;

				.isItem {
					width: 340rpx;
					height: 156rpx;
					background: #FFFFFF;
					border-radius: 12rpx;
					overflow: hidden;

					&:nth-last-child(1) {
						margin-right: 0;
					}

					image {
						width: 100%;
						border-radius: 12rpx;
					}
				}
			}

			// <!-- 广告分类 -->
			.newWefa {
				width: 100%;
				border-radius: 12rpx;
				// padding: 30rpx 0 20rpx;
				background: #fff;
				margin-top: 20rpx;
				display: flex;

				.imgBox {
					width: 25%;
					height: 220rpx;
					box-sizing: border-box;

					// border-right: 1px solid #ECECEC;
					image {
						width: 100%;
					}

					&:nth-last-child(1) {
						border: none;
					}
				}
			}


			.imgBoxBotom {
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				margin-top: 20rpx;
				border-radius: 12rpx;
				overflow: hidden;
				background: #fff;
				.icont {
					width: 50%;
					height: 220rpx;

					image {
						width: 100%;
					}
				}
			}

			// 阿里广告
			.aliad {
				width: 690rpx;
				margin: 20rpx auto 0;
				background: #fff;
				border-radius: 14rpx;

				.aliad_head {
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					padding: 25rpx 17rpx 0;
					align-items: baseline;

					.aliad_head_l {
						width: 227rpx;
						height: 27rpx;
					}

					.aliad_head_r {
						display: flex;

						image {
							width: 24rpx;
							height: 24rpx;
							margin-right: 7rpx;
						}

						view {
							font-size: 22rpx;
							color: #333333;

							text {
								color: #f70707;
							}
						}
					}
				}

				.aliad_body {
					padding: 17rpx 17rpx;
				}
			}


			//TO DO 商品tab栏
			.tabBox {
				min-height: 110vh;

				.goodsTabBox {

					width: 100%;
					// padding-top: 22rpx;
					box-sizing: border-box;
					white-space: nowrap;
					position: sticky;
					position: -webkit-sticky;
					background: #F5F5F5;
					// background-color: #0081FF;
					top: 0;

					&::-webkit-scrollbar {
						display: none;
					}

					.goodsTabList {
						margin-right: 62rpx;
						display: inline-block;
						position: relative;
						// height: 80rpx;
						line-height: 80rpx;

						&:nth-last-child(1) {
							margin: 0;
						}

						text {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}
					}

					.iconOne:nth-of-type(1) {
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
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
						background: #FF2B31;
						border-radius: 2rpx;
					}

					.iconList {
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
						}

						::before {
							content: '';
							position: absolute;
							bottom: 10rpx;
							left: 0;
							display: block;
							width: 100%;
							height: 4rpx;
							background: #FF2B31;
							border-radius: 2rpx;
						}
					}
				}

				.scroll {
					width: 750rpx;
					box-sizing: border-box;
					padding: 20rpx 30rpx 0;
					background: #fff;
					position: fixed;
					top: 0;
					left: 0;
				}

				.tabCont {
					display: flex;
					flex-wrap: wrap;
					margin-top: 10rpx;
					min-height: 40vh;

					&-item {
						width: 336rpx;
						margin: 0 16rpx 16rpx 0;
						border-radius: 12rpx;
						overflow: hidden;
						background: #fff;

						&:nth-of-type(2n+0) {
							margin-right: 0;
						}

						.topImage {
							width: 336rpx !important;
							height: 336rpx !important;
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
									font-weight: bold;

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
										height: 34rpx !important;
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

				.scrollPadd {
					padding-top: 90rpx;
				}
			}
		}
	}
</style>
