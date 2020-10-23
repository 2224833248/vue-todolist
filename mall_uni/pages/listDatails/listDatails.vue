<template>
	<view class="bodys" :style="{overflow:'hidden',height:'100%'}">
		<!-- TO-DO 滑动块 -->
		<aui-loading ref="ccc" :show="true" :type="4" direction="col" msg="加载中" :mask="true" :theme="2"></aui-loading>
		<view class="contTop">
			<swiper class="swiper">
				<swiper-item class="swiperItem" v-for="(item,index) in datails.pic_list" :key='index'>
					<view class="imageBox">
						<image :src="item" mode="aspectFit"></image>
					</view>
					<view class="iconText">{{index+1}}/{{datails.pic_list.length}}</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- TO-DO详情介绍 -->
		<view class="datails">
			<view class="priceBox">
				<view class="isPrice">
					<text>到手价￥</text>
					<text class="numPric">{{datails.endprice}}</text>
					<text class="yuanjia">原价</text>
					<text class="deletPric">￥{{datails.promotion_price}}</text>
				</view>
				<view class="best">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
					<view class="bestText">
						热卖<text>{{datails.format_volume}}</text>件
					</view>
				</view>
			</view>
			<view class="Datatitle">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/tbIcon.png" mode="aspectFit"></image>
				<text>{{datails.title}}</text>
			</view>

			<view class="discount" v-if="datails.coupon_money > 0">
				<view class="discountPric">
					<view class="price">
						<text>￥</text>
						<text class="priceNum">{{datails.coupon_money}}</text>
					</view>
					<view class="limit">
						<text>优惠券使用期限</text>
						<text class="dataNum">{{datails.coupon_start}}-{{datails.coupon_end}}</text>
					</view>
				</view>
				<view class="discountBtn" @click="getUrl">立即领券</view>
			</view>
		</view>

		<!-- TO-DO 达人推荐 -->
		<view class="recommend" v-show="showRemark">
			<view class="recommTitle">
				<view class="recTitleLeft">
					<view class="border"></view>
					<text>达人推荐</text>
				</view>
				<view class="recTitleRight">
					<text>12598分享</text>
				</view>
			</view>
			<view class="contTetx">
				<text>{{datails.remark}}</text>
			</view>
		</view>

		<!-- TO-DO店铺 -->
		<view class="theStore">
			<view class="storeTop">
				<view class="storeName">
					<view class="imgBox">
						<image :src="datails.seller_logo" mode="aspectFit"></image>
					</view>
					<view class="iconBox">
						<text>{{datails.nick}}</text>
						<view class="iconLis">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/iconLis.png" mode="aspectFit"></image>
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/iconLis.png" mode="aspectFit"></image>
						</view>
					</view>
				</view>

				<view class="storeBtn">
					<view class="intoShop" @click="sellerHander">进店逛逛</view>
					<view class="allGoods" @click="allGoods">全部商品</view>
				</view>
			</view>
			<view class="dscribe">
				<view class="dscribeList">
					<text>宝贝描述{{datails.describe_score}}</text>
					<text class="gao" :style="cowryStyle">{{cowry}}</text>
				</view>
				<view class="dscribeList">
					<text>卖家服务{{datails.service_score}}</text>
					<text class="gao" :style="serveStyle">{{serve}}</text>
				</view>
				<view class="dscribeList">
					<text>物流服务{{datails.logistics_score}}</text>
					<text class="gao" :style="logisticsStyle">{{logistics}}</text>
				</view>
			</view>
		</view>

		<!-- TO-DO tab列表 -->
		<view class="tabList" :style="{opacity:opacity,top:STATUS_BAR_HEIGTH+TITLE_BAR_HEIGTH+'px'}">
			<view class="tabListBox">
				<view class="tabListItem" v-for="(itemx,indexx) in tabList" :key='indexx' :class="{isBefer:isActv == indexx}"
				 @click="tabItems(indexx)">{{itemx.title}}</view>
			</view>
		</view>

		<!-- TO-DO 评价 -->
		<!-- <view class="evaluation">
			<view class="evaluationTop">
				<view class="evalLeft">
					<view class="border"></view>
					<text>评价(4568)</text>
				</view>
				<view class="evalRight">
					<text>查看全部</text>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/redR.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="labelCont">
				<view class="labelLis" v-for="(item,index) in 3" :key='index'>
					质量很不错
				</view>
			</view>
			<view class="evalList">
				<view class="evalUser">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/user.png" mode="aspectFit"></image>
					<text>颜***25</text>
				</view>
				<view class="userText">
					首先要说质量不错，面料柔软。首先要说质量不错，面料柔软，值得购买。
				</view>
			</view>
		</view> -->

		<!-- TO-DO 商品详情 -->
		<view class="goodsDatails">
			<!-- <view class="goodsTitle">
				<view class="evalLeft">
					<view class="border"></view>
					<text>商品详情</text>
				</view>
				<view class="evalRight">
					<text>{{fold}}</text>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/on.png" mode="aspectFit"></image>
				</view>
			</view> -->
			<view class="imagBox">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/cont.png" mode="aspectFit"></image>
			</view>
			<view class="goodsDatailsBox">
				<view class="dataLis" v-for="(xItem,xIndex) in similar" @click="xsDatails(xItem)" :key='xIndex'>
					<view class="imagBoxLis">
						<image :src="xItem.pic" mode="aspectFit"></image>
					</view>
					<view class="dataLisCont">
						<view class="text">
							{{xItem.title}}
						</view>
						<view class="price">
							<view class="priceNum">到手价￥<text>{{xItem.endprice}}</text></view>
							<view class="priceDelet">￥{{xItem.price}}</view>
						</view>
						<view class="priceBtn">
							<view class="volume" v-if="xItem.coupon_money>0">
								<text class="juan">券</text>
								<text>{{xItem.coupon_money}}元</text>
							</view>
							<view class="pricNum">
								<!-- <view class="textImgBox"> -->
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
								<view class="num">爆卖{{xItem.format_volume}}件</view>
								<!-- </view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="password" @click="getShare">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/fz.png" mode="aspectFit"></image>
				<view class="text">复制口令</view>
			</view>
			<view class="collection" @click="postCollect">
				<image :src="collectIcon" mode="aspectFit"></image>
				<view class="text">{{collect}}</view>
			</view>
			<!-- <view class="share" @click="fxzBtn">
				<text>分享赚</text>
				<view class="jfb">{{datails.subsidy_fraction}}集分宝</view>

			</view> -->
			<!-- 	<view class="place" @click="xdfBtn">
			</view> -->
			<view class="place" @click="getUrl()">
				<text>下单返</text>
				<view class="jfb">{{user.is_team==1?Number(datails.up_money_fraction):Number(datails.user_money_fraction)}}集分宝</view>
			</view>
		</view>

		<!-- 授权 -->
		<view class="hide" v-show="publisher.show">
			<view class="authorization">
				<view class="tops">
					<image :src="publisher.hideSrc" mode="aspectFill"></image>
				</view>
				<view class="bottoms">
					<view class="title">{{publisher.msg}}</view>
					<text>{{publisher.text}}</text>
					<view class="btn" @click="btnFn">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'

	import auiLoading from '@/components/aui-loading/aui-loading.vue';
	export default {
		components: {
			auiLoading
		},
		onLoad: function(option) {
			if(typeof option.relationId !== "undefined") this.relationId = option.relationId
			this.iid = option.iid.toString()
			this.activeType = option.type
			this.option = option;
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				},
			})
		},
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				option: {}, //传参
				iid: '', //商品详情
				activeType: 0,
				datails: {
					title: '',
					price: 0,
					nick: '',
					format_volume: 0,
					endprice: 0,
					coupon_money: 0,
					coupon_start: '',
					coupon_end: ''
				},
				collect: '收藏',
				collectIcon: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/sc.png',
				cowry: '',
				cowryStyle: '',
				serve: '',
				serveStyle: '',
				logistics: '',
				logisticsStyle: '',
				similar: [],
				tabList: [{
						title: '商品'
					},
					{
						title: '推荐'
					},
				],
				isActv: 0,
				opacity: 0,
				boxTop: 0,
				btnUrl: '',
				showRemark: true,
				//授权弹窗配置
				publisher: {
					show: false,
					msg: '进入小程序查看更多优惠吧！',
					text: '使用购物商城享受更多收益',
					hideSrc: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/succeed.png'
				},
				showCount: 0,
				relationId: '',
			}
		},
		onReady() {
			my.createIntersectionObserver().relativeToViewport({
				top: 100,
				bottom: 100
			}).observe('.goodsDatails', (res) => {
				this.boxTop = res.intersectionRect.top - this.STATUS_BAR_HEIGTH - this.TITLE_BAR_HEIGTH - 49.7
			});
		},
		mounted() {
			this.getDatails();
			this.getFav();
			this.popUpFn();
			this.dataLoadin()
			setTimeout(() => {
				this.$refs.ccc.hide()
			}, 2000)
		},

		// 分享
		onShareAppMessage() {
			return {
				title: this.datails.title,
				desc: this.datails.remark,
				bgImgUrl: this.datails.pic,
				path: this.btnUrl.xcx_url,
			};

		},
		methods: {
			// 店铺点击事件
			sellerHander() {
				this.postSellerUrl()
			},

			dataLoadin() {
				if (this.showCount >= 2) {
					this.$refs.ccc.hide()
				}
			},
			// 判断弹框是否显示
			popUpFn() {
				if (typeof(this.option.code) !== 'undefined') {
					$axios.login2();
					if (this.option.code == 1) {
						this.publisher.show = true
					} else if (this.option.code == 2) {
						this.publisher.show = true
						this.publisher.msg = this.option.msg
						this.publisher.text = '授权失败将无法获得收益'
						this.publisher.hideSrc = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/fail.png'
					}
				} else {
					this.publisher.show = false
				}
			},

			// 弹窗点击
			btnFn() {
				this.publisher.show = false
			},
			onPageScroll(e) {
				// 获取元素高度
				if (e.scrollTop <= 100) {
					this.opacity = e.scrollTop / 100
				} else {
					this.opacity = 1;
				}
				if (e.scrollTop >= this.boxTop - 1) {
					this.isActv = 1
				} else {
					this.isActv = 0
				}
			},

			scrollTo(scrollTop) {
				my.pageScrollTo({
					scrollTop: scrollTop,
					duration: 100,
				});
			},
			// tab点击事件
			tabItems(indexx) {
				this.isActv = indexx
				if (this.isActv == 0) {
					this.scrollTo(0)
				} else {
					this.scrollTo(this.boxTop)
				}
			},
			// 相似推荐跳转
			xsDatails(xItem) {
				uni.navigateTo({
					url: 'listDatails?iid=' + xItem.num_iid + '&type=' + xItem.goods_type
				})
			},
			// 获取店铺链接
			postSellerUrl() {
				$axios.post({
					url: 'Goods/sellerUrl',
					data: {
						sellerId: this.datails.seller_id
					}
				}).then(res => {
					if (res.data.code == 200) {
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(res.data.data.url)),
						});
					}
				}).catch(err => {

				})
			},
			// 全部商品
			allGoods() {
				uni.navigateTo({
					url: '/pages/allGoods/allGoods?datail=' + encodeURIComponent(JSON.stringify(this.datails)) + '&relationId=' + this.relationId
				})
			},
			// 商品详情
			getDatails() {
				$axios.get({
					url: 'Goods/detail',
					data: {
						gtype: this.activeType,
						iid: this.iid
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.datails = res.data.data
						if (this.datails.remark == '') {
							this.showRemark = false
						} else {
							this.showRemark = true
						}
						// 宝贝评价
						this.similarity();
						if (this.datails.describe_highgap == 1) {
							this.cowry = '高'
							this.cowryStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
						} else if (this.datails.describe_highgap == 0) {
							this.cowry = '平'
							this.cowryStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
						} else if (this.datails.describe_highgap == -1) {
							this.cowry = '低'
							this.cowryStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
						}

						if (this.datails.service_highgap == 1) {
							this.serve = '高'
							this.serveStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
						} else if (this.datails.service_highgap == 0) {
							this.serve = '平'
							this.serveStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
						} else if (this.datails.service_highgap == -1) {
							this.serve = '低'
							this.serveStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
						}

						if (this.datails.logistics_highgap == 1) {

							this.logistics = '高'
							this.logisticsStyle = 'backgroundColor:#ffdde0;color:#ff4052;'
						} else if (this.datails.logistics_highgap == 0) {
							this.logistics = '平'
							this.logisticsStyle = 'backgroundColor:#DDFFE7;color:#00A908;'
						} else if (this.datails.logistics_highgap == -1) {
							this.logistics = '低'
							this.logisticsStyle = 'backgroundColor:#EDEDED;color:#7B7B7B;'
						}
					}
					this.showCount++;
					this.dataLoadin()
				}).catch((err) => {
					this.showCount++;
					this.dataLoadin()
				})
			},

			// 相似推荐
			similarity() {
				$axios.get({
					url: 'Goods/similarRec',
					data: {
						iid: this.datails.iid,
						relationId: this.relationId,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.similar = res.data.data.list
					}
					this.showCount++;
					this.dataLoadin()
				}).catch(err => {
					this.showCount++;
					this.dataLoadin()
				})
			},
			// 底部按钮跳转
			fxzBtn() {
				if (this.user.relation_id == '') {
					let state = this.user.uid + ":" + this.iid + ":" + this.activeType;
					utils.setRelationId(state);
				}
				// my.showSharePanel();
			},
			xdfBtn() {
				my.ap.navigateToAlipayPage({
					path: encodeURIComponent(
						'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
						encodeURIComponent(this.btnUrl.url)),

				})
			},
			getUrl() {
				if (this.user.relation_id == '') {
					let state = this.user.uid + ":" + this.iid + ":" + this.activeType;
					utils.setRelationId(state);
				} else {
					$axios.get({
						url: 'Goods/getUrl',
						data: {
							iid: this.datails.num_iid,
							gtype: this.datails.goods_type,
							relationId: this.relationId,
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
				}
			},
			getShare() {
				if (this.user.relation_id == '') {
					let state = this.user.uid + ":" + this.iid + ":" + this.activeType;
					utils.setRelationId(state);
				} else {
					$axios.get({
						url: 'Goods/share',
						data: {
							id: this.datails.id,
							gtype: this.datails.goods_type,
							relationId: this.relationId,
						}
					}).then((res) => {
						if (res.data.code == 200) {
							// console.info(res.data.data)
							uni.setClipboardData({
								data: res.data.data.tkl,
								success: function() {
									uni.showToast({
										title: '复制成功'
									})
								},
								fail: function() {
									uni.showToast({
										title: '复制失败'
									})
								}
							})
						}
					}).catch((error) => {})
				}
			},
			getFav() {
				$axios.get({
					url: 'Goods/state',
					data: {
						type: 0,
						iid: this.iid,
						gtype: this.activeType
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.isFav == true) {
							this.collect = '已收藏'
							this.collectIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/sc2.png'
						} else {
							this.collect = '收藏'
							this.collectIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/sc.png'
						}
					}
				}).catch(err => {})
			},
			// 添加收藏
			postCollect() {
				$axios.post({
					url: 'User/setGoods',
					data: {
						type: 0,
						id: this.datails.id,
						gtype: this.datails.goods_type
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (this.collect == '收藏') {
							this.collect = '已收藏'
							this.collectIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/sc2.png'
						} else {
							this.collect = '收藏'
							this.collectIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/sc.png'
						}
					}
				}).catch(err => {})
			}

			// 商品详情
			// getDesc() {
			// 	uni.request({
			// 		url: 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data={%22id%22:%22' + this.iid + '%22}',
			// 		method: 'GET',
			// 		success: (res) => {
			// 			console.log('++++++++',res)
			// 			$axios.post({
			// 				url: 'Goods/setDescImg',
			// 				data: {
			// 					json:JSON.stringify(res),
			// 					iid: this.iid
			// 				}
			// 			}).then((res) => {
			// 				// console.log(this.datails)
			// 				console.log('______',res.data)
			// 				if (res.data.code == 200) {
			// 					console.log('______',res.data)
			// 				}
			// 			}).catch((err) => {})
			// 			// console.log(res)
			// 		},
			// 		fail: (error) => {
			// 			// reject(error)
			// 			console.log('--------请求失败',error)
			// 		}
			// 	})
			// }
		},
		//获取用户信息
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
				console.log(this.$store.state.user)
			},
		}
	}
</script>

<style lang="less">
	@red: #fd424d;

	.bodys {
		.contTop {
			width: 100%;
			height: 750rpx;

			.swiper {
				width: 100% !important;
				height: 100%;

				.swiperItem {
					.iconText {
						position: absolute;
						bottom: 18rpx;
						right: 20rpx;
						width: 64rpx;
						height: 32rpx;
						background-color: rgba(0, 0, 0, 0.4);
						border-radius: 16rpx;
						color: #fff;
						font-size: 20rpx;
						text-align: center;
						line-height: 32rpx;
					}

					.imageBox {
						width: 100%;
						height: 100%;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}

		.datails {
			background: #fff;
			border-radius: 0rpx 0rpx 16rpx 16rpx;
			padding: 0 20rpx 28rpx 20rpx;

			.priceBox {
				display: flex;
				justify-content: space-between;
				padding: 32rpx 0 28rpx 0;

				.isPrice {
					text {
						color: #ff4844;
						font-size: 22rpx;
					}

					.numPric {
						font-size: 46rpx;
					}

					.yuanjia {
						color: #666;
						font-size: 22rpx;
						margin-left: 10rpx;
					}

					.deletPric {
						color: #666;
						font-size: 22rpx;
						text-decoration: line-through;
					}
				}

				.best {
					display: flex;
					align-items: center;

					image {
						width: 21rpx;
						height: 24rpx;
						margin-bottom: 5rpx;
					}

					.bestText {
						font-size: 22rpx;
						color: #666;

						text {
							color: #ff4844;
						}
					}
				}
			}

			.Datatitle {
				image {
					width: 36rpx;
					height: 36rpx;
					margin-right: 10rpx;
					vertical-align: middle;
				}

				text {
					font-size: 28rpx;
					color: #111;
					margin-right: 10rpx;
					font-weight: bold;
					// vertical-align: middle;
				}
			}

			.integralBox {
				margin-top: 30rpx;
				height: 56rpx;
				background: #fff3e1;
				border-radius: 28rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 20rpx 0 18rpx;
				line-height: 56rpx;

				.integralLeft {
					display: flex;
					align-items: center;

					view {
						width: 130rpx;
						height: 40rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/btn.png)no-repeat;
						background-size: 100% 100%;
						border-radius: 20rpx;
						margin-right: 10rpx;
					}

					text {
						font-size: 22rpx;
						color: #333;
					}

					.redText {
						color: #ff2a00;
					}
				}

				.integralRight {
					image {
						width: 8rpx;
						height: 16rpx;
					}

					text {
						font-size: 22rpx;
						color: #ff2a00;
					}
				}
			}

			.discount {
				height: 150rpx;
				padding: 0 44rpx 0 35rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 27rpx;
				border-radius: 20rpx;
				height: 150rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/dscBg.png)no-repeat;
				background-size: 100% 100%;

				.discountPric {
					display: flex;

					.price {
						text {
							color: #ff4844;
							font-size: 40rpx;
						}

						.priceNum {
							display: inline-block;
							font-size: 60rpx;
						}
					}

					.limit {
						display: flex;
						justify-content: space-between;
						flex-direction: column;
						margin-left: 18rpx;

						text {
							font-size: 24rpx;
							color: #ff4844;
						}

						.dataNum {
							font-size: 20rpx;
						}
					}
				}

				.discountBtn {
					width: 170rpx;
					height: 60rpx;
					background-image: linear-gradient(130deg,
						#ff8f8f 0%,
						#ff2727 100%),
						linear-gradient(#fbe9eb,
						#fbe9eb);
					border-radius: 30rpx;
					color: #fff;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
				}
			}

		}

		// TO-DO 优惠券
		.recommend {
			background-color: #ffffff;
			border-radius: 16rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 28rpx 20rpx 23rpx 20rpx;
			margin-top: 18rpx;

			.recommTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.recTitleLeft {
					display: flex;
					align-items: center;

					.border {
						margin-right: 10rpx;
						width: 6rpx;
						height: 32rpx;
						background-image: linear-gradient(0deg,
							#ffaeac 0%,
							#ff423e 100%),
							linear-gradient(#ff4844,
							#ff4844);
						background-blend-mode: normal,
							normal;
						border-radius: 3rpx;
					}

					text {
						color: 28rpx;
						font-size: #111;
					}
				}

				.recTitleRight {
					font-size: 22rpx;
					color: #666;
				}
			}

			.contTetx {
				width: 100%;
				box-sizing: border-box;
				min-height: 166rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/textBG.png)no-repeat;
				background-size: 100% 100%;
				padding: 30rpx 26rpx 0 20rpx;
				margin-top: 20rpx;

				text {
					text-indent: 1rem;
					color: #555;
					justify-items: center;
					line-height: 40rpx;
					font-size: 22rpx;
				}
			}
		}

		// TO-DO 店铺
		.theStore {
			width: 100%;
			margin-top: 18rpx;
			padding: 22rpx 28rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			background: #fff;

			.storeTop {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.storeName {
					display: flex;

					.imgBox {
						image {
							width: 95rpx;
							height: 95rpx;
						}
					}

					.iconBox {
						padding: 12rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						text {
							font-size: 30rpx;
							color: #000;
						}

						.iconLis {
							image {
								width: 25rpx;
								height: 25rpx;
								margin-right: 5rpx;
							}
						}
					}
				}

				.storeBtn {
					display: flex;

					view {
						width: 130rpx;
						// height: 50rpx;
						border-radius: 25rpx;
						box-sizing: border-box;
						text-align: center;
						line-height: 50rpx;
						font-size: 24rpx;
					}

					.intoShop {
						border: solid 1rpx @red;
						color: @red;
						margin-right: 5rpx;
					}

					.allGoods {
						color: #fff;
						background-image: linear-gradient(90deg,
							#ff6662 0%,
							#ff423e 100%),
							linear-gradient(#ff4666,
							#ff4666);
					}
				}
			}

			.dscribe {
				display: flex;
				justify-content: space-between;
				padding-top: 25rpx;

				.dscribeList {
					display: flex;
					align-items: center;

					text {
						font-size: 22rpx;
						color: #999;

					}

					.gao {
						margin-left: 5rpx;
						color: #ff4052;
						background-color: #ffdde0;
						display: inline-block;
						font-size: 18rpx;
						width: 28rpx;
						line-height: 28rpx;
						text-align: center;
						border-radius: 50%;
						overflow: hidden;
					}
				}
			}
		}

		// TO-DO tab列表
		.tabList {
			width: 100%;
			height: 90rpx;
			box-sizing: border-box;
			background: #fff;
			// margin-top: 18rpx;
			position: fixed;
			// top: 0;
			padding: 0 150rpx;
			z-index: 9;

			.tabListBox {
				display: flex;
				justify-content: space-between;

				.tabListItem {
					position: relative;
					width: 70rpx;
					text-align: center;
					line-height: 90rpx;
				}

				.isBefer {
					&::before {
						content: '';
						position: absolute;
						bottom: 0;
						width: 70rpx;
						height: 6rpx;
						background: linear-gradient(90deg, #FFAEAC, #FF433E);
						border-radius: 3rpx;
					}
				}
			}
		}

		// .tabList::before {
		// 	content: '';
		// 	position: absolute;
		// 	width: 15rpx;
		// 	height: 30rpx;
		// 	left: 28rpx;
		// 	top: 50%;
		// 	transform: translateY(-50%);
		// 	background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/left.png)no-repeat;
		// 	background-size: 100% 100%;
		// }

		// .tabList::after {
		// 	content: '';
		// 	position: absolute;
		// 	width: 30rpx;
		// 	height: 8rpx;
		// 	right: 38rpx;
		// 	top: 50%;
		// 	transform: translateY(-50%);
		// 	background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/zk.png)no-repeat;
		// 	background-size: 100% 100%;
		// }

		// TO-DO 评价
		.evaluation {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 28rpx 40rpx 20rpx 20rpx;
			margin-top: 18rpx;

			.evaluationTop {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.evalLeft {
					display: flex;

					.border {
						margin-right: 10rpx;
						width: 6rpx;
						height: 32rpx;
						background-image: linear-gradient(0deg,
							#ffaeac 0%,
							#ff423e 100%),
							linear-gradient(#ff4844,
							#ff4844);
						background-blend-mode: normal,
							normal;
						border-radius: 3rpx;
					}

					text {
						font-size: 28rpx;
						color: #111;
					}
				}

				.evalRight {
					text {
						color: @red;
						font-size: 22rpx;
						margin-right: 10rpx;
					}

					image {
						width: 8rpx;
						height: 16rpx;
					}
				}
			}

			.labelCont {
				padding-top: 30rpx;
				display: flex;

				.labelLis {
					margin: 0 12rpx;
					padding: 0 38rpx;
					height: 60rpx;
					font-size: 26rpx;
					line-height: 60rpx;
					color: #444;
					background-color: #ffeded;
					border-radius: 30rpx;
				}
			}

			.evalList {
				padding: 0 15rpx;

				.evalUser {
					display: flex;
					align-items: center;
					padding-top: 20rpx;

					image {
						width: 44rpx;
						height: 44rpx;
					}

					text {
						font-size: 24rpx;
						color: #888;
						margin-left: 10rpx;
					}
				}

				.userText {
					margin-top: 25rpx;
					font-size: 24rpx;
					color: #333;
					line-height: 40rpx;
				}
			}
		}

		// TO-DO 商品详情
		.goodsDatails {
			margin-top: 18rpx;
			padding-bottom: 120rpx;

			.goodsTitle {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 90rpx;
				box-sizing: border-box;
				padding: 0 38rpx 0 20rpx;
				background-color: #ffffff;
				border-radius: 16rpx;

				.evalLeft {
					display: flex;

					.border {
						margin-right: 10rpx;
						width: 6rpx;
						height: 32rpx;
						background-image: linear-gradient(0deg,
							#ffaeac 0%,
							#ff423e 100%),
							linear-gradient(#ff4844,
							#ff4844);
						background-blend-mode: normal,
							normal;
						border-radius: 3rpx;
					}

					text {
						font-size: 28rpx;
						color: #111;
					}
				}

				.evalRight {
					text {
						color: #666;
						font-size: 22rpx;
						margin-right: 10rpx;
					}

					image {
						width: 20rpx;
						height: 20rpx;
					}
				}
			}

			.imagBox {
				padding-top: 33rpx;
				width: 100%;
				text-align: center;

				image {
					width: 199rpx;
					height: 29rpx;
				}
			}

			.goodsDatailsBox {
				padding: 0 20rpx;
				padding-top: 30rpx;
				display: flex;
				flex-wrap: wrap;

				.dataLis {
					width: 346rpx;
					border-radius: 16rpx;
					margin-right: 18rpx;
					margin-bottom: 22rpx;
					background: #fff;
					overflow: hidden;

					&:nth-of-type(2n) {
						margin-right: 0;
					}

					.imagBoxLis {
						image {
							width: 346rpx;
							height: 346rpx;
						}
					}

					.dataLisCont {
						padding: 20rpx 18rpx;

						.text {
							font-size: 24rpx;
							color: #111;
							margin-right: 8rpx;
							line-height: 36rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							height: 72rpx;
							display: -webkit-box; //作为弹性伸缩盒子模型显示。
							-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
							-webkit-line-clamp: 2;
						}

						.price {
							// display: flex;
							align-items: center;
							padding-top: 20rpx;

							.priceNum {
								display: inline-block;
								color: #ff4844;
								font-size: 22rpx;

								text {
									font-size: 38rpx;
								}
							}

							.priceDelet {
								display: inline-block;
								font-size: 20rpx;
								color: #999;
								text-decoration: line-through;
								margin-left: 8rpx;
							}

						}

						.priceBtn {
							padding-top: 30rpx;
							display: flex;
							justify-content: space-between;

							.volume {
								width: 130rpx;
								height: 40rpx;
								display: flex;
								align-items: center;
								// justify-content: center;
								background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
								background-size: 100% 100%;
								line-height: 40rpx;

								text {
									font-size: 20rpx;
									color: #ff4844;
									flex: 1;
									text-align: center;
								}

								.juan {
									display: inline-block;
									flex: none;
									width: 40rpx;
									height: 40rpx;
									color: #fff;
									// position: absolute;
									// left: 0;
									// top: 50%;
									// margin: 0;
									// transform: translateY(-50%);
								}

							}

							.pricNum {
								height: 38rpx;
								width: 157rpx;
								height: 38rpx;
								line-height: 38rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								background-color: rgba(255, 72, 68, 0.1);
								border-radius: 8rpx;
								position: relative;


								image {
									width: 20rpx;
									height: 22.6rpx;
								}

								.num {
									// line-height: 1;
									text-align: center;
									font-size: 20rpx;
									color: #ff4844;
									margin-left: 8rpx;
									height: 38rpx;
									line-height: 38rpx;
									// margin-top: 5rpx;
								}
							}
						}
					}
				}
			}

		}

		.footer {
			display: flex;
			background: #fff;
			height: 120rpx;
			padding: 0 38rpx;
			align-items: center;
			position: fixed;
			bottom: 0;
			width: 100%;

			.password {
				// display: flex;
				// flex-direction: column;
				margin-right: 20rpx;
				text-align: center;
				align-items: center;

				// padding: 24rpx 0 20rpx 0;
				image {
					width: 44rpx;
					height: 44rpx;
				}

				.text {
					color: #666;
					font-size: 22rpx;
				}
			}

			.collection {
				margin-right: 40rpx;
				text-align: center;
				width: 66rpx;
				text-align: center;

				image {
					width: 44rpx;
					height: 44rpx;
				}

				.text {
					color: #666;
					font-size: 22rpx;
				}
			}

			.share {
				width: 227rpx;
				height: 81rpx;
				box-sizing: border-box;
				padding-top: 14rpx;
				background-image: linear-gradient(90deg,
					#fee0b3 0%,
					#fef0db 100%),
					linear-gradient(#ff4666,
					#ff4666);
				border-radius: 40rpx 0rpx 0rpx 40rpx;
				// display: flex;
				// flex-direction: column;
				text-align: center;

				text {
					font-size: 30rpx;
					color: #fd424b;
				}

				.jfb {
					font-size: 18rpx;
					color: #fd424b;
				}
			}

			.place {
				width: 454rpx;
				height: 81rpx;
				background-image: linear-gradient(90deg,
					#ff6662 0%,
					#ff423e 100%),
					linear-gradient(#ff4666,
					#ff4666);
				border-radius: 40rpx 40rpx 40rpx 40rpx;
				box-sizing: border-box;
				padding-top: 14rpx;
				text-align: center;

				text {
					font-size: 30rpx;
					color: #fff;
				}

				.jfb {
					font-size: 18rpx;
					color: #fff;
				}
			}
		}

		// 授权弹窗
		.hide {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			top: 0;
			left: 0;

			.authorization {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				width: 591rpx;
				height: 738rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
				text-align: center;

				.tops {
					width: 100%;
					height: 420rpx;
					box-sizing: border-box;
					padding-top: 50rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/bg.png)no-repeat;
					background-size: 100% 100%;
					text-align: center;

					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.bottoms {
					padding-bottom: 40rpx;

					.title {
						padding: 0 45rpx;
						font-size: 32rpx;
						font-weight: 500;
						color: #343434;
						margin-bottom: 45rpx;
						font-weight: 600;
						;
					}

					text {
						font-size: 29rpx;
						color: #9A9A9A;
					}

					.btn {
						margin: 0 auto;
						margin-top: 67rpx;
						width: 412rpx;
						height: 74rpx;
						background: #FF4E4A;
						border-radius: 37rpx;
						text-align: center;
						line-height: 74rpx;
						font-size: 29rpx;
						color: #fff;
					}
				}
			}
		}
	}
</style>
