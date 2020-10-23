<template>
	<view class="page">
		<view class="top_bk_box">
			<view class="show_dou_num">
				<view class="show_num_text">
					你当前已拥有心愿豆
				</view>
				<view class="dou_num">
					<image class="dou_num_img" src="../../static/freedraw/index/luck_dpu3x.png" mode="aspectFit"></image>
					<text class="num">{{user.lucky_bean}}</text>
				</view>
			</view>
			<view class="show_record" @click="record()">
				参<br>
				与<br>
				记<br>
				录
			</view>
		</view>
		<view class="content">
			<view class="top_invite_box">
				<view class="box_title">
					邀请3位好友，最高可得<text class="red_price">{{userFred.maxjfb}}</text>集分宝
				</view>
				<view class="invite_friend">
					<view class="friend_item" v-for="(item,index) in userFred.user" :key="index">
						<view class="icons" @click="invite(item)">
							<image class="fri_icon" :src="item.headimg" mode="widthFix"></image>
							<image class="fir_red" src="/static/freedraw/share/redpaper_btn.png" mode="widthFix"></image>
						</view>
						<view class="invite_text">
							{{item.nickname}}
						</view>
					</view>
				</view>
				<view class="redpaper_btn" @click="openReadpaper()">
					<template v-if="userFred.status == 0">
						继续邀请赚集分宝
					</template>
					<template v-if="userFred.status == 1">
						开集分宝红包
					</template>
					<template v-if="userFred.status == 2">
						已开集分宝红包
					</template>
				</view>
				<view class="time_rule">
					<text>今日助力任务{{shi}}:{{min}}:{{miao}}后失效</text>
					<text class="line">|</text>
					<text class="rules" @click="toseeRules()">活动规则</text>
				</view>
			</view>
			<view class="task_list">
				<view class="list_title">
					心愿豆任务
				</view>
				<view class="lists">
					<task-list ref="task" tag="signIn" :isFilters="true" :size="10"></task-list>
				</view>
			</view>
		</view>
		<view class="red_paper_box" v-if="showRedPaper">
			<view class="red_paper">
				<view class="red_paper_text">
					<view class="paper_top_text">
						恭喜你获得
					</view>
					<view class="money_box">
						<text class="money_num">{{money}}集分宝</text>
					</view>
					<view class="bto_info">
						集分宝已转入您的支付宝账户
					</view>
				</view>
				<view class="know_text" @click="knowRedPaper()">
					我知道了
				</view>
			</view>
		</view>
		<view class="tasks_tanchuang" v-if="showTanchuangTasks == true">
			<view class="show_tasks_box">
				<view class="could_get_num">
					<image class="xy_dou" src="../../static/freedraw/index/luck_dpu3x.png" mode="aspectFit"></image>
					<view class="luck_dou_num">
						x{{user.lucky_bean}}
					</view>
				</view>
				<view class="box_title">
					完成下面任务即可获得心愿豆
				</view>
				<view class="close_icon" @click="closeTasks()">
					<image class="close_icon_img" src="../../static/freedraw/share/close_pop.png" mode="aspectFit"></image>
				</view>

				<view class="tasks_list">
					<task-list ref="tasks" tag="signIn" :isFilters="true" :size="10"></task-list>
				</view>

			</view>
		</view>
	</view>
</template>
<script>
	import ajax from '../../utils/ajax.js'
	import cache from '../../utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import taskList from '@/components/task-list/task-list.vue'

	export default {
		data() {
			return {
				isInviteAllFir: false, //邀请好友是否人数达到
				showRedPaper: false, //开红包后弹窗显示
				showTanchuangTasks: true,


				shi: '00',
				min: '00',
				miao: '00',
				userFred: {
					end_time: 0,
					maxjfb: 0,
					jfb: 0,
					user: [{
						nickname: '邀请好友',
						headimg: '/static/freedraw/share/head_icom.png',
					}, {
						nickname: '邀请好友',
						headimg: '/static/freedraw/share/head_icom.png',
					}, {
						nickname: '邀请好友',
						headimg: '/static/freedraw/share/head_icom.png',
					}],
					status: 0
				},
				userDef: {
					nickname: '邀请好友',
					headimg: '/static/freedraw/share/head_icom.png',
					statiu: 1
				},

				money: 0,
				title: ''
			}
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
			if (typeof(this.$refs.tasks) != 'undefined') {
				this.$refs.tasks.completeTask()
			}
			this.getShareBase()
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				this.getShareBase();
			},
			record() {
				uni.navigateTo({
					url: '/pages/sign/sign'
				})
			},
			getShareBase() {
				ajax.get({
					url: 'Invite/getShareBase'
				}).then(res => {
					if (res.data.data) {
						this.userFred = res.data.data
						var num = (3 - this.userFred.user.length);
						if (num > 0) {
							for (var i = 0; i < num; i++) {
								this.userFred.user.push(this.userDef)
							}
						}
						this.countDown();
					}
				}).catch(err => {})
			},

			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.userFred.end_time * 1000) - new Date()) / 1000)
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
			// 开启现金红包弹窗
			openReadpaper() {
				if (this.userFred.status == 1 || this.userFred.status == 2) {
					ajax.get({
						url: 'Invite/receiveShare'
					}).then(res => {
						if (res.data.code == 200) {
							this.money = res.data.data
							if (this.userFred.status == 1) {
								this.showRedPaper = true
							}
						} else {
							uni.showToast({
								title: res.data.msg
							})
						}
					}).catch(err => {})
				};
				if (this.userFred.status == 0) {
					my.showSharePanel();
				}
			},
			// 邀请好友图片点击
			invite(item) {
				if (typeof item.statiu != 'undefined') {
					my.showSharePanel();
				}
			},
			// 关闭现金红包弹窗
			knowRedPaper() {
				this.showRedPaper = false
				this.getShareBase()
			},

			closeTasks() {
				this.showTanchuangTasks = false;
			},
			toseeRules() {
				uni.navigateTo({
					url: "../activerules/activerules"
				})
			},
		},
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

		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '抽个奖',
					desc: '每日可领取,最高领99元',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/share/cgj.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '抽个奖',
					desc: '每日可领取,最高领99元',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/share/cgj.png',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
	}
</script>
<style lang="scss" scoped>
	.top_bk_box {
		width: 100%;
		height: 368rpx;
		background-size: 100%;
		background-image: url(../../static/freedraw/share/top_bk.png);
		position: relative;

		.show_dou_num {
			position: absolute;
			top: 47%;
			left: 10%;

			.show_num_text {
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				margin-bottom: 30rpx;
			}

			.dou_num {
				.dou_num_img {
					width: 36rpx;
					height: 36rpx;
					margin-right: 10rpx;
				}

				.num {
					font-size: 44rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FFFFFF;
				}
			}
		}

		.show_record {
			position: absolute;
			right: 0;
			top: 45%;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;

			background: #FF5559;
			border-radius: 8rpx 0rpx 0rpx 8rpx;
			padding: 12rpx 20rpx 14rpx 11rpx;
		}
	}

	.content {
		position: relative;
		width: 100%;
		height: 500rpx;
		background: #F7F7F7;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		margin-top: -45rpx;
		z-index: 10;
		padding: 30rpx 30rpx 45rpx 30rpx;
		box-sizing: border-box;

		.top_invite_box {
			background: #FFFFFF;
			border-radius: 14rpx;
			padding: 29rpx 30rpx;

			.box_title {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #343434;
				text-align: center;
				margin-bottom: 53rpx;

				.red_price {
					color: #FF282E;
				}
			}

			.invite_friend {
				display: flex;
				justify-content: space-around;

				.friend_item {
					.icons {
						position: relative;
						display: inline-block;

						.fri_icon {
							width: 80rpx;
							height: 80rpx;
							display: block;
							border-radius: 50%;
						}

						.fir_red {
							position: absolute;
							width: 28rpx;
							height: 36rpx;
							bottom: 0;
							left: 85%;
						}
					}

					.invite_text {
						text-align: center;
						margin-top: 20rpx;
						font-family: PingFang SC;
						color: #343434;
						width: 120rpx;
						height: 30rpx;
						font-size: 22rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 30rpx;
						letter-spacing: 0rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

			.redpaper_btn {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #FFFFFF;

				background: linear-gradient(-90deg, #FF282D 0%, #FF7540 100%);
				box-shadow: 1rpx 6rpx 13rpx 0rpx rgba(229, 16, 0, 0.38);
				border-radius: 37rpx;
				text-align: center;
				padding: 24rpx 0;
				margin-top: 53rpx;
			}

			.time_rule {
				margin: 30rpx 0 0 0;
				text-align: center;
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #9A9A9A;

				.line {
					margin: 0 16rpx;
				}

				.rules {
					color: #FF3030;

				}
			}
		}

		.task_list {
			padding: 28rpx 30rpx 0rpx 30rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;
			margin-top: 20rpx;
			border-radius: 14rpx;

			.list_title {
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #343434;
			}

			.lists {
				/deep/.task-list__item {
					background: none;
					padding-left: 0;
					padding-right: 0;
					border-bottom: 1px solid #cecece;

					&:nth-last-child(1) {
						border: none;
					}

					.item__right {
						button {
							background: linear-gradient(-90deg, #FF282D 0%, #FF7540 100%);
						}
					}
				}

			}
		}
	}

	.red_paper_box {
		position: fixed;
		top: 0;
		z-index: 20;
		height: 100vh;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		padding: 390rpx 0 0 0;
		box-sizing: border-box;

		.red_paper {
			position: relative;
			margin: 0 auto;
			width: 577rpx;
			height: 580rpx;
			background-image: url(../../static/freedraw/share/pop_redpaper.png);
			background-size: 100%;
			text-align: center;
			padding: 45rpx 0 0 0;
			box-sizing: border-box;

			.red_paper_text {
				display: inline-block;

				.paper_top_text {
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #333333;
					margin-bottom: 24rpx;
				}

				.money_box {
					margin-bottom: 24rpx;

					.money_icon {
						font-size: 36rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #FF2B31;
					}

					.money_num {
						font-size: 72rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #FF2B31;
					}
				}

				.bto_info {
					position: relative;
					left: 10rpx;
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #999999;
				}
			}

			.know_text {
				position: absolute;
				width: 380rpx;
				height: 70rpx;
				left: 50%;
				bottom: 20%;
				margin-left: -190rpx;
				text-align: center;
				background-image: url(../../static/freedraw/share/pop_redpaper_btn.png);
				background-size: 100%;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FE0106;
				padding: 14rpx 0 0 0;
				box-sizing: border-box;
			}
		}
	}

	.tasks_tanchuang {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100vh;
		z-index: 20;
		background-color: rgba(0, 0, 0, 0.5);

		.show_tasks_box {
			position: absolute;
			background-color: #FFFFFF;
			border-radius: 30rpx 30rpx 0rpx 0rpx;
			padding: 0 30rpx;
			padding-bottom: 30rpx;
			box-sizing: border-box;
			max-height: 76%;
			width: 100%;
			bottom: 0;
			text-align: center;

			.could_get_num {
				display: inline-block;
				width: 134rpx;
				height: 160rpx;
				background-image: url(../../static/freedraw/share/pop_title.png);
				background-size: 100%;
				text-align: center;
				padding: 35rpx 0 0 0;
				box-sizing: border-box;
				margin: -80rpx 0 31rpx 0;

				.xy_dou {
					display: inline-block;
					width: 54rpx;
					height: 56rpx;
				}

				.luck_dou_num {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}
			}

			.box_title {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #666666;
				margin-bottom: 31rpx;
			}

			.close_icon {
				position: absolute;
				top: 3%;
				right: 4%;

				.close_icon_img {
					display: block;
					width: 38rpx;
					height: 37.9rpx
				}
			}

			.tasks_list {
				padding: 10rpx 30rpx 0rpx 30rpx;
				box-sizing: border-box;
				background-color: #FCF7ED;
				margin-top: 20rpx;
				border-radius: 14rpx;
				height: 84%;
				overflow: scroll;

				/deep/.task-list__item {
					background: none;
					padding: 20rpx 0;
					padding-left: 0;
					padding-right: 0;

					.item__right {
						button {

							background: linear-gradient(-90deg, #FF282D 0%, #FF7540 100%);
						}
					}
				}
			}

			.tasks_list::-webkit-scrollbar {
				display: none
			}
		}
	}

	/deep/.popups {
		.taskpopupscomplete__bd {
			display: flex;
			justify-content:center;
			align-items: center;
			image {
				width: 52rpx!important;
			}

			view {
				padding-left: 16rpx;
				font-size: 36rpx;
				color: #FA501B;
			}
		}
	}
</style>
