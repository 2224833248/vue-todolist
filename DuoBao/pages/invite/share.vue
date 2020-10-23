<template>
	<view class="content">
		<view class="invite_top">
			<view class="top_box">
				<view class="title">您已累计获得{{base.jfb}}个集分宝</view>
				<view class="list_box">
					<view class="titles">邀请3位好友，最高可得{{base.maxjfb}}个集分宝</view>
					<view class="user_list">
						<view class="user" v-for="(user, index) in base.user" :key="index">
							<image class="userhead" :src="user.headimg" mode="aspectFill"></image>
							<view class="username">{{user.nickname}}</view>
						</view>
					</view>
					<view class="btn" @click="receive">
						<template v-if="base.status == 0">继续邀请，赚集分宝</template>
						<template v-if="base.status == 1">开集分宝红包</template>
						<template v-if="base.status == 2">已领红包</template>
					</view>
					<view class="tips">
						<text>今日助力任务{{shi}}:{{min}}:{{miao}}后失效</text>
						<text class="sx">|</text>
						<text class="rule" @click="jumpRule">活动规则</text>
					</view>
				</view>
			</view>
		</view>
		<view class="invite_task">
			<view class="task__hd">
				<view class="task__hd__left">玩赚金币</view>
				<view class="task__hd__right" @click="jumpMoreTask">
					<view class="task__hd__right__more">查看更多</view>
					<image lazy-load="ture" class="task__hd__right__image" src="/static/invite/more.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="task__bd">
				<task-list ref="task" :size="10" tag="sign" :isFilter="true" @share="onShowSharePanelTap"></task-list>
			</view>
		</view>

		<!-- 领取成功弹窗 -->
		<uni-popup ref="invite" type="center" :maskClick="false">
			<view class="invite-popup">
				<view class="box">
					<text class="title">恭喜你获得</text>
					<view class="integral">
						<view class="txt">{{number}}集分宝</view>
						<view class="tips">集分宝自动转入你的账户</view>
					</view>
					<view class="btn" @click="this.$refs.invite.close();">
						<text class="txt">我知道了</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import cache from '../../utils/cache.js'
	import taskList from '@/components/task-list/task-list.vue'
	export default {
		components: {
			taskList
		},
		data() {
			return {
				shi: '00',
				min: '00',
				miao: '00',
				base: {
					end_time: 0,
					maxjfb: 0,
					jfb: 0,
					user: [{
						nickname: '邀请好友',
						headimg: '/static/invite/info.png',
					}, {
						nickname: '邀请好友',
						headimg: '/static/invite/info.png',
					}, {
						nickname: '邀请好友',
						headimg: '/static/invite/info.png',
					}],
					status: 0
				},
				userDef: {
					nickname: '邀请好友',
					headimg: '/static/invite/info.png',
				},
				number: 0
			}
		},
		onLoad(option) {
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
		mounted() {},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		methods: {
			init() {
				this.getBase();
			},
			getBase() {
				ajax.get({
					url: 'invite/getShareBase',
					data: {}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.base = resp.data.data;
						var num = (3 - this.base.user.length);
						if (num > 0) {
							for (var i = 0; i < num; i++) {
								this.base.user.push(this.userDef)
							}
						}
						this.countDown();
					}
				})
			},
			receive() {
				if (this.base.status == 0) {
					my.showSharePanel();
				} else if (this.base.status == 1) {
					ajax.post({
						url: 'invite/receiveShare',
						data: {}
					}).then((resp) => {
						if (resp.data.code == 200) {
							this.number = resp.data.data;
							this.getBase();
							ajax.login2();
							this.$refs.invite.open()
						}
					})
				}
			},
			jumpRule() {
				uni.navigateTo({
					url: '/pages/invite/shareRule'
				})
			},
			jumpMoreTask() {
				uni.navigateTo({
					url: '/pages/my/task'
				})
			},
			onShowSharePanelTap() {
				my.showSharePanel();
			},
			// count down 
			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.base.end_time * 1000) - new Date()) / 1000)
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
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
				};
			}
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
		}
	}
</script>

<style lang="scss">
	.invite-popup {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 170rpx;

		.box {
			width: 577rpx;
			height: 583rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			background: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/14/11/cf0329f51154c7bfb0c22c919340cf19.png_xcxwep') no-repeat;
			background-size: 100%;

			.title {
				font-size: 40rpx;
				color: #333333;
				font-weight: bold;
				margin-top: 30rpx;
			}

			.integral {
				margin: 43rpx 0rpx 150rpx;

				.txt {
					font-size: 56rpx;
					color: #ff2b31;
					font-weight: 600;
				}

				.tips {
					font-size: 20rpx;
					color: #999999;
					margin-top: 31rpx;
				}
			}

			.btn {
				width: 369rpx;
				height: 90rpx;
				box-shadow: inset -3rpx 2rpx 40rpx 0rpx #ffe981;
				border-radius: 90rpx;
				background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/14/11/e57f0c268ee468f74e8761809bf1ff6b.png_xcxwep');
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;

				.txt {
					font-size: 32rpx;
					font-weight: bold;
					line-height: 1;
					color: #fe0106;
				}
			}
		}

		.close {
			width: 58rpx;
			height: 58rpx;
		}

		.header {
			width: 411rpx;
			height: 201rpx;
			z-index: 2;
		}
	}

	.content {
		background-image: linear-gradient(-90deg,
			#ff522c 0%,
			#ff7c24 100%);
	}

	.invite_task {
		padding: 100rpx 20rpx 77rpx 20rpx;
		padding-top: 100rpx;

		.task__hd {
			width: 654rpx;
			height: 104rpx;
			padding: 0 28rpx;
			background-image: linear-gradient(0deg,
				#f52634 0%,
				#eb3422 100%),
				linear-gradient(#fef0ee,
				#fef0ee);
			background-blend-mode: normal,
				normal;
			border-radius: 15rpx 15rpx 0rpx 0rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFF;

			&__left {
				font-size: 36rpx;
			}

			&__right {
				display: flex;
				align-items: center;

				&__more {
					font-size: 26rpx;
					margin-right: 8rpx;
				}

				&__image {
					width: 10rpx;
					height: 19rpx;
				}
			}
		}

		.task__bd {
			background-color: #fff5f4;
			border-radius: 0 0 15rpx 15rpx;
		}

		/deep/.task-list__item {
			padding: 20rpx 10rpx !important;
			border-radius: 10rpx;
			margin-bottom: 15rpx;

			.item__info {
				.item__info__hd__subtitle {
					view {
						font-size: 24rpx;
					}
				}
			}
		}

		/deep/.task-list__item.complete {
			background-position: 100% -160% !important;

		}
	}

	.invite_top {
		width: 750rpx;
		height: 786rpx;
		position: relative;
		background: url(../../static/invite/bg.png) no-repeat;
		background-size: 100%;

		.top_box {
			width: 710rpx;
			height: 644rpx;
			background: url(../../static/invite/top.png) no-repeat;
			background-size: 100%;
			position: absolute;
			left: 19rpx;
			bottom: -80rpx;
			text-align: center;

			.title {
				height: 40rpx;
				margin-top: 126rpx;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 40rpx;
				letter-spacing: 0;
				color: #ffffff;
			}

			.list_box {
				width: 655rpx;
				height: 378rpx;
				margin: 0 auto;
				margin-top: 60rpx;
				color: #333333;
				font-size: 24rpx;

				.user_list {
					width: 516rpx;
					height: 123rpx;
					margin: 0 auto;
					margin-top: 53rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.user {
						width: 140rpx;

						.userhead {
							width: 80rpx;
							height: 80rpx;
							border-radius: 80rpx;
						}

						.username {
							width: 140rpx;
							height: 30rpx;
							font-family: PingFangSC-Regular;
							font-size: 21rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 30rpx;
							letter-spacing: 0rpx;
							color: #333333;
							margin-top: 22rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}

				.btn {
					width: 630rpx;
					height: 74rpx;
					line-height: 74rpx;
					margin-top: 53rpx;
					background-image: linear-gradient(-90deg,
						#ff522c 0%,
						#ff7c24 100%);
					box-shadow: 0rpx 6rpx 13rpx 0rpx rgba(229, 16, 0, 0.38);
					border-radius: 37rpx;
					font-size: 28rpx;
					color: #ffffff;
				}

				.tips {
					margin-top: 30rpx;
					color: #999999;
					font-size: 20rpx;

					.sx {
						display: inline-block;
						width: 20rpx;
					}

					.rule {
						color: #ff302f;
					}
				}
			}

		}
	}
</style>
