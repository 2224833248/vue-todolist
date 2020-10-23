<template>
	<view id="red" class="page">
		<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/exchange/bg.jpg" class="topbg exchangeBg" mode="aspectFill"></image>
		<view class="data-box">
			<view class="top-box">
				<view class="title">每日限时限量秒杀</view>
				<view class="time">
					<text class="titles">本场秒杀倒计时</text>
					<text class="times">{{shi}}</text>
					<text class="biao">:</text>
					<text class="times">{{min}}</text>
					<text class="biao">:</text>
					<text class="times">{{miao}}</text>
				</view>
			</view>
			<view class="borderBox">
				<view class="list-box">
					<view class="list-top" v-if="redBase.length>=3">
						<view class="list-hour" :class="thisActive == redBase[0].title?'active':''" @click="onRedList(redBase[0])">
							<!-- https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard -->
							<image class="bgimg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-1.png"></image>
							<view class="tabs">
								<view class="title">{{redBase[0].title}}</view>
								<view class="tips">{{redBase[0].activeName}}</view>
							</view>
						</view>
						<view class="gun"></view>
						<view class="list-hour" :class="thisActive == redBase[1].title?'active':''" @click="onRedList(redBase[1])">
							<image class="bgimg bg2" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-2.png"></image>
							<view class="tabs">
								<view class="title">{{redBase[1].title}}</view>
								<view class="tips">{{redBase[1].activeName}}</view>
							</view>
						</view>
						<view class="gun"></view>
						<view class="list-hour" :class="thisActive == redBase[2].title?'active':''" @click="onRedList(redBase[2])">
							<image class="bgimg bg2" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-2.png"></image>
							<view class="tabs">
								<view class="title">{{redBase[2].title}}</view>
								<view class="tips">{{redBase[2].activeName}}</view>
							</view>
						</view>
						<view class="gun"></view>
						<view class="list-hour" :class="thisActive == redBase[3].title?'active':''" @click="onRedList(redBase[3])">
							<image class="bgimg bg3" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-3.png"></image>
							<view class="tabs">
								<view class="title">{{redBase[3].title}}</view>
								<view class="tips">{{redBase[3].activeName}}</view>
							</view>
						</view>
					</view>
					<view class="red-box">
						<view class="red-list" v-for="(item,index) in redList" :key="index" @click="onRed(item)">
							<view class="title">需{{item.integral}}币</view>
							<view class="money" v-if="item.type == 0">
								<view class="money_num">
									<text class="biao">¥</text>
									<text class="num">{{item.money}}</text>
								</view>

							</view>
							<view class="money" v-if="item.type == 1"><text class="text">随机红包</text></view>
							<view class="btn">{{item.status==1?'已抢光':'限量'+item.total_num+'份'}}</view>
							<view class="statusbg" :class="'status'+item.status"></view>
						</view>
					</view>
				</view>
			</view>

			<view class="end-box">
				<view class="end-box-l">
					<text class="tips">当前已拥有：</text>
					<text class="num">{{user.funcard_integral}}币</text>
				</view>
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/exchange/notice.png" class="end-box-r" mode="aspectFill"></image>
			</view>
		</view>

		<view class="task__bd">
			<view class="count-box">
				<view class="cont">
					<view class="title">
						<image class="img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/exchange/task-header.png"></image>
					</view>

					<view class="contList">
						<task-list ref="task" tag="funcardRed" :isFilter="true" :size="10"></task-list>
					</view>
				</view>
			</view>
		</view>

		<!-- 弹窗1 -->
		<uni-popup ref="redRandalert" type="center">
			<view class="redrand-popup">
				<view class="box" @click="onRedRand()">
				</view>
			</view>
		</uni-popup>
		<!-- 弹窗2 -->
		<uni-popup ref="redalert" type="center">
			<view class="redalert-popup">
				<view class="box">
					<text class="title">秒杀成功</text>
					<text class="tips">现金红包，领取后到余额</text>
					<view class="money">
						<text class="txt">{{thisMoney}}</text>
						<text class="biao">¥</text>
					</view>
					<view class="btn" @click="receive()"></view>
				</view>
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
	import taskList from '@/components/task-list/task-list.vue'

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				shi: '00',
				min: '00',
				miao: '00',
				thisActive: "10:00",
				timeEnd: 0,
				redBase: [],
				redList: [],
				isCk: false,
				thisMoney: 0.0,
				thisId: 0
			}
		},
		components: {
			taskList
		},
		onLoad: function(option) {},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success:()=>{
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
					success:()=>{
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		mounted() {
			if (this.isLogin) {
				this.init();
			} else {
				uni.$on('login', (res) => {
					this.init();
				})
			}
		},
		methods: {
			init() {
				this.getRedList();
			},
			onRedList(e) {
				this.thisActive = e.title;
				this.redList = e.list;
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
						uni.$emit('redGetBase', res)
					}
				}).catch((error) => {})
			},
			onRed(item) {
				if (item.status == 0) {
					if (parseInt(this.user.funcard_integral) > parseInt(item.integral)) {
						ajax.post({
							url: 'FlashsaleRed/ckRed',
							data: {
								id: item.id
							},
							login: true,
						}).then((res) => {
							this.isCk = false;
							if (res.data.code == 200) {
								if (item.type == 1) {
									this.thisId = item.id;
									this.$refs.redRandalert.open();
								} else {
									this.thisMoney = item.money;
									this.thisId = item.id;
									this.$refs.redalert.open();
								}
							} else {
								uni.showToast({
									title: res.data.msg
								});
							}
						}).catch((error) => {})

					} else {
						uni.showToast({
							title: '金币不足'
						});
					}
				} else if (item.status == 2) {
					uni.showToast({
						title: '即将开始'
					});
				} else if (item.status == 1) {
					uni.showToast({
						title: '抢光啦,下次早点!'
					});
				}
			},
			onRedRand() {
				ajax.get({
					url: 'FlashsaleRed/randMoney',
					data: {
						id: this.thisId
					},
					login: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.thisMoney = res.data.data;
						this.$refs.redRandalert.close();
						this.$refs.redalert.open();
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				}).catch((error) => {})
			},
			receive() {
				if (!this.isCk) {
					this.isCk = true;
					ajax.post({
						url: 'FlashsaleRed/setRed',
						data: {
							id: this.thisId
						},
						login: true,
					}).then((res) => {
						this.getRedList();
						this.isCk = false;
						if (res.data.code == 200) {
							uni.showToast({
								title: res.data.msg
							});
							ajax.login2();
							this.$refs.redalert.close();
						} else {
							uni.showToast({
								title: res.data.msg
							});
						}
					}).catch((error) => {})
				}
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
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		},
		filters: {},
	}
</script>
<style lang="scss" scoped>
	.exchangeBg {
		width: 100%;
		height: 478rpx;
	}

	.redrand-popup {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.box {
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/red.gif');
			background-size: 100% 100%;
			margin-top: -60rpx;
			width: 364rpx;
			height: 452rpx;
			border-radius: 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.redalert-popup {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.box {
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/alert.png');
			background-size: 100% 100%;
			margin-top: -60rpx;
			width: 546rpx;
			height: 601rpx;
			border-radius: 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.title {
				font-size: 36rpx;
				color: #333333;
				font-weight: bold;
			}

			.tips {
				height: 84rpx;
				line-height: 44rpx;
				font-size: 24rpx;
				color: #999999;
			}

			.money {
				height: 220rpx;
				color: #fd3e16;
				position: relative;

				.txt {
					font-size: 120rpx;
					letter-spacing: -5rpx;
				}

				.biao {
					width: 52rpx;
					height: 52rpx;
					line-height: 52rpx;
					background-color: #fd3e16;
					display: inline-block;
					font-size: 34rpx;
					border-radius: 52rpx;
					color: #FFF;
					text-align: center;
					position: absolute;
					top: 0;
					right: -60rpx;
				}
			}

			.btn {
				width: 391rpx;
				height: 123rpx;
				background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/redbtn.png');
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				position: absolute;
				bottom: 40rpx;

				.txt {
					font-size: 29rpx;
					line-height: 1;
					color: #ce2906;
				}
			}
		}
	}

	.task__bd {
		width: 714rpx;
		color: #FFFFFF;
		padding: 0 18rpx 34rpx;

		.count-box {
			padding: 14rpx;
			background: rgba(255, 255, 255, 0);
			border-radius: 20rpx;
			box-shadow: 0px 0px 24px 0px rgba(255, 255, 255, 0.63);

			.cont {
				background: #fff;
				border-radius: 20rpx;
				overflow:hidden;

				.title {
					padding-top: 24rpx;
					display: flex;
					justify-content: center;

					.img {
						width: 500rpx;
						height: 32rpx;
					}
				}

				.contList {
					//padding: 38rpx 24rpx 0 30rpx;
					/deep/.task-list__item .item__right__button{
						background: linear-gradient(90deg, #FF0D89, #FD4F6B);
					}
					.contItem {
						display: flex;
						align-items: center;
						padding-bottom: 45rpx;

						image {
							width: 88rpx;
							height: 88rpx;
							box-shadow: 1rpx 2rpx 9rpx 0rpx rgba(255, 255, 255, 0.54);
						}

						.center {
							width: 333rpx;
							margin-left: 25rpx;

							.title {
								display: flex;
								align-items: center;

								text {
									color: #343434;
									font-size: 28rpx;

									&:nth-last-of-type(1) {
										color: #FB8202;
										font-size: 28rpx;
									}
								}

								image {
									width: 28rpx;
									height: 23rpx;
									margin: 0 11rpx 0 20rpx;
								}

							}

							.texts {
								font-size: 24rpx;
								color: #9A9A9A;
								margin-top: 10rpx;
							}

						}

						.btn {
							width: 120rpx;
							height: 46rpx;
							background: linear-gradient(90deg, #FF0E8A, #FD506C);
							box-shadow: 1rpx 6rpx 6rpx 0rpx rgba(255, 22, 134, 0.1);
							border-radius: 23rpx;
							color: #fff;
							font-size: 22rpx;
							text-align: center;
							line-height: 46rpx;
							margin-left: 64rpx;
						}
					}
				}
			}
		}
	}


	.data-box {
		width: 714rpx;
		color: #FFFFFF;
		padding: 0 18rpx 0;

		.end-box {
			width: 690rpx;
			height: 90rpx;

			display: flex;
			justify-content: space-between;
			align-items: center;

			.end-box-l {
				font-family: PingFangSC-Medium;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				height: 30rpx;
				line-height: 30rpx;

				.tips {
					font-size: 24rpx;
					color: #ffffff;
				}

				.num {
					font-size: 32rpx;
					color: #FF6450;
				}
			}

			.end-box-r {
				width: 348rpx;
				height: 45rpx;
			}
		}

		.borderBox {
			padding: 14rpx;
			background: rgba(255, 255, 255, 0);
			margin-top: 32rpx;
			border-radius: 20rpx;
			box-shadow: 0px 0px 24px 0px rgba(255, 255, 255, 0.63);
		}

		.list-box {
			height: 534rpx;
			background-color: #1e318f;
			border-radius: 20rpx;
			// box-shadow: inset 0rpx 0rpx 16rpx 0rpx #0c2287;
			// border-style: solid;
			// border-width: 6rpx;
			// border-image-source: linear-gradient(180deg,
			// 	#2d2cc5 0%,
			// 	#4c88f5 49%,
			// 	#2e2fc6 100%);
			// border-image-slice: 1;

			.red-box {
				// width: 615rpx;
				// height: 420rpx;
				background-color: #ffffff;
				border-radius: 0rpx 0rpx 20rpx 20rpx;
				padding: 32rpx 32rpx 0 32rpx;

				display: flex;
				flex-flow: wrap;
				justify-content: space-between;
				align-items: center;

				.red-list {
					width: 135rpx;
					height: 184rpx;
					background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/exchange/red.png');
					background-size: 100% 100%;
					// opacity: 0.8;
					text-align: center;
					margin-bottom: 26rpx;
					position: relative;

					.title {
						width: 135rpx;
						height: 64rpx;
						font-family: PingFangSC-Medium;
						font-size: 20rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 52rpx;
						letter-spacing: 0rpx;
						color: #ffebac;
					}

					.money {
						width: 135rpx;
						height: 72rpx;
						font-family: PingFangSC-Medium;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 0rpx;
						color: #ffffff;

						display: flex;
						justify-content: center;
						align-items: flex-end;

						font-size: 26rpx;

						.text {
							font-size: 18rpx;
							margin-bottom: 11rpx;
						}

						.money_num {
							display: flex;
							justify-content: center;
							align-items: flex-end;
							letter-spacing: 2rpx;

							.biao {
								font-size: 20rpx;
							}

							.num {
								font-size: 40rpx;
								line-height: 1;
							}
						}
					}

					.btn {
						width: 110rpx;
						height: 33rpx;
						background-color: #ca1937;
						border-radius: 16rpx;
						font-family: PingFangSC-Medium;
						font-size: 18rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 33rpx;
						letter-spacing: 0rpx;
						color: #fed7a1;
						margin: 0 auto;
					}

					.statusbg {
						display: none;
						width: 135rpx;
						height: 184rpx;
						background-color: #000000;
						border-radius: 10rpx;
						opacity: 0.4;
						position: absolute;
						top: 0;
						left: 0;
					}

					.statusbg.status1 {
						display: block;
					}
				}
			}


			.list-top {
				color: #ececec;
				display: flex;
				justify-content: space-between;
				align-items: center;
				text-align: center;

				.gun {
					width: 2rpx;
					height: 25rpx;
					background-color: #ececec;
				}

				.list-hour {
					width: 170rpx;
					height: 80rpx;
					font-family: PingFangSC-Medium;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 0rpx;
					position: relative;

					.bgimg {
						position: absolute;
						top: 0;
						left: 0;
						display: none;
						z-index: 1;
						width: 180rpx;
						height: 90rpx;
					}

					.bg2 {
						width: 188rpx;
						left: -10rpx;
					}

					.bg3 {
						left: -11rpx;
					}

					.tabs {
						width: 170rpx;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 9;

						.title {
							height: 48rpx;
							line-height: 48rpx;
							font-size: 34rpx;
						}

						.tips {
							height: 24rpx;
							line-height: 24rpx;
							font-size: 20rpx;
						}
					}
				}

				.list-hour.active {
					color: #1e318f;

					.bgimg {
						display: block;
					}
				}

			}

		}

		.top-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 32rpx;

			.title {
				font-size: 28rpx;
			}

			.time {
				font-size: 22rpx;
				text-align: center;

				text {
					display: inline-block;
				}

				.titles {
					margin-right: 24rpx;
				}

				.biao {
					width: 32rpx;
					height: 32rpx;
				}

				.times {
					width: 32rpx;
					height: 32rpx;
					line-height: 32rpx;
					background: #FCDE44;
					color: #4448AE;
					border-radius: 2rpx;
				}
			}
		}
	}

	.topbg {
		width: 750rpx;
	}

	.page {

		background: #5458CC;
		padding-bottom: 60rpx;
	}
</style>
