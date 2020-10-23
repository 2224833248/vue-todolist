<template>
	<view class="content">
		<view class="header">
			<block v-if="isLogin">
				<view class="header_gold">
					<text class="header_gold__number">{{user.integral}}</text>
					<text class="header_gold__info">
						金币
					</text>
				</view>
				<view class="header_progress">
					<view class="header_progress__min">
						{{user.integral}}
					</view>
					<view class="header_progress__bar">
						<view class="header_progress__percent" :style="{'width': Math.min(100,user.integral/100)+'%'}"></view>
					</view>
					<view class="header_progress__max">
						10000
					</view>
				</view>
				<view class="header_panda_speak">满10000金币可兑换1元</view>
			</block>
			<block v-else>
				<view class="header_nologin_textarea">
					您还未登录账号
				</view>
				<view class="header_nologin__button" @click="login">
					点击登录
				</view>
			</block>

			<view class="header_extra_bonus" v-if="floatAd.length>0">
				<image lazy-load="ture" class="header_extra_bonus__img" src="/static/index/header_extra_bonus.png" mode="aspectFill"></image>
				<view class="header_extra_bonus__list">
					<view class="header_extra_bonus__list__item" v-for="(item,index) in floatAd" :key="index" @click="adClick(item)">
						<image lazy-load="ture" class="item__image" :src="item.image" mode="widthFix"></image>
						<view class="item__text">{{item.title}}</view>
					</view>
				</view>
			</view>

			<form class="header_bubble" @submit="onSubmit" :report-submit="true">
				<button formType="submit" class="header_bubble__item" v-if="typeof task_bubble[0] != 'undefined'" @click="onTaskTap(task_bubble[0])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[0].image_bubble" mode="widthFix"></image>
				</button>
				<button formType="submit" class="header_bubble__item" v-if="typeof task_bubble[1] != 'undefined'" @click="onTaskTap(task_bubble[1])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[1].image_bubble" mode="widthFix"></image>
				</button>
				<button formType="submit" class="header_bubble__item header_bubble__item--text" v-if="typeof task_bubble[2] != 'undefined'"
				 @click="onTaskTap(task_bubble[2])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[2].image_bubble" mode="widthFix"></image>
				</button>
				<button formType="submit" class="header_bubble__item header_bubble__item--text" v-if="typeof task_bubble[3] != 'undefined'"
				 @click="onTaskTap(task_bubble[3])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[3].image_bubble" mode="widthFix"></image>
				</button>
				<button formType="submit" class="header_bubble__item header_bubble__item--text" v-if="typeof task_bubble[4] != 'undefined'"
				 @click="onTaskTap(task_bubble[4])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[4].image_bubble" mode="widthFix"></image>
				</button>
				<button formType="submit" class="header_bubble__item header_bubble__item--text" v-if="typeof task_bubble[5] != 'undefined'"
				 @click="onTaskTap(task_bubble[5])">
					<image lazy-load="ture" class="item__image" :src="task_bubble[5].image_bubble" mode="widthFix"></image>
				</button>
			</form>

			<view class="header_left" v-if="typeof kxzbIndexLeft[0] != 'undefined'" @click="adClick(kxzbIndexLeft[0])">
				<image lazy-load="ture" class="header_left__image" :src="kxzbIndexLeft[0].image" mode="widthFix"></image>
			</view>
		</view>
		<view class="">
			<form class="quick_nav" @submit="formSubmit" :report-submit="true">
				<button class="quick_nav__item clear_button" hover-class="none" formType="submit" v-for="(item,index) in navAd"
				 :key="index" @click="adClick(item)">
					<image class="item__image" :src="item.image+'_xcx50n'" mode="aspectFill"></image>
					<view class="item__text">{{item.title}}</view>
				</button>
			</form>
		</view>

		<!-- 支付宝广告插件 -->
		<view class="card aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="../../static/index/xsjf.png" mode="aspectFill"></image>
				<view class="aliad_head_r">
					<image src="../../static/index/jfbb.png" mode="aspectFill"></image>
					<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>

		<view class="card duobaodao" v-if="kxzb_examine != 1">
			<view class="duobaodao__hd">
				<view class="duobaodao__hd__left">
					<view class="duobaodao__hd__left__title">
						夺宝岛
					</view>
					<view class="duobaodao__hd__left__subtitle">
						100金币夺宝
					</view>
				</view>
				<view class="duobaodao__hd__right">
					<view class="duobaodao__hd__right__users">
						<image lazy-load="ture" class="duobaodao__hd__right__users__item" :src="item.user_avatar" mode="aspectFill" v-for="(item,index) in users"
						 :key="index"></image>
					</view>
					<view class="duobaodao__hd__right__number">
						{{count}}
					</view>
					<view class="duobaodao__hd__right__text">
						人正在夺宝
					</view>
				</view>
			</view>

			<view class="duobaodao__bd">
				<view class="duobaodao__bd__list" @touchstart="this.lock = true" @touchend="this.lock = false">
					<view class="duobaodao__bd__list__item" v-for="(item,index) in capture_list" :key="item" @click="goCaptureDetail(item.id)">
						<view class="item__image">
							<image lazy-load="ture" class="item__image__pic" :src="item.goods_pic+'_xcx200'" mode="aspectFill"></image>
							<view class="item__image__info" v-if="kxzb_examine != 1">{{item.countdown|totime}}</view>
						</view>
						<view class="item_gold">
							<image lazy-load="ture" class="item_gold__image" src="/static/index/gold.png" mode="aspectFill"></image>
							<view class="item_gold__number">{{item.gold_bets}}</view>
						</view>
						<view class="item_button">
							<text>参与夺宝</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="red-tab">
			<red-tab ref="redTab"></red-tab>
		</view>

		<view class="card task">
			<view class="task__hd">
				<view class="task__hd__left">
					<image lazy-load="ture" class="task__hd__left__title" src="/static/index/wzjb.png" mode="widthFix"></image>
					<view class="task__hd__left__record">
						<swiper :autoplay="true" :interval="2000" :duration="300" :circular="true" :vertical="true">
							<swiper-item v-for="(text, index) in randUser" :key="index" :item-id="index">{{text}}</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="task__hd__right" @click="jumpMoreTask">
					<view class="task__hd__right__more">查看更多</view>
					<image lazy-load="ture" class="task__hd__right__image" src="/static/index/more.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="task__bd">
				<task-list ref="task" tag="index" :size="10" :isFilter="true" :inviteId="invite_id" @share="onShowSharePanelTap"></task-list>
			</view>
		</view>

		<view class="card invite" v-if="bottomAd.length >0">
			<image lazy-load="ture" v-for="(item,index) in bottomAd" :key="index" @click="adClick(item)" :src="item.image" mode="widthFix"></image>
		</view>

		<view class="openlifes" :class="isOpenListShow ? '' : 'openlifes--hide'">
			<image lazy-load="ture" class="openlifes__hd" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close2.png"
			 mode="aspectFill" @click="openListShow"></image>
			<view class="openlifes__bd">
				关注天天夺宝生活号,夺宝不遗漏,更便捷!
			</view>
			<button class="openlifes__ft" type="default" open-type="lifestyle" publicId="2021001171668332">立即关注</button>
		</view>

		<view class="display_none">
			<life-follow v-if="show" sceneId="d29409bda9c942d999f2bcab484043e5" :checkFollow="true" @checkFollow.native="checkFollowCb" />
		</view>

		<view class="rectangle" v-if="showTips" @click="tipsClick" :style="'top:'+NAV_HEIGHT">
			<view class="shape"></view>
			<view class="box">
				<image lazy-load="ture" class="img" src="../../static/logo.png"></image>
				<text class="content">把“天天夺宝”添加到首页,以后使用更方便</text>
			</view>
		</view>
		<uni-popup ref="popup" type="center" :maskClick="false">
			<view class="firstlogin" v-if="firstTaskData">
				<image lazy-load="ture" class="headerimg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/firstlogin.png"></image>
				<view class="content">
					<text class="title">恭喜获得金币</text>
					<view class="box">
						<image lazy-load="ture" class="icon" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/gold.png"></image>
						<text class="integral">+{{firstTaskData.integral}}</text>
					</view>
					<view class="btn" @click="firstTask">立即领取</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="guide" type="top" :maskClick="false">
			<view class="guide" @click="this.$refs.guide.close()">
				<image class="guide_bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/index/guide_bg.png?" mode="widthFix"></image>
				<image class="guide_bt" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/index/know.png?" mode="widthFix"></image>
			</view>
		</uni-popup>

		<!-- 广告弹窗 -->
		<view class="indexfloatad" v-if="indexFloatAd.length>0" @click="adClick(indexFloatAd[0])">
			<image lazy-load="ture" :src="indexFloatAd[0].image+'_xcx200n'" mode="widthFix"></image>
		</view>

		<uni-popup class="butieBox" ref="butie" type="center" :maskClick='false'>
			<view class="butie">
				<image @click="adClick(indexPopup[0],true)" class="butie_bt" lazy-load="ture" :src="indexPopup[0].image" mode="widthFix"></image>
				<image class="close" @click="closeBtn" src="/static/icon/close.png" mode="widthFix"></image>
			</view>
		</uni-popup>

		<!-- 任务弹窗 -->
		<!-- <uni-popup class="butieBox" ref="butie" type="center" :maskClick='false'>
			<view class="butie">
				<image @click="onTaskTap(indexPopup)" class="butie_bt" lazy-load="ture" :src="indexPopup.image" mode="widthFix"></image>
				<image class="close" @click="closeBtn" src="/static/icon/close.png" mode="widthFix"></image>
			</view>
		</uni-popup> -->

		<!-- <view class="indexfloatad" v-if="indexFloatTask!=null && indexFloatTask.id == 417 && setUpLoad == 1" @click="onTaskTap(indexFloatTask)">
			<image lazy-load="ture" :src="indexFloatTask.image+'_xcx200n'" mode="widthFix"></image>
		</view> -->



		<view class='bcgroup' v-if="showbcGroup">
			<bcGroup v-if="showbcGroup" :params="params" @succ="succ" @error="error" />
		</view>

		<view class="devBox" v-if="isdev">
			<button @click="devBox('share')">分享有礼</button>
			<button @click="devBox('eleven')">落地页</button>
			<button @click="devBox('xcxlist')">赚更多</button>
			<button @click="devBox('clearCache')">清除缓存</button>
		</view>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	import utils from '@/utils/utils.js'
	import cache from '@/utils/cache.js'
	import taskList from '@/components/task-list/task-list.vue'
	import redTab from '@/components/red-tab.vue'

	let countdown
	let atten
	let inviteId = ''

	export default {
		components: {
			taskList,
			redTab
		},
		beforeCreate() {},
		data() {
			return {
				invite_id: '', //邀请人
				show: true,
				showTips: false,
				title: 'Hello',
				NAV_HEIGHT: "0px",
				navAd: [],
				floatAd: [],
				indexAd: [],
				bottomAd: [],
				indexFloatAd: [],
				indexPopup: [],
				kxzbIndexLeft: [],

				capture_list: [],

				users: [],
				count: 0,
				indexPopo: [],

				checkFollow: true,

				isOpenListShow: false,

				randUser: [
					"贵*昂赚了100金币",
					"列*纬赚了100金币",
					"隆*晴赚了100金币",
					"相*盈赚了100金币",
					"洁*清赚了100金币",
					"鹏*峰赚了100金币",
					"冬*胜赚了100金币",
					"椒*恺赚了100金币",
					"联*霁赚了100金币",
					"星*智赚了100金币",
					"枫*峥赚了100金币"
				],

				lock: false,

				params: {
					businessId: '2021001167652345',
					businessType: '7',
					groupImg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/e393470786b0278477d9c47ab91d7d51.png',
					notice: '本群为天天夺宝粉丝福利群，群内每天不定时现金红包雨，通知天天夺宝最新福利活动！！！',
				},
				showbcGroup: false,

				// 阿里广告
				adUnitId: 'ad_tiny_2021001167652345_202009182200003947',
				aliAdTaskId: 217,
				isShowAliAd: 0,
			}
		},
		onLoad(option) {
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.NAV_HEIGHT = res.statusBarHeight + res.titleBarHeight + "px"
				}
			})
			// 保存邀请人ID
			if (typeof option.invite_id == "string") {
				inviteId = option.invite_id;
				console.info(this.invite_id)
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
			}
			if (this.isLogin) {
				setTimeout(() => {
					this.init()
				})

			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
			this.attention();
			setTimeout(() => {
				this.showTips = true;
				setTimeout(() => {
					this.showTips = false;
				}, 4000)
			}, 2000)
			if (this.firstTaskData !== null && this.firstTaskData.isComplete == false) {
				this.$refs.popup.open();
			}
			let ee = this.$scope.__e
			this.$scope.__e = (e, b) => {
				if (!e || typeof(e.type) == 'undefined') {
					if (e.success == false) {
						this.showbcGroup = false
					} else {
						this.showbcGroup = false
					}
				} else {
					ee.call(this.$scope, e)
				}
			}
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		mounted() {
			this.invite_id = inviteId;
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		methods: {
			devBox(type) {
				if (type == 'share') {
					uni.navigateTo({
						url: '/pages/invite/share'
					})
				} else if (type == 'eleven') {
					uni.navigateTo({
						url: '/pages/activity/eleven?id=228'
					})
				} else if (type == 'xcxlist') {
					uni.navigateTo({
						url: '/pages/activity/xcxlist'
					})
				} else if (type == 'clearCache') {
					uni.clearStorage();
					uni.showToast({
						title: '清除成功'
					})
				}
			},
			closeBtn() {
				this.$refs.butie.close()
			},
			ckurl(type) {
				my.ap.navigateToAlipayPage({
					path: encodeURIComponent(
						'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
						encodeURIComponent('https://mobile.yhshapp.com/card/card?type=' + type))
				});
			},
			init() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				}).catch((error) => {})

				this.getAd()
				this.getCapture()
				this.getCaptureUser()
			},
			// 邀请好友
			onShowSharePanelTap() {
				my.showSharePanel();
			},
			firstTask() {
				if (this.firstTaskData && !this.firstTaskData.isComplete) {
					utils.taskLog('newuserBubble', this.firstTaskData)
					ajax.get({
						url: 'Task/complete',
						data: {
							task_id: this.firstTaskData.id
						},
						login: true,
					}).then((res) => {
						if (res.data.code == 200 && res.data.data == 1) {
							this.firstTaskData.isComplete = true;
							utils.editTask(this.firstTaskData);
							utils.upUserInfo();
							if (typeof(this.$refs.popup) !== 'undefined') {
								this.$refs.popup.close();
							}
						}
					}).catch((error) => {})
				}
			},
			tipsClick() {
				this.showTips = false;
			},
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task, 'kxzbBubble');
				}

				if (typeof(this.$refs.butie) !== 'undefined') {
					this.$refs.butie.close();
				}

			},
			onSubmit(e) {
				if (this.$refs.task && this.$refs.task.onSubmit) {
					this.$refs.task.onSubmit(e);
				}
			},
			login() {
				ajax.login(() => {
					this.init()
				})
			},
			jumpMoreTask() {
				uni.navigateTo({
					url: '/pages/my/task'
				})
			},
			getAd() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: '6,7,12,14,29,42'
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						let adList = [];
						this.navAd = res.data.data[6];
						adList = adList.concat(this.navAd);
						this.floatAd = res.data.data[7];
						adList = adList.concat(this.floatAd);
						this.bottomAd = res.data.data[14];
						adList = adList.concat(this.bottomAd);
						this.kxzbIndexLeft = res.data.data[29];
						if (this.kxzbIndexLeft.length > 0) {
							adList.push(this.kxzbIndexLeft[0])
						}
						this.indexFloatAd = res.data.data[12];
						adList = adList.concat(this.indexFloatAd);
						this.indexPopup = res.data.data[42];
						if (this.indexPopup.length > 0) {
							adList.push(this.indexPopup[0])
						}
						adList.forEach(item => {
							utils.addAdShowLog(item)
						})

					}
					if (!cache.get('isPopup') || cache.get('isPopup') != new Date().getDate()) {
						if (this.indexPopup.length > 0) {
							this.$refs.butie.open()
						}
					}

				}).catch((error) => {

				})
			},
			// 跳转页面
			onPage(url) {
				uni.navigateTo({
					url: '/pages/' + url
				})
			},
			// 点击广告
			adClick(ad, closePopup = false) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				if (this.invite_id) {
					ajax.post({
						url: 'ad/invite',
						data: {
							ad_id: ad.id,
							invite_id: this.invite_id
						}
					})
				}
				utils.adJump(ad, this);
				if (typeof(this.$refs.butie) !== 'undefined' && typeof(this.$refs.butie.close) == 'function' && closePopup) {
					this.$refs.butie.close();
					cache.set('isPopup', new Date().getDate())
				}
			},
			adClickLog(ad) {
				utils.addAdShowLog(ad);
			},
			getCaptureUser() {
				ajax.get({
					url: 'Capture/getCaptureUser',
				}).then((res) => {
					if (res.data.code == 200) {
						this.users = res.data.data.user
						this.count = res.data.data.count
					}
				}).catch((error) => {})
			},
			getCapture() {
				ajax.get({
					url: 'Capture/randList',
					data: {
						count: 5
					}
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item) => (
							item.start_time = utils.dateFtt('hh:mm:ss', item.lottery_time * 1000)
						))
						this.capture_list = res.data.data.list
						countdown = setInterval(() => {
							if (this.lock) return
							this.capture_list.forEach((e) => {
								if (new Date(e.lottery_time * 1000) - new Date() > 0) {
									e.countdown = parseInt((new Date(e.lottery_time * 1000) - new Date()) / 1000)
								} else {
									e.countdown = 0
								}
							})
						}, 1000)
					}
				}).catch((error) => {})
			},
			goCaptureDetail(id) {
				uni.navigateTo({
					url: '/pages/duobao/index'
				});
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},
			attention() {
				atten = setInterval(() => {
					this.show = !this.show
				}, 1000)
			},
			checkFollowCb(e) {
				const {
					followed,
					closeCount
				} = e.detail

				if (!followed) {
					this.isOpenListShow = true
				} else {
					clearInterval(atten)
					this.isOpenListShow = false
				}
			},
			openListShow() {
				clearInterval(atten)
				this.isOpenListShow = false
			},
			formSubmit(e) {
				ajax.post({
					url: 'Base/collectFormId',
					data: {
						formId: e.detail.formId
					},
				})
			},
			// 阿里广告 - 点击
			onAliTaskTap() {
				this.isShowAliAd === 1 && this.task_ali && this.onTaskTap(this.task_ali)
			},
			// 阿里广告 - 调用成功回调
			onRenderSuccess(e) {
				if (e.detail.height == 0) {
					this.adUnitId = ''
				}
			},
			// 阿里广告 - 调用失败回调
			onRenderFail(e) {
				this.adUnitId = ''
			},
		},
		computed: {
			kxzb_examine() {
				return this.$store.state.setUp.kxzb_examine;
			},
			setUpLoad() {
				return this.$store.state.setUp.isLoad;
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			// indexPopup() {
			// 	return null;
			// 	let tmp = typeof(this.$store.state.taskList.indexPopup) == 'undefined' ? [] : this.$store.state.taskList.indexPopup;
			// 	if (tmp.length > 0) {
			// 		if (!tmp[0].isComplete) {
			// 			//任务展示量统计
			// 			utils.taskShowLog('indexPopup', [tmp[0]]);
			// 			if (!cache.get('isPopup') || cache.get('isPopup') != new Date().getDate()) {
			// 				let interval = setInterval(() => {
			// 					if (typeof(this.$refs.butie) != 'undefined' && typeof(this.$refs.butie.open) == 'function' && this.setUpLoad ==
			// 						1) {
			// 						this.$refs.butie.open()
			// 						clearInterval(interval);
			// 						cache.set('isPopup', new Date().getDate())
			// 					}
			// 				}, 10)
			// 			}
			// 			return tmp[0];
			// 		} else {
			// 			return null;
			// 		}
			// 	}
			// 	return null;
			// },
			indexFloatTask() {
				let tmp = typeof(this.$store.state.taskList.indexFloatAd) == 'undefined' ? [] : this.$store.state.taskList.indexFloatAd;
				if (tmp.length > 0) {
					if (!tmp[0].isComplete) {
						//任务展示量统计
						utils.taskShowLog('indexFloatTask', [tmp[0]]);
						return tmp[0];
					} else {
						return null;
					}
				}
				return null;
			},
			popupBubble() {
				let tmp = typeof(this.$store.state.taskList.popupBubble) == 'undefined' ? [] : this.$store.state.taskList.popupBubble;
				if (tmp.length > 0) {
					if (!tmp[0].isComplete) {
						//任务展示量统计
						utils.taskShowLog('popupBubble', [tmp[0]]);
						return tmp[0];
					} else {
						return null;
					}
				}
				return null;
			},
			firstTaskData() {
				let tmp = typeof(this.$store.state.taskList.newuserBubble) == 'undefined' ? [] : this.$store.state.taskList.newuserBubble;
				if (tmp.length > 0) {
					if (!tmp[0].isComplete) {
						//任务展示量统计
						utils.taskShowLog('newuserBubble', [tmp[0]]);
					}
					return tmp[0];
				}
				return null;
			},
			task_bubble() {
				let tmp = typeof(this.$store.state.taskList.kxzbBubble) == 'undefined' ? [] : this.$store.state.taskList.kxzbBubble;
				let ret = [];
				for (let item of tmp) {
					if (!item.isComplete) {
						ret.push(item)
					}
				}
				//任务展示量统计
				utils.taskShowLog('kxzbBubble', ret.slice(0, 5));
				return ret;
			},
			task_ali() {
				let tmp = typeof(this.$store.state.taskList.aliad) == 'undefined' ? [] : this.$store.state.taskList.aliad;
				let ret = [];
				for (let item of tmp) {
					if (item.id == this.aliAdTaskId) {
						return item
					}
				}
			},
			showali() {
				if ((this.isShowAliAd === 1) && this.task_ali && (this.task_ali.isComplete == false)) {
					// 一年一次的弹窗
					if (!cache.get('guide')) {
						this.$refs.guide.open()
						cache.set('guide', 1, 378432000)
					}
					return true
				} else {
					return false
				}
			}
		},
		watch: {
			firstTaskData(val) {
				if (val !== null && val.isComplete == false && typeof(this.$refs.popup) !== 'undefined') {
					this.$refs.popup.open();
				}
			}
		},
		filters: {
			totime(modulo) {
				if (modulo < 1) return "已结束"
				let hours = Math.floor(modulo / (60 * 60));
				modulo = modulo % (60 * 60);
				let minutes = Math.floor(modulo / 60);
				let seconds = modulo % 60;

				hours = hours < 10 ? '0' + hours : hours;
				minutes = minutes < 10 ? '0' + minutes : minutes;
				seconds = seconds < 10 ? '0' + seconds : seconds;

				return hours + ":" + minutes + ":" + seconds + "后截止"
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.guide {
		.guide_bg {
			width: 100%;
			margin-top: 600rpx;
		}

		.guide_bt {
			width: 184rpx;
			height: 69rpx;
			margin: 62rpx auto;
			display: block;
		}
	}

	.butie {
		position: relative;

		.butie_bt {
			width: 500rpx;
		}

		.close {
			position: absolute;
			width: 60rpx;
			left: 50%;
			bottom: -20rpx;
			overflow: auto;
			transform: translateX(-50%);
		}
	}

	.header_left {
		position: absolute;
		left: 20rpx;
		bottom: 20rpx;
		width: 120rpx;

		&__image {
			width: 120rpx;
		}
	}

	.red-tab {
		margin: 20rpx 20rpx;
		background-color: #FFF;
		border-radius: 14rpx;
	}

	.display_none {
		position: absolute;
		top: -999999rpx;
		left: -999999rpx;
	}

	.follow {
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin: 20rpx 20rpx;
		height: 90rpx;
		line-height: 90rpx;
		background-color: #FFF;
		border-radius: 14rpx;
		padding: 0 14rpx;
		position: relative;

		&__l {
			display: flex;
			justify-content: space-between;
			align-items: center;

			&__hd {
				width: 32rpx;
				height: 38rpx;
			}

			&__bd {
				width: 400rpx;
				font-size: 27rpx;
				margin-left: 10rpx;
				color: #111111;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		&__ft {
			margin-right: 27rpx;
		}

		&__red {
			position: absolute;
			right: 20rpx;
			top: 0;
			width: 41rpx;
			height: 44rpx;
		}
	}

	.follow--hide {
		display: none;
	}

	.devBox {
		position: fixed;
		bottom: 20rpx;
		left: 20rpx;
		background-color: #00BFFF;

		button {
			width: 160rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 22rpx;
		}

		button:nth-child(odd) {
			background-color: #f0ad4e;
		}

		button:nth-child(even) {
			background-color: #007aff;
		}
	}


	.indexfloatad {
		position: fixed;
		right: 0;
		bottom: 200rpx;
		z-index: 1;

		image {
			width: 126rpx;
			height: 130rpx;
		}
	}

	.openlifes {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5rpx 20rpx;
		height: 60rpx;
		background-color: rgba($color: #000000, $alpha: 0.4);
		position: fixed;
		bottom: 0;
		width: 710rpx;

		&__hd {
			width: 31rpx;
			height: 31rpx;
		}

		&__bd {
			font-size: 25rpx;
			color: #ffffff;
		}

		&__ft {
			border: none;
			padding: 18rpx 25rpx;
			height: 55rpx;
			line-height: 20rpx;
			background-image: linear-gradient(90deg, #fe9349 0%, #fe5332 100%),
				linear-gradient(90deg, #ffc02a 0%, #ff9102 100%),
				linear-gradient(#ff5add, #ff5add);
			background-blend-mode: normal, normal, normal;
			border-radius: 60rpx;

			font-size: 24rpx;
			color: #ffffff;

			text-align: center;
		}
	}

	.openlifes--hide {
		bottom: -100rpx;
	}

	.header {
		height: calc(700rpx - 48px - var(--status-bar-height));
		padding-top: calc(48px + var(--status-bar-height));
		background-image: url(/static/index/header_bg.webp);
		background-size: 100%;

		position: relative;

		.header_nologin_textarea {
			margin-top: 78rpx;
			text-align: center;
			color: #333333;
			font-size: 28rpx;
		}

		.header_nologin__button {
			width: 290rpx;
			height: 72rpx;
			background-image: linear-gradient(90deg,
				#fe9349 0%,
				#fe5332 100%),
				linear-gradient(#01b873,
				#01b873);
			background-blend-mode: normal,
				normal;
			border-radius: 36rpx;

			margin: 22rpx auto 230rpx;

			font-size: 30rpx;
			color: #ffffff;

			line-height: 72rpx;
			text-align: center;
		}

		.header_gold {
			margin-top: 28rpx;
			text-align: center;
			color: #111111;

			&__number {
				width: 184rpx;
				height: 49rpx;
				font-size: 66rpx;
				font-weight: bold;
				line-height: 1;
				letter-spacing: -1rpx;
			}

			&__info {
				font-size: 24rpx;
				line-height: 1;
				letter-spacing: 0rpx;
			}
		}

		.header_progress {
			display: flex;
			justify-content: center;
			margin-top: 32rpx;

			font-size: 24rpx;
			line-height: 1;
			color: #111111;
			text-align: center;

			&__min {
				width: 70rpx;
			}

			&__max {
				width: 70rpx;
			}

			&__bar {
				width: 206rpx;
				height: 20rpx;
				background-color: #ffd7bc;
				border-radius: 10rpx;
				overflow: hidden;
			}

			&__percent {
				height: 20rpx;
				background-image: linear-gradient(90deg,
					#fe9349 0%,
					#fe5332 100%),
					linear-gradient(#f2a449,
					#f2a449);
				background-blend-mode: normal,
					normal;
				border-radius: 10rpx;
			}
		}

		.header_panda_speak {
			margin: 25rpx auto;
			width: 265rpx;
			height: 24rpx;
			font-size: 25rpx;
			line-height: 1;
			color: #fe5e10;

			padding: 10rpx 12rpx 18rpx;

			background-image: url(/static/index/panda_speak.png);
			background-size: 100%;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.header_extra_bonus {
			margin-top: 224rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			&__img {
				width: 199rpx;
				height: 65rpx;
				margin-right: 10rpx;
				animation: dong 1s infinite;
			}

			&__tip {
				width: 178rpx;
				height: 65rpx;
				background-image: url(/static/index/tip.png);
				background-size: 100%;
				display: flex;
				align-items: center;
				margin-right: 8rpx;

				position: absolute;
				right: 300rpx;

				animation: ghostUpleft 2s infinite;

				&__img {
					width: 41rpx;
					height: 32rpx;
					margin: 0 3rpx 0 8rpx;
				}

				&__info {
					&__title {
						align-items: center;
						display: flex;
						justify-content: center;
						font-size: 20rpx;
						font-weight: bold;
						line-height: 1;
						color: #a86012;

						image {
							margin-left: 4rpx;
							width: 29rpx;
							height: 19rpx;
						}
					}

					&__subtitle {
						margin-top: 7rpx;
						font-size: 16rpx;
						line-height: 1;
						color: #a86012;
					}
				}
			}

			&__list {
				border-radius: 47rpx 0rpx 0rpx 47rpx;
				background-color: rgba($color: #000000, $alpha: 0.45);

				display: flex;
				padding: 11rpx 0 11rpx 30rpx;

				&__item {
					width: 70rpx;
					text-align: center;
					margin: 0 10rpx;

					.item__image {
						width: 50rpx;
						height: 50rpx;
					}

					.item__text {
						font-size: 16rpx;
						line-height: 1;
						color: #ffffff;
					}
				}
			}
		}

		.header_bubble {
			position: absolute;
			width: 100vw;
			height: 470rpx;
			top: 100rpx;
			overflow: hidden;

			&__item {
				position: absolute;
				text-align: center;
				width: 148rpx;
				animation: ghostUpdown 2s infinite;
				border: none;
				background-color: rgba($color: #000000, $alpha: 0);
				height: auto;

				.item__image {
					width: 148rpx;
				}
			}

			&__item:nth-child(1) {
				top: 36rpx;
				left: 44rpx;
			}

			&__item:nth-child(2) {
				top: 43rpx;
				right: 30rpx;
			}

			&__item:nth-child(3) {
				top: 195rpx;
				left: 62rpx;
			}

			&__item:nth-child(4) {
				top: 186rpx;
				right: 60rpx;
			}

			&__item:nth-child(5) {
				top: 311rpx;
				left: 164rpx;
			}

			&__item:nth-child(6) {
				top: 319rpx;
				right: 134rpx;
			}

			&__item--text {
				width: 140rpx;

				.item__image {
					width: 110rpx;
				}

				.item_text {
					font-size: 24rpx;
					color: #333333;

					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	.quick_nav {
		height: 103rpx;
		background-color: #FFFFFF;
		padding: 28rpx 0;
		margin-bottom: 18rpx;
		display: flex;
		justify-content: space-around;

		&__item {
			width: 110rpx;
			text-align: center;

			.item__image {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 7rpx;
			}

			.item__text {
				font-size: 26rpx;
				letter-spacing: 0rpx;
				line-height: 1;
				color: #555555;
			}
		}
	}

	// 夺宝岛卡片
	.duobaodao {
		&__hd {
			padding: 17rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&__left {
				display: flex;
				align-items: center;

				&__title {
					font-size: 32rpx;
					font-weight: 500;
					color: #111111;
					margin: 0 8rpx 0 26rpx;
				}

				&__subtitle {
					background-color: #fff1eb;
					border-radius: 20rpx 20rpx 20rpx 0rpx;
					border: solid 1rpx #ff6f50;
					padding: 6rpx 9rpx;

					font-size: 20rpx;
					color: #fe5733;
				}
			}

			&__right {
				background-color: #f5f5f5;
				border-radius: 25rpx 0rpx 0rpx 25rpx;
				padding: 8rpx 13rpx 8rpx 11rpx;
				display: flex;
				align-items: center;
				font-size: 22rpx;

				&__users {
					margin-right: 13rpx;

					&__item {
						width: 34rpx;
						height: 34rpx;
						margin-right: -13rpx;
						background-color: #ff7777;
						border: solid 2rpx #ffffff;
						border-radius: 50%;
					}
				}

				&__number {
					color: #ff4e00;
				}

				&__text {
					color: #010101;
				}
			}
		}

		&__bd {
			padding: 8rpx 27rpx 13rpx;

			&__list {
				overflow-x: scroll;
				white-space: nowrap;
				-webkit-overflow-scrolling: touch;
				display: flex;

				align-items: flex;
				justify-content: flex-start;

				&__item {
					flex-shrink: 0;
					flex-grow: 0;
					width: 166rpx;
					margin-right: 24rpx;

					.item__image {
						width: 166rpx;
						height: 166rpx;
						position: relative;
						margin-bottom: 13rpx;

						&__pic {
							width: 166rpx;
							height: 166rpx;
							border-radius: 10rpx;
						}

						&__info {
							width: 100%;
							background-image: linear-gradient(90deg, #fe9349 0%, #fe5332 100%), linear-gradient(#ffffff, #ffffff);
							background-blend-mode: normal, normal;

							font-size: 18rpx;
							line-height: 1;
							color: #ffffff;

							padding: 6rpx 0;
							text-align: center;

							position: absolute;
							bottom: 0;
							border-radius: 0 0 10rpx 10rpx;
						}
					}

					.item_gold {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 15rpx;

						&__image {
							width: 30rpx;
							height: 23rpx;
							margin-right: 5rpx;
						}

						&__number {
							font-size: 28rpx;
							font-weight: bold;
							color: #ff7800;
						}
					}

					.item_button {
						width: 140rpx;
						height: 42rpx;
						background-image: linear-gradient(90deg,
							#fe9349 0%,
							#fe5332 100%),
							linear-gradient(#df8d37,
							#df8d37);
						background-blend-mode: normal,
							normal;
						border-radius: 20rpx;

						font-size: 23rpx;
						letter-spacing: 1rpx;
						text-align: center;
						line-height: 23rpx;
						color: #ffffff;
						margin: 0 auto 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;

					}
				}

				&__item:last-child {
					margin-right: 0;
				}
			}
		}
	}

	// 活动
	.activity {
		width: 694rpx;
		margin: 0 auto 18rpx;
		display: flex;
		justify-content: space-between;

		&__item {
			width: 230rpx;
			height: 326rpx;

			image {
				width: 230rpx;
				height: 326rpx;
			}
		}
	}

	// 生活号
	.openlife {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 21rpx 0;

		&__left {
			display: flex;
			align-items: center;
			margin-left: 16rpx;

			&__logo {
				width: 60rpx;
				height: 60rpx;
				margin-right: 9rpx;
			}

			&__title {
				font-size: 30rpx;
				color: #111111;
				font-weight: 400;
			}
		}

		&__right {
			margin-right: 23rpx;

			&__button {
				background-image: linear-gradient(90deg, #fe9349 0%, #fe5332 100%), linear-gradient(#fe9e5b, #fe9e5b);
				background-blend-mode: normal, normal;
				border-radius: 23rpx;

				font-size: 26rpx;
				line-height: 46rpx;
				letter-spacing: -1rpx;
				color: #ffffff;
				padding: 0 23rpx;
			}
		}
	}

	// 任务
	.task {
		&__hd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 20rpx;
			background-image: url(/static/index/task-header.png);
			background-size: 100%;

			&__left {
				display: flex;
				align-items: center;
				justify-content: center;

				&__title {
					// font-size: 32rpx;
					// font-weight: 500;
					// color: #111111;
					width: 137rpx;
				}

				&__record {
					width: 183rpx;
					height: 24rpx;
					padding: 16rpx 48rpx 7rpx 50rpx;
					background-image: url(/static/index/task_more.png);
					background-size: 100%;
					font-size: 22rpx;

					swiper {
						height: 24rpx;

						swiper-item {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
				}
			}

			&__right {
				display: flex;
				align-items: center;

				&__more {
					font-size: 26rpx;
					color: #999999;
					margin-right: 8rpx;
				}

				&__image {
					width: 10rpx;
					height: 19rpx;
				}
			}
		}

		&__bd {
			background-color: rgb(255, 248, 224);
		}
	}

	// 任务列表
	.task-list {
		&__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32rpx 0;
			margin: 0 17rpx;
			border-bottom: 2rpx #f5f5f5 solid;

			.item__left {
				width: 460rpx;
				display: flex;
				align-items: center;

				.item__image {
					width: 96rpx;
					height: 96rpx;
					margin: 0 18rpx 0 10rpx;
				}

				.item__info {
					width: 335rpx;

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

						&__subtitle {}

						&__subtitle--gold {
							display: flex;
							align-items: center;

							image {
								width: 35rpx;
								height: 27rpx;
								margin-right: 5rpx;
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
					}

					&__bd {
						font-size: 26rpx;
						color: #808080;
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
				.item__button {
					width: 183rpx;
					height: 66rpx;
					background-image: linear-gradient(90deg,
						#fe9349 0%,
						#fe5332 100%),
						linear-gradient(#df8d37,
						#df8d37);
					background-blend-mode: normal,
						normal;
					border-radius: 33rpx;

					font-size: 30rpx;
					font-weight: bold;
					line-height: 66rpx;
					color: #ffffff;
					text-align: center;
				}
			}
		}
	}

	.invite {
		background-color: rgba(255, 255, 255, 0);

		image {
			width: 100%;
			display: block;
			margin-bottom: 16rpx;
		}
	}

	// 动画
	@keyframes dong {
		0% {
			transform: translate(0px, 0px);
		}

		50% {
			transform: translate(-10px, 0px);
		}

		100% {
			transform: translate(0px, 0px);
		}
	}

	@keyframes ghostUpdown {
		0% {
			margin-top: 0;
		}

		50% {
			margin-top: 10px;
		}
	}

	@keyframes ghostUpleft {
		0% {
			margin-top: 0;
		}

		50% {
			right: 330rpx;
		}
	}

	.rectangle {
		position: fixed;
		right: 20rpx;
		z-index: 1000;
		width: 400rpx;

		.shape {
			width: 0rpx;
			height: 0px;
			position: relative;
			right: -280rpx;
			border-left: 10rpx solid transparent;
			border-right: 10rpx solid transparent;
			border-bottom: 8rpx rgba($color: #000000, $alpha: 0.75) solid;
		}

		.box {
			display: flex;
			align-items: center;
			background-color: rgba($color: #000000, $alpha: 0.75);
			padding: 15rpx;

			.img {
				width: 60rpx;
				height: 60rpx;
				margin-right: 10rpx;
			}

			.content {
				flex: 1;
				font-size: 25rpx;
				color: white
			}
		}

	}

	.firstlogin {
		display: flex;
		flex-direction: column;
		width: 530rpx;
		height: 570rpx;
		border-radius: 30rpx;
		overflow: hidden;

		.headerimg {
			width: 530rpx;
			height: 182rpx;
			display: block;
		}

		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			background-color: #fff;

			.box {
				display: flex;
				align-items: center;

				.integral {
					color: #ff7608;
					font-size: 66rpx;
				}

				.icon {
					width: 79rpx;
					height: 62rpx;
				}
			}

			.title {
				font-size: 36rpx;
			}

			.btn {
				padding: 15rpx 60rpx;
				background-image: linear-gradient(90deg,
					#fe9349 0%,
					#fe5332 100%),
					linear-gradient(#df8d37,
					#df8d37);
				background-blend-mode: normal,
					normal;
				border-radius: 50rpx;

				text-align: center;
				font-size: 40rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
			}
		}
	}

	.duobaodao__bd__list::-webkit-scrollbar {
		display: none;
	}

	.ad {
		// height: 95px;
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		background-color: #FFFFFF;

		ad {
			border-radius: 20rpx;
		}
	}

	.aliad {
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
