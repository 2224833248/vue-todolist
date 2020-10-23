<template>
	<view class="tbody">
		<view class="div" style="width: 100%;height: 50rpx;background: #F7F7F7; border-radius: 30rpx 30rpx 0 0;"></view>
		<view class="cont">
			<view class="banner">
				<swiper class="swiper" :indicator-dots='true' :autoplay="true" :interval="3000" :circular='true' :duration="duration">
					<swiper-item class="swiper-item" v-for="(item,index) in adList.sqg_slide" :key='index'>
						<view class="swiper-itemList" @click="adClick(item)">
							<image :src="item.image" mode="widthFix"></image>
							
						</view>
					</swiper-item>
				</swiper>

				<view class="itemBox">
					<view class="isItem" v-for="(item,index) in adList['sqg-nav']" :key='index' @click="adClick(item)">
						<image :src="item.image" mode="widthFix"></image>
					</view>
				</view>
			</view>

			<view class="newWefa">
				<view class="title">
					<view class="left">
						<view class="textImg">
							<image src="/static/freedraw/sqg/title.png" mode="widthFix"></image>
						</view>
						<view class="date">
							<view class="dateItem">{{timeS}}</view>
							<view class="dateFh">:</view>
							<view class="dateItem">{{timeF}}</view>
							<view class="dateFh">:</view>
							<view class="dateItem">{{timeM}}</view>
						</view>
					</view>
					<view class="right">
						每人限量<text>1</text>单
					</view>
				</view>

				<view class="newWefa-cont">
					<scroll-view class="scroll" scroll-x='true' show-scrollbar='false'>
						<view class="newWefa-cont-item" v-for="(item,index) in albumTab" :key='index' @click="getUrl(item)">
							<view class="imgBox">
								<image :src="item.pic" mode="widthFix"></image>
							</view>
							<view class="newWefa-title">{{item.title}}</view>
							<view class="price">
								<view class="price-left">￥{{item.endprice}}</view>
								<view class="price-right">￥{{item.promotion_price}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<view class="imgBoxBotom">
				<view class="icont" v-for="(item,index) in adList['sqg-subfield']" :key='index' @click="adClick(item)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>

			<view class="tabBox">
				<!-- TD DO 导航栏 -->
				<scroll-view :class="{scroll:menuFixed}" class="goodsTabBox" scroll-x='true' show-scrollbar='false'>
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
									<image class="imgJuan" src="/static/freedraw/icon/juan.png" mode="aspectFill"></image>
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
		components:{
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
				albumTab: [],
				paging: 1,
				menuFixed: false,
				dateTime: '',
				timeS: '00',
				timeF: '00',
				timeM: '00',

				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				topHeight: 0,
				
				loading:true,
				loadTime:0
			};
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof(option.invite_id) == "string") {
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
			}
		},
		onShow() {
		},
		mounted() {
			// 加载loading
			let time = setInterval(() =>{
				if(this.loadTime >= 3){
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
			init() {
				this.getAlbumGoods()
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
							scrollTop: ret[0].top - ret[1].top
						});
					})

			},
			// 点击广告
			adClick(ad) {
				if(clickLock)return;
				clickLock = true
				setInterval(()=> {
					clickLock = false
				},3000);
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
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

			tabIons(index) {
				if (loding) return;
				this.anchor()
				this.activeOne = false
				this.active = index
				this.scrollLeft = (index - 2) * 60;
				this.paging = 1
				//清空数据
				this.goodsList = []
				this.goodsNum = index
				this.getGoodsList()

			},
			// 主题tab
			getAlbumGoods() {
				ajax.get({
					url: 'SaveMoneyShop/albumGoods',
					data: {
						albumId: 1,
						size: 8
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.albumTab = res.data.data.list
					}

				}).catch(err => {})
				this.loadTime++;
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
		background-color: #FF2B31;
		height: 50vw;
		&::-webkit-scrollbar {
			display: none;
		}

		.cont {
			width: 750rpx;
			box-sizing: border-box;
			padding: 0 30rpx;
			background: #F7F7F7;
			box-sizing: border-box;
			&::-webkit-scrollbar {
				display: none;
			}

			.banner {
				// padding-top: 50rpx;

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

				.itemBox {
					display: flex;
					flex-wrap: wrap;
					padding-top: 20rpx;

					.isItem {
						width: 162rpx;
						height: 198rpx;
						margin-right: 14rpx;
						background: #FFFFFF;
						border-radius: 10rpx;
						text-align: center;

						&:nth-last-child(1) {
							margin-right: 0;
						}

						image {
							width:100%;
							border-radius: 10rpx;
						}
					}
				}
			}

			.newWefa {
				padding: 26rpx 30rpx 36rpx 30rpx;
				background: #FDFDFD;
				border-radius: 10rpx 10rpx 0 0;
				margin-top: 20rpx;
				border-bottom: 1px solid #ececec;

				.title {
					display: flex;
					justify-content: space-between;

					.left {
						display: flex;

						.textImg {
							width: 172rpx;
							height: 34rpx;

							image {
								width: 172rpx;
							}
						}

						.date {
							font-weight: 400;
							margin-left: 12rpx;
							display: flex;
							align-items: center;

							.dateItem {
								width: 30rpx;
								line-height: 30rpx;
								background: #FF2B31;
								border-radius: 5rpx;
								font-size: 18rpx;
								font-weight: 400;
								color: #FFFFFF;
								text-align: center;
							}

							.dateFh {
								color: #FF2B31;
								font-size: 30rpx;
								margin:-5px 0.08rem 0px;
							}
						}
					}

					.right {

						font-size: 20rpx;
						font-weight: 400;
						color: #999999;
						line-height: 28rpx;

						text {
							color: #FF2B31;
						}
					}
				}

				&-cont {
					margin-top: 24rpx;

					.scroll {
						&::-webkit-scrollbar {
							display: none;
						}

						display: flex;
					}

					&-item {
						width: 198rpx;
						margin-right: 20rpx;

						.imgBox {
							width: 198rpx;
							height: 198rpx;
							background: #F6F6F6;
							border-radius: 12rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							overflow: hidden;

							image {
								width: 100%;
							}
						}

						.newWefa-title {
							margin-top: 16rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #333333;
							overflow: hidden; //超出的文本隐藏
							text-overflow: ellipsis; //用省略号显示
							white-space: nowrap
						}

						.price {
							margin-top: 24rpx;
							display: flex;
							justify-content: space-between;

							&-left {

								font-size: 24rpx;
								font-weight: 400;
								color: #FF2B31;
							}

							&-right {

								font-size: 20rpx;
								font-weight: 400;
								color: #999999;
								text-decoration: line-through;
							}
						}

					}
				}
			}

			.imgBoxBotom {
				display: flex;

				.icont {
					width: 344rpx;
					height: 344rpx;

					image {
						width: 100%;
					}

					&:nth-of-type(1) {
						border-right: none;
						border-right: 1px solid #EAEAEA;
					}
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
					background: #F7F7F7;
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

						// padding-top: 22rpx;
						// line-height: 1;
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
						}
					}

					.iconOne:nth-of-type(1)::before {
						content: '';
						position: absolute;
						display: block;
						width: 32rpx;
						background: url(/static/freedraw/sqg/tab.png)no-repeat;
						background-size: 100% 100%;
						bottom: 4rpx;
						left: 50%;
						transform: translateX(-50%);
					}

					.iconList {

						// padding-top: 22rpx;
						// line-height: 1;
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
						}

						::before {
							content: '';
							position: absolute;
							display: block;
							width: 32rpx;
							height: 16rpx;
							background: url(/static/freedraw/sqg/tab.png)no-repeat;
							background-size: 100% 100%;
							bottom: 4rpx;
							left: 50%;
							transform: translateX(-50%);
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
