<template>
	<view class="red-box" v-if="Object.keys(redBase).length > 0">
		<view class="tabs-box">
			<view class="tabs-box-l">
				<image :lazy-load="true" src="/static/gift/xsms.png"></image>
				<view class="time-box">
					<text class="time">{{shi}}</text>
					<text class="time-leb">:</text>
					<text class="time">{{min}}</text>
					<text class="time-leb">:</text>
					<text class="time">{{miao}}</text>
				</view>
			</view>
			<view class="tabs-box-r">
				<view class="list" v-for="(item,index) in redBase" :key="index" :class="thisActive ==item.title?'active':''" @click="onRedList(item)">
					<view class="title">{{item.title}}</view>
					<view class="btn">{{item.activeName}}</view>
				</view>
			</view>
		</view>
		<scroll-view class="scroll-view-red" scroll-x="true" :show-scrollbar="true">
			<view class="list" v-for="(item,index) in redList" :key="index" @click="onRed()">
				<view class="box">
					<view class="img">
						<image :lazy-load="true" src="/static/gift/red.png"></image>
						<text class="name" v-if="item.type == 0">{{item.money}}元</text>
						<view class="name rand" v-if="item.type == 1">随机红包</view>
					</view>
					<view class="datas">
						<view class="title">{{item.title}}</view>
						<view class="integral-box">
							<image :lazy-load="true" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/gold.png"></image>
							<text class="num"> x{{item.integral}}</text>
						</view>
						<view class="btn" :class="'status'+item.status">
							<text v-if="item.status == 0">点击兑换</text>
							<text v-else-if="item.status == 1">已兑完</text>
							<text v-else-if="item.status == 2">即将开始</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	export default {
		data() {
			return {
				shi: '00',
				min: '00',
				miao: '00',
				thisActive: "10:00",
				timeEnd: 0,
				redBase: [],
				redList: [],
			};
		},
		mounted() {
			if (this.isLogin) {
				this.getRedList();
			} else {
				uni.$on('login', (res) => {
					this.getRedList();
				})
			}
			uni.$on('redGetBase', (res) => {
				this.timeEnd = res.data.data.timeEnd;
				this.countDown();
				this.redBase = res.data.data.list;
				this.redBase.forEach((item, index, array) => {
					if (item.active) {
						this.thisActive = item.title;
						this.redList = item.list;
					}
				})
			})
		},
		computed: {
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		},
		methods: {
			onRedList(e) {
				this.thisActive = e.title;
				this.redList = e.list;
			},
			onRed() {
				uni.navigateTo({
					url: '/pages/exchange/exchange'
				})
			},
			getRedList() {
				ajax.get({
					url: 'FlashsaleRed/getBase',
					data: {},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.timeEnd = res.data.data.timeEnd;
						this.countDown();
						this.redBase = res.data.data.list;
						this.redBase.forEach((item, index, array) => {
							if (item.active) {
								this.thisActive = item.title;
								this.redList = item.list;
							}
						})
					}
				}).catch((error) => {})
			},
			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.timeEnd * 1000) - new Date()) / 1000)
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
	.red-box {
		padding: 25rpx 20rpx 30rpx 20rpx;

		.tabs-box {
			width: 636rpx;
			display: flex;
			align-items: center;

			.tabs-box-l {
				margin-right: 50rpx;

				image {
					width: 116rpx;
					height: 27rpx;
				}

				.time-box {
					width: 116rpx;
					color: #333333;

					.time {
						width: 28rpx;
						height: 28rpx;
						background-image: linear-gradient(180deg,
							#fb9400 0%,
							#ff4f02 100%),
							linear-gradient(#000000,
							#000000);
						background-blend-mode: normal,
							normal;
						border-radius: 2rpx;
						font-size: 20rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 28rpx;
						letter-spacing: 0rpx;
						color: #ffffff;
						display: inline-block;
						text-align: center;
					}

					.time-leb {
						font-size: 20rpx;
						height: 28rpx;
						line-height: 28rpx;
						display: inline-block;
						margin: 0 5rpx;
					}
				}
			}

			.tabs-box-r {
				width: 510rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text-align: center;

				.list {
					width: 86rpx;

					.title {
						width: 86rpx;
						height: 27rpx;
						font-family: PingFangSC-Medium;
						font-size: 34rpx;
						font-weight: bold;
						font-stretch: normal;
						line-height: 27rpx;
						letter-spacing: 0rpx;
						color: #000000;
						margin-top: 4rpx;
					}

					.btn {
						width: 83rpx;
						height: 30rpx;
						font-family: PingFangSC-Medium;
						font-size: 20rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 30rpx;
						letter-spacing: 0rpx;
						color: #666666;
						margin-top: 16rpx;
						font-weight: 600;
					}
				}

				.list.active {
					.title {
						color: #ff5102;
					}

					.btn {
						background-image: linear-gradient(90deg,
							#fb9400 0%,
							#ff4f02 100%),
							linear-gradient(#000000,
							#000000);
						background-blend-mode: normal,
							normal;
						border-radius: 15rpx;
						color: #ffffff;
					}
				}
			}
		}

		.scroll-view-red {
			white-space: nowrap;
			margin-top: 26rpx;
			height: 140rpx;

			.list {
				width: 263rpx;
				height: 104rpx;
				background-color: #f8f8f8;
				border-radius: 16rpx;
				padding: 18rpx 14rpx;
				display: inline-block;
				margin-right: 17rpx;

				.box {
					display: flex;

					.img {
						width: 81rpx;
						height: 103rpx;
						position: relative;

						image {
							width: 81rpx;
							height: 103rpx;
						}

						.name {
							width: 81rpx;
							height: 20rpx;
							font-family: PingFang-SC-Bold;
							font-size: 23rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 20rpx;
							letter-spacing: 1rpx;
							color: #ffffff;
							text-align: center;
							position: absolute;
							// z-index: 9;
							bottom: 18rpx;
							left: 0;
						}

						.rand {
							font-size: 18rpx;
						}
					}

					.datas {
						width: 160rpx;
						margin-left: 17rpx;

						.title {
							width: 149rpx;
							height: 32rpx;
							font-family: PingFang-SC-Medium;
							font-size: 24rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 32rpx;
							letter-spacing: 1rpx;
							color: #333333;
						}

						.integral-box {
							display: flex;
							align-items: center;

							height: 34rpx;
							line-height: 34rpx;

							image {
								width: 24rpx;
								height: 24rpx;
							}

							.num {

								font-family: PingFang-SC-Bold;
								font-size: 20rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 0rpx;
								color: #fb8201;
							}
						}

						.btn {
							width: 100rpx;
							height: 17rpx;
							padding: 9rpx 0 5rpx;
							text-align: center;
							background-image: linear-gradient(90deg,
								#fb9400 0%,
								#ff4f02 100%),
								linear-gradient(#f34223,
								#f34223);
							background-blend-mode: normal,
								normal;
							border-radius: 16rpx;

							font-size: 17rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 17rpx;
							letter-spacing: 0rpx;
							color: #ffffff;
						}

						.btn.status1 {
							background: #909399;
						}

						.btn.status2 {
							background: #67C23A;
						}
					}
				}
			}

			.list:last-child {
				margin-right: 0;
			}
		}

	}

	.scroll-view-red::-webkit-scrollbar {
		display: none;
	}
</style>
