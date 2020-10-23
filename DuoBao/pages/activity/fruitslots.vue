<template>
	<view class="content">
		<view class="fruitslots">
			<view class="fruitslots__tipText">剩余抽奖次数: <text>{{times}}</text> 次</view>
			<fruit-slots width="651" margin="20" :prizeList="prizeList" :prizeName="prizeName" :disabled="disabled"
			 :currentIndex="currentIndex" @start="onStart" @finish="onFinish" />
		</view>
		<view class="prize-pond">
			<image class="prize-pond__item" v-for="(item,index) in prize" :key="index" :src="item.url" mode="aspectFill"></image>
		</view>
		<view class="rule">
			<image class="rule__title" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/rule_title.png" mode="aspectFill"></image>
			<view class="rule__item" v-for="(item,index) in rule" :key="index">{{item}}</view>
		</view>
		<view class="prize" @click="goRecord">我的奖品</view>

		<uni-popup ref="popup" type="center" :maskClick="false">
			<view class="popup">
				<view class="popup__title">
					{{popup.title}}
				</view>
				<image class="popup__image" :src="popup.image" mode="widthFix" @click="jump" :data-url="popup.url" :data-id="popup.id"
				 :data-type="popup.jump_type"></image>
				<view class="popup__button" @click="jump" :data-url="popup.url" :data-id="popup.id" :data-type="popup.jump_type"></view>
				<view class="popup__close" v-if="close" @click="this.$refs.popup.close()"></view>
			</view>
		</uni-popup>

		<view class="newpopup" v-if="newpopup">
			<view class="caiguang"></view>
			<view class="m-box"></view>
			<view class="showPrize-dialog">
				<view class="red-bg"></view>
				<view class="card-bg">
					<image :src="popup.image" mode="aspectFill" @click="jump" :data-url="popup.url" :data-id="popup.id" :data-type="popup.jump_type"></image>
				</view>
				<view class="detail">
					<view class="topic">{{popup.title}}</view>
					<view class="goto" @click="jump" :data-url="popup.url" :data-id="popup.id" :data-type="popup.jump_type"></view>
				</view>
			</view>
			<view class="close" v-if="close" @click="this.newpopup = false"></view>
		</view>
	</view>
</template>

<script>
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	import fruitSlots from '@/components/fruit_slots.vue'
	export default {
		components: {
			fruitSlots
		},
		data() {
			return {
				lottery: 3,
				prizeName: '福袋1',
				disabled: false,
				currentIndex: 1,
				tipText: '',
				times: 0,
				popup: {},
				prizeList: [],
				prize: [],
				rule: [],
				close: false,
				newpopup: false,
			};
		},
		mounted() {
			this.getStatus()
		},
		methods: {
			getStatus() {
				ajax.get({
					url: 'FruitSlots/status',
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.times = res.data.data.times
						this.prize = res.data.data.prize
						this.prizeList = res.data.data.prizeList
						this.rule = res.data.data.rule
						if (res.data.data.times <= 0) {
							this.disabled = true
						}
					}
				}).catch((error) => {})
			},
			onStart() {
				// 隐藏关闭按钮
				this.newpopup = false
				this.close = false

				// 减少抽奖次数
				this.times--
				if (this.times <= 0) {
					this.disabled = true
				}

				// 设置下次中奖奖品
				if (Math.round(Math.random())) {
					this.prizeName = '福袋1'
				} else {
					this.prizeName = '福袋2'
				}

				ajax.get({
					url: 'FruitSlots/draw',
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.popup = res.data.data
					}
				}).catch((error) => {})
			},
			onFinish(index, name) {
				setTimeout(() => {
					this.newpopup = true
					// this.$refs.popup.open()
				}, 500)
				setTimeout(() => {
					this.close = true
				}, 5000)
			},
			jump(e) {
				if (typeof e.currentTarget.dataset.id == 'undefined') {
					return
				}
				let url = e.currentTarget.dataset.url
				let id = e.currentTarget.dataset.id
				let type = e.currentTarget.dataset.type

				if (!url) {
					return
				}

				// 统计点击
				ajax.post({
					url: "FruitSlots/statis",
					data: {
						id
					}
				})
				utils.adJump2(url, type)
			},
			goRecord() {
				uni.navigateTo({
					url: '/pages/activity/record'
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		background-color: rgb(231, 68, 53);
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/fruitslots_bg.png);
		background-size: 100%;
		background-repeat: no-repeat;
		padding-top: 319rpx;
		overflow: auto;
	}

	.fruitslots {
		margin-bottom: 30rpx;
		padding: 0 21rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/fruit-slots_bg.png);
		background-size: 100%;
		overflow: auto;

		.fruitslots__tipText {
			width: 350rpx;
			height: 50rpx;
			line-height: 50rpx;
			background: rgba(151, 26, 14, 0.45);
			border-radius: 25rpx;
			text-align: center;
			margin: 40rpx auto 0;

			font-size: 28rpx;
			color: #ffffff;

			text {
				font-size: 34rpx;
				color: #feef47;
			}
		}

		.fruit-slots {
			width: 651rpx;
			margin: 43rpx auto;
		}
	}

	.prize-pond {
		margin: 0 21rpx 30rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/prize-pond_bg.png);
		background-size: 100% auto;
		height: 178rpx;
		padding: 109rpx 40rpx 0;
		display: flex;
		justify-content: space-around;

		.prize-pond__item {
			width: 141rpx;
			height: 141rpx;
			display: block;
		}
	}

	.rule {
		margin: 0 21rpx 30rpx;
		padding: 41rpx 25rpx 60rpx;
		background-color: #fffefe;
		border-radius: 16rpx;

		.rule__title {
			width: 268rpx;
			height: 33rpx;
			display: block;
			margin: 0 auto 30rpx;
		}

		.rule__item {
			font-size: 25rpx;
			line-height: 45rpx;
			color: #000000;
		}
	}

	.prize {
		position: fixed;
		top: 20rpx;
		right: 0rpx;

		width: 28rpx;
		padding: 16rpx 18rpx;
		background-image: linear-gradient(0deg, #ffd08c 0%, #fff2e2 100%),
			linear-gradient(#000000, #000000);
		background-blend-mode: normal, normal;
		border-radius: 24rpx 0rpx 0rpx 24rpx;

		font-size: 26rpx;
		letter-spacing: 2rpx;
		color: #dc3424;
	}

	.popup {
		width: 577rpx;
		height: 790rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/popup_bg.gif);
		background-repeat: no-repeat;
		background-size: 100%;

		.popup__title {
			font-size: 40rpx;
			color: #ffffff;
			text-align: center;
			padding-top: 210rpx;
		}

		.popup__image {
			width: 470rpx;
			display: block;
			margin: 22rpx auto 0;
			border-radius: 18rpx;
		}

		.popup__button {
			width: 341rpx;
			height: 87rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/fruitslots/popup_botton.png);
			background-repeat: no-repeat;
			background-size: 100%;
			margin: 27rpx auto;
		}

		.popup__close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			top: 822rpx;
			left: 50%;
			margin-left: -30rpx;

			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close2.png);
			background-repeat: no-repeat;
			background-size: 100%;

			opacity: 1;
			animation: mobbile 0.5s;
		}
	}

	@keyframes mobbile {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.newpopup {
		position: fixed;
		z-index: 10000;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: hidden;
		background-color: rgba(0, 0, 0, .85);

		.caiguang {
			animation: rotation 5s linear infinite;
			position: absolute;
			top: 0;
			width: 750rpx;
			height: 750rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/618e7ad4b74aa60bf1d54ad9ebc121d0.png);
			background-size: 100%;
		}

		.m-box {
			width: 750rpx;
			height: 100%;
			position: absolute;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/2f9bcbb41043262e9e87ea9c15a83b87.png);
			background-repeat: no-repeat;
			background-position: center center;
			background-size: 100%;
		}

		.showPrize-dialog {
			width: 100%;
			height: 828rpx;
			position: absolute;

			z-index: 2;
			margin-top: -414rpx;
			top: 42%;
			animation: showModal .5s ease-in-out;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/8a7a73be91375c07a5b63d14ec2d30e4.png);
			background-size: 100%;

			.card-bg {
				width: 672rpx;
				height: 566rpx;
				background-position: center top;
				background-repeat: no-repeat;
				margin: auto;
				padding-top: 20rpx;

				image {
					width: 546rpx;
					height: 250rpx;
					display: block;
					margin: 168rpx auto 0;
					margin-right: 66rpx;
				}
			}

			.red-bg {
				top: 184rpx;
				left: 50%;
				margin-left: -228rpx;
				width: 456rpx;
				height: 171rpx;
				background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/3f5468de0bfbe111586f7649a3c8d115.gif);
				background-size: 100%;
				background-position: center;
				background-repeat: no-repeat;
				position: relative;
				z-index: -1;
				animation: scale 0.2s linear forwards;
			}

			.detail {
				width: 560rpx;
				height: 302rpx;
				background-position: center;
				background-repeat: no-repeat;
				position: absolute;
				top: 617rpx;
				left: 50%;
				margin-left: -280rpx;
				z-index: 7;
				animation: scale 0.2s linear forwards;

				.topic {
					width: 562rpx;
					height: 77rpx;
					border-radius: 4px;
					text-align: center;
					position: absolute;
					top: 14rpx;
					left: 40%;
					color: #fff;
					font-size: 30rpx;
					margin-left: -225rpx;
					line-height: 77rpx;
				}

				.goto {
					width: 229rpx;
					height: 229rpx;
					background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/86b46e2351b4dcf328f7e9ef80cc3458.png);
					background-size: 100%;
					background-position: center;
					background-repeat: no-repeat;
					position: absolute;
					left: 50%;
					margin-left: -114.5rpx;
					bottom: -26rpx;
					text-align: center;
					line-height: 100.4rpx;
					color: #ef4511;
					font-size: 40rpx;
					text-shadow: 1px 1px 2px #fff;
					animation: skip .3s linear infinite alternate;
				}
			}
		}

		.close {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			top: 80rpx;
			right: 40rpx;
			z-index: 857;

			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close2.png);
			background-repeat: no-repeat;
			background-size: 100%;

			opacity: 1;
			animation: mobbile 0.5s;
		}
	}

	@keyframes rotation {
		from {
			-webkit-transform: rotate(0deg);
		}

		to {
			-webkit-transform: rotate(360deg);
		}
	}


	@keyframes showModal {
		from {
			-webkit-transform: scale(.1);
			transform: scale(.1)
		}

		to {
			-webkit-transform: scale(1);
			transform: scale(1)
		}
	}

	@keyframes skip {
		from {
			-webkit-transform: scale(0.9);
			transform: scale(0.9)
		}

		100% {
			-webkit-transform: scale(1);
			transform: scale(1)
		}
	}


	@keyframes scale {
		from {
			transform: scale(0);
		}

		to {
			transform: scale(1);
		}
	}
</style>
