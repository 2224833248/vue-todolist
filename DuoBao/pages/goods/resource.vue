<template>
	<view class="content">
		<view class="notice">
			<view class="notice__text">浏览兴趣商品，有机会发现集分宝，集分宝可多次获得，每天最多获得3次， 1-88个不等</view>
		</view>
		<scroll-view class="nav" scroll-x="true">
			<view class="nav__item" :class="{'nav__item--active':cid == item.cid}" v-for="(item,index) in navList" :key='index'
			 @click="switchingState(item.cid)">{{item.title}}</view>
		</scroll-view>

		<view class="goods-box">
			<view class="list" v-for="(item,index) in goodsList" :key="index" @click="getUrl(item)">
				<view class="top-img" :class="'top'+index">Top{{index+1}}</view>
				<view class="top-right" v-if="ckGoods[item.iid]"></view>
				<image class="pic" :src="item.pic" mode="aspectFill"></image>
				<view class="item">
					<view class="title-box">
						<view class="title">{{item.small_title}}</view>
					</view>
					<view class="price-box">
						<view class="price">
							<text class="tips">补贴价￥</text>
							<text class="num">{{item.endprice}}</text>
						</view>
						<view class="old">原价￥{{item.promotion_price}}</view>
					</view>
					<view class="labels">
						<view class="coupon">{{item.coupon_money}}元</view>

						<view class="discount">{{item.discount}}折</view>
					</view>
				</view>
			</view>
		</view>
		<loading :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>


		<image class="float" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/goods/float.png" mode="widthFix"></image>

		<uni-popup ref="popup" type="center">
			<view class="popup" @click="this.$refs.popup.close()">
				<view>{{popupMsg}}</view>
			</view>
		</uni-popup>
				<!-- https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/goods/popup.png -->
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				navList: [],
				goodsList: [],

				pidType: 'def',

				page: 1,
				cid: 0,

				loadingMore: false,
				noMoreData: false,
				noData: false,

				base: {},

				clickTime: 0,
				
				popupMsg:''
			}
		},
		onLoad(option) {
			if (typeof option.type == "string") {
				this.pidType = option.type;
			}
		},
		mounted() {
			this.getBase();
			this.getNav();
		},
		onShow() {
			if (this.clickTime == 0) return;
			if ((new Date() - this.clickTime) / 1000 > 10) {
				this.read()
			}else{
				uni.showModal({
					title: '提示',
					content: '访问10秒以上,才有机会获得集分宝哦',
					showCancel: false,
					confirmText: "知道了"
				})
			}
			this.clickTime = 0
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			read(){
				ajax.get({
					url: 'Goods/findRedPacket'
				}).then((res) => {
					if (res.data.code == 200) {
						if(res.data.msg){
							this.popupMsg = res.data.msg
							this.$refs.popup.open()
						}
					}
				})
			},
			
			getNav() {
				ajax.get({
					url: 'base/getCat',
					data: {
						type: 1
					},
				}).then((res) => {
					if (res.data.code == 200) {
						this.navList = res.data.data;
						this.cid = res.data.data[0].cid
						this.getList()
					}
				}).catch((error) => {})
			},

			getList() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'goods/getList',
					data: {
						page: this.page,
						cid: this.cid,
						adData: "ranking:-9"
					},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.goodsList = this.goodsList.concat(res.data.data.list);
						if (res.data.data.list.length > 0) {
							this.page++
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

			getBase() {
				ajax.get({
					url: 'User/getSubsidy',
					data: {
						type: this.pidType
					},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.base = res.data.data;
						if (this.base.isAlert == 1) {
							this.$refs.redalert.open();
						}
						this.countDown();
					}
				}).catch((error) => {})
			},

			getUrl(e) {
				ajax.get({
					url: 'Goods/getUrl',
					data: {
						iid: e.num_iid,
						gtype: e.goods_type,
						pid: this.base.pid,
						relationId: this.relationId,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						// 设置跳转
						this.clickTime = new Date();
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(res.data.data.url))
						});
					}
				}).catch((error) => {})
			},
			switchingState(cid) {
				this.cid = cid
				this.goodsList = []
				this.page = 1
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.getList()

				my.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
		}
	}
</script>

<style lang="less">
	.popup{
		width: 750rpx;
		height: 700rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/goods/popup.png);
		background-size: 100% 100%;
		
		view{
			color: #b61e13;
			text-align: center;
			font-size: 76rpx;
			font-weight: bold;
			padding-top: 170rpx;
		}
	}
	///////////////////
	.content {
		min-height: 100vh;
		background-color: #FFFFFF;
	}

	.notice {
		position: fixed;
		height: 63rpx;
		z-index: 10;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/goods/top-bg.png);
		background-size: 100% 100%;
		padding: 19rpx 67rpx 19rpx 87rpx;

		&__text {
			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 36rpx;
		}
	}

	.nav {
		position: fixed;
		width: 750rpx;
		top: 101rpx;
		z-index: 10;
		background-color: #FFFFFF;
		font-size: 24rpx;
		font-weight: 800;
		height: 80rpx;

		white-space: nowrap;
		display: flex;

		&::-webkit-scrollbar {
			display: none;
		}

		&__item {
			flex-shrink: 0;
			flex-grow: 1;
			color: #AEAEAE;
			line-height: 30rpx;
			padding: 25rpx 42rpx 25rpx 30rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/goods/nav.png);
			background-repeat: no-repeat;
			background-position: right;
			background-size: auto 24rpx;

			&--active {
				color: #FF7200;
			}

			&:last-child {
				background-image: none;
			}
		}
	}

	.goods-box {
		padding-top: 181rpx;
		width: 710rpx;
		margin-left: auto;
		margin-right: auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		.list {
			width: 344rpx;
			background-color: #FFF;
			margin-bottom: 22rpx;
			border-radius: 8rpx;
			position: relative;

			.top-right {
				width: 82rpx;
				height: 82rpx;
				background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/8a78a9c95f81bf90154368216ef6efcb.png');
				background-repeat: no-repeat;
				background-size: 82rpx 82rpx;
				font-size: 22rpx;
				color: #ffeaa0;
				text-align: center;
				line-height: 62rpx;
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;

			}

			.top-img {
				width: 90rpx;
				height: 50rpx;
				font-size: 22rpx;
				color: #FFF;
				text-align: center;
				line-height: 50rpx;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				background-image: linear-gradient(90deg, #f4bda5 0%, #e28d65 100%);
				background-blend-mode: normal, normal;
				border-radius: 0rpx 50rpx 50rpx 0rpx;
				font-weight: 600;
			}

			.top-img.top0 {
				background-image: linear-gradient(90deg, #fec22b 0%, #ed8d01 100%);
			}

			.top-img.top1 {
				background-image: linear-gradient(90deg, #d9dada 0%, #afb9bd 100%);
			}



			.pic {

				width: 344rpx;
				height: 344rpx;
				border-radius: 8rpx;
			}

			.item {
				padding: 6rpx 10rpx;

				.title-box {

					height: 70rpx;
					line-height: 34rpx;
					font-size: 24rpx;
					position: relative;

					overflow: hidden;
					text-overflow: ellipsis;


					.title {
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.price-box {
					height: 60rpx;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					color: #ff4844;

					.price {
						width: 194rpx;
						display: flex;
						align-items: flex-end;

						.tips {
							font-size: 20rpx;
						}

						.num {
							font-size: 34rpx;
							line-height: 34rpx;
						}
					}

					.old {
						text-align: right;
						font-size: 20rpx;
						color: #999999;
						text-decoration: line-through;
					}
				}

				.labels {

					display: flex;

					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;

					height: 70rpx;
					font-size: 20rpx;
					text-align: center;
					color: #FFFFFF;

					.discount {
						width: 72rpx;
						height: 38rpx;
						line-height: 38rpx;

						background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/1950f0b0121c98306916e006c70198c9.png');
						background-repeat: no-repeat;
						background-size: 110rpx 38rpx;
						border-radius: 19rpx;
						padding-left: 38rpx;
					}

					.coupon {
						width: 75rpx;
						height: 36rpx;
						background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/ac68a9e98f05c67e3785e8ed4a245f18.png');
						background-repeat: no-repeat;
						background-size: 57rpx 36rpx;
						border: 2rpx solid #ff4844;
						border-radius: 10rpx;
						font-size: 22rpx;
						line-height: 36rpx;
						text-align: center;
						color: #ff4844;
						padding-right: 8rpx;
						padding-left: 58rpx;
					}
				}
			}
		}
	}

	.float {
		width: 223rpx;
		position: fixed;
		right: 48rpx;
		bottom: 204rpx;
	}
</style>
