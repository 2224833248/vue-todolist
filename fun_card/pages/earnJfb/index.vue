<template>
	<view class="body_box">
		<view class="bg_box">
			<view class="data_box">
				<view class="top_title">今日累计集分宝奖池</view>
				<view class="top_all">{{base.jackpot}}</view>
				<view class="top_tips">
					已有{{base.inAll}}人参与瓜分
				</view>
				<view class="top_btn" @click="onClick">
					<template v-if="base.status==0">
						{{base.signUpFee}}幸运币参与瓜分
					</template>
					<template v-if="base.status==1">
						参与成功，等待明日0:00瓜分
					</template>
					<template v-if="base.status==2">
						领取昨日瓜分奖励
					</template>
				</view>
				<image src="../../static/earnjfb/buzou.png" mode="aspectFill"></image>
			</view>
			<view class="card task">
				<view class="task__hd">
					<view class="task__hd__left">
						<view class="task__hd__left__title">已收集</view>
						<image lazy-load="ture" class="task__hd__left__img" src="../../static/earnjfb/xyb.png" mode="widthFix"></image>
						<view class="task__hd__left__num">x{{base.getAll}}</view>
					</view>
					<view class="task__hd__right">
						<view class="task__hd__right__more">做任务集{{base.signUpFee}}个幸运币获得瓜分资格</view>
					</view>
				</view>
				<view class="task__bd">
					<task-list ref="task" tag="funcardSign" :size="10" :isFilters="true" @share="onShowSharePanelTap"></task-list>
				</view>
			</view>
		</view>

		<uni-popup ref="earnAlert" type="center" :maskClick='false'>
			<view class="earn_alert">
				<view class="content">
					<text class="title">恭喜你获得</text>
					<text class="num">{{num}}集分宝</text>
					<text class="tips">集分宝自动发放至您的账户</text>
				</view>
				<image lazy-load="ture" class="btn" src="/static/earnjfb/alert_btn.png" @click="collar"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import taskList from '@/components/task-list/task-list.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		components: {
			taskList,
			uniPopup
		},
		data() {
			return {
				base: {
					jackpot: 680494800, //奖池
					inAll: 3589004, //累计参与人数
					signUpFee: 2, //报名费用
					status: 0,//状态
					getAll: 30//已收集
				},
				num: 300 //开奖获得
			}
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		mounted() {
			if (this.isLogin) {
				setTimeout(() => {
					this.init()
				})

			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		methods: {
			init() {},
			getBse(){
				ajax.get({
					url: 'earnJfb/getbase'
				}).then(res => {
					if (res.data.code == 200) {
						this.base = res.data.data;					
					}
				}).catch(err => {})
			},
			onClick() {
				this.$refs.earnAlert.open()
			},
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
			},
			collar() {
				this.$refs.earnAlert.close()
			},
			// 邀请好友
			onShowSharePanelTap() {
				my.showSharePanel();
			},
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '开心签到',
					desc: '开心签到',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '开心签到',
					desc: '开心签到',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: ''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.body_box {
		width: 750rpx;
		min-height: 100vh;
		background-color: #FF580E;


		.bg_box {
			width: 750rpx;
			min-height: 1507rpx;
			background: url(../../static/earnjfb/bg.png) no-repeat;
			background-size: 100%;
			padding-top: 405rpx;
			padding-bottom: 80rpx;

			.data_box {
				width: 670rpx;
				min-height: 560rpx;
				margin: 0 auto;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				flex-direction: column;
				color: #FFFFFF;
				margin-bottom: 40rpx;

				.top_title {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					margin-bottom: 40rpx;
				}

				.top_all {
					font-size: 76rpx;
					font-family: PingFang SC;
					font-weight: bold;
					margin-bottom: 48rpx;
				}

				.top_tips {
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					margin-bottom: 64rpx;
				}

				.top_btn {
					width: 540rpx;
					height: 78rpx;
					line-height: 78rpx;
					font-size: 30rpx;
					background: linear-gradient(0deg, #F8C657, #F9D996);
					border-radius: 39rpx;
					font-weight: bold;
					color: #F5472D;
					text-align: center;
					margin-bottom: 60rpx;
				}

				image {
					width: 555rpx;
					height: 84rpx;
				}
			}
		}
	}


	.earn_alert {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 656rpx;
		height: 638rpx;
		border-radius: 30rpx;
		overflow: hidden;
		background: url(../../static/earnjfb/alert.png) no-repeat;
		background-size: 100%;


		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			padding-top: 106rpx;
			padding-bottom: 180rpx;


			.title {
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #971F0C;
				margin-bottom: 30rpx;
			}

			.num {
				font-size: 62rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FF0C2E;
				margin-bottom: 30rpx;
			}

			.tips {
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #B97965;
			}
		}

		.btn {
			width: 424rpx;
			height: 84rpx;
		}
	}

	// 任务
	.task {
		width: 696rpx;
		margin: 0 auto;
		padding-bottom: 20rpx;

		&__hd {
			height: 106rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: url(../../static/earnjfb/task-header.png) no-repeat;
			background-size: 100%;
			padding: 0 20rpx 0 25rpx;

			&__left {
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FFF;

				&__title {
					height: 36rpx;
					line-height: 39rpx;
					font-size: 24rpx;
					min-width: 80rpx;
				}

				&__img {
					width: 36rpx;
					height: 36rpx;
					margin: 0 10rpx;
				}

				&__num {
					height: 36rpx;
					line-height: 36rpx;
					font-size: 32rpx;
					min-width: 80rpx;
				}
			}

			&__right {
				display: flex;
				align-items: center;

				&__more {
					height: 38rpx;
					line-height: 38rpx;
					font-size: 20rpx;
					color: #FFF;
					padding: 0 10rpx;
					background: rgba(0, 0, 0, 0.3);
					border-radius: 20rpx;
				}
			}
		}

		&__bd {
			background-color: rgb(255, 248, 224);
		}
	}
</style>
