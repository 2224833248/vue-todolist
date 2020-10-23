<template>
	<view class="content">
		<view class="egg-banner">
			<view class="egg-banner__rule" @click="this.$refs.rule.open()">规则</view>
			<view class="egg-banner__my-awards" @click="goRecord"></view>
		</view>
		<view class="hit_number">砸蛋次数:{{times}}次</view>
		<view class="hiteggs">
			<hiteggs @start="onStart" @finish="onFinish" :disabled="disabled" eggWidth="230" hammerWidth='150' hammerOriginX='20'
			 hammerIcon="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/hammerIcon.png" eggIcon="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/eggIcon.png"
			 jumpIcon="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/jumpIcon.png" redBagIcon="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/jumpIcon.png"
			 :smashedIcon="smashedIcon" smashingDuration="1500" eggMarginTop="54" />
		</view>

		<view class="prize-list">
			<view class="prize-icon"></view>
			<image class="prize-list__item" v-for="(item,index) in prize" :key="index" :src="item.url" mode="aspectFill"></image>
		</view>

		<uni-popup ref="popup" type="top" :maskClick="false">
			<view class="popup">
				<view v-if='popup.isGoods == 0' class="popup__ad">
					<image :src="popup.image" mode="aspectFill"></image>
				</view>
				<view class="adgoods" v-else>
					<image :src="popup.image" mode="aspectFill"></image>
					<view class="title-box">
						<view class="title">{{popup.title}}</view>
						<view class="tips">{{popup.subtitle}}</view>
					</view>
				</view>
				<view class="popup__text">
					{{popup.title}}
				</view>

				<form class="quick_nav" @submit="formSubmit" :report-submit="true">
					<button formType="submit" hover-class="none" class="newRd-btn clear_button" @click="jump" :data-url="popup.url"
					 :data-id="popup.id" :data-type="popup.jump_type">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/f6261ac7-11b5-435a-8eaf-48dbddc69b0f0.png"
						 mode="aspectFill"></image>
					</button>
				</form>

				<image class="close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/close.png" @click="this.$refs.popup.close()"></image>
			</view>
		</uni-popup>

		<uni-popup ref="rule" type="center" :maskClick="false">
			<view class="rule">
				<view class="rule__title">
					活动规则
				</view>
				<view class="rule-list">
					<view class="rule-list__item" v-for="(item,index) in rule" :key='index'>{{item}}</view>
				</view>
				<image class="close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/close.png" @click="this.$refs.rule.close()"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import hiteggs from '@/components/hit-eggs.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import utils from '@/utils/utils.js'

	export default {
		components: {
			hiteggs,
			uniPopup
		},
		data() {
			return {
				disabled: false,
				times: 0,
				prize: [],
				rule: [],

				smashedIcon: [
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
					"https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/smashedIcon.png",
				],
				popup: {}
			}
		},
		mounted() {
			this.init()

		},
		methods: {
			// 初始化
			init() {
				uni.showLoading({
					title: '加载中'
				});
				ajax.get({
					url: "hiteggs/status",
				}).then((res) => {
					if (res.data.code == 200) {
						this.times = res.data.data.times
						this.prize = res.data.data.prize
						this.rule = res.data.data.rule
						if (res.data.data.times <= 0) {
							this.disabled = true
						}
					} else {
						uni.showToast({
							title: res.data.msg,
						});
					}
					uni.hideLoading();
				}).catch((error) => {
					uni.hideLoading();
					uni.showToast({
						title: '加载超时,请稍后再试',
					});
				})
			},
			// 开始砸蛋
			onStart(activeIndex) {
				this.times--;
				ajax.get({
					url: "hiteggs/hit",
				}).then((res) => {
					if (res.data.code == 200) {
						this.popup = res.data.data
						// this.smashedIcon[activeIndex] = res.data.data.smashed
					}
				}).catch((error) => {})
			},
			// 砸蛋结束
			onFinish() {
				this.$refs.popup.open()
				if (this.times <= 0) {
					this.disabled = true
				}
			},
			// 点击广告
			jump(e) {
				if (typeof e.currentTarget.dataset.id == 'undefined') {
					return
				}
				let url = e.currentTarget.dataset.url
				let id = e.currentTarget.dataset.id
				let type = e.currentTarget.dataset.type

				// 领取红包
				if (this.popup.id == 0) {
					ajax.post({
						url: "hiteggs/exchange",
						data: {
							red_id: this.popup.red_id
						}
					}).then((res) => {
						if (res.data.code == 200) {
							this.$refs.popup.close()
						}
						uni.showToast({
							title: res.data.msg,
						});
					}).catch((error) => {})
				}

				// 统计点击
				ajax.post({
					url: "hiteggs/statis",
					data: {
						id: id
					}
				})

				utils.adJump2(url, type)
				this.$refs.popup.close()
			},
			goRecord() {
				uni.navigateTo({
					url: '/pages/activity/record'
				})
			},
			formSubmit(e) {
				ajax.post({
					url: 'Base/collectFormId',
					data: {
						formId: e.detail.formId
					},
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		min-height: 100vh;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/bg.jpg);
		background-size: 100%;
		background-repeat: no-repeat;
		background-color: #F63645;
		padding-bottom: 30rpx;
	}

	.egg-banner {
		height: 330rpx;

		.egg-banner__rule {
			color: #FFFCE7;
			background-color: #AD481C;
			padding: 0 20rpx;
			display: inline-block;
			line-height: 40rpx;
			font: 20rpx;
			border-radius: 40rpx;
			margin: 20rpx 30rpx;
		}

		.egg-banner__my-awards {
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/my-awards.png);
			background-size: 100%;
			width: 146rpx;
			height: 127rpx;
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.hit_number {
		height: 67rpx;
		line-height: 67rpx;
		text-align: center;
		color: rgb(255, 235, 216);
		font-weight: 500;
	}

	.hiteggs {
		width: 700rpx;
		margin: 0 auto;
	}

	.eggs-container {
		margin-top: -30rpx;
	}

	.prize-list {
		margin: 30rpx 20rpx 0;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/p-list-bg.png);
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
		display: flex;
		height: 140rpx;
		justify-content: space-between;
		padding: 15rpx 30rpx;
		border-radius: 20rpx;

		.prize-icon {
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/prize-icon.png);
			background-size: 100%;
			width: 67rpx;
			height: 67rpx;
			position: absolute;
			top: 0;
			left: 0;
		}

		.prize-list__item {
			width: 128rpx;
			height: 146rpx;
		}
	}

	.popup {
		margin-top: 100rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/popup_bg.png);
		background-size: 100%;
		background-repeat: no-repeat;
		padding: 340rpx 75rpx;

		.popup__ad {
			background-color: #FFDFBB;
			width: 580rpx;
			padding: 10rpx;

			image {
				width: 580rpx;
				height: 246rpx;
				display: block;
			}
		}

		.adgoods {
			background-color: #FFDFBB;
			width: 560rpx;
			padding: 40rpx 20rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
			}

			.title-box {
				width: 340rpx;

				.title {
					font-size: 36rpx;
					color: #652d0e;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.tips {
					font-size: 32rpx;
					color: #fe4c4b;
					margin-top: 18rpx;
				}
			}

		}

		.popup__text {
			margin-top: 14rpx;
			font-size: 27rpx;
			height: 55rpx;
			line-height: 55rpx;
			background-color: #D0150C;
			text-align: center;
			color: #F6DEDE;
			border-radius: 6rpx;
		}

		.newRd-btn {
			width: 240rpx;
			height: 247rpx;
			margin: 40rpx auto 0;
			animation: newRd-btnScale .6s linear infinite;

			image {
				width: 240rpx;
				height: 247rpx;
			}
		}

		.close {
			width: 62rpx;
			height: 62rpx;
			position: absolute;
			top: 0rpx;
			right: 40rpx;
			margin-left: -31rpx;
		}
	}

	.rule {
		width: 520rpx;
		height: 710rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/hit-eggs/rule-bg.png);
		background-size: 100%;
		color: #726029;
		padding: 10rpx 60rpx;

		.rule__title {
			text-align: center;
			font-size: 40rpx;
			line-height: 80rpx;
			font-weight: bold;
		}

		.rule-list {
			padding: 20rpx 0;
			font-size: 26rpx;
			line-height: 50rpx;
		}

		.close {
			width: 62rpx;
			height: 62rpx;
			position: absolute;
			top: 760rpx;
			left: 50%;
			margin-left: -31rpx;
		}
	}

	@keyframes newRd-btnScale {
		0% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}

		50% {
			-webkit-transform: scale(1.2);
			transform: scale(1.2)
		}

		to {
			-webkit-transform: scale(1);
			transform: scale(1)
		}
	}
</style>
