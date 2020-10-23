<template>
	<view id="Gift" class="page">
		<mescroll-uni ref="mescroll" @init="mescrollInit" @down="downCallback" :up="up" :down="down" @up="upCallback">
			<view class="user_box">
				<view class="integral-box">
					<view class="box-list">
						<text calss="title">我的金币</text>
					</view>
					<view class="box-list two">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jb.png"></image>
						<text class="integral">{{user.integral}}</text>
					</view>
				</view>
				<view class="icon-box">
					<view class="list" @click="onIndexTap()">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/yellows.png"></image>
						<text class="name">去赚金币</text>
					</view>
					<view class="list" @click="onLogTap()">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/huan_h.png"></image>
						<text class="name">我的兑换</text>
					</view>
				</view>
			</view>
			<!-- 红包 -->			
			<view class="red-tab">
				<red-tab ref="redTab"></red-tab>
			</view>
			
			<view class="tab-box">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/tit.png"></image>
			</view>
			<view class="gift-list">
				<view class="item" v-for="(item,index) in goodsList" :key="index">
					<view class="pic-box">
						<image class="pic" :src="item.pic"></image>
					</view>
					<view class="data-box">

						<view class="title">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/dui_h.png"></image>
							<text class="name">{{item.title}}</text>
						</view>
						<view class="volume-box">
							已兑{{item.use_num}}件
						</view>
						<view class="integral-btn">
							<view class="integral-box">
								<template v-if="item.money>0">
									<text class="jb">￥</text>
									<text class="money">{{item.money}}</text>
									<text class="jia">+</text>
								</template>
								<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jb.png"></image>
								<text class="num">{{item.integral}}</text>
							</view>
							<view class="btn" :class="item.status > 0?'err':''" @click="onDetail(item)">
								<text v-if="item.status == 0">点击兑换</text>
								<text v-else-if="item.status == 2">已兑换</text>
								<text v-else-if="item.status == 3">已兑完</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>

		<uni-popup class="popup" ref="popup" type="center">
			<view class="login-popup">
				<image class="login-popup__img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/login_popup_bg.png" mode="aspectFill"></image>
				<view class="login-popup__text">欢迎来到走路钱多多小程序</view>
				<view class="login-popup__text">— 步数越多优惠越多 —</view>
				<view class="login-popup__button" @click="login">支付宝授权登录</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import ajax from '../../utils/ajax.js'
	import cache from '../../utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import redTab from '@/components/red-tab.vue'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				loadingData: false,
				down: {
					use: false
				},
				up: {
					auto:false,
					noMoreSize: 1,
					textNoMore: '— 没有更多兑换商品了哦 —',
					empty: {
						icon: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/app_data_null.png',
						tip: '— 暂无兑换商品了哦 —'
					}
				},
				goodsList: [],
				isLogin: false,
				page: 1
			};
		},
		components: {
			MescrollUni,
			redTab
		},
		onLoad() {
			// this.user = cache.get('user');
			// if(this.user == ''){
			// 	this.getUser()
			// 	}
		},
		mounted() {
			if (!ajax.isLogin()) {
				this.$refs.popup.open()
			}

			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.isLogin = res.success
					this.init()
				})
			} else {
				this.isLogin = true
				this.init()
			}
		},
		methods: {
			init() {
				this.getList();
			},

			// 跳转到 “首页” 页面
			onIndexTap() {
				uni.navigateTo({
					url: '/pages/my/task'
				})
			},
			onLogTap() {
				if (!this.isLogin) {
					this.login()
				}
				uni.navigateTo({
					url: '/pages/exchange/exchange?cur=1'
				})
			},
			onDetail(item) {
				if (!this.isLogin) {
					this.login()
				}
				if (item.status == 0) {
					uni.navigateTo({
						url: '/pages/gift/detail?id=' + item.id
					})
				}
			},
			mescrollInit() {

			},
			downCallback() {

			},
			upCallback(e) {
				if (this.loadingData != true) {
					if (!ajax.isLogin()) return;
					this.getList();
				}
			},
			getList() {
				let mescroll = this.$refs.mescroll.mescroll;
				this.loadingData = true;
				ajax.get({
					url: 'gift/getList',
					data: {
						page: this.page
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
			login() {
				ajax.login(() => {
					this.isLogin = true
					this.init()
				})
			},
		},
		watch: {
			isLogin(o) {
				if (o == true) {
					this.$refs.popup.close()
				} else {
					this.$refs.popup.open()
				}
			}
		},
		computed: {
			user() {
				return typeof(this.$store.state.user.uid) !== 'undefined' ? this.$store.state.user : {
					integral: 0
				};
			}
		}
	}
</script>


<style lang="scss" scoped>
	.red-tab {
		
			width:716rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			background-color: #FFF;
			border-radius: 14rpx;
	}

	.gift-list {
		margin: 35rpx 17rpx;

		.item {
			width: 683rpx;
			padding: 20rpx 17rpx;
			margin-bottom: 19rpx;
			background-color: #FFF;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.pic-box {
				width: 206rpx;
				height: 206rpx;

				image {
					width: 206rpx;
					height: 206rpx;
					border-radius: 10rpx;
				}
			}

			.data-box {
				width: 454px;
				margin-left: 18rpx;
				padding: 15rpx 0;

				.title {
					height: 62rpx;
					position: relative;
					text-indent: 30rpx;

					.name {
						font-family: PingFang-SC-Medium;
						font-size: 25rpx;
						display: block;
						font-weight: normal;
						font-stretch: normal;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					image {
						width: 28rpx;
						height: 28rpx;
						position: absolute;
						top: 2rpx;
						left: 0;
					}
				}

				.volume-box {
					font-family: PingFang-SC-Medium;
					font-size: 20rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 60rpx;
					letter-spacing: -1rpx;
					color: #999999;
				}

				.integral-btn {
					height: 52rpx;
					font-family: PingFang-SC-Bold;
					color: #fb8201;
					letter-spacing: 0rpx;
					font-weight: normal;
					font-stretch: normal;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.integral-box {
						.jb {
							font-size: 27rpx;
						}

						.money {
							font-size: 39rpx;
							letter-spacing: -1rpx;
						}

						.jia {
							font-size: 32rpx;
							color: #999999;
						}

						image {
							width: 28rpx;
							height: 23rpx;
						}

						.num {
							font-size: 27rpx;
						}
					}

					.btn {
						width: 144rpx;
						height: 52rpx;
						background-image: linear-gradient(90deg,
							#fb9400 0%,
							#ff4f02 100%),
							linear-gradient(#111111,
							#111111);
						background-blend-mode: normal,
							normal;
						border-radius: 25rpx;
						font-size: 27rpx;
						text-align: center;
						line-height: 52rpx;
						color: #ffffff;
					}

					.btn.err {
						background-color: #b2b2b2;
						background-image: none;
					}
				}
			}
		}
	}

	// .gift-list {
	// 	margin: 35rpx 32rpx;
	// 	display: flex;
	// 	flex-wrap: wrap;
	// 	justify-content: space-between;

	// 	.item {
	// 		display: flex;
	// 		flex-direction: column;
	// 		width: 334rpx;
	// 		height: 510rpx;
	// 		background-color: #ffffff;
	// 		border-radius: 16rpx;
	// 		margin-bottom: 15rpx;
	// 		overflow: hidden;
	// 		padding: 17rpx 15rpx 20rpx 15rpx;
	// 		box-sizing: border-box;

	// 		.pic {
	// 			width: 305rpx;
	// 			height: 305rpx;
	// 			background-color: #fe747b;
	// 			border-radius: 10rpx;
	// 			overflow: initial;
	// 		}

	// 		.info {
	// 			padding-top: 15rpx;

	// 			.title {
	// 				height: 25rpx;
	// 				text-overflow: ellipsis;
	// 				overflow: hidden;
	// 				line-height: 26rpx;
	// 				font-size: 24rpx;
	// 				text-overflow: ellipsis
	// 			}

	// 			.integral-volume {
	// 				display: flex;
	// 				align-items: center;
	// 				justify-content: space-between;
	// 				height: 37rpx;
	// 				line-height: 37rpx;
	// 				margin-top: 17rpx;

	// 				.integral-box {
	// 					display: flex;
	// 					align-items: center;

	// 					height: 37rpx;
	// 					line-height: 37rpx;

	// 					image {
	// 						width: 37rpx;
	// 						height: 37rpx;
	// 					}

	// 					.num {
	// 						font-family: PingFang-SC-Bold;
	// 						font-size: 30rpx;
	// 						font-weight: normal;
	// 						font-stretch: normal;
	// 						letter-spacing: 0rpx;
	// 						color: #fb8201;
	// 					}
	// 				}

	// 				.volume-box {
	// 					font-family: PingFang-SC-Medium;
	// 					font-size: 20rpx;
	// 					font-weight: normal;
	// 					font-stretch: normal;
	// 					letter-spacing: -1rpx;
	// 					color: #666666;
	// 				}
	// 			}

	// 			.btn {
	// 				margin-top: 15rpx;
	// 				width: 301rpx;
	// 				height: 60rpx;
	// 				background-image: linear-gradient(90deg,
	// 					#fb9400 0%,
	// 					#ff4f02 100%),
	// 					linear-gradient(#111111,
	// 					#111111);
	// 				background-blend-mode: normal,
	// 					normal;
	// 				border-radius: 30rpx;
	// 				font-family: PingFang-SC-Medium;
	// 				font-size: 30rpx;
	// 				font-weight: normal;
	// 				font-stretch: normal;
	// 				line-height: 60rpx;
	// 				letter-spacing: 0rpx;
	// 				color: #ffffff;
	// 				text-align: center;
	// 			}

	// 			.btn.err{
	// 				background-color: #b2b2b2;
	// 				background-image:none;
	// 			}

	// 		}

	// 	}
	// }

	#Gift {
		background-color: #f5f5f5;
	}

	.user_box {

		height: 220rpx;
		margin-top: 18rpx;
		background-color: #ffffff;
		display: flex;

		.integral-box {
			width: 467rpx;
			margin-left: 32rpx;
			color: #000000;
			padding: 35rpx 0;

			.title {
				width: 132rpx;
				height: 32rpx;
				font-family: PingFang-SC-Medium;
				font-size: 34rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 14rpx;
				letter-spacing: 0rpx;
			}

			.box-list {
				display: flex;
				align-items: center;

				image {
					width: 59rpx;
					height: 59rpx;
				}

				.integral {
					width: 136rpx;
					font-family: PingFang-SC-Bold;
					font-size: 60rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 14rpx;
					letter-spacing: 0rpx;
					margin-left: 12rpx;
				}
			}

			.two {
				height: 59rpx;
				margin-top: 35rpx;
			}
		}

		.icon-box {
			width: 251rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.list {
				width: 100rpx;

				image {
					width: 90rpx;
					height: 90rpx;
				}

				.name {
					width: 87rpx;
					font-family: MicrosoftYaHei;
					font-size: 22rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 1;
					letter-spacing: 0rpx;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	.tab-box {
		width: 312rpx;
		height: 40rpx;
		margin: 0 auto;
		margin-top: 19rpx;

		image {
			width: 312rpx;
			height: 35rpx;
		}

	}

	.login-popup {
		width: 580rpx;
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding-bottom: 66rpx;

		&__img {
			width: 580rpx;
			height: 267rpx;
			margin-bottom: 62rpx;
		}

		&__text {
			text-align: center;
			font-size: 36rpx;
			line-height: 48rpx;
			color: #333333;
		}

		&__button {
			width: 430rpx;
			height: 96rpx;
			background-image: linear-gradient(90deg,
				#fb9400 0%,
				#ff4f02 100%),
				linear-gradient(#111111,
				#111111);
			background-blend-mode: normal,
				normal;
			border-radius: 48rpx;

			font-size: 40rpx;
			line-height: 96rpx;
			color: #ffffff;

			text-align: center;
			margin: 50rpx auto 0;
		}
	}
</style>
