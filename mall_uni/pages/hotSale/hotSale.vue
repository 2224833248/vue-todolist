<template>
	<view class="content">
		<view v-if="nav_show" style=" width:100%;height: 160rpx;position:fixed;top:0;background-color:#FF6C5E;z-index:100; transition: 1.5s;"></view>

		<view class="header-content" :style="{'padding-top':STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}">

			<!-- 商品导航-->
			<scroll-view :class="{goodsTabBoxs:nav_show}" :style="{'top':!nav_show?'':(STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px')}"
			 class="goodsTabBox" scroll-x='true' show-scrollbar='false'>
				<view class="goodsTabList" :class="item.cid==cid?'active':''" @click="ckCid(item,index)" v-for="(item,index) in album.cat"
				 :key="index">
					<text>{{item.title}}</text>
				</view>
			</scroll-view>

			<!-- 排名更新文本框 -->
			<view class="refresh">
				距离下次排名更新还有
				<template v-if="shi>0">{{shi}}时</template>
				{{min}}分{{miao}}秒
			</view>
			<!-- 热销榜前三名 -->
			<view class="top_three_box" v-if="topGoods.length>0">
				<!-- 第二 -->
				<view class="two" @click="toDatails(topGoods[1])">
					<view class="image">
						<image lazy-load="true" :src="topGoods[1].pic" mode="aspectFit"></image>
						<view class="sale-num">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/fire.png" />
							<text>热卖{{topGoods[1].time_volume}}件</text>
						</view>
					</view>
					<view class="title">
						{{topGoods[1].title}}
					</view>
					<view class="desc">
						<span class="price">到手价￥<span class="monny">{{topGoods[1].endprice}}</span></span>
						<span class="zhekou">￥{{topGoods[1].promotion_price}}</span>
					</view>
					<view class="listIcon">
						<view class="listIconL">
							<text class="juan">券</text>
							<text>{{topGoods[1].coupon_money}}元</text>
						</view>
						<view class="listIconR">
							<text>返{{user.is_team==1?Number(topGoods[1].up_money_fraction):Number(topGoods[1].user_money_fraction)}}集分宝</text>
						</view>
					</view>
					<view class="num">2</view>
				</view>
				<!-- 第一 -->
				<view class="one" @click="toDatails(topGoods[0])">
					<view class="image">
						<image lazy-load="true" :src="topGoods[0].pic" mode="aspectFit"></image>
						<view class="sale-num">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/fire.png" />
							<text>热卖{{topGoods[0].format_volume}}件</text>
						</view>
					</view>
					<view class="title">
						{{topGoods[0].title}}
					</view>
					<view class="desc">
						<span class="price">到手价￥<span class="monny">{{topGoods[0].endprice}}</span></span>
						<span class="zhekou">￥{{topGoods[0].promotion_price}}</span>
					</view>
					<view class="listIcon">
						<view class="listIconL">
							<text class="juan">券</text>
							<text>{{topGoods[0].coupon_money}}元</text>
						</view>
						<view class="listIconR">
							<text>返{{user.is_team==1?Number(topGoods[0].up_money_fraction):Number(topGoods[0].user_money_fraction)}}集分宝</text>
						</view>
					</view>
					<view class="num_1">1</view>
				</view>
				<!-- 第三 -->
				<view class="three" @click="toDatails(topGoods[2])">
					<view class="image">
						<image lazy-load="true" :src="topGoods[2].pic" mode="aspectFit"></image>
						<view class="sale-num">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/fire.png" />
							<text>热卖{{topGoods[2].time_volume}}件</text>
						</view>
					</view>
					<view class="title">
						{{topGoods[2].title}}
					</view>
					<view class="desc">
						<span class="price">到手价￥<span class="monny">{{topGoods[2].endprice}}</span></span>
						<span class="zhekou">￥{{topGoods[2].promotion_price}}</span>
					</view>
					<view class="listIcon">
						<view class="listIconL">
							<text class="juan">券</text>
							<text>{{topGoods[2].coupon_money}}元</text>
						</view>
						<view class="listIconR">
							<text>返{{user.is_team==1?Number(topGoods[2].up_money_fraction):Number(topGoods[2].user_money_fraction)}}集分宝</text>
						</view>
					</view>
					<view class="num num_3">3</view>
				</view>
			</view>
		</view>
		<view class="main_content">
			<!-- 第四名及以后 -->
			<view class="four" v-for="(item,index) in goods" :key="index" @click="toDatails(item)">
				<!-- 商品销量名次 -->
				<view class="num_456" v-if="(index+4) < 11">{{(index+4)}}</view>
				<view class="left">
					<image lazy-load="true" :src="item.pic" mode="aspectFit"></image>
				</view>
				<view class="right">
					<view class="title">
						{{item.title}}
					</view>
					<view class="desc">
						<span class="price">￥<span class="monny">{{item.endprice}}</span></span>
						<span class="zhekou">￥{{item.promotion_price}}</span>
					</view>
					<view class="listIcon">
						<view class="listIconL" v-if="item.coupon_money">
							<text class="juan">券</text>
							<text>{{item.coupon_money}}元</text>
						</view>
						<view class="listIconR">
							返{{user.is_team==1?Number(item.up_money_fraction):Number(item.user_money_fraction)}}集分宝
						</view>
					</view>
					<view class="qiang_btn">
						<text>近两小时疯抢<span class="xiaoliang">{{item.time_volume}}</span>件</text>
						<text class="mashang">马上抢</text>
					</view>
				</view>
			</view>
		</view>

		<loading v-if="!noData && isInit" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import store from '@/store.js'

	export default {
		data() {
			return {
				shi: '0',
				min: '0',
				miao: '0',
				STATUS_BAR_HEIGTH: 0,
				TITLE_BAR_HEIGTH: 237.5,
				albumId: 0,
				page: 1,
				cid: 0,
				album: {},
				topGoods: [],
				goods: [],
				nav_show: false,
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				relationId:'',
			}

		},
		onLoad(option) {
			if(typeof option.relationId !== "undefined") this.relationId = option.relationId
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
		},
		methods: {
			// 监听页面滚动事件
			onPageScroll: function(e) {
				if (e.scrollTop >= 1) {
					this.nav_show = true
				} else {
					this.nav_show = false
				}
			},
			ckCid(item, index) {
				this.goods = []
				this.cid = item.cid
				this.isDowCat = false
				this.page = 1
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.getGoodsList();
				this.scrollLeft = (index - 2) * this.scrollTopLis;
			},
			toDatails(item) {
				utils.dnClickLog(item.num_iid)
				let url = '../listDatails/listDatails?iid=' + item.num_iid + '&gtype=' + item.goods_type
				if(this.relationId){
					url += "&relationId="+this.relationId
				}
				uni.navigateTo({
					url: url
				})
			},
			//获取专场数据
			postAlbum() {
				ajax.post({
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
						this.getGoodsList();
						this.countDown();
					}
				}).catch(err => {})


			},
			getGoodsList() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.post({
					url: 'Album/getList',
					data: {
						p: this.page,
						albumId: this.albumId,
						cid: this.cid
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item, index, array) => {
							this.goods.push(item)
						})
						if (this.page == 1) {
							this.topGoods = this.goods.slice(0, 3);
							this.goods = this.goods.slice(3, 20);
						}
						if (res.data.data.list.length > 0) {
							this.page++
						} else {
							if (this.page == 1 && res.data.data.list.length == 0) {
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
			},

			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.album.timeEnd * 1000) - new Date()) / 1000)
					if (modulo > 1) {
						let hours = Math.floor(modulo / (60 * 60));
						modulo = modulo % (60 * 60);
						let minutes = Math.floor(modulo / 60);
						let seconds = modulo % 60;

						this.shi = this.timeFormat(hours);
						this.min = this.timeFormat(minutes);
						this.miao = this.timeFormat(seconds);
					} else {
						this.shi = '0';
						this.min = '0';
						this.miao = '0';
						clearInterval(interval);
					}
				}, 500)
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},

		},
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
			}
		},
		onReachBottom() {
			this.getGoodsList()
		}
	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	.content {
		flex-direction: column;
		justify-content: center;
		align-items: center;
		//font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0rpx;
		overflow-x: hidden;

		.header-content {
			width: 100%;
			background: #F2F2F2 url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/st2x.png) no-repeat left top;
			background-size: 750rpx 554rpx;
			padding-bottom: 18rpx;



			.goodsTabBox {
				position: fixed;
				left: 0;
				width: 100%;
				padding: 0 26rpx;
				box-sizing: border-box;
				height: 90rpx;
				white-space: nowrap;

				.goodsTabList {
					line-height: 90rpx;
					padding: 0 25rpx;
					display: inline-block;
					position: relative;

					text {
						font-size: 26rpx;
						color: #FFF;
					}
				}

				.goodsTabList.active {
					height: 86rpx;
					line-height: 92rpx;
					border-bottom: 4rpx solid #FFFFFF;

					text {
						font-size: 28rpx;
						color: #FFF;
						font-weight: bold;
					}
				}
			}

			.goodsTabBoxs {
				background-color: #FFF;
				z-index: 9999;
				color: #ff4844;

				.goodsTabList {
					text {
						color: #ff4844;
					}
				}

				.goodsTabList.active {
					border-bottom: 4rpx solid #ff4844;

					text {
						color: #ff4844;
					}
				}
			}

			.refresh {
				width: 438rpx;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				background: rgba(0, 0, 0, 0.15) url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/djs.png) no-repeat 31rpx 8rpx;
				background-size: 24rpx;
				padding-left: 63rpx;
				margin: 0 auto;
				margin-top: 117rpx;
				box-sizing: border-box;

			}

			.top_three_box {
				width: 100%;
				margin-top: 30rpx;
				display: flex;
				justify-content: space-evenly;
				align-items: flex-end;

				.two {
					width: 210rpx;
					height: 328rpx;
					background-color: #FFFFFF;
					border-radius: 16rpx;
					padding: 10rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					font-weight: normal;
					font-stretch: normal;
					border-radius: 16rpx;
					position: relative;

					.image {
						border-radius: 16rpx;
						width: 190rpx;
						height: 190rpx;
						position: relative;

						image {
							width: 190rpx;
							height: 190rpx;
							display: block;
							border-radius: 16rpx;
						}

						.sale-num {
							width: 100%;
							height: 32rpx;
							position: absolute;
							left: 0;
							bottom: 0;
							background: #FF605C;
							font-size: 18rpx;
							z-index: 2;
							border-radius: 0 0 16rpx 16rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 18rpx;
								height: 21rpx;
								margin-right: 7rpx;
							}

							text {
								font-size: 18rpx;
								color: #fff;
							}
						}
					}

					.title {
						width: 100%;
						height: 24rpx;
						line-height: 24rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 18rpx;
						font-weight: 500;
						color: #121212;
						margin-top: 12rpx;
						overflow-x: hidden;
					}

					.desc {
						display: flex;
						width: 100%;
						justify-content: space-between;
						//padding: 14rpx;
						display: inline-block;
						//margin-top: -6rpx;
						box-sizing: border-box;

						.price {
							display: inline-block;
							color: #f00;
							font-size: 13rpx;

							.monny {
								font-size: 18rpx;
							}
						}

						.zhekou {
							display: inline-block;
							font-size: 18rpx;
							font-weight: 500;
							color: #9A9A9A;
							padding-left: 20rpx;
							text-decoration: line-through;
						}

					}

					.listIcon {
						width: 100%;
						display: flex;
						justify-content: space-between;
						margin-top: 10rpx;
						height: 24rpx;

						.listIconL {
							width: 82rpx;
							height: 24rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 26rpx;
							display: flex;

							text {
								color: #ff4844;
								font-size: 12rpx;
								flex: 1;
								text-align: center;
								display: block;
								line-height: 25rpx;
							}

							.juan {
								width: 24rpx;
								line-height: 25rpx;
								color: #fff;
								flex: none;
							}
						}

						.listIconR {
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 5rpx;
							height: 24rpx;
							color: #ff3a00;
							font-size: 13rpx;
							line-height: 24rpx;
							text-align: center;
						}
					}


					.num {
						position: absolute;
						left: 9rpx;
						top: 0;
						width: 44rpx;
						height: 52rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/xz2.png) no-repeat;
						background-size: 44rpx 52rpx;
						z-index: 3;

						line-height: 58rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #FFFFFF;
						text-align: center;
					}

					.num_3 {
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/xz3.png) no-repeat;
						background-size: 44rpx 52rpx;
					}
				}

				.one {
					width: 260rpx;
					height: 391.3rpx;
					border-radius: 16rpx;
					padding: 14rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: center;
					font-weight: normal;
					font-stretch: normal;
					border-radius: 16rpx;
					position: relative;
					background-color: #FFF;

					.image {
						border-radius: 16rpx;
						width: 232rpx;
						height: 232rpx;
						position: relative;

						image {
							width: 100%;
							height: 100%;
							display: block;
							border-radius: 16rpx;
						}

						.sale-num {
							width: 100%;
							height: 38rpx;
							position: absolute;
							left: 0;
							bottom: 0;
							background: #FF605C;
							z-index: 2;
							border-radius: 0 0 16rpx 16rpx;
							display: flex;
							align-items: center;
							justify-content: center;

							image {
								width: 23rpx;
								height: 26rpx;
								margin-right: 7rpx;
							}

							text {
								font-size: 22rpx;
								color: #fff;
							}
						}
					}

					.title {
						width: 100%;
						height: 26rpx;
						line-height: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 22rpx;
						font-weight: 500;
						color: #111111;
						margin-top: 16rpx;
						overflow-x: hidden;
					}

					.desc {
						display: flex;
						width: 100%;
						justify-content: space-between;
						//padding: 14rpx;
						display: inline-block;
						//margin-top: -6rpx;
						box-sizing: border-box;

						.price {
							display: inline-block;
							color: #f00;
							font-size: 18rpx;

							.monny {
								font-size: 22rpx;
							}
						}

						.zhekou {
							display: inline-block;
							font-size: 22rpx;
							font-weight: 500;
							color: #9A9A9A;
							padding-left: 22rpx;
							text-decoration: line-through;
						}

					}

					.listIcon {
						width: 100%;
						display: flex;
						justify-content: space-between;
						margin-top: 13rpx;
						height: 30rpx;

						.listIconL {
							width: 102rpx;
							height: 30rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 30rpx;
							display: flex;

							text {
								color: #ff4844;
								font-size: 16rpx;
								flex: 1;
								text-align: center;
								display: block;
								line-height: 35rpx;
							}

							.juan {
								width: 32rpx;
								line-height: 35rpx;
								color: #fff;
								flex: none;
							}
						}

						.listIconR {
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 7rpx;
							height: 30rpx;
							color: #ff3a00;
							font-size: 16rpx;
							line-height: 30rpx;
							text-align: center;
						}
					}

					.num_1 {
						position: absolute;
						left: 9rpx;
						top: 0;
						width: 44rpx;
						height: 52rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/xz1.png) no-repeat;
						background-size: 44rpx 52rpx;
						z-index: 3;
						line-height: 58rpx;
						font-size: 28rpx;
						font-weight: bold;
						color: #FFFFFF;
						text-align: center;
					}

				}

				.three {
					@extend .two;
				}
			}
		}

		.main_content {
			width: 715rpx;
			background-color: #F2F2F2;
			margin: 0 auto;
			margin-top: 10rpx;

			.four {
				width: 100%;
				height: 272rpx;
				margin-bottom: 18rpx;
				border-radius: 16rpx;
				position: relative;
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				background: #FFFFFF;

				.num_456 {
					position: absolute;
					left: 9rpx;
					top: 0;
					width: 44rpx;
					height: 52rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/xz4.png) no-repeat;
					background-size: 44rpx 52rpx;
					z-index: 3;

					line-height: 58rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #FFFFFF;
					text-align: center;

				}

				.left {
					width: 240rpx;
					height: 240rpx;
					border-radius: 10rpx;

					image {
						width: 240rpx;
						height: 240rpx;
						display: block;
						border-radius: 10rpx;
					}
				}

				.right {
					width: 418rpx;
					height: 226rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/taobao.png) no-repeat left 12rpx;
					background-size: 32rpx;


					.title {
						width: 100%;
						height: 28rpx;
						line-height: 28rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						font-size: 26rpx;
						font-weight: 500;
						color: #111111;
						margin-top: 16rpx;
						margin-left: 40rpx;
						overflow-x: hidden;
					}

					.desc {
						display: flex;
						width: 100%;
						justify-content: space-between;
						//padding: 14rpx;
						display: inline-block;
						//margin-top: -6rpx;
						box-sizing: border-box;

						.price {
							display: inline-block;
							color: #f00;
							font-size: 20rpx;

							.monny {
								font-size: 30rpx;
							}
						}

						.zhekou {
							display: inline-block;
							font-size: 22rpx;
							font-weight: 500;
							color: #9A9A9A;
							padding-left: 10rpx;
							text-decoration: line-through;
						}

					}

					.listIcon {
						width: 100%;
						display: flex;
						justify-content: space-between;
						margin-top: 13rpx;
						height: 36rpx;
						padding: 0px 5rpx;
						margin-top: -5rpx;
						box-sizing: border-box;

						.listIconL {
							width: 125rpx;
							height: 36rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 36rpx;
							display: flex;

							text {
								color: #ff4844;
								font-size: 20rpx;
								flex: 1;
								text-align: center;
								display: block;
								line-height: 38rpx;
							}

							.juan {
								width: 38rpx;
								line-height: 38rpx;
								color: #fff;
								flex: none;
							}
						}

						.listIconR {
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 7rpx;
							height: 36rpx;
							color: #ff3a00;
							font-size: 20rpx;
							line-height: 36rpx;
							text-align: center;
						}
					}

					.qiang_btn {
						width: 418.7rpx;
						height: 50rpx;
						background: #FFF2EB url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/142.png) no-repeat right top;
						background-size: 154rpx 50rpx;
						border-radius: 25rpx;
						display: flex;

						text {
							width: 265rpx;
							display: block;
							font-size: 22rpx;
							line-height: 50rpx;
							font-weight: 500;
							color: #AA5D25;
							padding-left: 24rpx;
							box-sizing: border-box;

							.xiaoliang {
								display: inline;
								font-weight: 500;
								color: #FF4844;
							}
						}

						.mashang {
							display: inline-block;
							flex: 1;
							height: 50rpx;
							//text-align: center;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/hotSale/jt.png) no-repeat 120rpx 16rpx;
							background-size: 9rpx 18rpx;
							font-size: 26rpx;
							//margin-left: 40rpx;
							color: #FFFFFF;
							padding-left: 30rpx;
						}

					}

				}

			}

			// .five{
			// 	@extend .four;

			// }
			// .six{
			// 	@extend .four;
			// }

		}

	}
</style>
