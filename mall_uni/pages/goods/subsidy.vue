<template>
	<view class="content">
		<mescroll-uni ref="mescroll" @scroll="pageScroll" @init="mescrollInit" @down="downCallback" :up="up" :down="down" @up="upCallback">
			<view class="bg">
				<view class="top-box">
					<view class="title-box">
						<view class="title">我的现金补贴(元)</view>
						<view class="time-box">
							<view class="time">{{shi}}</view>
							<view class="tips">:</view>
							<view class="time">{{min}}</view>
							<view class="tips">:</view>
							<view class="time">{{miao}}</view>
							<view class="tips">后失效</view>
						</view>
					</view>
					<view class="money">
						<view class="num">{{base.money}}</view>
						<view class="tips">元</view>
					</view>
				</view>
				<view class="cat-box">
					<scroll-view class="scroll-view-cat" scroll-x="true" :scroll-left="scrollLeft" :show-scrollbar="true">
						<view class="list" v-for="(item,index) in catList" :key="index" @click="ckCid(item,index)">
							<view class="cat" :class="item.cid==cid?'active':''">{{item.title}}</view>
						</view>
					</scroll-view>
					<view class="cat-icon" @click="ckShowCat">
						<view class="icons"></view>
						<image :class="isDowCat?'active':''" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/32d43ce9ac3eebbb8c5aa0f841d8db47.png"
						 mode="aspectFill"></image>
					</view>
				</view>
				<view class="cat_list" :class="isDowCat?'show':''">
					<view class="list" v-for="(item,index) in catList" :key="index" @click="ckCid(item,index)">
						<image :src="item.dir_img" mode="aspectFill"></image>
						<view class="cat">{{item.title}}</view>
					</view>
				</view>
			</view>

			<view class="floadbg" :class="isFload">
				<view class="top-float">
					<view class="money">
						<view class="tips">购物补贴</view>
						<view class="num">{{base.money}}</view>
						<view class="tips">元</view>
					</view>
					<view class="time-box">
						<view class="time">{{shi}}</view>
						<view class="tips">:</view>
						<view class="time">{{min}}</view>
						<view class="tips">:</view>
						<view class="time">{{miao}}</view>
						<view class="tips">后失效</view>
					</view>
				</view>
				<view class="cat-box">
					<scroll-view class="scroll-view-cat" scroll-x="true" :scroll-left="scrollLeft" :show-scrollbar="true">
						<view class="list" v-for="(item,index) in catList" :key="index" @click="ckCid(item,index)">
							<view class="cat" :class="item.cid==cid?'active':''">{{item.title}}</view>
						</view>
					</scroll-view>
					<view class="cat-icon" @click="ckShowCats">
						<view class="icons"></view>
						<image :class="isDowCats?'active':''" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/32d43ce9ac3eebbb8c5aa0f841d8db47.png"
						 mode="aspectFill"></image>
					</view>
				</view>
				<view class="cat_list" :class="isDowCats?'show':''">
					<view class="list" v-for="(item,index) in catList" :key="index" @click="ckCid(item,index)">
						<image :src="item.dir_img" mode="aspectFill"></image>
						<view class="cat">{{item.title}}</view>
					</view>
				</view>
			</view>



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
							<view class="coupon" v-if="item.coupon_money>0">{{item.coupon_money}}元</view>

							<view class="discount">{{item.discount}}折</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<uni-popup class="popups" ref="redalert" type="center" :maskClick="false">
			<view class="popups">
				<view class="redalert">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/9ada605b876ac1469bd020cc81c0e5bf.png" class="redalert__logo"
					 @click="redSet"></image>
				</view>
			</view>
			<view class="red__close">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="redClose"></image>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import ajax from "@/utils/ajax.js"
	export default {
		components: {
			MescrollUni,
			uniPopup
		},
		data() {
			return {
				shi: '00',
				min: '00',
				miao: '00',
				base: {
					isAlert: 0,
					money: 0,
					timeEnd: 0,
					pid: '',
				},
				pidType: 'def',
				cid: 0,
				scrollLeft: 0,
				catList: [],
				isFload: '',
				isDowCat: false,
				isDowCats: false,
				loadingData: false,
				down: {
					use: false
				},
				up: {
					onScroll: true,
					noMoreSize: 1,
					textNoMore: '— 没有更多商品了哦 —',
					empty: {
						icon: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/app_data_null.png',
						tip: '— 暂无商品了哦 —'
					},
					toTop: {
						src: "",
					},
				},
				ckGoods: {},
				goodsList: [],
				isLogin: true,
				page: 1
			}
		},
		onLoad(option) {
			if (typeof option.type == "string") {
				this.pidType = option.type;
			}
		},
		mounted() {
			this.getBase();
			this.getCat();
		},
		methods: {
			ckShowCat() {
				if (this.isDowCat) {
					this.isDowCat = false;
				} else {
					this.isDowCat = true;
				}
			},
			ckShowCats() {
				if (this.isDowCats) {
					this.isDowCats = false;
				} else {
					this.isDowCats = true;
				}
			},
			ckCid(item, index) {
				this.cid = item.cid;
				this.scrollLeft = (index - 2) * 60;
				this.goodsList = [];
				this.page = 1;
				this.getList();
				this.$refs.mescroll.mescroll.resetUpScroll();
				this.isDowCat = false;
				this.isDowCats = false;
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
			redSet() {
				ajax.post({
					url: 'User/setSubsidy',
					data: {},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '领取成功',
						});
						this.base.isAlert = 0;
						this.base.money = res.data.data.money;
						this.base.timeEnd = res.data.data.end_time;
						this.$refs.redalert.close()
						this.countDown();
					}
				}).catch((error) => {})
			},

			redClose() {
				this.$refs.redalert.close()
			},
			getCat() {
				ajax.get({
					url: 'base/getCat',
					data: {
						type: 1
					},
					login: false,
				}).then((res) => {
					if (res.data.code == 200) {
						this.catList = res.data.data;
					}
				}).catch((error) => {})
			},

			pageScroll(e) {
				if (e.scrollTop > 205) {
					this.isFload = 'fixed';
				} else {
					if (this.isFload == 'fixed') {
						this.isDowCats = false;
						this.isFload = 'fixedhide';
					}
				}
			},
			mescrollInit() {

			},
			downCallback() {

			},
			upCallback(e) {
				if (this.loadingData != true) {
					// if (!ajax.isLogin()) return;
					this.getList();
				}
			},
			getList() {
				let mescroll = this.$refs.mescroll.mescroll;
				this.loadingData = true;
				ajax.get({
					url: 'goods/getList',
					data: {
						page: this.page,
						cid: this.cid,
						adData: "ranking:-9",
						type: this.pidType
					},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						if (this.page == 1) {
							this.goodsList = [];
						}
						this.goodsList = this.goodsList.concat(res.data.data.list);
						mescroll.endSuccess(res.data.data.list.length, !res.data.data.endPage);
						this.page++
					} else {
						mescroll.endErr()
					}
					this.loadingData = false;
				}).catch((error) => {
					mescroll.endUpScroll(true);
					this.loadingData = false;
				})
			},
			getUrl(e) {
				ajax.get({
					url: 'Goods/getUrl',
					data: {
						iid: e.num_iid,
						gtype: e.goods_type,
						pid: this.base.pid
					}
				}).then((res) => {
					if (res.data.code == 200) {
						ajax.post({
							url: 'User/setSubsidyMoney',
							data: {
								money: e.coupon_money
							}
						}).then((res) => {
							if (res.data.code == 200) {
								this.base.money = res.data.data;
								uni.showToast({
									title: '恭喜再次获得200元',
								});
							}
						});
						this.ckGoods[e.num_iid] = true;
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(encodeURIComponent(res.data.data.url)))
						});
					}
				}).catch((error) => {})

			},
			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.base.timeEnd * 1000) - new Date()) / 1000)
					if (modulo > 1) {
						let hours = Math.floor(modulo / (60 * 60));
						modulo = modulo % (60 * 60);
						let minutes = Math.floor(modulo / 60);
						let seconds = modulo % 60;

						this.shi = this.timeFormat(hours);
						this.min = this.timeFormat(minutes);
						this.miao = this.timeFormat(seconds);
					} else {
						this.shi = '00';
						this.min = '00';
						this.miao = '00';
						clearInterval(interval);
					}
				}, 500)
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},
		}
	}
</script>


<style lang="scss" scoped>
	.red__close {
		margin: 42rpx 0 0;
		text-align: center;

		image {
			width: 66rpx;
			height: 66rpx;
		}
	}

	.redalert {
		position: relative;
		width: 580rpx;
		height: 720rpx;
		background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/3ff122253990c7e5feb1691e21368a3b.png?');
		background-size: 580rpx 720rpx;
		display: flex;
		justify-content: center;
		margin-top: 100rpx;

		&__logo {
			width: 260rpx;
			height: 260rpx;

			position: absolute;
			bottom: 80rpx;

			-webkit-animation: breath 1.2s ease-in-out infinite;
			animation: breath 1.2s ease-in-out infinite;
		}
	}

	.goods-box {
		width: 710rpx;
		margin: 20rpx auto;
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
						line-height: 37rpx;
						text-align: center;
						color: #ff4844;
						padding-right: 8rpx;
						padding-left: 58rpx;
					}
				}
			}
		}
	}

	.cat_list.show {
		display: flex;
		animation: catshow 1s;
		animation-fill-mode: forwards;
	}

	@keyframes catshow {
		from {
			height: 0rpx;
		}

		to {
			height: 498rpx;
		}
	}

	.cat_list {
		width: 750rpx;
		padding-top: 30rpx;
		background-color: #FFF;
		display: none;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		text-align: center;
		z-index: 9;
		overflow: hidden;

		.list {
			width: 125rpx;
			height: 138rpx;
			margin-right: 25rpx;
			font-size: 24rpx;
			padding-bottom: 28rpx;

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 180rpx;
			}
		}

	}

	.cat-box {
		width: 710rpx;
		margin: 0 auto;
		background-color: #FFF;
		display: flex;

		::-webkit-scrollbar {
			display: none;
		}

		.scroll-view-cat {
			width: 620rpx;
			height: 90rpx;
			line-height: 90rpx;
			white-space: nowrap;
			font-size: 28rpx;
			text-align: center;

			.list {
				width: 92rpx;
				height: 90rpx;
				display: inline-block;

				.cat.active {
					width: 90rpx;
					height: 86rpx;
					line-height: 96rpx;
					margin: 0 auto;
					font-size: 30rpx;
					border-bottom: 4rpx solid #ff4844;
					color: #ff4844;
				}
			}
		}

		.cat-icon {
			width: 90rpx;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: 0rpx 0rpx 16rpx 0rpx;

			display: flex;
			justify-content: space-around;
			align-items: center;
			flex-wrap: wrap;

			.icons {
				width: 10rpx;
				height: 85rpx;
				background-color: #ffffff;
				box-shadow: -4rpx 0rpx 10rpx 0rpx rgba(169, 169, 169, 0.15);
				border-radius: 0rpx 0rpx 10rpx 0rpx;
			}

			image {
				width: 36rpx;
				height: 18rpx;
			}

			image.active {
				transform: rotate(180deg);
			}
		}
	}

	.bg {
		width: 750rpx;
		background-color: #FFF;
		padding-top: 20rpx;
	}

	.floadbg {
		width: 750rpx;
		display: none;
		background-color: #FFF;
		padding-top: 20rpx;
	}

	.fixed {
		position: fixed;
		// top: 0;
		left: 0;
		z-index: 2;
		display: block;
		padding-top: 10rpx !important;
		animation: fixedshow 1s;
		animation-fill-mode: forwards;
	}

	@keyframes fixedshow {
		from {
			top: -410rpx;
		}

		to {
			top: 0px;
		}
	}

	.fixedhide {
		position: fixed;
		// top: 0;
		left: 0;
		z-index: 2;
		display: block;
		padding-top: 10rpx !important;
		animation: fixedhide 1s;
		animation-fill-mode: forwards;
	}

	@keyframes fixedhide {
		from {
			top: 0;
		}

		to {
			display: none;
			top: -410rpx;
		}
	}


	.top-float {
		width: 670rpx;
		height: 130rpx;
		margin: 0 auto;
		padding: 0 20rpx;
		background-image: linear-gradient(90deg,
			#ff615e 0%,
			#fe4743 100%),
			linear-gradient(#ffffff,
			#ffffff);
		border-radius: 16rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		color: #FFF;

		.money {
			display: flex;
			justify-content: baseline;
			align-items: inherit;
			flex-wrap: wrap;
			font-size: 28rpx;

			.num {
				font-size: 50rpx;
				line-height: 50rpx;
				font-weight: 600;
			}

			.tips {
				margin-left: 6rpx;
			}
		}

		.time-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			font-size: 24rpx;

			.time {
				width: 36rpx;
				height: 36rpx;
				line-height: 40rpx;
				text-align: center;
				border: 1rpx solid #fff;
				border-radius: 6rpx;
			}

			.tips {
				padding: 0 7rpx;
			}
		}
	}

	.top-box {
		width: 630rpx;
		height: 160rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/limit/bg.png)no-repeat;
		background-size: 100% 100%;
		border-radius: 16rpx;
		margin: 0 auto 20rpx;
		padding: 58rpx 40rpx;
		color: #FFF;

		.title-box {

			display: flex;
			justify-content: space-between;
			align-items: baseline;
			flex-wrap: wrap;

			.title {
				font-size: 28rpx;
				letter-spacing: 2rpx;
			}

			.time-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				font-size: 24rpx;

				.time {
					width: 36rpx;
					height: 36rpx;
					line-height: 40rpx;
					text-align: center;
					border: 1rpx solid #fff;
					border-radius: 6rpx;
				}

				.tips {
					padding: 0 7rpx;
				}
			}
		}


		.money {

			margin-top: 52rpx;
			display: flex;
			justify-content: baseline;
			align-items: flex-end;
			flex-wrap: wrap;
			font-size: 40rpx;

			.num {
				font-size: 66rpx;
				line-height: 66rpx;
				font-weight: 600;
			}

			.tips {
				margin-left: 6rpx;
			}
		}
	}


	@-webkit-keyframes breath {
		0% {
			-webkit-transform: scale(.9)
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}

		30% {
			-webkit-transform: scale(.9);
			transform: scale(.9)
		}

		45% {
			-webkit-transform: scale(1)
		}

		to {
			-webkit-transform: scale(.9)
		}
	}

	@keyframes breath {
		0% {
			-webkit-transform: scale(.9)
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}

		30% {
			-webkit-transform: scale(.9);
			transform: scale(.9)
		}

		45% {
			-webkit-transform: scale(1)
		}

		to {
			-webkit-transform: scale(.9)
		}
	}
</style>
