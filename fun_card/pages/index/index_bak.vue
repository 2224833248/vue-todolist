<template>
	<view class="tbody">

		<!-- 用户余额 -->
		<button class="user" :style="{top:NAV_HEIGHT}" open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError"
		 scope='userInfo'>
			<view class="user-icon">
				<image :src="user.headimg" mode="aspectFill"></image>
			</view>
			<view class="user-text">
				<view class="user-text-id">账号余额</view>
				<view class="user-text-price">{{user.funcard_money}}元</view>
			</view>
		</button>

		<view class="yundon" v-show="qiehuan">
			<view class="banner">
				<view class="bannerBg">
					<view class="banner-title">{{motion.subTitle}}</view>
					<view class="banner-money">{{motion.applyMoney}}</view>
					<template v-if="motion.thisApply == 0 || motion.thisApply == 2 || motion.thisApply == 5">
						<view class="banner-apply">
							<view class="applyText">已有<text>{{motion.applyNum}}</text>人报名参加</view>
						</view>
						<view class="banner-time">距开赛还有 {{timeData.motion.shi}}:{{timeData.motion.min}}:{{timeData.motion.miao}}</view>
					</template>
					<template v-if="motion.thisApply == 1 || motion.thisApply == 3">
						<!-- 已报名 -->
						<view class="banner-sign">
							<view class="sign">已报名</view>
							<view class="right">已有<text>{{motion.applyNum}}</text>人报名参加</view>
						</view>
						<view class="banner-time">距开赛还有 {{timeData.motion.shi}}:{{timeData.motion.min}}:{{timeData.motion.miao}}</view>
					</template>
					<template v-if="motion.thisApply == 4">
						<!-- 已开赛 -->
						<view class="banner-kickoff">
							<view class="kickoff">已开赛</view>
							<view class="right">{{thisStep}}/{{motion.applySelfStep}}步</view>
						</view>
						<view class="banner-time">距结束还有 {{timeData.motion.shi}}:{{timeData.motion.min}}:{{timeData.motion.miao}}</view>
					</template>
					<view class="motionImg">
						<image src="/static/index/motion.gif" mode="widthFix"></image>
					</view>
				</view>

				<!-- 泡泡 -->
				<view class="icon">
					<view class="icon-img" @click="adClick(item)" v-for="(item,index) in adList.indexBubble" :key='index'>
						<image :src="item.image" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<!-- cont -->
			<view class="cont">
				<view class="contBgs">
					<form class="cont-top" @submit="onSubmit" :report-submit="true">
						<button formType="submit" hover-class="none" class="cont-top-btn2 clear_button" @click="monSignIn">早起打卡</button>
						<button formType="submit" hover-class="none" class="cont-top-btn clear_button">运动挑战</button>
					</form>
				</view>

				<!-- 按钮报名 -->
				<view class="cont-btn" @click="applyHander">
					<template v-if="motion.thisApply == 0">
						立即报名
					</template>
					<template v-if="motion.thisApply == 1 || motion.thisApply == 3">
						邀请好友，一起跑步
					</template>
					<template v-if="motion.thisApply == 2 || motion.thisApply == 5">
						报名下一期
					</template>
					<template v-if="motion.thisApply == 4">
						提交成绩
					</template>
				</view>
				
				<view class="aliad" v-if="qiehuan && adUnitId1">
					<view class="aliad_head" v-if="showali">
						<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
						<view class="aliad_head_r">
							<image src="/static/index/jfb.png" mode="widthFix"></image>
							<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
						</view>
					</view>
					<view class="aliad_body" @click="onAliTaskTap()">
						<ad :unit-id="adUnitId1" @load="onRenderSuccess1" @error="onRenderFail1" />
					</view>
				</view>
				<adSwiper ref="adSwiper" tag="indexMotionProjector"></adSwiper>

				<view class="pointsMoney" v-if="motion.applyGetInfo.show == 1">
					<view class="pointsTitle">
						<view class="pointsData">【{{motion.applyGetInfo.title}}】</view>
						<view class="pointsGf">
							<template v-if="motion.applyGetInfo.status == 0">
								进行中
							</template>
							<template v-if="motion.applyGetInfo.status == 1">
								已瓜分
							</template>
							<template v-if="motion.applyGetInfo.status == -1">
								已瓜分
							</template>
						</view>
					</view>
					<view class="pointsCent">
						<view class="pointsNum">{{motion.applyGetInfo.successNum}}</view>
						<view class="pointsText">达标人数</view>
					</view>
					<view class="pointsLis">
						<view class="pointsTime">
							<view class="top" :class="'redMoney'+motion.applyGetInfo.status">{{motion.applyGetInfo.incomeMoney}}元</view>
							<view class="bottom">{{motion.applyGetInfo.status?'瓜分收益':'预计收益'}}</view>
						</view>
						<view class="pointsTime">
							<view class="top">{{motion.applyGetInfo.applyNum}}</view>
							<view class="bottom">参与人数</view>
						</view>
						<view class="pointsTime">
							<view class="top">{{motion.applyGetInfo.applyMoney}}元</view>
							<view class="bottom">总奖池</view>
						</view>
					</view>
					<view class="up-to-par" :class="'status'+motion.applyGetInfo.status">{{motion.applyGetInfo.tips}}</view>
				</view>

				<view class="cont-bottom">
					<view class="cont-bottom-title">
						<view class="title">三步赚钱运动奖金</view>
						<view class="rule">
							<view class="rule-text" @click="rule">规则详情</view>
							<image src="../../static/index/more.png" mode="widthFix"></image>
						</view>
					</view>
					<view class="listBox">
						<image src="../../static/index/rule.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 早起打卡 -->
		<view class="daka" v-show='!qiehuan'>
			<view class="banner">
				<view class="bannerBg">
					<view class="banner-title">{{card.subTitle}}</view>
					<view class="banner-money">{{card.applyMoney}}</view>
					<view class="banner-apply">
						<view class="applyText">已有<text>{{card.applyNum}}</text>人报名参加</view>
					</view>

					<template v-if="card.thisApply == 0 || card.thisApply == 2 || card.thisApply == 5">
						<!-- 打卡时间 -->
						<view class="banner-time" v-if="isOpen">
							<view class="time">打卡时间:06:00-9:00</view>
						</view>
					</template>
					<template v-if="card.thisApply == 1 || card.thisApply == 3">
						<!-- 距离打卡时间 -->
						<view class="applyClass" v-if="isOpen">
							<view class="applyLeft">
								<template v-if="timeData.card.shi <6">今日打卡</template>
								<template v-else>明早打卡</template>
							</view>
							<view class="time">距打卡还有{{timeData.card.shi}}:{{timeData.card.min}}:{{timeData.card.miao}}</view>
						</view>
					</template>
					<template v-if="card.thisApply == 4">
						<!-- 已开始 -->
						<view class="applyClass">
							<view class="applyLeft">已开始</view>
							<view class="time">距结束还有{{timeData.card.shi}}:{{timeData.card.min}}:{{timeData.card.miao}}</view>
						</view>
					</template>

					<!-- <view class="xion">
						<image src="../../static/index/xion.png" mode="widthFix"></image>
					</view> -->
				</view>
				<!-- 泡泡 -->
				<view class="icon">
					<view class="icon-img" @click="adClick(item)" v-for="(item,index) in adList.indexQipao" :key='index'>
						<image :src="item.image" mode="widthFix"></image>
					</view>
				</view>


			</view>
			<!-- cont -->
			<view class="cont">
				<view class="contBgs">
					<form class="cont-top" @submit="onSubmit" :report-submit="true">
						<button formType="submit" hover-class="none" class="cont-top-btn clear_button">早起打卡</button>
						<button formType="submit" hover-class="none" class="cont-top-btn2 clear_button" @click="signIn">运动挑战</button>
					</form>
				</view>

				<view class="cont-btn" @click="applyHander">
					<template v-if="card.thisApply == 0">
						立即报名
					</template>
					<template v-if="card.thisApply == 1 || card.thisApply == 3">
						邀请好友，一起早起
					</template>
					<template v-if="card.thisApply == 2 || card.thisApply == 5">
						报名下一期
					</template>
					<template v-if="card.thisApply == 4">
						立即打卡
					</template>
				</view>

				<view class="aliad" v-if="!qiehuan && adUnitId2">
					<view class="aliad_head" v-if="showali">
						<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
						<view class="aliad_head_r">
							<image src="/static/index/jfb.png" mode="widthFix"></image>
							<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
						</view>
					</view>
					<view class="aliad_body" @click="onAliTaskTap()">
						<ad :unit-id="adUnitId2" @load="onRenderSuccess2" @error="onRenderFail2" />
					</view>
				</view>
				<adSwiper ref="adSwipers" tag="indexCardProjector"></adSwiper>

				<!-- 打卡成功 -->

				<view class="" v-if="card.applyGetInfo.show == 1">
					<view class="successful" v-if="card.applyGetInfo.status == 1">
						<view class="titleBox">
							<view class="xian"></view>
							<view class="title">
								今日打卡成功
							</view>
							<view class="xian"></view>
						</view>

						<view class="dateCenter">
							<view class="when">
								<view class="title">早起时间(AM)</view>
								<view class="time">{{card.applyGetInfo.cardTime}}</view>
							</view>
							<view class="day">
								<view class="cumulative">累计早起(天)</view>
								<view class="numDay">{{card.applyGetInfo.cardNum}}</view>
							</view>
						</view>
					</view>

					<!-- 通知 -->
					<view class="notice" v-if="card.applyGetInfo.status != -1">
						<view class="noticeList">
							<view class="noticeBox">
								<view class="noticeItem">
									<image src="../../static/index/notice.png" mode="widthFix"></image>
									<view class="tips">{{card.applyGetInfo.tips}}</view>
								</view>
							</view>
						</view>
					</view>

				</view>

				<!-- 打卡失败 -->
				<view class="cardOver" v-if="card.applyGetInfo.status == -1">
					<view class="titleBox">
						<view class="xian"></view>
						<view class="title">
							今日打卡失败
						</view>
						<view class="xian"></view>
					</view>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/over.gif" mode="widthFix"></image>
					<view class="bottomTz">
						<image src="../../static/index/notice.png" mode="widthFix"></image><text>很遗憾，你已错过打卡时间06:00-09:00</text>
					</view>
				</view>

				<!-- 打卡成功失败弹窗 -->
				<uni-popup :maskClick='false' :animation='false' ref="messagePopup" type="center">
					<view class="cardPop" :class="{succeed:isStatus}">
						<template v-if="isStatus">
							<view class="CardDate">打卡时间:{{cardTime}}</view>
						</template>
						<template v-if="!isStatus">
							<view class="btns" @click="applyClick"></view>
						</template>

						<view class="close" @click="close"></view>
					</view>
				</uni-popup>



				<view class="cont-bottom">
					<view class="cont-bottom-title">
						<view class="title">三步玩转早起打卡</view>
						<view class="rule">
							<view class="rule-text" @click="rule">规则详情</view>
							<image src="../../static/index/more.png" mode="widthFix"></image>

						</view>
					</view>
					<view class="listBox">
						<image src="../../static/index/rule2.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<load v-if="loading"></load>

		<!-- 开心签到 -->
		<view class="rectangle" v-if="showTips" @click="tipsClick" :style="'top:'+NAV_HEIGHT">
			<view class="shape"></view>
			<view class="box">
				<image lazy-load="ture" class="img" src="../../static/icon/icon.png"></image>
				<text class="content">把“开心签到”添加到首页,以后使用更方便</text>
			</view>
		</view>

		<task-list ref="task" tag="index" :size="0" :isFilter="true"></task-list>		
		
		<view class="devBox" v-if="isdev">
			<button @click="devBox('share')">分享有礼</button>
			<button @click="devBox('clearCache')">清除缓存</button>
		</view>
	</view>
</template>
<script>
	import ajax from '../../utils/ajax.js'
	import cache from '../../utils/cache.js'
	import utils from '../../utils/utils.js'
	import adSwiper from '../../components/adSwiper/adSwiper.vue'
	import load from '../../components/load/load.vue'
	import taskList from '@/components/task-list/task-list.vue'

	export default {
		components: {
			adSwiper,
			load,
			taskList
		},
		data() {
			return {

				isStatus: true,
				isOpen: false,
				timeData: {
					motion: {
						interval: '',
						shi: '00',
						min: '00',
						miao: '00',
					},
					card: {
						interval: '',
						shi: '00',
						min: '00',
						miao: '00',
					}
				},
				cardTime: '',
				motion: {
					// loading: true,
					type: 'motion',
					alertCode: 0, //弹窗:0:不弹窗|1:弹签到弹窗|2:未报名|3:已报名
					applyItems: [],
					applyNum: 0, //参加人数
					applyMoney: 0, //参与金额
					thisApply: 0, // 状态:0:未报名;1:已报名;2:已打卡;3:未开赛;4::进行中;5:已结束
					applySelfMoney: 0, //报名金额
					applySelfStep: 0, //报名步数
					startTime: 0, //打卡开始时间
					endTime: 0, //打卡结束时间
					subTitle: '达标赛奖池金额(元)',
					ruleUrl: '', //规则页面地址
					applyGetInfo: {} //提交后获取金额
				},
				card: {
					// loading: true,
					type: 'card',
					alertCode: 0, //弹窗:0:不弹窗|1:弹签到弹窗|2:未报名|3:已报名
					applyItems: [],
					applyNum: 0, //参加人数
					applyMoney: 0, //参与金额
					thisApply: 0, // 状态:0:未报名;1:已报名;2:已打卡;3:未开赛;4::进行中;5:已结束
					applySelfMoney: 0, //报名金额
					applySelfStep: 0, //报名步数
					startTime: 0, //打卡开始时间
					endTime: 0, //打卡结束时间
					subTitle: '达标赛奖池金额(元)',
					ruleUrl: '', //规则页面地址
					applyGetInfo: {} //提交后获取金额
				},

				apply: '',
				points: false,
				applys: true, //默认
				kickoff: false, //已开赛
				sign: false, //已报名

				qiehuan: false, //首页切换
				monerys: false, //打卡切换
				type: 'card',
				thisStep: 0, //当前步数
				getRunDataLock: false,

				points: true,
				isApply: true, //默认打卡时间
				isMorning: false, //明早打卡
				isBegin: false, // 已开始
				clock: true,

				STATUS_BAR_HEIGTH: 44,
				TITLE_BAR_HEIGTH: 48,
				NAV_HEIGHT: '92px',


				loading: true,
				loadingNum: 0,
				showTips: false,
				NAV_HEIGHT: "0px",

				// 阿里广告
				isShowAliAd: 0,
				adUnitId1: 'ad_tiny_2021001167643261_202009262200004061',
				adUnitId2: 'ad_tiny_2021001167643261_202009262200004061',
				aliAdTaskId: 226
			}
		},
		onLoad(option) {
			setTimeout(() => {
				this.showTips = true;
				setTimeout(() => {
					this.showTips = false;
				}, 4000)
			}, 2000)
			uni.getSystemInfo({
				success: (systemInfo) => {
					this.STATUS_BAR_HEIGTH = systemInfo.statusBarHeight
					this.TITLE_BAR_HEIGTH = systemInfo.titleBarHeight
					this.NAV_HEIGHT = systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px"
				}
			})
			// 保存邀请人ID
			if (typeof(option.invite_id) == "string") {
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
			}
		},
		onShow(option) {
			if (this.$refs.task) {
				this.$refs.task.completeTask()
			}
			if (this.isLogin) {
				this.init()
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		mounted() {
			setTimeout(() => {
				this.loading = false
			}, 3000)
		},
		methods: {
			devBox(type) {
				if (type == 'share') {
					uni.navigateTo({
						url: '/pages/my/my'
					})
				} else if (type == 'clearCache') {
					uni.clearStorage();
					uni.showToast({
						title: '清除成功'
					})
				}
			},
			applyClick() {
				uni.navigateTo({
					url: '../apply/apply?type=' + this.type
				})
			},
			close() {
				this.$refs.messagePopup.close()
			},
			onGetAuthorize(res) {
				if (this.user.nickname == 'YH_USER') {
					my.getOpenUserInfo({
						fail: (res) => {},
						success: (res) => {
							ajax.post({
								url: 'public/upInfo',
								data: {
									uid: this.user.uid,
									userInfo: res.response
								}
							}).then((res) => {
								if (res.data.code == 200) {
									ajax.login2();
									this.goMy();
								} else {
									uni.showModal({
										title: '提示',
										content: '授权失败,请重试'
									})
								}
							})
						}
					});
				} else {
					this.goMy();
				}
			},
			onAuthError(res) {
				uni.showModal({
					title: '提示',
					content: '取消授权,可能会使部分服务无法使用，或者页面信息不完整'
				})
			},
			goMy() {
				uni.switchTab({
					url: '/pages/my/my'
				})
			},

			// 添加到首页
			tipsClick() {
				this.showTips = false;
			},
			adClick(ad) {
				if (ad.path == "/pages/apply/apply") {
					ad.extra_data = 'type=' + this.type
				}
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad);
			},
			//早起打卡点击
			monSignIn() {
				this.adUnitId1 = 'ad_tiny_2021001167643261_202009262200004061'
				this.adUnitId2 = 'ad_tiny_2021001167643261_202009262200004061'
				this.qiehuan = !this.qiehuan //首页切换
				if (this.qiehuan == true) {
					this.type = 'motion'
					if (this.motion.applyItems.length == 0) {
						this.getInfo();
					}
				} else {
					this.type = 'card'
					// this.card.thisApply = 4
					if (this.card.applyItems.length == 0) {
						this.getInfo();
					}
				}
			},
			// 跑步点击
			signIn() {
				this.adUnitId1 = 'ad_tiny_2021001167643261_202009262200004061'
				this.adUnitId2 = 'ad_tiny_2021001167643261_202009262200004061'
				this.qiehuan = !this.qiehuan //首页切换
				if (this.qiehuan == true) {
					this.type = 'motion'
					this.exchangeStep();
					if (this.motion.applyItems.length == 0) {
						this.getInfo();
					}
				} else {
					this.type = 'card'
					if (this.card.applyItems.length == 0) {
						this.getInfo();
					}
				}
			},
			init() {
				this.getInfo()
				this.getAliAdShow()
			},
			rule() {
				uni.navigateTo({
					url: '../ruleDateils/ruleDateils?type=' + this.type
				})
			},
			applyHander() {
				// 状态:0:未报名;1:邀请好友;3:未开赛;4:进行中;5:已结束

				// this.punchCard()
				if (this.type == 'motion') {
					var thisData = this.motion;
				} else {
					var thisData = this.card;
				}
				if (thisData.thisApply == 0) {
					// 报名处理
					uni.navigateTo({
						url: '../apply/apply?type=' + thisData.type
					})
				} else if (thisData.thisApply == 2 || thisData.thisApply == 5) {
					// 报名下一期处理
					// 报名处理
					uni.navigateTo({
						url: '../apply/apply?type=' + thisData.type
					})
				} else if (thisData.thisApply == 4) {
					// 提交成绩
					this.punchCard()
					// this.exchangeStep();
				} else {
					// 邀请好友处理
					my.showSharePanel();
				}
			},
			punchCard() {
				// this.isStatus = true;
				// this.$refs.messagePopup.open();
				ajax.post({
					url: 'FunCard/punchCard',
					data: {
						type: this.type,
						step: this.thisStep,
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						if (this.type == 'card') {
							this.cardTime = res.data.data;
							this.isStatus = true;
							this.$refs.messagePopup.open();
						} else {
							uni.showToast({
								title: res.data.msg,
							});
						}
						this.getInfo();
						ajax.login2();
					} else {
						uni.showToast({
							title: res.data.msg,
						});
					}
					this.loadingNum++
				}).catch((error) => {
					uni.showModal({
						title: '提示',
						content: '网络请求超时，请稍后再试',
					})
				})
			},
			// 兑换步数
			exchangeStep() {
				if (!ajax.isLogin()) {
					ajax.login(() => {
						this.isLogin = true
						this.init()
					})
				} else {
					if (this.getRunDataLock) {
						return
					}
					this.getRunDataLock = true
					my.getRunData({
						countDate: utils.dateFtt('yyyy-MM-dd', new Date()),
						timeZone: 'Asia/Shanghai',
						success: (res) => {
							let that = this;
							ajax.post({
								url: 'FunCard/getAliStep',
								data: {
									sign: res.sign,
									encryptContent: res.response
								},
								login: true,
							}).then((res) => {
								if (res.data.code == 200) {
									this.thisStep = res.data.data
								} else {
									uni.showToast({
										title: res.data.msg,
									});
								}
								this.loadingNum++
							}).catch((error) => {
								uni.showModal({
									title: '提示',
									content: '网络请求超时，请稍后再试',
								})
							})
						},
						fail: (res) => {
							if (res.error == 1003) {
								uni.showModal({
									title: '提示',
									content: '取消授权,可能会使部分服务无法使用，或者页面信息不完整',
									cancelText: '我知道了',
									confirmText: '重新授权',
									success: (res) => {
										if (res.confirm) {
											this.updateRunData()
										} else if (res.cancel) {}
									},
									fail(e) {
										console.info(e)
									}
								})
							} else {
								if (res.errorMessage == '未知错误') {
									uni.showToast({
										title: '获取步数失败,清稍后再试',
									})
								} else {
									uni.showToast({
										title: res.errorMessage,
									})
								}
							}
						},
						complete: (res) => {
							setTimeout(() => {
								this.getRunDataLock = false
							}, 300)
						}
					})
				}
			},
			getInfo() {
				ajax.get({
					url: 'FunCard/getInfo',
					data: {
						type: this.type
					}
				}).then((res) => {
					if (res.data.code == 200) {
						var thisData = res.data.data;
						var name = 'cardPopupErr_' + thisData.startTime;

						if (this.type == 'motion') {
							this.motion = res.data.data
						} else {
							this.card = res.data.data
						}
						// 状态:0:未报名;1:已报名;2:已打卡;3:未开赛;4::进行中;5:已结束
						var endTime = thisData.startTime;
						// thisData.thisApply = 5
						if (thisData.thisApply == 4) {
							endTime = thisData.endTime;
						} else if (thisData.thisApply == 5) {
							if (this.type == 'card' && cache.get(name) == '') {
								this.isStatus = false;
								this.$refs.messagePopup.open();
								cache.set(name, '1', 86400)
							}
						}
						this.loading = false;
						this.countDown(this.type, endTime)
					}
					this.loadingNum++
				}).catch((err) => {

				})
			},
			countDown(type, endTime) {
				if (this.timeData[type].interval) {
					return;
				}
				// 倒计时
				this.timeData[type].interval = setInterval(() => {
					let modulo = parseInt((new Date(endTime * 1000) - new Date()) / 1000)
					if (modulo > 1) {
						this.timeData[type].shi = this.timeFormat(Math.floor(modulo / (60 * 60)));
						modulo = modulo % (60 * 60);
						this.timeData[type].min = this.timeFormat(Math.floor(modulo / 60));
						this.timeData[type].miao = this.timeFormat(modulo % 60);
					} else {
						this.timeData[type].shi = '00';
						this.timeData[type].min = '00';
						this.timeData[type].miao = '00';
						this.getInfo();
						clearInterval(this.timeData[type].interval);
						this.timeData[type].interval = 0;
					}
					this.isOpen = true
				}, 1000)
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},
			onSubmit(e) {
				ajax.post({
					url: 'Base/collectFormId',
					data: {
						formId: e.detail.formId
					},
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
					this.loadingNum++
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
			onRenderSuccess1(e) {
				if (e.detail.height == 0) {
					this.adUnitId1 = ''
				}
			},

			// 广告打开失败
			onRenderFail1(e) {
				this.adUnitId1 = ''
			},

			// 广告打开成功
			onRenderSuccess2(e) {
				if (e.detail.height == 0) {
					this.adUnitId2 = ''
				}
			},

			// 广告打开失败
			onRenderFail2(e) {
				this.adUnitId2 = ''
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
				};
			}
		},
		computed: {
			adList() {
				let tmp = this.$store.state.adList.indexQipao;
				if (!tmp) {
					tmp = [];
				}
				let list = {
					indexQipao: [],
					indexBubble: [],
				}
				tmp.forEach(item => {
					if ((this.card.thisApply == 3 || this.card.thisApply == 4) && item.id == 207) {
						return false;
					}
					list.indexQipao.push(item);
				})

				tmp = this.$store.state.adList.indexBubble;
				if (!tmp) {
					tmp = [];
				}
				tmp.forEach(item => {
					if ((this.motion.thisApply == 3 || this.motion.thisApply == 4) && item.id == 221) {
						return false;
					}
					list.indexBubble.push(item);
				})

				return list;

			},
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
			},
			applyad(adid) {
				let thisData = this.card;
				if (this.type == 'motion') {
					thisData = this.motion;
				}
				return true;
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
		watch: {
			loadingNum() {
				if (this.loadingNum >= 5) {
					this.loading = false
				}

			}
		}
	}
</script>
<style lang="less">
	@keyframes rainbow {
		0% {
			background-position-x: 750rpx;
		}

		100% {
			background-position-x: 100%;
		}
	}

	.user {
		border: none;
		border: none;
		text-align: left;
		line-height: 1;
		position: absolute;
		left: 0;
		top: 154rpx;
		width: 186rpx;
		box-sizing: border-box;
		padding: 10rpx 0;
		height: 70rpx;
		background: rgba(255, 255, 255, 0.38);
		border-radius: 0px 34px 34px 0px;
		display: flex;
		z-index: 9;

		&-icon {
			padding-left: 10rpx;

			image {
				width: 48rpx;
				height: 48rpx;
				border-radius: 50%;
				overflow: hidden;
			}
		}

		&-text {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 10rpx;

			&-id {
				color: #095C9A;
				font-size: 20rpx;
			}

			&-price {
				color: #095C9A;
				font-size: 24rpx;
			}
		}

	}

	.yundon {

		.banner {
			position: relative;
			width: 100%;
			overflow: hidden;

			.bannerBg {
				width: 100%;
				height: 749rpx;
				background-image: url(../../static/index/bannerBg.png);
				background-repeat: repeat-x;
				background-size: auto 100%;
				background-position-x: -100px;
				animation: rainbow 20s linear infinite;

				.motionImg {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);

					image {
						width: 220rpx;
						// height: 179rpx;
					}
				}

				view {
					text-align: center;
				}

				.banner-title {
					font-size: 28rpx;
					color: #fff;
					padding-top: 194rpx;
				}

				.banner-money {
					font-size: 94rpx;
					color: #fff;
					padding-top: 20rpx;
				}

				.banner-apply {
					padding-top: 18rpx;

					.applyText {
						font-size: 28rpx;
						color: #fff;

						text {
							color: #FFD974;
						}
					}
				}

				.banner-sign {
					display: flex;
					height: 70rpx;
					justify-content: center;
					padding-top: 60rpx;

					.sign {
						width: 140rpx;
						text-align: center;
						line-height: 70rpx;
						font-size: 28rpx;
						color: #fff;
						background: #FEC32C;
					}

					.right {
						width: 300rpx;
						line-height: 70rpx;
						background: #56AFF2;
						font-size: 24rpx;
						color: #fff;
						text-align: center;

						text {
							color: #FFD974;
						}
					}

				}

				.banner-kickoff {
					display: flex;
					height: 70rpx;
					justify-content: center;
					padding-top: 60rpx;

					.kickoff {
						width: 140rpx;
						text-align: center;
						line-height: 70rpx;
						font-size: 28rpx;
						color: #fff;
						background: #397FE9;
					}

					.right {
						width: 300rpx;
						line-height: 70rpx;
						background: #56AFF2;
						font-size: 24rpx;
						color: #fff;
						text-align: center;

						text {
							color: #FFD974;
						}
					}
				}

				.banner-time {
					font-size: 28rpx;
					color: #fff;
					padding-top: 37rpx;
				}
			}


			.icon {
				position: absolute;
				top: 229rpx;
				right: 32rpx;

				.icon-img {
					margin-bottom: 50rpx;

					image {
						width: 100rpx;
						height: 100rpx;
					}

					.text {
						text-align: center;
						font-size: 20rpx;
						color: #fff;
						margin-top: -4rpx;
						line-height: 0;
						z-index: 9;
					}
				}
			}
		}

		.cont {
			background: #fff;
			padding-bottom: 60rpx;

			.adSwiper {
				margin-top: 50rpx;
			}

			.contBgs {
				width: 100%;
				height: 74rpx;
				background: rgba(69, 161, 229, 1);
			}

			&-top {
				width: 100%;
				border-radius: 18rpx 18rpx 0px 0rpx;
				text-align: center;
				line-height: 74rpx;
				display: flex;
				justify-content: space-between;
				background: #548BE0;

				button {
					flex: 1;
					text-align: center;
					color: #fff;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 75rpx;
				}

				.cont-top-btn {
					background: url(../../static/index/right.png)no-repeat;
					background-size: 100% 100%;
					color: #548BE0;
					width: 50%;
				}

				.cont-top-btn2 {
					width: 50%;
				}
			}

			&-btn {
				width: 690rpx;
				height: 80rpx;
				background: url(../../static/index/btn.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 40rpx;
				margin: 0 auto;
				margin-top: 44rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				color: #804401;
			}

			// 瓜分奖池
			.pointsMoney {
				width: 690rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				border-radius: 12px;
				background: #F5F6F8;
				padding: 30rpx 0;

				.pointsTitle {
					display: flex;
					justify-content: space-between;
					align-items: center;
					// margin-top: 30rpx;
					padding-left: 38rpx;

					.pointsData {
						font-size: 28rpx;
						color: #343434;
						font-weight: bold;
					}

					.pointsGf {
						width: 137rpx;
						height: 50rpx;
						background: #FEC32C;
						border-radius: 25rpx 0rpx 0rpx 25rpx;
						text-align: center;
						line-height: 50rpx;
						color: #9A5A02;
						font-size: 24rpx;
					}
				}

				.pointsCent {
					margin-top: 42rpx;
					padding: 0 50rpx;

					.pointsNum {
						font-size: 40rpx;
						color: #343434;
						font-weight: bold;
						text-align: center;
					}

					.pointsText {
						font-size: 22rpx;
						color: #666666;
						margin-top: 20rpx;
						text-align: center;
					}
				}

				.pointsLis {
					display: flex;
					justify-content: space-between;
					padding-top: 42rpx;

					.pointsTime {
						width: 33%;

						.top {
							color: #343434;
							font-size: 28rpx;
							font-weight: bold;
							text-align: center;
						}

						.redMoney1 {
							color: #F50E3A;
						}

						.bottom {
							font-size: 24rpx;
							color: #666;
							margin-top: 20rpx;
							text-align: center;
						}
					}
				}

				.up-to-par {
					margin-top: 56rpx;
					font-size: 26rpx;
					color: #548BE0;
					text-align: center;
				}

				.status-1 {
					color: #999999;
				}
			}

			&-bottom {
				margin-top: 30rpx;
				padding: 0 30rpx;

				&-title {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20rpx;
					border-bottom: 1px solid #ECECEC;

					.title {
						color: #333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.rule {
						display: flex;
						align-items: center;

						&-text {
							color: #548BE0;
							font-size: 30rpx;
						}

						image {
							width: 30rpx;
							height: 30rpx;
							margin-left: 10rpx;
						}

					}
				}

				.listBox {
					padding-top: 40rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					image {
						width: 100%;
					}

					.list {
						width: 116rpx;

						&-data {
							width: 88rpx;
							height: 41rpx;
							box-sizing: border-box;
							padding-top: 7rpx;
							background: #FDC32B;
							text-align: center;
							margin: 0 auto;
							color: #fff;
							font-size: 20rpx;
						}

						&-icon {
							width: 116rpx;
							height: 116rpx;
							background: #FEF8E0;
							border-radius: 50%;
							overflow: hidden;
							margin: 20rpx 0;
						}

						&-name {
							color: #333;
							font-size: 22rpx;
							text-align: center;
						}
					}

					.imgBox {
						width: 49rpx;
						height: 24rpx;

						image {
							width: 49rpx;
							height: 24rpx;
						}
					}
				}
			}
		}

		.cont-top {
			line-height: 75rpx
		}
	}

	.daka {
		.banner {
			position: relative;
			width: 100%;
			overflow: hidden;

			.bannerBg {
				width: 100%;
				height: 749rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/morning_bg.png)no-repeat;
				background-size: 100% 100%;
				position: relative;

				.xion {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					text-align: center;

					image {
						width: 127rpx;
						height: 146rpx;
					}
				}

				view {
					text-align: center;
				}

				.banner-title {
					font-size: 28rpx;
					color: #fff;
					padding-top: 194rpx;
				}

				.banner-money {
					font-size: 94rpx;
					color: #fff;
					padding-top: 20rpx;
				}

				.banner-apply {
					padding-top: 18rpx;

					.applyText {
						font-size: 28rpx;
						color: #fff;

						text {
							color: #FFD974;
						}
					}
				}

				.banner-time {
					font-size: 28rpx;
					color: #fff;
					padding-top: 80rpx;
				}

				.applyClass {
					display: flex;
					height: 70rpx;
					justify-content: center;
					padding-top: 40rpx;

					.applyLeft {
						width: 140rpx;
						text-align: center;
						line-height: 70rpx;
						font-size: 28rpx;
						color: #fff;
						background: #FEC32C;
					}

					.time {
						width: 300rpx;
						line-height: 70rpx;
						background: #56AFF2;
						font-size: 24rpx;
						color: #fff;
						text-align: center;
					}

				}
			}



			.icon {
				position: absolute;
				top: 229rpx;
				right: 32rpx;

				.icon-img {
					margin-bottom: 50rpx;

					image {
						width: 100rpx;
						height: 100rpx;
					}

					.text {
						text-align: center;
						font-size: 20rpx;
						color: #fff;
						margin-top: -4rpx;
						line-height: 0;
						z-index: 9;
					}
				}
			}
		}

		.cont {
			background: #fff;
			padding-bottom: 60rpx;

			.adSwiper {
				margin-top: 50rpx;
			}

			// padding-top: 40rpx;
			.contBgs {
				width: 100%;
				height: 74rpx;
				background: #68D893;
			}

			&-top {
				width: 100%;
				border-radius: 18rpx 18rpx 0px 0rpx;
				text-align: center;
				line-height: 74rpx;
				display: flex;
				justify-content: space-between;
				background: #548BE0;

				button {
					flex: 1;
					text-align: center;
					color: #fff;
					font-size: 32rpx;
					font-weight: bold;
					line-height: 75rpx;
				}

				.cont-top-btn {
					background: url(../../static/index/left.png)no-repeat;
					background-size: 100% 100%;
					color: #548BE0;
					width: 50%;
				}

				.cont-top-btn2 {
					width: 50%;
				}
			}

			&-btn {
				width: 690rpx;
				height: 80rpx;
				background: url(../../static/index/btn.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 40rpx;
				margin: 0 auto;
				margin-top: 44rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				color: #804401;
			}

			&-bottom {
				margin-top: 30rpx;
				padding: 0 30rpx;

				&-title {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20rpx;
					border-bottom: 1px solid #ECECEC;

					.title {
						color: #333;
						font-size: 32rpx;
						font-weight: bold;
					}

					.rule {
						display: flex;
						align-items: center;

						&-text {
							color: #548BE0;
							font-size: 30rpx;
						}


						image {
							width: 30rpx;
							margin-left: 10rpx;
						}

					}
				}

				.listBox {
					padding-top: 40rpx;
					display: flex;
					// justify-content: space-between;
					align-items: center;

					image {
						width: 100%;
					}

					.list {
						flex: 1;

						&-data {
							width: 88rpx;
							height: 41rpx;
							box-sizing: border-box;
							padding-top: 7rpx;
							background: #FDC32B;
							text-align: center;
							margin: 0 auto;
							color: #fff;
							font-size: 20rpx;
						}

						&-icon {
							width: 116rpx;
							height: 116rpx;
							background: #FEF8E0;
							border-radius: 50%;
							overflow: hidden;
							margin: 20rpx auto;

							// margin: 20rpx 0;
							image {
								width: 116rpx;
								height: 116rpx;
							}
						}

						&-name {
							color: #333;
							font-size: 22rpx;
							text-align: center;
						}
					}

					.imgBox {
						width: 49rpx;
						height: 24rpx;

						image {
							width: 49rpx;
							height: 24rpx;
						}
					}
				}
			}

			.successful {
				padding-top: 74rpx;

				.titleBox {
					display: flex;
					justify-content: center;
					align-items: center;
					padding-bottom: 67rpx;

					.xian {
						width: 40rpx;
						height: 4rpx;
						background: #FDC32B;
						border-radius: 2rpx;
					}

					.title {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
						padding: 0 20rpx;
					}
				}


				.dateCenter {
					display: flex;
					justify-content: center;

					.when {
						height: 103rpx;
						display: flex;
						padding-right: 65rpx;
						flex-direction: column;
						justify-content: space-between;
						border-right: 2rpx solid #ECECEC;

						.title {
							color: #333;
							font-size: 28rpx;
						}

						.time {
							font-size: 48rpx;
							color: #548BE0;
							text-align: center;
						}
					}

					.day {
						height: 103rpx;
						display: flex;
						padding-left: 65rpx;
						flex-direction: column;
						justify-content: space-between;

						.cumulative {
							color: #333;
							font-size: 28rpx;
						}

						.numDay {
							font-size: 48rpx;
							color: #548BE0;
							text-align: center;
						}
					}
				}

			}

			.notice {
				padding-top: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				text-align: center;


				.noticeList {
					width: 100%;
					height: 30rpx;
					line-height: 30rpx;


					image {
						width: 28rpx;
						height: 24rpx;
					}

					.noticeBox {

						.noticeItem {
							font-size: 22rpx;
							color: #333;
							display: flex;
							align-items: center;
							justify-content: center;
							text-align: center;

							.tips {
								margin-left: 10rpx;
							}

							image {
								width: 28rpx;
								height: 24rpx;
							}
						}
					}
				}
			}

			// 打卡失败
			.cardOver {
				padding-top: 74rpx;
				text-align: center;

				.titleBox {
					display: flex;
					justify-content: center;
					align-items: center;
					// padding-bottom: 67rpx;

					.xian {
						width: 40rpx;
						height: 4rpx;
						background: #FDC32B;
						border-radius: 2rpx;
					}

					.title {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
						padding: 0 20rpx;
					}
				}

				image {
					width: 214rpx;
					height: 122rpx;
					margin-top: 50rpx;
				}

				.bottomTz {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-top: 20rpx;

					image {
						width: 28rpx;
						height: 24rpx;
						margin: 0;
					}

					text {
						font-size: 22rpx;
						color: #333;
						padding-left: 10rpx;
					}
				}
			}

			.cardPop {
				width: 553rpx;
				height: 576rpx;
				background: url(../../static/newImg/fail.png)no-repeat;
				background-size: 100% 100%;
				border-radius: 26rpx;
				position: relative;

				.CardDate {
					text-align: center;
					color: #FA051C;
					text-align: center;
					padding-top: 348rpx;
				}

				.close {
					position: absolute;
					bottom: -160rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 73rpx;
					height: 72rpx;
					background: url(../../static/newImg/close.png)no-repeat;
					background-size: 100% 100%;
				}

				.btns {
					position: absolute;
					bottom: 16rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 389rpx;
					height: 107rpx;
					background: url(../../static/newImg/failBtn.png)no-repeat;
					background-size: 100% 100%;

				}
			}

			.succeed {
				background: url(../../static/newImg/succeed.png)no-repeat;
				background-size: 100% 100%;
			}
		}

		.cont-top {
			line-height: 75rpx
		}
	}

	/* 清楚按钮样式 */
	.clear_button {
		height: auto;
		line-height: normal;
		border: none;
		background-color: rgba(0, 0, 0, 0);
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
			border-bottom: 8rpx rgba(0, 0, 0, 0.75) solid;
		}

		.box {
			display: flex;
			align-items: center;
			background-color: rgba(0, 0, 0, 0.75);
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

	.aliad {
		margin: 30rpx 30rpx 0;
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
</style>
