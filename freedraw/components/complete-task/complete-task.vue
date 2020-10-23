<template>
	<view>
		<uni-popup v-if="isinit" class="popups" ref="popup1" type="center" :maskClick="false">
			<view class="popups">
				<view class="taskredcomplete" @click="redbag">
					<view class="text">
						<text class="money">{{task.money}}</text>
						<text class="yuan">元</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup v-if="isinit" class="popups" ref="popup" type="center" :maskClick='false'>
			<view class="popups">
				<view class="taskpopupscomplete">
					<!-- <view class="taskpopupscomplete__hd" v-if="task.reward_type == 1">恭喜获得金币</view> -->
					<!-- <view class="taskpopupscomplete__hd" v-if="task.reward_type == 2">恭喜获得步数</view> -->
					<view class="taskpopupscomplete__hd">— 恭喜获得 —</view>
					<view class="taskpopupscomplete__bd">
						<template v-if="task.reward_type=='1'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/gold.png" mode="aspectFill"></image>
							<text>+{{task.integral}}</text>
						</template>
						<template v-if="task.reward_type=='2'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/gold.png" mode="aspectFill"></image>
							<text>+{{task.step}}</text>
						</template>
						<template v-if="task.reward_type=='3'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/redbag.png" mode="aspectFill"></image>
							<text>+{{task.money}}元</text>
						</template>
						<template v-if="task.reward_type=='4'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/jfb.png" mode="aspectFill"></image>
							<text>+{{task.jfb}}集分宝</text>
						</template>
						<template v-if="task.reward_type=='5'">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/luckdpu.png" mode="widthFix"></image>
							<view>+{{task.wish_bean}}心愿豆</view>
						</template>
					</view>
					<view class="taskpopupscomplete__ft">
						<view>我们还为您准备了以下福利：</view>
					</view>
					<view class="taskpopupscomplete__ad" @click="adClick(popupAd)">
						<image :src="popupAd.image" mode="aspectFill" v-if="!isGoods" class="adimage"></image>
						<view class="adgoods" v-else>
							<image :src="popupAd.image" mode="aspectFill"></image>
							<view class="title-box">
								<view class="title">{{popupAd.title}}</view>
								<view class="tips">{{popupAd.subtitle}}</view>
							</view>
						</view>
					</view>
					<view class="taskpopupscomplete__button" @click="adClick(popupAd)">立即领取</view>
				</view>
			</view>
			<view class="taskpopupscomplete__close">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="completeClose"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	export default {
		components: {
			uniPopup
		},
		props: {
			info: null
		},
		data() {
			return {
				isGoods: false,
				popupAd: {},
				isinit: false
			};
		},
		mounted() {
			this.isinit = true
		},
		computed: {
			task() {
				if (this.info == null || this.info == undefined || this.info == '') {
					return {
						reward_type: 0,
						integral: 0,
						step: 0,
						money: 0
					}
				} else {
					return this.info;
				}
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			}
		},
		watch: {
			info: {
				handler() {
					if (this.info === null || this.info === undefined || this.info === '' || this.info.isComplete == false) {
						return;
					}
					if (this.info.reward_type === '3') {
						this.$refs.popup1.open()
					} else {
						ajax.get({
							url: 'Ad/record',
							data: {
								slot_id: 17
							},
							login: true,
							loading: true,
						}).then((res) => {
							if (res.data.code == 200) {
								if (res.data.data.isGoods == 1) {
									this.isGoods = true;
								} else {
									this.isGoods = false;
								}
								this.popupAd = res.data.data;
								utils.addAdShowLog(this.popupAd);
							}
						}).catch((error) => {

						})
						this.$refs.popup.open()
					}
				},
				deep: true
			}
		},
		methods: {
			init() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 17
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						if (res.data.data.isGoods == 1) {
							this.isGoods = true;
						} else {
							this.isGoods = false;
						}
						this.popupAd = res.data.data;
					}
				}).catch((error) => {

				})
			},
			completeClose() {
				try {
					this.$refs.popup1.close()
					this.$refs.popup.close()
				} catch (e) {

				}
			},
			redbag() {
				ajax.get({
					url: 'Task/taskred',
					data: {
						task_id: this.info.id,
					},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.$refs.popup1.close()
					}
					uni.showToast({
						content: res.data.msg
					})
				}).catch((error) => {
					this.$refs.popup1.close()
				})
			},
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad);
			},
			adShow(ad) {
				utils.addAdShowLog(ad);
			}
		}
	}
</script>

<style lang="scss">
	/deep/.taskredcomplete {
		position: relative;
		width: 457rpx;
		height: 418rpx;
		background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/redbg.png');
		background-size: 100% 100%;
		display: flex;
		justify-content: center;

		.text {
			position: absolute;
			top: 90rpx;

			.money {
				font-size: 72rpx;
				color: #fe3010;
			}

			.yuan {
				font-size: 45rpx;
				color: #fe3010;
			}
		}
	}

	// 领取成功
	/deep/.taskpopupscomplete {
		width: 663rpx;
		height: 740rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/popup_bg.png);
		background-size: 663rpx 740rpx;
		background-repeat: no-repeat;
		background-position: top;
		margin-top: 100rpx;

		&__hd {
			width: 663rpx;
			height: 30rpx;
			font-size: 32rpx;
			color: #333333;
			padding-top: 50rpx;
			text-align: center;
		}

		&__bd {
			margin: 50rpx 0 130rpx 0;
			text-align: center;

			image {
				width: 78rpx;
				height: 62rpx;
				vertical-align: middle;
			}

			text {
				font-size: 60rpx;
				color: #fa4f1a;
				vertical-align: middle;
				font-weight: 600;
				margin-left: 18rpx;
			}
		}

		&__ft {
			text-align: center;
			font-size: 29rpx;
			letter-spacing: 1rpx;
			margin-bottom: 43rpx;
			color: #ffffff;
		}

		&__ad {
			width: 510rpx;
			height: 160rpx;
			border-radius: 10rpx;
			margin: 0 auto;
			margin-bottom: 40rpx;


			.adimage {
				width: 510rpx;
				height: 160rpx;
				border-radius: 10rpx;
			}

			.adgoods {
				width: 510rpx;
				height: 160rpx;
				border-radius: 10rpx;
				background-color: #fbebd2;

				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 120rpx;
				}


				.title-box {
					width: 324rpx;
					margin-left: 26rpx;

					font-family: PingFang-SC-Medium;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 0rpx;
					text-align: left;

					.title {
						height: 32rpx;
						font-size: 28rpx;
						color: #652d0e;
						text-align: left;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.tips {
						height: 26rpx;
						font-size: 24rpx;
						color: #fe4c4b;
						margin-top: 18rpx;
					}
				}
			}

		}

		&__button {
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-image: linear-gradient(0deg,
				rgba(243, 210, 80, 1) 0%,
				#fbea93 100%),
				linear-gradient(#ee7a34,
				#ee7a34);
			background-blend-mode: normal,
				normal;
			border-radius: 40rpx;

			text-align: center;
			font-size: 34rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #df1f1e;
			margin: 0 auto;
			font-weight: 600;
		}

		&__close {
			margin: 42rpx 0 0;
			text-align: center;

			image {
				width: 66rpx;
				height: 66rpx;
			}
		}
	}
</style>
