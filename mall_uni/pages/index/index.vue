<template>
	<view class="houm">
		<!--TO DO 导航栏 -->
		<view v-if="adList.indexTopLeftAd.length > 0" class="nav" :style="{'padding-top':STATUS_BAR_HEIGTH+'px','height':TITLE_BAR_HEIGTH+'px'}">
			<image :src="adList.indexTopLeftAd[0].image" mode="aspectFit" @click="adClick(adList.indexTopLeftAd[0])"></image>
		</view>
		<!--TO DO 主题内容 -->
		<view class="contBody" :style="{paddingTop:STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}">
			<view class="contTop">
				<!-- 输入框 -->
				<!-- <view class="bgCont" :style="{top:STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}"></view> -->
				<!-- <view class="inputSroll" :style="{top:STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}">
					<view class="inputBox" @click="inputSear">
						<view class="iconSeach">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/search.png" mode="scaleToFill"></image>
							<text>输入商品名称或粘贴淘宝标题</text>
						</view>
						<view class="btns">
							<button type="default">搜索</button>
						</view>
					</view>
				</view> -->
				<!-- swiper -->
				<view class="swiper">
					 <!-- :style="{paddingTop:89+'rpx'}" -->
					<swiper class="swiper" @change="change" :indicator-dots='true' :autoplay='true' :interval='3000' :duration='300'
					 :mode="mode">
						<swiper-item v-for="(item ,index) in adList.projectorAd" :key="index">
							<view class="swiper-item" @click="adClick(item)">
								<image :src="item.image" mode="widthFix"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>

				<!-- 菜单导航栏 -->
				<view class="tabNav">
					<view class="tabList" v-for="(tabItem,tabIndex) in navAd.top" :key='tabIndex' @click="adClick(tabItem)">
						<view class="">
							<image :src="tabItem.image" mode="aspectFit"></image>
						</view>
						<text>{{tabItem.title}}</text>
					</view>
				</view>
				<view class="tabNav tab">
					<view class="tabList" v-for="(tabItem,tabIndex) in navAd.bottom" :key='tabIndex' @click="adClick(tabItem)">
						<image :src="tabItem.image" mode="aspectFit"></image>
						<view>{{tabItem.title}}</view>
					</view>
				</view>

			</view>
			<!--TO DO 红包 -->
			<view class="red_packet">
				<view class="red_packetBanner">
					<view class="" @click="adClick(adList.indexMd[0].projector[0])">
						<image :src="adList.indexMd[0].projector[0].image" mode="widthFix"></image>
					</view>
				</view>
				<view class="red_packetBox">
					<view class="packetImg" v-for="(redItem,redIndex) in adList.indexMd[0].adList" :key="redIndex" @click="adClick(redItem)">
						<image :src="redItem.image" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!--TO DO 商品导航栏 -->
			<view class="goodsTab">
				<!-- TD DO 导航栏 -->
				<scroll-view :class="{scroll:menuFixed}" class="goodsTabBox" :style="{top:STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}"
				 scroll-x='true' show-scrollbar='false'>
					<view class="goodsTabList" :class="{iconList:active == index,iconOne:activeOne}" v-for="(item,index) in tabList"
					 :key="index" @click="tabIons(index)">
						<text>{{item.title}}</text>
					</view>
				</scroll-view>
				<!-- TO DO详情 -->
				<view class="goodsDetails" :class="{scrollPadd:menuFixed}">
					<!-- <scroll-view scroll-x="true" > -->
					<view class="lisDetails" @click="datails(item,$event)" v-for="(item,index) in goodsList" :key="index">
						<view class="lisImgBox">
							<image lazy-load="true" :src="item.pic" mode="aspectFit"></image>
						</view>
						<view class="listRight">
							<view class="listText">
								{{item.title}}
							</view>
							<view class="listIcon">
								<view class="listIconL" v-if="item.coupon_money > 0">
									<text class="juan">券</text>
									<text>{{item.coupon_money}}元</text>
								</view>
								<view class="listIconR">
									<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image> -->
									<!-- <text>爆买{{item.format_volume}}件</text> -->
									<text>返{{user.is_team==1?Number(item.up_money_fraction):Number(item.user_money_fraction)}}集分宝</text>
								</view>
							</view>

							<view class="originalBox">
								<view class="originalL">
									<text>原价</text>
									<text class="ListDelet">￥{{item.price}}</text>
								</view>
								<view class="listIconR">
									<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image> -->
									<view>热卖<text class="fontred">{{item.format_volume}}</text>件</view>
								</view>
							</view>

							<view class="listDetailsB">
								<view class="DetailsBottomText">
									<text>到手价￥</text>
									<text class="listBig">{{item.endprice}}</text>
								</view>
								<view class="DetailsBottomBtn">
									<text>马上抢</text>
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/right.png" mode="aspectFit"></image>
								</view>
							</view>
						</view>
					</view>
					<loading v-if="isInit" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				</view>
			</view>
		</view>
		<!-- TO DP 弹窗 -->
		<view class="pop-up-hide" v-show="popIndex">
			<view class="pop-up" v-for="(items,indexs) in isAdData" :key='indexs'>
				<view class="popImg">
					<image :src="items.pic" mode="aspectFit"></image>
				</view>
				<view class="popSyinp">
					<view class="shop">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/shop.png" mode="aspectFit"></image><text>{{items.nick}}</text>
					</view>
					<view class="title">{{items.title}}</view>
					<view class="pop-discount">
						<view class="discount" v-if="items.coupon_money > 0">
							<text class="juan">券</text>
							<text>{{items.coupon_money}}元</text>
						</view>
						<view class="points">
							<text>返{{user.is_team==1?Number(items.up_money_fraction):Number(items.user_money_fraction)}}集分宝</text>
						</view>
					</view>
					<view class="original">
						<text>原价</text>
						<text class="ListDelet">￥{{items.price}}</text>
					</view>
					<view class="pop-price">
						<view class="DetailsBottomText">
							<text v-if="items.coupon_money > 0">券后</text>
							<text v-else>在售</text>
							<text class="pric">￥</text>
							<text class="listBig">{{items.endprice}}</text>
						</view>
						<view class="sold">
							<text>已售{{items.format_volume}}</text>
						</view>
					</view>
				</view>
				<view class="btnBottom">
					<view class="searchBtn" @click="searchMore(items)">搜索更多</view>
					<view class="detalisBtn" @click="datails(items)">查看详情</view>
				</view>
				<view class="close" @click="popindex"></view>
				<view class="label"></view>
			</view>
		</view>
	</view>
</template>

<script>
	let toNavas = false
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import $axios from "../../utils/ajax.js"
	import $utils from '../../utils/utils.js' //vuex
	export default {
		components: {
			uniSwiperDot
		},
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				current: 0,
				mode: 'round',
				autoplay: true,
				style: {
					width: 4,
					height: 4,
					backgroundColor: '#fff',
					border: 'none',
					selectedBackgroundColor: '#fff',
					selectedBorder: 'none'
				},
				active: false,
				activeOne: true,
				hides: 0,
				menuFixed: false,
				inputFixed: false,
				tabList: [],
				goodsList: [],
				paging: 1,
				loadingMore: false,
				noMoreData: false,
				noData: false,
				popIndex: false,
				dataLid: 0,
				dataType: 0,
				isAdData: [],
				keyWords: 0,
				isInit: false,
				scrollLeft: 0,
				navAd: {
					top: [],
					bottom: []
				}
			};
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				},
			})
			// 保存邀请人ID
			if (typeof(option.invite_id) == "string") {
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
			}
		},
		methods: {
			inputSear() {
				uni.navigateTo({
					url: './copySearch'
				})
			},
			// TO DO 商品菜单列表tab栏
			getGoodsTabList() {
				$axios.get({
					url: 'Base/getCat'
				}).then((res) => {
					if (res.data.code == 200) {
						this.tabList = res.data.data
						this.getGoods();
					}

				}).catch((err) => {

				})
			},
			// TO DO 商品列表	
			getGoods(index) {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				$axios.get({
					url: 'Goods/getList',
					data: {
						p: this.paging,
						cid: this.tabList[this.hides].cid,
					}
				}).then((res) => {
					if (res.data.code == 200) {

						let data = this.goodsList
						res.data.data.list.forEach((item, index, array) => {
							this.goodsList.push(item)
						})
						this.goodsList = data
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
						// this.goodsList = res.data.data.list
					}

					this.loadingMore = false;


				}).catch((error) => {
					this.loadingMore = false;
				})
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
				uni.navigateTo({
					url: '../listDatails/listDatails?iid=' + item.num_iid + '&type=' + item.goods_type
				})
			},
			// TO-DO 广告弹窗
			popUp() {
				// uni.getClipboardData({
				// 	success: (rest) => {
				// 		$axios.get({
				// 			url: 'Goods/search',
				// 			data: {
				// 				keyword: rest.data //'xz0pc37gXbM'
				// 			}
				// 		}).then((res) => {
				// 			uni.setClipboardData({
				// 				data: ''
				// 			})
				// 			if (res.data.code == 200) {
				// 				this.isAdData = res.data.data.list
				// 				if (this.isAdData.length != 0) {
				// 					this.popIndex = true
				// 				}
				// 			}

				// 		}).catch((err) => {})
				// 	}
				// });
			},
			// 点击搜索更多跳转
			searchMore(items) {
				this.setKeyword(items.title)
				uni.navigateTo({
					url: './searchResult?search=' + items.title
				});
				// console.log(items.title)
			},
			setKeyword(key) {
				if (key != '' && key != undefined) {
					$axios.post({
						url: 'User/setKeyword',
						data: {
							keyword: key
						}
					}).then((res) => {}).catch(() => {})
				}
			},
			popindex() {
				this.popIndex = false;
			},
			searchBtn() {
				this.getSearch();
			},
			change(e) {
				this.current = e.detail.current;
			},
			// TO DO tab导航栏
			tabIons(index) {
				this.paging = 1
				this.activeOne = false
				this.active = index
				this.hides = index
				this.goodsList = []
				this.scrollLeft = (index - 2) * 60;
				this.getGoods()

			},
			// TO DO 导航栏吸顶
			onPageScroll(e) {
				uni.createSelectorQuery().select('.goodsTab').boundingClientRect(data => { //目标节点
					let h = this.STATUS_BAR_HEIGTH + this.TITLE_BAR_HEIGTH
					if (data.top <= h) {
						this.menuFixed = true
					} else {
						this.menuFixed = false
					}

				}).exec()
			},
			init() {
				// this.popUp()
				this.isInit = true
			},

			// TO DO 获取焦点事件跳转页面
			focus() {
				uni.navigateTo({
					url: 'search?name=1'
				});

			},
			// 点击广告
			adClick(ad) {
				$axios.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				$utils.adJump(ad, this);
			},
			// 邀请
			onShowSharePanelTap() {
				my.showSharePanel();
			},
		},
		created() {
			this.getGoodsTabList();
		},
		mounted() {
			if (this.isLogin) {
				this.init()
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '淘牛品',
					desc: '淘牛品',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/08/14/bf170c3bae606409a8ffee5b9f0cc692.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '淘牛品',
					desc: '淘牛品',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/08/14/bf170c3bae606409a8ffee5b9f0cc692.jpg',
					path: '/pages/index/index',
				};
			}
		},
		computed: {
			adList() {
				let tmp = this.$store.state.adList;
				let adList = [];
				if (tmp.navAd != undefined) {
					this.navAd = {
						top: tmp.navAd.slice(0, 5),
						bottom: tmp.navAd.slice(5, 15),
					};
					adList = adList.concat(this.navAd.top);
					adList = adList.concat(this.navAd.bottom);
				}
				if (tmp.indexTopLeftAd && tmp.indexTopLeftAd.length > 0) {
					adList.push(tmp.indexTopLeftAd[0]);
				}

				if (tmp.indexTopLeftAd && tmp.indexTopLeftAd.length > 0) {
					adList.push(tmp.indexTopLeftAd[0]);
				}

				if (tmp.indexMd && tmp.indexMd.length > 0) {
					if (tmp.indexMd[0].projector && tmp.indexMd[0].projector[0].length > 0) {
						adList.push(tmp.indexMd[0].projector[0]);
					}

					if (tmp.indexMd[0].adList && tmp.indexMd[0].adList[0].length > 0) {
						adList.push(tmp.indexMd[0].adList[0]);
					}
				}

				if (tmp.projectorAd && tmp.projectorAd.length > 0) {
					adList = adList.concat(tmp.projectorAd);
				}

				adList.forEach((item) => {
					$utils.addAdShowLog(item);
				})

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
			}
		},
		onReachBottom() {
			this.getGoods()
		}
	}
</script>

<style lang="less">
	.houm {
		.nav {
			width: 100%;
			// height: 168rpx;
			background: #ff0000;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9;

			image {
				width: 335rpx;
				height: 54rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				background-position: left top !important;
			}
		}

		.contBody {
			background: #ff0000;
			padding-top: 168rpx;
					border-radius:0.35rem 0.35rem 0rem 0rem;

			.contTop {
				box-sizing: border-box;
				padding: 30rpx 28rpx;
				border-radius: 35rpx 35rpx 0rpx 0rpx;
				background: #fff;

				.bgCont {
					width: 100%;
					height: 40px;
					left: 0;
					background: #ff0000;
					position: fixed;
					z-index: 9;
				}

				.inputSroll {
					width: 100%;
					box-sizing: border-box;
					border-radius: 35rpx 35rpx 0rpx 0rpx;
					background: #fff;
					padding: 30rpx 28rpx 23rpx 30rpx;
					position: fixed;
					// top: ;
					left: 0;
					z-index: 9;
					display: flex;

					.quxiao {
						font-size: 28rpx;
						color: #111;
					}
				}

				.inputBox {
					width: 100%;
					height: 66rpx;
					box-sizing: border-box;
					background: #f0f1f3;
					border-radius: 33rpx;
					padding: 0 10rpx 0 22rpx;
					line-height: 66rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.iconSeach {
						line-height: 66rpx;
						width: 80%;
						height: 66rpx;
						display: flex;
						align-items: center;

						image {
							width: 25rpx;
							height: 25rpx;
						}

						text {
							color: #999;
							font-size: 26rpx;
							background-color: #f0f1f3;
							padding-left: 10rpx;
							line-height: 66rpx;
						}
					}

					.btns {
						text-align: right;

						button {
							line-height: 66rpx;
							width: 108rpx;
							height: 52rpx;
							background-image: linear-gradient(90deg,
								#ff6662 0%,
								#ff423e 100%),
								linear-gradient(#b93f1c,
								#b93f1c);
							border-radius: 26rpx;
							color: #fff;
							font-size: 28rpx;
							text-align: center;
							line-height: 52rpx;
						}
					}
				}

				.swiper {
					// padding-top: 23rpx;

					 .swiper {
						.swiper-item {
							image {
								width: 100%;
								height: 175rpx !important;
								background: #ccc;
								border-radius: 20rpx;
								overflow: hidden;
							}
						}
					}
				}

				// tab菜单栏
				.tabNav {
					display: flex;
					// justify-content: space-around;
					padding-top: 25rpx;

					.tabList {
						width: 20%;
						text-align: center;

						// display: flex;
						// flex-wrap: wrap;
						// justify-content: center;
						image {
							width: 90rpx;
							height: 90rpx;
						}

						text {
							font-size: 24rpx;
							color: #333;
						}
					}
				}

				.tab {
					flex-wrap: wrap;
					padding-top: 0;

					.tabList {
						// display: flex;
						// flex-wrap: wrap;
						// justify-content: center;
						margin-top: 35rpx;

						image {
							width: 68rpx;
							height: 68rpx;
						}

						view {
							font-size: 22rpx;
							padding-top: 10rpx;
						}
					}
				}
			}

			// TO DO 红包
			.red_packet {
				.red_packetBanner {
					padding-bottom: 20rpx;
					padding-top: 30rpx;
					background: #fff;

					view {
						width: 720rpx;
						height: 195rpx;
						margin: 0 auto;

						image {
							width: 720rpx;
							height: 195rpx;
						}
					}
				}

				.red_packetBox {
					background: rgba(245, 245, 245, 1);
					padding: 18rpx 20rpx;
					padding-bottom: 11rpx;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.packetImg {
						width: 352rpx;
						height: 140rpx;
						background: #fff;
						border-radius: 15rpx;
						overflow: hidden;
						margin-bottom: 7rpx;

						image {
							width: 352rpx;
							height: 140rpx;
						}
					}
				}
			}

			//TO DO 商品tab栏
			.goodsTab {

				.goodsTabBox {
					width: 100%;
					// padding: 0 27rpx;
					box-sizing: border-box;
					height: 90rpx;
					white-space: nowrap;
					background-color: #FFFFFF;

					.goodsTabList {
						line-height: 90rpx;
						margin: 0 25rpx;
						display: inline-block;
						position: relative;

						text {
							font-size: 26rpx;
							color: #333;
						}
					}

					.iconOne:nth-of-type(1) {
						text {
							font-size: 28rpx;
							color: #ff6662;
						}
					}

					.iconOne:nth-of-type(1)::before {
						content: '';
						position: absolute;
						display: block;
						width: 36rpx;
						height: 13rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/hx.png)no-repeat;
						background-size: 100% 100%;
						bottom: 13rpx;
						left: 50%;
						transform: translateX(-50%);
					}

					.iconList {
						text {
							font-size: 28rpx;
							color: #ff6662;
						}

						::before {
							content: '';
							position: absolute;
							display: block;
							width: 36rpx;
							height: 13rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/hx.png)no-repeat;
							background-size: 100% 100%;
							bottom: 13rpx;
							left: 50%;
							transform: translateX(-50%);
						}
					}
				}

				.scroll {
					position: fixed;
					top: 259rpx;
				}

				.goodsTabBox::-webkit-scrollbar {
					display: none;
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

							image {
								width: 220rpx;
								height: 220rpx;
								border-radius: 10rpx;
							}
						}

						.listRight {
							margin-left: 20rpx;
							padding-top: 10rpx;
							width: 100%;

							.listText {
								// width: 460rpx;
								color: #111;
								font-size: 26rpx;
								line-height: 40rpx;
								// padding-right: 28rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box; //作为弹性伸缩盒子模型显示。
								-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
								-webkit-line-clamp: 1;
							}

							.listIcon {
								margin-top: 10rpx;
								display: flex;

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

										.fontred {
											display: inline-block;
											color: rgb(255, 72, 68);
										}

									}
								}
							}

							.listDetailsB {
								display: flex;
								justify-content: space-between;
								margin-top: 15rpx;

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

								.DetailsBottomBtn {
									width: 135rpx;
									height: 55rpx;
									background-image: linear-gradient(90deg,
										#ff6662 0%,
										#ff423e 100%),
										linear-gradient(#f84a23,
										#f84a23);
									background-blend-mode: normal,
										normal;
									border-radius: 27rpx 0rpx 0rpx 27rpx;
									line-height: 55rpx;
									text-align: right;

									text {
										font-size: 26rpx;
										color: #fff;
									}

									image {
										width: 18rpx;
										height: 20rpx;
										margin: 0 5rpx;
									}
								}
							}
						}
					}

					.lisDetails:nth-child(1) {
						margin-top: 0;
					}
				}

				.scrollPadd {
					padding-top: 90rpx;
				}
			}
		}

		// 弹窗
		.pop-up-hide {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);
			position: fixed;
			left: 0;
			top: 0;
			z-index: 99;

			.pop-up {
				width: 502rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				border-radius: 17rpx;
				background: #fff;

				// transform: translateY(-50%);
				.popImg {
					image {
						width: 100%;
						height: 460rpx;
					}
				}

				.popSyinp {
					padding: 0 20rpx 0 20rpx;
					background: #fff;

					.shop {
						padding-top: 18rpx;
						display: flex;
						align-items: center;

						image {
							width: 26rpx;
							height: 24rpx
						}

						text {
							font-size: 24rpx;
							color: #777;
							margin-left: 10rpx;
						}
					}

					.title {
						color: #000;
						font-size: 26rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 1;
						margin-top: 20rpx;
					}

					.pop-discount {
						display: flex;
						margin-top: 18rpx;

						.discount {
							width: 140rpx;
							height: 40rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 40rpx;
							display: flex;

							text {
								display: block;
								color: #ff4844;
								font-size: 22rpx;
								flex: 1;
								text-align: center;
							}

							.juan {
								width: 40rpx;
								line-height: 40rpx;
								color: #fff;
								flex: none;
								// margin: 0 20rpx 0 10rpx;
							}
						}

						.points {
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 10rpx;
							margin-left: 14rpx;
							height: 40rpx;
							line-height: 40rpx;

							text {
								color: #ff3a00;
								font-size: 22rpx;
							}
						}
					}

					.original {
						margin-top: 20rpx;

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

					.pop-price {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 18rpx 0 24rpx 0;
						border-bottom: 2px solid #f5f5f5;

						.DetailsBottomText {
							text {
								color: #ff4844;
								font-size: 24rpx;
							}

							.price {
								font-size: 20rpx;
							}

							.listBig {
								font-size: 40rpx;
							}
						}

						.sold {
							font-size: 24rpx;
							color: #999;
						}
					}
				}

				.btnBottom {
					padding: 22rpx 30rpx 26rpx 30rpx;
					display: flex;
					justify-content: space-between;
					background: #fff;
					border-radius: 0 0 17rpx 17rpx;

					.searchBtn {
						width: 213rpx;
						height: 71rpx;
						border-radius: 36rpx;
						border: solid 1rpx #d0d0d0;
						box-sizing: border-box;
						text-align: center;
						line-height: 71rpx;
						color: #666;
						font-size: 30rpx;
					}

					.detalisBtn {
						width: 213rpx;
						height: 71rpx;
						border-radius: 36rpx;
						background-image: linear-gradient(90deg,
							#ff6662 0%,
							#ff423e 100%),
							linear-gradient(#040404,
							#040404);
						text-align: center;
						line-height: 71rpx;
						color: #fff;
						font-size: 30rpx;
					}
				}

				.close {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					bottom: -85rpx;
					width: 49rpx;
					height: 49rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/close.png)no-repeat;
					background-size: 100% 100%;
				}

				.label {
					position: absolute;
					left: 0;
					top: 26rpx;
					width: 170rpx;
					height: 55rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/labal.png)no-repeat;
					background-size: 100% 100%;
				}
			}

		}
	}
</style>
