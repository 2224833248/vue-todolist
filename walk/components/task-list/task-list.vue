<template v-if="Object.keys(taskList).length > 0">
	<view>
		<view class="task__body">
			<view class="task-list">
				<view :class="item.isComplete == false?'task-list__item':'task-list__item complete'" v-for="(item,index) in taskList"
				 :key="index" @click="onTaskTap(item)">
					<view class="item__right">
						<view class="item__right__subtitle item__right__subtitle--gold">
							<template v-if="item.reward_type=='1'">
								<view>+{{item.integral}}</view>
								<image :lazy-load="true" src="/static/index/jb.png" mode="aspectFill"></image>
							</template>
							<template v-if="item.reward_type=='2'">
								<view>+{{item.step}}</view>
								<image :lazy-load="true" src="/static/index/jb.png" mode="aspectFill"></image>
							</template>
							<template v-if="item.reward_type=='3'">
								<view>+1</view>
								<image :lazy-load="true" src="/static/index/redbag.png" mode="aspectFill"></image>
							</template>
							<template v-if="item.reward_type=='4'">
								<view>+{{item.jfb}}集分宝</view>
								<image :lazy-load="true" src="/static/index/jfb.png" mode="aspectFill"></image>
							</template>
						</view>
						<form @submit="onSubmit" :report-submit="true">
							<button formType="submit" v-if="item.isComplete == false" class="item__right__button">{{item.button_text=='' || item.button_text==null?'去完成':item.button_text}}</button>
							<button v-else class="item__right__button item__right__button--complete">已完成</button>
						</form>
					</view>
					<view class="item__left">
						<view class="item__info">
							<view class="item__info__hd">
								<view class="item__info__hd__title">{{item.title}}</view>
							</view>
							<view class="item__info__bd">{{item.subtitle}}</view>
						</view>
						<image :lazy-load="true" class="item__image" v-if="item.image==''?false:true" :src="item.image+'_xcx100'" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<complete-task v-if="isinit" :info="task"></complete-task>

			<uni-popup v-if="isinit" class="popups" ref="follows" type="center" :maskClick="false">
				<view class="popups">
					<view class="taskguanzhucomplete">
						<image :src="lifeTask.image" class="taskguanzhucomplete__logo"></image>
						<view class="taskguanzhucomplete__count">
							<view class="title">{{lifeTask.title}}</view>
							<view class="tips">{{lifeTask.subtitle}}</view>
						</view>
						<view @click="ckFollow" class="taskguanzhucomplete__btns">
							<life-follow class="taskguanzhucomplete__ft" :sceneId="lifeTask.life_id!=''?lifeTask.life_id:lifeTask.appid"
							 @close.native="lifeClose" :checkFollow="false" />
							<view class="isFollowed" v-if="followed==2">
								已关注
							</view>
						</view>
					</view>
				</view>
				<view class="taskpopupscomplete__close">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="completeClose"></image>
				</view>
			</uni-popup>

			<uni-popup v-if="isinit" class="desktop" ref="desktop" type="top" :maskClick="false">
				<image class="desktop__img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/22/ea9bcf0623d3c1c8931c645b59d9028b.png_xcxwep"
				 mode="widthFix"></image>
				<view class="desktop__button" @click="this.$refs.desktop.close()">
					我知道了
				</view>
			</uni-popup>
			<uni-popup v-if="isinit" class="desktop" ref="aliindex" type="top" :maskClick="false">
				<image class="desktop__img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/22/56af37c499ac780b0164a9f76762cf7b.png_xcxwep"
				 mode="widthFix"></image>
				<view class="desktop__button" @click="this.$refs.aliindex.close()">
					我知道了
				</view>
			</uni-popup>
		</view>
		<view class='bcgroup' v-if="showbcGroup">
			<bcGroup v-if="isinit" :params="params" @succ="succ" @error="error" />
		</view>
	</view>
</template>

<script>
	let app = getApp();

	import ajax from '@/utils/ajax.js'
	import utils from '@/utils/utils.js'
	import completeTask from '@/components/complete-task/complete-task.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			completeTask,
			uniPopup
		},
		data() {
			return {
				show: true,
				checkFollow: true,
				isOpenListShow: false,

				task: '',
				formId: '',
				activeTask: '',
				activeDate: '',
				followed: 0,
				lifeTask: {
					integral: 0,
					appid: ''
				},

				isinit: false,
				params: {
					businessId: '2021001167652345',
					businessType: '7',
					groupImg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/e393470786b0278477d9c47ab91d7d51.png',
					notice: '本群为天天夺宝粉丝福利群，群内每天不定时现金红包雨，通知天天夺宝最新福利活动！！！',
				},
				showbcGroup: false,
				whitelist: {}
			};
		},
		props: {
			isFilter: false,
			isFilters: false,
			tag: '',
			layoutType: '',
			size: {
				type: Number,
				default: 5
			}
		},
		mounted() {
			this.isinit = true

			let ee = this.$scope.__e
			this.$scope.__e = (e, b) => {
				if (!e || typeof(e.type) == 'undefined') {
					// if(this.task && this.task.type == 12){
					if (e.success == false) {
						this.showbcGroup = false
					} else {
						this.showbcGroup = false
						this.completeTask();
					}
					// }
				} else {
					ee.call(this.$scope, e)
				}
			}
		},
		methods: {
			loadData() {
				utils.upTaskInfo();
			},
			// attention() {
			// 	atten = setInterval(() => {
			// 		this.show = !this.show
			// 	}, 1000)
			// },			
			// checkFollowCb(e) {
			// 	const {
			// 		followed,
			// 		closeCount
			// 	} = e.detail

			// 	if (!followed) {
			// 		this.isOpenListShow = true
			// 	} else {
			// 		clearInterval(atten)
			// 		this.isOpenListShow = false
			// 	}
			// },
			ckFollow() {
				if (this.followed == 2) {
					// uni.showToast({
					// 	title: '已关注',
					// 	icon: 'success',
					// 	duration: 1000
					// });
					if (typeof(this.$refs.follows) !== 'undefined') {
						this.followed = 0;
						this.$refs.follows.close();
					}
				} else {
					this.followed = 1;
				}
			},

			lifeClose(e) {
				if (this.lifeTask == null) {
					return;
				}
				if (e.detail.followed == true && this.followed == 1) {
					if (typeof(this.$refs.follows) !== 'undefined') {
						this.followed = 0;
						this.$refs.follows.close();
					}
					this.jumpTask(this.lifeTask)
					this.completeTask(true);
					this.lifeTask = null;
				} else {
					if (e.detail.followed == true) {
						this.followed = 2;
						this.postTask(true, true)
						if (typeof(this.$refs.follows) !== 'undefined') {
							this.followed = 0;
							this.$refs.follows.close();
						}
						this.jumpTask(this.lifeTask)
						this.lifeTask = null;
					}
				}
			},
			completeClose() {
				try {
					this.followed = 0;
					this.$refs.follows.close()
				} catch (e) {

				}
			},
			// 点击任务
			onTaskTap(task, tag = '') {
				if (!task) {
					return;
				}
				//关注生活号任务
				let isLife = task.life_id != '';
				if (isLife && !task.isComplete) {
					this.lifeTask = task
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
					if (typeof(this.$refs.follows) !== 'undefined') {
						this.$refs.follows.open();
					}
					return;
				}
				this.jumpTask(task, () => {
					if (!isLife && !task.isComplete) {
						this.task = task
						this.activeTask = task
						this.activeDate = new Date()
					}
				})
			},
			upUserInfo() {
				utils.upUserInfo();
			},
			jumpTask(task, bk = null) {
				if (!task) {
					return;
				}
				if (task.type == 1) { // 链接跳转
					if (task.url == '') {
						bk && bk();
						return;
					}
					uni.navigateTo({
						url: "/pages/webview/webview?url=" + task.url,
						success: (res) => {
							bk && bk();
						}
					})
				} else if (task.type == 2) { // 跳转小程序
					bk && bk();
					let extraData = {};
					let u = task.extra_data.split("&");
					for (var i in u) {
						var j = u[i].split("=");
						extraData[j[0]] = j[1];
					}
					my.navigateToMiniProgram({
						appId: task.appid,
						path: task.path,
						extraData: extraData
					});
				} else if (task.type == 4) { // 关注公众号
					bk && bk();
					if (typeof(this.$refs.follows) !== 'undefined') {
						this.$refs.follows.open();
					}
				} else if (task.type == 3) { // 跳转页面
					uni.navigateTo({
						url: task.path + "?" + task.extra_data,
						success: (res) => {
							bk && bk();
						}
					})
				} else if (task.type == 5) { // 跳转插件页面
					uni.navigateTo({
						url: task.url,
						success: (res) => {
							bk && bk();
						}
					})
				} else if (task.type == 6) { // 跳转生活号
					my.ap.navigateToAlipayPage({
						path: task.url,
						success: (res) => {
							bk && bk();
						}
					})
				} else if (task.type == 7) { // 跳转指定页面
					my.ap.navigateToAlipayPage({
						path: encodeURIComponent(
							'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
							encodeURIComponent(task.url)
						),
						success: (res) => {
							bk && bk();
						}
					});
				} else if (task.type == 8) { // 系统桌面打开小程序
					bk && bk();
					if (typeof(this.$refs.desktop) !== 'undefined') {
						this.$refs.desktop.open()
					}
				} else if (task.type == 9) { // 系统桌面打开小程序
					bk && bk();
					if (typeof(this.$refs.aliindex) !== 'undefined') {
						this.$refs.aliindex.open()
					}
				} else if (task.type == 10) { // 收藏任务
					bk && bk();
					my.navigateToMiniProgram({
						appId: '2018122562686742',
						path: 'pages/index/index?originAppId=2021001167652345&newUserTemplate=KP20200813000002657818'
					});
				} else if (task.type == 11) { // 邀请好友
					bk && bk();
					my.showSharePanel();
				} else if (task.type == 12) { // 加入群聊
					bk && bk();
					this.showbcGroup = true
				} else if (task.type == 13) { // 饿了么小程序指定网页跳转
					bk && bk();
					my.navigateToMiniProgram({
						appId: '2018090761255717',
						path: 'pages/webview-redirect/webview-redirect?url=' + encodeURIComponent(task.url)
					});
				}
			},
			// 完成任务
			completeTask(isLife = false, tag = '') {
				if (this.activeTask && !this.activeTask.isComplete) {
					let isLife = this.activeTask.life_id != '';
					//关注任务不能通过onShow时间触发完成
					if (isLife) {
						this.postTask(isLife, false)
					}

					// 系统桌面打开小程序 任务场景不一致
					if (this.activeTask.type == 8 && app.globalData.scene == 1023) {
						this.postTask(isLife, false)
					}

					// 支付宝首页打开小程序 任务场景不一致
					if (this.activeTask.type == 9 && app.globalData.scene == 1000) {
						this.postTask(isLife, false)
					}

					// 收藏页面打开小程序
					if (this.activeTask.type == 10) {
						my.isCollected({
							success: (res) => {
								if (res.isCollected == true) {
									this.postTask(isLife, false)
								}
							},
						});
					}

					if (
						this.activeTask.type != 4 &&
						this.activeTask.type != 8 &&
						this.activeTask.type != 9 &&
						this.activeTask.type != 10
					) {
						this.postTask(isLife, false)
					}
				} else {
					this.activeTask = ''
					this.activeDate = ''
				}
			},
			postTask(isLife, isNoSet = false, tag = '') {
				tag = tag === '' ? this.tag : tag
				let isEmpty = this.activeTask.integral == 0 && this.activeTask.step == 0 && this.activeTask.jfb == 0 && this.activeTask
					.money == 0;
				let isShare = this.activeTask.type == 11;
				if (((new Date() - this.activeDate) / 1000 < 10) && !isShare && !isLife && !isEmpty && !isNoSet) {
					uni.showModal({
						title: '提示',
						content: '访问10秒以上,才能领取奖励哦',
						showCancel: false,
						confirmText: "知道了"
					})
					this.task = '';
					this.activeTask = ''
					this.activeDate = ''
				} else {
					ajax.get({
						url: 'Task/complete',
						data: {
							task_id: this.activeTask.id,
							form_id: this.formId ? this.formId : '',
							adzone_id: getApp().globalData.adzoneId,
							cid: this.activeTask && this.activeTask.tagMap && this.activeTask.tagMap[tag] ? this.activeTask.tagMap[tag] : 0,
							is_no_set: isNoSet
						},
						login: true,
					}).then((res) => {
						if (res.data.code == 200 && res.data.data == 1) {
							if (!isNoSet) {
								this.task.isComplete = true;
								utils.editTask(this.task);
							}
							this.$emit('update', res.data.data);
							this.upUserInfo()
						}
						this.loadData()

						this.activeTask = ''
						this.activeDate = ''
					}).catch((error) => {
						this.loadData()
						this.activeTask = ''
						this.activeDate = ''
					})
				}

			},
			onSubmit(e) {
				this.formId = e.detail.formId
			}
		},
		watch: {},
		computed: {
			taskList() {
				let tmp = [];
				if (this.tag == '@all') {
					let allList = {};
					for (let item of this.$store.state.taskList) {
						// 组件调用全部任务的时候过滤新手任务和阿里幻灯任务
						if (item.key.indexOf('ubble') !== -1 || item.key.indexOf('aliad') !== -1) {
							continue;
						}
						for (let item1 of item.value) {
							allList[item1.oldId] = item1;
						}
					}
					for (let item of allList) {
						tmp.push(item.value);
					}
				} else if (this.tag == '' || typeof(this.$store.state.taskList[this.tag]) == 'undefined') {
					tmp = [];
				} else {
					tmp = this.$store.state.taskList[this.tag];
				}
				if (this.isFilter) {
					let ret = [];
					for (let item of tmp) {
						if (!item.isComplete) {
							ret.push(item)
						}
					}
					tmp = ret;
				}
				if (this.isFilters) {
					let ret = [];
					let ret2 = [];
					for (let item of tmp) {
						if (!item.isComplete) {
							ret.push(item)
						} else {
							ret2.push(item)
						}
					}
					ret = ret.concat(ret2)
					tmp = ret;
				}
				if (this.tag != '@all') {
					if (tmp.length > this.size) {
						tmp = tmp.slice(0, this.size)
					}
				}
				//任务展示量统计
				utils.taskShowLog(this.tag, tmp);
				return tmp;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bcgroup {
		position: absolute;
		left: 0;
	}

	.display_none {
		position: absolute;
		top: -999999rpx;
		left: -999999rpx;
	}


	.desktop {
		&__img {
			margin-top: 150rpx;
			width: 750rpx;
		}

		&__button {
			width: 205rpx;
			height: 80rpx;
			border-radius: 8rpx;
			border: solid 2rpx #ffffff;

			font-size: 32rpx;
			letter-spacing: 1rpx;
			color: #ffffff;

			line-height: 80rpx;
			text-align: center;
			margin: 155rpx auto 0;
		}
	}

	// 任务列表
	.task-list {
		overflow: auto;

		&__item.complete {
			// background-color: #f8f8f8;
			// background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/complete.png');
			// background-size: 100rpx 100rpx;
			// background-repeat: no-repeat;
			// background-position: 101% -190%;

		}

		&__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 13rpx;
			//border-bottom: 2rpx #f5f5f5 solid;
			margin: 18rpx 16rpx;
			border-radius: 12rpx;
			background-color: #FFFFFF;
			flex-direction: row-reverse;

			.item__left {
				display: flex;
				align-items: center;
				flex: 1;
				overflow: hidden;
				flex-direction: row-reverse;

				.item__image {
					width: 90rpx;
					height: 90rpx;
					margin-right: 18rpx;
					flex-shrink: 0;
				}

				.item__info {
					flex: 1;
					overflow: hidden;

					&__hd {
						margin-bottom: 13rpx;
						display: flex;
						align-items: center;

						&__title {
							// max-width: 160rpx;
							font-size: 30rpx;
							font-weight: normal;
							color: #333333;
							margin-right: 12rpx;

							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}


					}

					&__bd {
						text-align: left;
						font-size: 26rpx;
						color: #808080;

						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					&__ft {
						margin-top: 20rpx;
						display: flex;
						align-items: center;

						.progress {
							width: 191rpx;
							height: 30rpx;
							background-color: #ffcc7b;
							border-radius: 15rpx;
							position: relative;

							&__bar {
								height: 30rpx;
								background-image: linear-gradient(90deg, #ffb736 0%, #ff7826 100%), linear-gradient(#f2a449, #f2a449);
								background-blend-mode: normal, normal;
								border-radius: 15rpx;
							}

							&__text {
								position: absolute;
								top: 0;
								left: 0;
								right: 0;
								text-align: center;
								font-size: 23rpx;
								line-height: 31rpx;
								color: #FFFFFF;
							}
						}

						&__text {
							font-size: 24rpx;
							color: #333333;

							&__bold {
								color: #ff8900;
							}
						}
					}
				}
			}

			.item__right {
				width: 132rpx;

				&__subtitle {}

				&__subtitle--gold {
					display: flex;
					align-items: center;
					justify-content: center;

					image {
						width: 30rpx;
						height: 22rpx;
						margin-left: 5rpx;
					}

					view {
						font-size: 26rpx;
						font-weight: bold;
						color: #ff7800;
					}
				}

				&__subtitle--down {
					width: 470rpx;
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #ff7800;
					font-weight: bold;

					.down__time {
						width: 40rpx;
						height: 40rpx;
						background-color: #ffeedf;
						border-radius: 8rpx;
						text-align: center;
						line-height: 40rpx;
						margin: 0 6rpx;
					}
				}

				&__button {
					width: 132rpx;
					height: 46rpx;
					background-image: linear-gradient(90deg,
						#fe9349 0%,
						#fe5332 100%),
						linear-gradient(#df8d37,
						#df8d37);
					background-blend-mode: normal,
						normal;
					border-radius: 31rpx;

					text-align: center;
					font-size: 23rpx;
					line-height: 46rpx;
					letter-spacing: 1rpx;
					color: #ffffff;
				}

				&__button--complete {
					background: #D6D6D6;

					// background-image: none;
					// background-image: linear-gradient(90deg,
					// 	#4ACF7A 0%,
					// 	#1EC694 100%),
					// 	linear-gradient(#1EC694,
					// 	#1EC694);
				}
			}
		}

		.task-list__item:last-child {
			border-bottom: none !important;
		}
	}

	.task {
		border-radius: 16rpx;
		margin: 0 31rpx 21rpx;

		&__header {
			height: 110rpx;
			background: url(/static/index/task_bg.png) 0 0 / 100% no-repeat;
		}

		&__body {
			// background-color: #ffffff;
		}
	}

	.task__body .life {
		display: flex;
		flex-direction: column;
		align-items: center;

		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			position: relative;
			align-items: center;
			width: 638rpx;
			height: 596rpx;
			background-size: 100% 100%;
			background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/life.png');

			.title {
				top: 111rpx;
				position: absolute;
				font-size: 79rpx;
				color: #fe2b2b;
			}

			.descr {
				top: 430rpx;
				position: absolute;
				font-size: 34rpx;
				color: #ffffff;
			}
		}

		.btn {
			margin-top: 20rpx;
		}

	}

	/deep/.taskguanzhucomplete {
		position: relative;
		width: 580rpx;
		height: 720rpx;
		background-image: url('https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/gzbg.png');
		background-size: 580rpx 720rpx;
		display: flex;
		justify-content: center;
		margin-top: 100rpx;

		&__logo {
			width: 170rpx;
			height: 170rpx;
			border: solid 8rpx rgba(254, 224, 155, 0.6);
			border-radius: 170rpx;
			position: absolute;
			top: 116rpx;
		}

		&__count {

			color: #ffffff;
			letter-spacing: -1rpx;
			font-size: 40rpx;
			text-align: center;
			position: absolute;
			top: 360rpx;

			.tips {
				margin-top: 30rpx;
				font-size: 34rpx;
			}
		}

		&__btns {
			width: 580rpx;
			display: flex;
			justify-content: center;
			position: absolute;
			top: 540rpx;

			.isFollowed {
				width: 302rpx;
				height: 80rpx;
				line-height: 80rpx;
				color: #FFF;
				background-color: #3875f6;
				border-radius: 40rpx;
				text-align: center;
			}
		}

		&__ft {
			transform: scale(1.5);
			// width: 302rpx;
			// height: 80rpx;
			// line-height: 80rpx;
			// background-color: #3875f6;
			// color: #FFf;
			// border: none;
			// border-radius: 40rpx;
		}

	}
</style>
