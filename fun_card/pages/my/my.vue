<template>
	<view class="tbody">
		<view class="bannerBox">
			<view class="banner">
				<view class="mytop">
					<image :src="user.headimg" mode="widthFix"></image>
					<view class="userName">
						<view class="title">{{user.nickname}}</view>
						<view class="userId">ID: &nbsp;&nbsp;{{user.uid}}</view>
					</view>
				</view>
			</view>
			<view class="myMoneyBox">
				<view class="title">我的账户</view>
				<view class="myMoney">
					<view class="balance" @click="toGold('babance')">

						<view class="moneyBox">
							<view class="money">{{user.funcard_money}}</view>
							<text>账户余额(元)</text>
						</view>
					</view>
					<view class="xian"></view>
					<view class="balance" @click="toGold('asdas')">

						<view class="moneyBox">
							<view class="money">{{user.funcard_integral}}</view>
							<text>我的金币</text>
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
				<view class="aliad_head_r">
					<image src="/static/index/jfb.png" mode="aspectFill"></image>
					<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>



		<adSwiper ref="adSwiper" tag="userProjector"></adSwiper>
		<!-- cont -->

		<view class="tool">
			<view class="tool-title">使用工具</view>
			<view class="tool-list">
				<view class="item" @click="toSign(jfbRecord)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/syjl.png?v2" mode="widthFix"></image>
				</view>
				<view class="item">
					<contact-button class='service' tnt-inst-id="27k_hzAR" scene="SCE00365066" icon="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/zxkf.png?v2"
					 size="88rpx" />
				</view>
				<view class="item" @click="toSign(feedback)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/jyfk.png?v2" mode="widthFix"></image>
				</view>
				<view class="item" @click="toSign(myFeedback)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/wdfk.png?v2" mode="widthFix"></image>
				</view>
				<view class="item" @click="toSign(issue)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/cjwt.png?v2" mode="widthFix"></image>
				</view>
				<view class="item" @click="toSign(applyPay,1)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/yhxy.png?v2" mode="widthFix"></image>
				</view>
				<view class="item" @click="toSign(ruleDateils,1)">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/ptgz.png?v2" mode="widthFix"></image>
				</view>
			</view>
		</view>

		<task-list ref="task" tag="index" :size="0" :isFilter="true"></task-list>

		<load v-if="loading"></load>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import adSwiper from '../../components/adSwiper/adSwiper.vue'
	import load from '../../components/load/load.vue'
	import taskList from '@/components/task-list/task-list.vue'
	export default {
		components: {
			adSwiper,
			taskList
		},
		data() {
			return {
				page: 1,
				type: 'card',
				base: [],
				list: [],
				shouHide: false,
				jfbRecord: '../jfbRecord/jfbRecord',
				feedback: '../feedback/feedback',
				myFeedback: '../myFeedback/myFeedback',
				issue: '../issue/issue',
				applyPay: 'https://mobile.yhshapp.com/Article/detail?aid=74', //用户协议
				ruleDateils: 'https://mobile.yhshapp.com/Article/detail?aid=75',

				// 阿里广告
				isShowAliAd: 1,
				adUnitId: 'ad_tiny_2021001167643261_202009262200004062',
				aliAdTaskId: 229,
			};
		},
		onShow() {
			this.getBase();
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
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
				this.getAliAdShow()
			},
			toSign(src, id) {
				if (id == 1) {
					uni.navigateTo({
						url:'/pages/webview/webview?url='+encodeURIComponent(src)
					})
				} else {
					uni.navigateTo({
						url: src
					})
				}
			},
			toGold(type) {
				uni.navigateTo({
					url: '../myGold/myGold?type=' + type
				})
			},
			swiperHandel(event) {
				if (event.detail.current == 1) {
					this.type = 'motion';
				} else {
					this.type = 'card';
				}
				this.getBase();
			},
			getBase() {
				ajax.get({
					url: 'FunCard/getBase'
				}).then((res) => {
					this.base = res.data.data;
				})
			},

			/**
			 * 阿里广告
			 */

			// 获取是否显示广告状态
			getAliAdShow() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				})
			},

			// 点击阿里广告
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.aliAdTask && this.onTaskTap(this.aliAdTask)
			},

			// 用户点击广告
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
			},

			// 广告打开成功
			onRenderSuccess(e) {
				console.info(e)
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},

			// 广告打开失败
			onRenderFail(e) {
				console.info(e)
				this.adUnitId = ''
			},
		},
		//获取用户信息
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					money: 0,
					jfb: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			aliAdTask() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.aliAdTask && (this.aliAdTask.isComplete == false)) {
					return true
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		height: 100vh;
	}

	.bannerBox {
		width: 100%;
		position: relative;

		.banner {
			width: 100%;
			height: 443rpx;
			box-sizing: border-box;
			background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner3.png)no-repeat;
			background-size: 100% 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 20rpx;

			.mytop {
				display: flex;
				padding-left: 30rpx;

				image {
					width: 94rpx;
					height: 94rpx !important;
					border-radius: 50%;
					overflow: hidden;
				}

				.userName {
					margin-left: 24rpx;
					padding: 13rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.title {
						font-size: 28rpx;
						color: #fff;
					}

					.userId {
						font-size: 24rpx;
						color: #fff;
					}
				}
			}

			.right {
				width: 100rpx;
				height: 48rpx;
				background: #2A86D8;
				border-radius: 23rpx 0rpx 0rpx 23rpx;
				text-align: center;
				line-height: 48rpx;
				font-size: 22rpx;
				color: #fff;
			}
		}
	}

	.myMoneyBox {
		width: 690rpx;
		margin: -138rpx auto 0;
		background: #fff;
		border-radius: 14rpx;
		padding: 30rpx 0;
		margin-bottom: 20rpx;

		.title {
			color: #333;
			font-size: 28rpx;
			padding-left: 30rpx;
			font-weight: bold;
		}

		.myMoney {
			display: flex;
			justify-content: space-around;
			align-items: center;

			.balance {
				width: 40%;

				.title {
					display: flex;
					align-items: center;
					justify-content: center;

					// image {
					// 	width: 10rpx;
					// 	height: 18rpx;
					// }
				}

				.moneyBox {
					text-align: center;

					.money {
						font-size: 40rpx;
						color: #333;
						font-weight: bold;
						padding-top: 20rpx;
						text-align: center;
					}

					text {
						font-size: 24rpx;
						color: #666;
					}
				}
			}

			.xian {
				width: 2px;
				height: 50rpx;
				background: #ECECEC;
			}
		}

	}

	.tool {
		width: 690rpx;
		background: #FFFFFF;
		border-radius: 14rpx;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 30rpx 0;

		&-title {
			padding-left: 30rpx;
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
		}

		&-list {
			display: flex;
			flex-wrap: wrap;

			.item {
				width: 25%;
				text-align: center;
				margin-top: 40rpx;

				image {
					width: 88rpx;
				}

				.service {
					width: 88rpx;
				}

				.title {
					color: #666;
					font-size: 24rpx;
					text-align: center;
					margin-top: 20rpx;
				}
			}
		}
	}


	.cont {
		&-pating {
			background: #fff;
			padding: 40rpx 30rpx 0rpx 30rpx;

			.dateTitle {
				display: flex;
				justify-content: space-between;
				padding-bottom: 28rpx;

				.date,
				.theyCount,
				.bonus {
					font-size: 28rpx;
					color: #343434;
					font-weight: bold;
				}
			}

			&-item {
				// height: 130rpx;
				box-sizing: border-box;
				padding: 28rpx 0;
				border-bottom: 1px solid #ECECEC;

				&:nth-last-child(1) {
					border: none;
					// padding-bottom: 0;
				}

				.submit {
					width: 100%;
					display: flex;
					justify-content: space-between;

					view {
						width: 30%;
					}

					.submitText {
						font-size: 28rpx;
						color: #343434;
						text-align: center;
					}

					.price {
						color: #228CF5;
						font-size: 28rpx;
						text-align: right;
					}
				}

				.challenge {
					padding-top: 25rpx;
					display: flex;
					justify-content: space-between;

					.challengeText {
						font-size: 22rpx;
						color: #9A9A9A;
					}

					.date {
						font-size: 22rpx;
						color: #9A9A9A;
					}
				}
			}

			.nodata {
				// position: absolute;
				// left: 50%;
				// transform: translateX(-50%);
				margin: 100rpx auto 0;
				text-align: center;
				padding-bottom: 40rpx;

				image {
					width: 330rpx;
					height: 255rpx;
				}

				.text {
					color: #666666;
					font-size: 28rpx;
				}
			}
		}

	}

	// // 客服
	// .service {
	// 	width: 107rpx;
	// 	height: 107rpx;
	// 	background: url(/static/icon/kf.png)no-repeat;
	// 	background-size: 100% 100%;
	// 	position: fixed;
	// 	bottom: 60rpx;
	// 	left: 30rpx;
	// }

	.aliad {
		margin: 30rpx 30rpx;
		background-color: #FFFFFF;
		border-radius: 14rpx;

		.aliad_head {
			display: flex;
			justify-content: space-between;
			padding: 25rpx 17rpx 0;
			align-items: baseline;

			.aliad_head_l {
				width: 227rpx;
				height: 27rpx;
			}

			.aliad_head_r {
				display: flex;

				image {
					width: 24rpx;
					height: 24rpx;
					margin-right: 7rpx;
				}

				view {
					font-size: 22rpx;
					color: #333333;

					text {
						color: #f70707;
					}
				}
			}
		}

		.aliad_body {
			padding: 17rpx 17rpx;
		}
	}
</style>
