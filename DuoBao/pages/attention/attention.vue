<template>
	<view class="tbody">
		<view class="contBox" v-if="showHide">
			<view class="cont">
				<view class="imgBox">
					<image :src="dataList[0].image" mode="widthFix"></image>
				</view>
				<view class="title">{{dataList[0].title}}</view>
				<view class="center"><text>+{{dataList[0].jfb}}集分宝</text></view>
				<view class="btnBox">
					<view class="btns" @click="ckFollow">
						<life-follow class="taskguanzhucomplete__ft" :sceneId="dataList[0].life_id!=''?dataList[0].life_id:dataList[0].appid"  @close.native="lifeClose" :checkFollow="false" v-if='dataList[0].life_id && shows' />
						
						<view class="isFollowed" v-if="followed==2">
							已关注
						</view>
						
					</view>
				</view>

				<view class="text">领取后集分宝自动发放至您的账户</view>
			</view>
		</view>

		<view class="attention" v-else>
			<image src="/static/icon/attention.png" mode="widthFix"></image>
			<view class="title">今日任务已全部完成，明天再来~</view>
		</view>
		<!-- 弹窗 -->
		<uni-popup :maskClick='false' :animation='false' ref="attentionPop" type="center">
			<view class="isCnt" :class="{succeed:isStatus}">
				<view class="jfbBox">
					<image src="/static/newImg/jb.png" mode="widthFix"></image>
					<view class="jfbNum">{{dataList[0].jfb}}个集分宝</view>
				</view>
				<view class="jfbBtn" @click="btnClicks"></view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		onLoad(option) {

			this.dataTag = option.tag
			if (this.dataTag !== 'undefined') {
				this.tcData()
			}

		},
		data() {
			return {
				showHide: true,
				dataList: [],
				shows: true,
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
		methods: {
			ckFollow() {
				if (this.followed == 2) {
					if (typeof(this.$refs.follows) !== 'undefined') {
						this.$refs.follows.close();
					}
				} else {
					this.followed = 1;
				}
			},

			tcData() {
				
				this.dataList = []
				this.$store.state.taskList.lifelist.forEach(item => {
					if (!item.isComplete) {
						// this.showHide = false
						this.dataList.push(item)
					}
				})
				if (this.dataList.length == 0) {
					this.showHide = false
				}

				this.lifeTask = this.dataList[0]

				this.onTaskTap(this.lifeTask)

			},
			btnClicks() {
				this.followed = 0;
				this.shows = false
				this.dataList = this.dataList
				this.dataList = this.dataList.splice(1, )
				this.lifeTask = this.dataList[0]

				this.onTaskTap(this.lifeTask)
				setTimeout(() => {
					this.shows = true
				}, 300)
				this.$refs.attentionPop.close()

				if (this.dataList.length <= 0) {
					this.showHide = false
				}
			},
			attenClick() {
				this.$refs.attentionPop.open()
			},

			lifeClose(e) {
				if (this.lifeTask == null) {
					return;
				}
				if (e.detail.followed == true && this.followed == 1) {

					if (typeof(this.$refs.attentionPop) !== 'undefined') {
						this.$refs.attentionPop.close();
					}
					// this.jumpTask(this.lifeTask)
					this.completeTask(true);

					if (this.dataList.length == 1) {
						this.lifeTask = null;
					}

				} else {
					if (e.detail.followed == true) {
						this.followed = 2;
						this.postTask(true, true)
						if (typeof(this.$refs.attentionPop) !== 'undefined') {
							this.$refs.attentionPop.close();
						}

						this.lifeTask = null;
						// this.btnClicks();
					}
				}
				// //缺省页显示
				// if (this.dataList.length == 1) {
				// 	this.showHide = false
				// }
			},

			completeClose() {
				try {
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

						this.$refs.attentionPop.open()
						this.postTask(isLife, false)
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
				tag = tag === '' ? this.tag : tag;
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
						if (res.data.code == 200 && (res.data.data == 1 || res.data.data == 5)) {
							if (!isNoSet) {
								if (res.data.data == 5) {
									this.$refs.coupon && this.$refs.coupon.open();
								} else {
									this.task.isComplete = true;
									utils.editTask(this.task);
								}

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
		}
	}
</script>

<style lang="less">
	.tbody {
		width: 100%;
		height: 100vh;


		.contBox {
			padding-top: 150rpx;
			background: #339EF9;
			height: 100vh;

			.cont {
				width: 690rpx;
				height: 680rpx;
				margin: 0 auto;
				background: #FFFFFF;
				border-radius: 16rpx;
				position: relative;

				.imgBox {
					position: absolute;
					top: -64rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 168rpx;
					height: 168rpx;
					background: #FFFFFF;
					border-radius: 50%;

					image {
						width: 160rpx;
						height: 160rpx;
						border-radius: 50%;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translateX(-50%)translateY(-50%);
					}
				}

				.title {
					font-size: 40rpx;
					color: #666666;
					text-align: center;
					padding-top: 133rpx;
					font-weight: 800;
				}

				.center {
					width: 520rpx;
					height: 142rpx;
					margin: 70rpx auto 0;
					background: url(/static/newImg/jfbNum.png)no-repeat;
					background-size: 100% 100%;
					border-radius: 10rpx;

					text {
						display: block;
						text-align: right;
						color: #D22A25;
						font-size: 64rpx;
						line-height: 142rpx;
						margin-right: 40rpx;
						font-weight: bold;
					}
				}

				.btnBox {
					width: 480rpx;
					margin: 84rpx auto 44rpx;
					display: flex;
					justify-content: center;

					.btns {

						// position: relative;
						.taskguanzhucomplete__ft {
							transform: scale(1.8);
						}

						// image {
						// 	width: 90rpx;
						// 	height: 80rpx;
						// 	position: absolute;
						// 	top: 0rpx;
						// 	right: 0rpx;
						// }

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
				}

				.text {
					font-size: 24rpx;
					color: #666666;
					text-align: center;
				}
			}
		}

		.attention {
			padding-top: 382rpx;
			width: 100%;
			text-align: center;

			image {
				width: 300rpx;
			}

			.title {
				font-size: 32rpx;
				color: #888;
				padding-top: 62rpx;
				text-align: center;
			}
		}

		.isCnt {
			width: 750rpx;
			height: 702rpx;
			background: url(/static/newImg/pop.png)no-repeat;
			background-size: 100% 100%;
			position: relative;

			.jfbBox {
				padding-top: 196rpx;
				text-align: center;

				image {
					width: 90rpx;
				}

				.jfbNum {
					text-align: center;
					padding-top: 10rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #D22A25;
				}
			}

			.jfbBtn {
				position: absolute;
				left: 50%;
				bottom: 55rpx;
				transform: translateX(-50%);
				width: 328rpx;
				height: 118rpx;
				background: url(/static/newImg/jfbBtn.png)no-repeat;
				background-size: 100% 100%;
			}
		}

	}
</style>
