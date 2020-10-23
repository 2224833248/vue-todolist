<template>
	<view id="red" class="page">
		<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/redtop.png" class="topbg" mode="aspectFill"></image> -->
		<image src="../../static/exchangred/top_bc2x.png" class="topbg top_bc" mode="aspectFit"></image>
		<!-- <view class="notice">
			由于支付宝政策变更。兑换红包金额暂由转账到支付宝变更为转入账户余额，您可以到"我的"--"提现"查看您的余额，并提现到支付宝
		</view> -->
		<view class="data-box">
			<view class="top-box">
				<!-- <view class="title">每日限时限量秒杀</view> -->
				<view class="title">
					<image class="title_icon" src="../../static/exchangred/active_text2x.png" mode="aspectFit"></image>
					<text>限时限量</text>
				</view>
				<view class="time">
					<!-- <text class="titles">本场秒杀倒计时</text> -->
					<text class="titles">距离结束还有</text>
					<text class="times">{{shi}}</text>
					<text class="biao">:</text>
					<text class="times">{{min}}</text>
					<text class="biao">:</text>
					<text class="times">{{miao}}</text>
				</view>
			</view>
			<view class="list-box">
				<view class="list-top" v-if="redBase.length>=3">
					<view class="list-hour" :class="thisActive == redBase[0].title?'active':''" @click="onRedList(redBase[0])">
						<image class="bgimg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-1.png"></image>
						<view class="tabs">
							<view class="title">{{redBase[0].title}}</view>
							<!-- <view class="tips">{{redBase[0].activeName}}</view> -->
							<view :class="'tips '+(redBase[0].activeName.indexOf('中') == -1 ? '' : 'tips_active')">{{redBase[0].activeName}}</view>
						</view>
					</view>
					<view class="gun"></view>
					<view class="list-hour" :class="thisActive == redBase[1].title?'active':''" @click="onRedList(redBase[1])">
						<image class="bgimg bg2" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-2.png"></image>
						<view class="tabs">
							<view class="title">{{redBase[1].title}}</view>
							<!-- <view class="tips">{{redBase[1].activeName}}</view> -->
							<view :class="'tips '+(redBase[1].activeName.indexOf('中') == -1 ? '' : 'tips_active')">{{redBase[1].activeName}}</view>
						</view>
					</view>
					<view class="gun"></view>
					<view class="list-hour" :class="thisActive == redBase[2].title?'active':''" @click="onRedList(redBase[2])">
						<image class="bgimg bg2" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-2.png"></image>
						<view class="tabs">
							<view class="title">{{redBase[2].title}}</view>
							<!-- <view class="tips">{{redBase[2].activeName}}</view> -->
							<view :class="'tips '+(redBase[2].activeName.indexOf('中') == -1 ? '' : 'tips_active')">{{redBase[2].activeName}}</view>
						</view>
					</view>
					<view class="gun"></view>
					<view class="list-hour" :class="thisActive == redBase[3].title?'active':''" @click="onRedList(redBase[3])">
						<image class="bgimg bg3" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab-3.png"></image>
						<view class="tabs">
							<view class="title">{{redBase[3].title}}</view>
							<!-- <view class="tips">{{redBase[3].activeName}}</view> -->
							<view :class="'tips '+(redBase[3].activeName.indexOf('中') == -1 ? '' : 'tips_active')">{{redBase[3].activeName}}</view>
						</view>
					</view>
				</view>
				<view class="red-box">
					<view class="red-list" v-for="(item,index) in redList" :key="index" @click="onRed(item)">
						<view class="title">需{{item.integral}}币</view>
						<view class="money" v-if="item.type == 0">
							<text class="biao">¥</text>
							<text class="num">{{item.money}}</text>
						</view>
						<view class="money" v-if="item.type == 1">随机红包</view>
						<view class="btn">{{item.status==1?'已抢光':'限量'+item.total_num+'份'}}</view>
						<view class="statusbg" :class="'status'+item.status"></view>
					</view>
				</view>
			</view>
			<!-- <view class="end-box">
				<view class="end-box-l">
					<text class="tips">当前已拥有：</text>
					<text class="num">{{user.walk_integral}}币</text>
				</view>
				<view class="end-box-r">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/lb.png?v2" class="topbg" mode="aspectFill"></image>
					<text class="title">天天做任务领取多多币或红包</text>
				</view>
			</view> -->
			
			
			<view class="last-box">
				<view class="title">
					我拥有的多多币：
				</view>
				<view class="num_text">
					{{user.walk_integral}}
				</view>
				<view class="more_btn" @click="totask()">
					点击赚更多
				</view>
			</view>
			
			<view class="rules_box">
				<view class="box_title">
					多多币小贴士
				</view>
				<view class="rules_list">
					<view class="rules_item" v-for="(item,index) in rules" :key="index">
						{{item.content_text}}
					</view>
				</view>
			</view>
		</view>

		<!-- <view class="task__bd">
			<view class="count-box">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/tab.png" class="topbg" mode="aspectFill"></image>
				<task-list ref="task" tag="morestep" :size="15" :isFilter="false"></task-list>
			</view>
		</view> -->
		
		<!-- 弹窗1 -->
		<uni-popup ref="redRandalert" type="center" :maskClick='false'>
			<view class="redrand-popup">
				<view class="box" @click="onRedRand()">
				</view>
			</view>
		</uni-popup>
		<!-- 弹窗2 -->
		<uni-popup ref="redalert" type="center" :maskClick='false'>
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
	let lock = false;

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
				thisId: 0,
				rules:[
					{
						content_text:'1.提高每天跑步、走路的运动量，即可兑换为更多的多多币，每天兑换上限为30000步'
					},
					{
						content_text:'2.每成功邀请一名新用户，即可获得2000步(具体奖励以活动为准)'
					},
					{
						content_text:'3.做多多币任务，每个多多币任务都可以获得不同数量的多多币哦'
					},
					{
						content_text:'4.平台会不定期推出各种赠送多多币的活动，敬请期待'
					},
					{
						content_text:'温馨小提示：记得每天回来兑换多多币哦，这样才能兑换更多红包！'
					}
				]
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
		mounted() {
			this.init()
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		methods: {
			totask(){
				uni.navigateTo({
					url:'../my/task',
				})
			},
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
				if (lock) return;
				lock = true
				setTimeout(res => {
					lock = false
				}, 1000)
				if (item.status == 0) {
					if (parseInt(this.user.walk_integral) > parseInt(item.integral)) {
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
							title: '多多币不足'
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
	.top_bc{
		width: 100%;
		height: 764rpx;
	}
	.notice {
		background-color: #fefad2;
		padding-left: 30rpx;
		font-size: 20rpx;
		line-height: 32rpx;
		color: #f50707;
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
		width: 679rpx;
		background-color: #1e318f;
		box-shadow: inset 0rpx 0rpx 16rpx 0rpx #0c2287;
		border-style: solid;
		border-width: 6rpx;
		border-image-source: linear-gradient(180deg,
			#2d2cc5 0%,
			#4c88f5 49%,
			#2e2fc6 100%);
		border-image-slice: 1;
		margin: 0 auto;

		.count-box {
			width: 637rpx;
			background-color: #ffffff;
			border-radius: 18rpx;
			padding: 24rpx;
			text-align: center;

			.topbg {
				width: 342rpx;
				height: 31rpx;
			}

			.task-list {
				&__item {
					padding: 40rpx 0rpx;
				}
			}
		}
	}



	.data-box {
		width: 690rpx;
		color: #FFFFFF;
		padding: 36rpx 30rpx;
		margin-top: -160rpx;

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
					color: #ffdaa6;
				}
			}

			.end-box-r {
				width: 327rpx;
				height: 43rpx;
				background-color: #0d217a;
				border-radius: 21rpx;
				padding: 0 18rpx;


				display: flex;
				flex-flow: wrap;
				align-items: center;

				image {
					width: 24rpx;
					height: 21rpx;
				}

				.title {
					width: 254rpx;
					height: 43rpx;
					font-family: PingFangSC-Regular;
					font-size: 20rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 46rpx;
					letter-spacing: 0rpx;
					color: #ffffff;
					display: inline-block;
					margin-left: 10rpx;
				}
			}
		}
		.last-box{
			width: 100%;
			height: 270rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 12rpx;
			text-align: center;
			padding: 29rpx 0 0 0;
			.title{
				
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
				text-align: center;
				margin: 0 0 29rpx 0;
			}
			.num_text{
				
				font-size: 60rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FF6148;
				text-align: center;
				margin: 0 0 29rpx 0;
			}
			.more_btn{
				display: inline-block;
				margin: 0 auto;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #73472C;
				line-height: 21px;
				text-align: center;
				
				background-image: url(../../static/exchangred/btn2x.png);
				width: 392rpx;
				height: 84rpx;
				background-size: 100%;
				background-repeat: no-repeat;
				padding: 20rpx 0 0 0;
			}
		}

		.list-box {
			// height: 534rpx;
			// background-color: #1e318f;
			// box-shadow: inset 0rpx 0rpx 16rpx 0rpx #0c2287;
			// border-style: solid;
			// border-width: 6rpx;
			// border-image-source: linear-gradient(180deg,
			// 	#2d2cc5 0%,
			// 	#4c88f5 49%,
			// 	#2e2fc6 100%);
			// border-image-slice: 1;
			margin-top: 32rpx;
			
			
			background: #FFFFFF;
			border-radius: 16rpx;

			.red-box {
				// width: 615rpx;
				
				width: 100%;
				// height: 420rpx;
				background-color: #ffffff;
				border-radius: 0rpx 0rpx 20rpx 20rpx;
				// padding: 32rpx 32rpx 0 32rpx;
				padding: 32rpx 19rpx 0 19rpx;

				display: flex;
				flex-flow: wrap;
				justify-content: space-between;
				align-items: center;
				
				box-sizing: border-box;

				.red-list {
					// width: 140rpx;
					// height: 184rpx;
					
					width: 150rpx;
					height: 196rpx;
					background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/red/red.png');
					background-size: 100% 100%;
					// opacity: 0.8;
					text-align: center;
					margin-bottom: 26rpx;
					position: relative;

					.title {
						// width: 140rpx;
						width: 150rpx;
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
						// width: 140rpx;
						width: 150rpx;
						height: 72rpx;
						line-height: 72rpx;
						font-family: PingFangSC-Medium;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 0rpx;
						color: #ffffff;

						font-size: 26rpx;

						.biao {
							font-size: 20rpx;
						}

						.num {
							font-size: 40rpx;
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
						// width: 140rpx;
						// height: 184rpx;
						
						width: 150rpx;
						height: 196rpx;
						
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
				
				
				background: #F5F5F5;
				border-radius: 16rpx 16rpx 0rpx 0rpx;

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
						height: 80rpx;
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
							// height: 48rpx;
							line-height: 48rpx;
							// font-size: 34rpx;
							
							
							font-size: 34rpx;
							font-family: AlipayNumber-Regular;
							font-weight: 400;
							color: #333333;
						}

						.tips {
							height: 24rpx;
							line-height: 24rpx;
							// font-size: 20rpx;
							
							
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #7E7E7E;
						}
						.tips_active{
							
							width: 80rpx;
							// height: 28rpx;
							background: linear-gradient(90deg, #91A3FF, #5762FF);
							border-radius: 14rpx;
							
							margin: 0 auto;
							padding: 4rpx 11rpx;
							
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 500;							
							color: #FFFFFF;
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
			padding: 32rpx 19rpx 0 19rpx;

			.title {
				// font-size: 28rpx;
				display: flex;
				align-items: center;
				
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				.title_icon{
					width: 135rpx;
					height: 32rpx;
					margin-right: 9rpx;
				}
			}

			.time {
				font-size: 22rpx;
				text-align: center;

				text {
					display: inline-block;
				}

				.titles {
					// margin-right: 24rpx;
					margin-right: 8rpx;
					
					
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}

				.biao {
					// width: 32rpx;
					width: 16rpx;
					height: 32rpx;
					
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}

				.times {
					width: 32rpx;
					height: 32rpx;
					line-height: 32rpx;
					background-image: linear-gradient(180deg,
						#fb9400 0%,
						#ff4f02 100%),
						linear-gradient(#000000,
						#000000);
					background-blend-mode: normal,
						normal;
					border-radius: 2rpx;
					
					width: 32rpx;
					height: 32rpx;
					background: #FFFFFF;
					border-radius: 4px;

					
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #6C53DA;
				}
			}
		}
	}

	.topbg {
		width: 750rpx;
	}

	.page {
		background-color: #6D52D8;
		padding-bottom: 60rpx;
	}

	/deep/.task__bd .count-box {
		width: auto;
		padding: 24rpx 0 24rpx 0 !important;
	}

	/deep/.task-list {
		.task-list__item.complete {
			background-position: 103% -150% !important;
		}

		.item__info__hd__title {
			max-width: 180rpx;
		}
	}
	
	//规则
	.rules_box{
		margin: 34rpx 0 0 0;
		text-align: center;
		.box_title{
			position: relative;
			display: inline-block;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			margin: 0 auto 40rpx auto;
		}
		.box_title::before{
			position: absolute;
			display: block;
			content: '';
			width: 8rpx;
			height: 8rpx;
			border-radius: 50%;
			background: #FFFFFF;
			top:50%;
			margin-top:-4rpx;
			left: -20rpx;
		}
		.box_title::after{
			position: absolute;
			display: block;
			content: '';
			width: 8rpx;
			height: 8rpx;
			border-radius: 50%;
			background: #FFFFFF;
			top:50%;
			margin-top:-4rpx;
			right: -20rpx;
		}
		.rules_list{
			.rules_item{
				text-indent: 1em; 
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 44rpx;
				text-align: left;
			}
		}
	}
</style>
