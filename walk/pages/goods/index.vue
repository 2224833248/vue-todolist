<template>
	<view class="tbody">
		<navbar customStyle="borderBottom:0px;background:url(/static/walk/amend/bg.png)no-repeat;backgroundSize: 100% auto;color:#FFF;">
			<view class="ui-row" style="height:46px;">
				<view class="ui-col-content valign-middle">
					<image src="/static/walk/amend/contTitle.png" style="width: 280rpx;height: 36rpx;margin-left: 38rpx;" mode="widthFix"></image>
				</view>
			</view>
		</navbar>

		<view class="contBox">
			<view class="banner" :style="{'padding-top':navPadding}">
				<swiper class="swiper" :indicator-dots='true' :autoplay="true" :interval="3000" :circular='true' :duration="duration">
					<swiper-item class="swiper-item" v-for="(item,index) in adList.banner" :key='index'>
						<view class="swiper-itemList" @click="adClick(item)">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="cont">


			<task-list ref="task" tag="morestep" :size="0"></task-list>

			<!-- 支付宝广告插件 -->
			<view class="card aliad" v-if="adUnitId">
				<view class="aliad_head" v-if="showali">
					<image class="aliad_head_l" src="../../static/index/xsjf.png?v2" mode="aspectFill"></image>
					<view class="aliad_head_r">
						<image src="../../static/index/redbag.png" mode="aspectFill"></image>
						<view>点击浏览广告,可获得<text>随机红包</text></view>
					</view>
				</view>
				<view class="aliad_body" @click="onAliTaskTap()">
					<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
				</view>
			</view>

			<view class="newWefa">
				<view class="title">
					<view class="left">
						<text>每日爆款</text>
						<image src="/static/walk/amend/title.png" mode="widthFix"></image>
					</view>
					<view class="right" @click="ckgdHanlder(3)">
						<text>查看更多</text>
						<image src="/static/walk/amend/riught.png" mode="widthFix"></image>
					</view>
				</view>

				<view class="newWefa-cont">
					<scroll-view class="scroll" scroll-x='true' show-scrollbar='false'>
						<view class="newWefa-cont-item" v-for="(item,index) in albumTab" :key='index' @click="getUrl(item)">
							<view class="imgBox">
								<image :src="item.pic" mode="widthFix"></image>
								<view class="juan">
									<view class="left"></view>
									<view class="contJuan">{{item.coupon_money}}元</view>
								</view>
							</view>
							<view class="price">
								<view class="price-left">￥{{item.endprice}}</view>
								<view class="price-right">￥{{item.promotion_price}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
			
				<view class="fenlan1">
					<view class="icont" @click="ckgdHanlder(1)">
						<view class="items">
							<text>大额卷</text>
							<image src="/static/walk/amend/yhdd.png" mode="widthFix"></image>
						</view>
						<view class="contImg">
							<view class="imgBox" v-for="(item,index) in goodsTop.largeCoupon.list" :key='index'>
								<image :src="item.pic" mode="widthFix"></image>
								<view class="buttom">{{item.coupon_money}}元券</view>
							</view>
						</view>
					</view>
				
					<view class="icont" @click="ckgdHanlder(2)">
						<view class="items">
							<text>9.9包邮</text>
							<image src="/static/walk/amend/hwdj.png" mode="widthFix"></image>
						</view>
						<view class="contImg">
							<view class="imgBox" v-for="(item,index) in goodsTop.freeShipping.list" :key='index'>
								<image :src="item.pic" mode="widthFix"></image>
								<view class="buttom">{{item.coupon_money}}元券</view>
							</view>
						</view>
					</view>
				</view>
				
			</view>
			<view class="imgBoxBotom">
				<view class="icont" v-for="(item,index) in adList.fenlan2" :key='index' @click="adClick(item)">
					<image :src="item.image" mode="widthFix"></image>
				</view>
			</view>

			<view class="tabBox">
				<!-- TD DO 导航栏 -->
				<scroll-view :style="{'top':navTop}" :class="{scroll:menuFixed}" class="goodsTabBox" scroll-x='true' show-scrollbar='false'>
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
								<view class="priceLeft">到手价￥<text class="dian1">{{item.endprice.split('.')[0]}}</text>.<text class="dian2">{{item.endprice.split('.')[1].length>1?item.endprice.split('.')[1]:item.endprice.split('.')[1]+'0'}}</text></view>
								<view class="overPrice-left">￥{{item.promotion_price}}</view>
							</view>
							<view class="overPrice">
								<view class="juan">
									<image class="imgJuan" src="/static/walk/amend/juan.png" mode="aspectFill"></image>
									<view class="text">{{item.coupon_money}}元</view>
								</view>
								<view class="overPrice-right">
									<image src="/static/walk/amend/huo.png" mode="widthFix"></image>
									<view class="titles">热卖<text>{{item.format_volume}}</text>件</view>
								</view>
							</view>
						</view>
					</view>

				</view>
				<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				<!-- <load v-if="loading"></load> -->

			</view>
		</view>

	</view>

</template>

<script>
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	import taskList from '@/components/task-list/task-list.vue'

	// import load from '@/components/load/load.vue'
	let loding = false
	let clickHandler = false
	export default {
		components: {
			taskList,
			// load
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
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				topHeight: 0,

				loadTime: 0,
				loading: true,
				// 阿里广告
				isShowAliAd: 0,
				adUnitId: 'ad_tiny_2021001167680229_202010172200004266',
				aliAdTaskId: 368,

				STATUSHEIGHT: 0,
				TITLEHEIGHT: 0,
				navTop: 0,
				navPadding: 0,
				goodsTop: [],
				topHader:0

			};
		},
		onLoad(option) {
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.STATUSHEIGHT = res.statusBarHeight + "px";
					this.TITLEHEIGHT = res.titleBarHeight + "px";
					this.navTop = (res.statusBarHeight + res.titleBarHeight) + 'px';
					this.topHader = (res.statusBarHeight + res.titleBarHeight);
					this.navPadding = (res.statusBarHeight + res.titleBarHeight + 15) + 'px';
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
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		mounted() {
			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
			// 加载loading
			let time = setInterval(() =>{
				if(this.loadTime >= 4){
					this.loading = false
					clearInterval(time)
				}
			},10)
		},
		methods: {
			init() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					this.loadTime++;
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				}).catch((error) => {
					this.loadTime++;
				})
				this.getAlbumGoods()
				this.getTabList()
				this.getGoodsTop()
				setInterval(() => {
					this.dateHandler()
				}, 1000)
			},
			ckgdHanlder(albumId) {
				uni.navigateTo({
					url: '../more/more?albumId=' + albumId
				})
			},
			getGoodsTop() {
				ajax.get({
					url: 'SaveMoneyShop/indexGoods',
					data: {
						type: 1
					}
				}).then(res => {
					this.loadTime++;
					this.goodsTop = res.data.data
					// this.goodsTop
				})
			},

			// 阿里广告 - 点击
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.task_ali && this.onTaskTap(this.task_ali)
			},
			// 阿里广告 - 调用成功回调
			onRenderSuccess(e) {
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},
			// 阿里广告 - 调用失败回调
			onRenderFail(e) {
				this.adUnitId = ''
			},
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
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
							scrollTop: ret[0].top - ret[1].top - this.topHader
						});
					})

			},
			// 点击广告
			adClick(ad) {
				if (clickHandler == true) return;
				clickHandler = true
				setTimeout(() => {
					clickHandler = false
				}, 3000)
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})

				utils.adJump(ad, this);
			},
			getUrl(e) {
				if (clickHandler == true) return;
				clickHandler = true
				setTimeout(() => {
					clickHandler = false
				}, 3000)
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
					url: 'goods/getList',
					data: {
						adData: 'ranking:1',
						size: 8
					}
				}).then(res => {
					this.loadTime++;
					if (res.data.code == 200) {
						this.albumTab = res.data.data.list
					}

				}).catch(err => {
					this.loadTime++;
				})
			},
			// 商品tab标题分类
			getTabList() {
				ajax.get({
					url: 'base/getCat'
				}).then(res => {
					this.loadTime++;
					if (res.data.code == 200) {
						this.tabList = res.data.data
						this.getGoodsList()
					}
				}).catch(err => {

					this.loadTime++;
				})
			},
			// 商品数据
			getGoodsList() {
				loding = true;
				this.isInit = true
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'goods/getList',
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
			task_ali() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.task_ali && (this.task_ali.isComplete == false)) {
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
		background: #f5f5f5;
	}

	.contBox {
		width: 100%;
		height: 396rpx;
		box-sizing: border-box;
		background: url(/static/walk/amend/bg.png)no-repeat;
		background-size: 100% 100%;

		// .contTitle {
		// 	position: fixed;
		// 	left: 0;
		// 	top: 0;
		// 	width: 100%;
		// 	// box-sizing: border-box;
		// 	display: flex;
		// 	align-items: center;
		// 	padding-left: 38rpx;
		// 	background: url(/static/walk/amend/bg.png)no-repeat;
		// 	background-size: 100% auto;
		// 	z-index: 9999;

		// 	image {
		// 		width: 280rpx;
		// 		height: 36rpx;
		// 	}
		// }

		.banner {
			width: 710rpx;
			margin: 0 auto;
			// margin-top: 80rpx;
			height: 240rpx;

			.swiper {
				height: 240rpx;
				border-radius: 14rpx;
				overflow: hidden;

				.swiper-item {
					height: 100%;

					.swiper-itemList {
						height: 100%;

						image {
							width: 100% !important;
							height: 240rpx;
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
						width: 100%;
						border-radius: 10rpx;
					}
				}
			}
		}

	}

	.tbody {
		background: #F5F5F5;

		&::-webkit-scrollbar {
			display: none;
		}

		.cont {
			padding: 20rpx;
			margin-top: 20rpx;

			&::-webkit-scrollbar {
				display: none;
			}


			// a阿里广告
			.alAd {
				// height: 236rpx;
				margin: 12rpx auto;
				background: #fff;
				border-radius: 16rpx;
			}


			.newWefa {
				box-sizing: border-box;
				padding: 26rpx 18rpx 22rpx 18rpx;
				background: #FDFDFD;
				border-radius: 16rpx;
				margin-top: 20rpx;

				.title {
					display: flex;
					justify-content: space-between;

					.left {
						display: flex;
						align-items: center;

						text {
							font-size: 30rpx;
							color: #343434;
							font-weight: bold;
						}

						image {
							width: 114rpx;
						}
					}

					.right {
						display: flex;
						align-items: center;

						text {
							font-size: 22rpx;
							color: #9A9A9A;
							padding-right: 8rpx;
						}

						image {
							width: 6rpx;
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
						width: 150rpx;
						margin-right: 12rpx;

						.imgBox {
							width: 150rpx;
							height: 150rpx;
							background: #F6F6F6;
							border-radius: 16rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							overflow: hidden;
							position: relative;

							.juan {
								position: absolute;
								left: 50%;
								transform: translateX(-50%);
								bottom: 0;
								width: 96rpx;
								height: 30rpx;
								background: url(/static/walk/amend/juaner.png)no-repeat;
								background-size: 100% 100%;
								display: flex;

								.left {
									width: 32rpx;
								}

								.contJuan {
									flex: 1;
									text-align: center;
									line-height: 30rpx;
									font-size: 18rpx;
									color: #fff;
								}
							}

							image {
								width: 100%;
							}
						}

						.price {
							margin-top: 24rpx;
							display: flex;
							align-items: baseline;

							&-left {
								margin-right: 6rpx;
								font-size: 26rpx;
								font-weight: 400;
								color: #FF2B31;
							}

							&-right {

								font-size: 18rpx;
								font-weight: 400;
								color: #999999;
								text-decoration: line-through;
							}
						}

					}
				}
			}

			.fenlan1 {
				display: flex;
				background: #fff;
				border-radius: 0 0 16rpx 16rpx;
				border-top: 1px solid #F2F2F2;
				margin-top: 24rpx;
				.icont {
					flex: 1;
					padding: 24rpx 18rpx 0 0;
					box-sizing: border-box;
					overflow: hidden;
					border-right: 1px solid #F2F2F2;
					&:nth-last-of-type(1){
						padding: 24rpx 0 0 18rpx;
						border: none;
					}
					.items {
						display: flex;
						align-items: center;

						text {
							font-size: 30rpx;
							color: #343434;
							margin-right: 5rpx;
						}

						image {
							width: 114rpx;
						}
					}

					&:nth-of-type(1) {
						border-right: none;
						border-right: 1px solid #EAEAEA;
					}

					.contImg {
						padding-top: 24rpx;
						display: flex;
						justify-content: space-between;

						.imgBox {
							position: relative;
							width: 150rpx;
							height: 150rpx;
							background: #FFFFFF;
							border-radius: 16rpx;
							overflow: hidden;

							image {
								width: 100%;
								height: 100%;
							}

							.buttom {
								width: 100%;
								height: 34rpx;
								font-size: 22rpx;
								color: #fff;
								position: absolute;
								bottom: 0;
								left: 0;
								background: rgba(255, 91, 63, 0.8);
								text-align: center;
								line-height: 34rpx;
							}
						}
					}
				}

			}

			.imgBoxBotom {
				margin-top: 12rpx;
				display: flex;
				justify-content: space-between;

				.icont {

					width: 352rpx;
					height: 246rpx;
					border-radius: 16rpx;
					overflow: hidden;

					image {
						width: 100%;
					}
				}
			}

			//TO DO 商品tab栏
			.tabBox {
				min-height: 110vh;

				.goodsTabBox {

					width: 100%;
					box-sizing: border-box;
					white-space: nowrap;
					position: sticky;
					position: -webkit-sticky;
					background: #F5F5F5;
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
							font-size: 26rpx;
							color: #343434;
							font-weight: bold;
							position: relative;
						}
					}

					.iconOne:nth-of-type(1) {
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
							padding-bottom: 10rpx;

							&::before {
								content: '';
								position: absolute;
								display: block;
								width: 100%;
								height: 4rpx;
								border-radius: 2rpx;
								background: linear-gradient(90deg, #FF614B, #FF3131);
								bottom: 0;
							}
						}
					}

					.iconList {
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #FF2B31;
							padding-bottom: 10rpx;

							&::before {
								content: '';
								position: absolute;
								display: block;
								width: 100%;
								height: 4rpx;
								border-radius: 2rpx;
								background: linear-gradient(90deg, #FF614B, #FF3131);
								bottom: 0;
							}
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
						width: 350rpx;
						margin: 0 10rpx 10rpx 0;
						border-radius: 16rpx;
						overflow: hidden;
						background: #fff;

						&:nth-of-type(2n+0) {
							margin-right: 0;
						}

						.topImage {
							width: 350rpx !important;
							height: 350rpx !important;
						}

						.tabCont-bottom {
							padding: 0 14rpx 24rpx;

							.title {
								padding-top: 26rpx;
								font-size: 26rpx;
								height: 26rpx;
								font-weight: 400;
								color: #333333;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
							}

							.price {
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding-top: 20rpx;

								.priceLeft {
									font-size: 20rpx;
									color: #F84A23;
									font-weight: bold;

									.dian1 {
										font-size: 34rpx;
									}

									.dian2 {
										font-size: 20rpx;
									}
								}

								.overPrice-left {

									font-size: 22rpx;
									font-weight: 400;
									color: #999999;
									text-decoration: line-through;
								}
							}

							.overPrice {
								padding-top: 16rpx;
								display: flex;
								justify-content: space-between;

								.juan {
									width: 120rpx;
									height: 40rpx;
									border-radius: 4rpx;
									display: flex;
									overflow: hidden;

									.imgJuan {
										width: 40rpx;
										height: 40rpx !important;
									}

									.text {
										flex: 1;
										text-align: center;
										font-size: 20rpx;
										font-weight: 400;
										color: #F84A23;
										line-height: 40rpx;
										box-sizing: border-box;
										border: 2rpx solid #F84A23;
										border-left: none;
										border-radius: 0 4rpx 4rpx 0;
									}
								}

								&-right {
									display: flex;
									padding: 10rpx 10rpx;
									border-radius: 8rpx;
									background: rgba(255, 72, 68, 0.1);

									image {
										width: 20rpx;
									}

									.titles {
										padding-left: 8rpx;
										font-size: 20rpx;
										font-weight: 400;
										color: #666;

										text {
											color: #FF4845;
										}
									}

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

	.aliad {
		width: 710rpx;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 10rpx;

		.aliad_head {
			display: flex;
			justify-content: space-between;
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
</style>
