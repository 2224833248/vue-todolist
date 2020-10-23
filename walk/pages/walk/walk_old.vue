<template>
	<view id="walkPage" class="page">
		<!-- <aui-loading ref="ccc" :show="true" :type="4" direction="col" msg="加载中" :mask="true" :theme="2"></aui-loading> -->

		<navbar customStyle="borderBottom:0px;backgroundColor:#FEFDBC;">
			<view class="ui-row" style="height:46px;">
				<view class="ui-col-content align-center valign-middle">
					<view>
						走路钱多多
					</view>
				</view>
			</view>
		</navbar>
		<view :style="{height:NAV_HEIGHT}"></view>
		<view class="head" v-if="bulletin">
			<view class="headLeft">
				<image class="leftpic" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/gong.png"></image>
				<uni-notice-bar v-if="bulletin.length>0" class="tests" color="#888888" backgroundColor="#fffff5" :text="bulletin"
				 scrollable="true" single="true"></uni-notice-bar>
			</view>
			<image class="headRight" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/back.png" @click="closeBulletin"></image>
		</view>
		<view class="main">
			<!-- 图 -->
			<view class="head_main">
				<image class="mian_bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/headindex.png"></image>
				<view class="main-fix">
					<view class="left">我的多多币</view>
					<view class="right" @click="onRule">
						<view class="rightTit">活动规则</view>
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/nav.png" class="rightImg"></image>
					</view>
				</view>
				<view class="progress">
					<view class="progress-fix">
						<image class="progress_left" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/progress.png"></image>
						<view class="progress_right">{{user.walk_integral||0}}</view>
					</view>
				</view>
				<view class="main-contents">
					<view class="steps">当前步数</view>
					<view class="nums" @click="updateRunData">{{step}}</view>
					<view class="btns" @click="exchangeStep">
						<view class="testes" v-if="isLogin">点击兑换多多币</view>
						<view class="testes" v-if="!isLogin">登陆</view>
					</view>
					<view class="spams">每日24点步数清零</view>
				</view>

				<view class="picLeft">
					<view class="leftt" v-if="typeof task_bubble[0] != 'undefined'" @click="onTaskTap(task_bubble[0])">
						<view class="leftTop">
							<image mode="widthFix" :src="task_bubble[0].image"></image>
						</view>
					</view>
					<view class="leftb" v-if="typeof task_bubble[2] != 'undefined'" @click="onTaskTap(task_bubble[2])">
						<view class="leftBottom">
							<image mode="widthFix" :src="task_bubble[2].image"></image>
						</view>
					</view>
				</view>
				<view class="picRight">
					<view class="rightst" v-if="typeof task_bubble[1] != 'undefined'" @click="onTaskTap(task_bubble[1])">
						<view class="rightTop">
							<image mode="widthFix" :src="task_bubble[1].image"></image>
						</view>
					</view>
					<view class="rightsb" v-if="typeof task_bubble[3] != 'undefined'" @click="onTaskTap(task_bubble[3])">
						<view class="rightBottom">
							<image mode="widthFix" :src="task_bubble[3].image"></image>
						</view>
					</view>
				</view>

				<view class="seeing">
					<view class="amin"></view>
				</view>
			</view>

			<view class="life_box" v-if="isLife">
				<image class="img" src="../..https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/logo.png" />
				<text class="content">有惠走路赚钱 - 生活号</text>
				<life-follow class="life" @checkFollow.native="checkFollow" sceneId="9301d1a86dd14c7ca3be8159fd3edabb" />
			</view>

			<!-- <view class="" @click="cs">csssssssss</view> -->
			<!-- 邀请 -->
			<view class="inviteding">
				<view class="inviteFix">
					<view class="inviteLeft">
						<view class="leftTops">
							<view class="blacktet">
								邀好友立得
							</view>
							<view class="orangetet">
								2000步
							</view>
							<image class="inviteImg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/i.png" @click="onHelpTap"></image>
						</view>
						<view class="leftBottoms">
							<view class="bottoms">还可享受步数加速 最高+100%</view>
							<image class="bottomimg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/shan.png"></image>
						</view>
					</view>
					<view class="inviteRight">
						<view class="rightTit" @click="onShowSharePanelTap">立即邀请</view>
					</view>
				</view>
				<view class="invitess" @click="onRankTap">
					<view class="ess">已邀请</view>
					<view class="ess longs">{{count}}</view>
					<view class="ess">人</view>
					<view class="ess lis">加速</view>
					<view class="longs ess">{{scale}}%</view>
					<image class="seeImg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/nav.png"></image>
				</view>
			</view>
			<view class="activity" v-if="activity.length > 0">
				<view class="activity__hd">热门活动</view>
				<view class="activity__bd">
					<view class="activity__bd__item" v-for="(item,index) in activity" :key="index" @click="onAdTap(item)">
						<image :src="item.image" mode="aspectFill"></image>
					</view>
				</view>
			</view>
			<!-- 换现金 -->
			<view class="cash" v-if="redList.length > 0">
				<view class="cashTit">
					<view class="cashLeft">多多币可换现金</view>
					<view class="cashRight">
						<view class="cashpro">当前多多币</view>
						<view class="cashnum">{{user.walk_integral}}</view>
					</view>
				</view>
				<view class="ress">
					<view class="redList">
						<view class="reds" v-for="(item,index) in redList" :key="index" @click="redeem(item.price)">
							<image class="redImg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/red.png"></image>
							<view class="price">{{item.price}}元</view>
							<view class="listFixd">
								<image class="pandaes" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/panda.png"></image>
								<view class="money">{{item.money}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="Tips">
					<view class="tiptire" @click="onRule">
						多多币不足？教你如何快速获取多多币
					</view>
					<image class="tipsImgs" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/lefts.png"></image>
				</view>
			</view>
			<!-- 获取步数 -->
			<view class="task" v-if="Object.keys(ad_more).length > 0">
				<view class="task__header">
					获取更多多多币
				</view>
				<view class="task__body">
					<view class="task__list">
						<view class="task__list__item" v-for="(item,index) in ad_more" :key="index">
							<view class="item__left">
								<view class="item__left__header">
									<text class="item__left__header__title">{{item.title}}</text>
									<image class="item__left__header__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/golds.png"
									 mode="aspectFill"></image>
									<view class="item__left__header__integral">
										+{{item.integral}}
									</view>
								</view>
								<view class="item__left__body">
									{{item.subtitle}}
								</view>
							</view>
							<view class="item__right">
								<view v-if="item.isComplete == false" class="item__right__button" @click="onTaskTap(item)">去完成</view>
								<view v-else class="item__right__button item__right__button--complete" @click="onTaskTap(item)">已完成</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 步数加速规则 -->
		<uni-popup class="popup " ref="popup" type="center" :maskClick='false'>
			<view class="popups">
				<view class="pop-content">
					<image class="tanbg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/tanbg.png"></image>
					<view class="rule_Tips">
						<view class="rulees">步数加速规则</view>
						<view class="ruleList">
							<view class="rules" v-for="(item,index) in ruleList" :key="index">{{item}}</view>
						</view>
					</view>
					<view class="knows" @click="onKnow">
						<image class="knowImg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/know.png"></image>
					</view>
					<view class="cancel" @click="onCancel">
						<image class="cancelPic" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png"></image>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 兑换积分弹窗 -->
		<uni-popup class="popup" ref="popup1" type="center" :maskClick='false'>
			<view class="popups">
				<view class="exchange-success">
					<view class="exchange-success__hd">恭喜获得多多币</view>
					<view class="exchange-success__bd">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/golds.png" mode="aspectFill"></image>
						<text>+{{receive}}</text>
					</view>
					<view class="exchange-success__ft">
						<view>更多多多币可兑换现金红包</view>
						<view>还可兑换优质商品</view>
					</view>
					<view class="exchange-success__button" @click="onClose">继续做任务</view>
				</view>
			</view>
		</uni-popup>
		<!-- 完成任务弹窗 -->
		<uni-popup class="popup" ref="popup2" type="center" :maskClick='false'>
			<view class="popups">
				<view class="complete">
					<view class="complete__hd" v-if="task.reward_type == 1">恭喜获得多多币</view>
					<view class="complete__hd" v-if="task.reward_type == 2">恭喜获得步数</view>
					<view class="complete__bd">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/golds.png" mode="aspectFill"></image>
						<text v-if="task.reward_type == 1">+{{task.integral}}</text>
						<text v-if="task.reward_type == 2">+{{task.step}}</text>
					</view>
					<view class="complete__ft">
						<view>获取更多多多币，可兑换现金红包哦！</view>
					</view>
					<view class="complete__button" @click="completeClose">继续做任务</view>
				</view>
			</view>
			<view class="complete__close">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="completeClose"></image>
			</view>
		</uni-popup>
		<view class="rectangle" v-if="showTips" @click="tipsClick" :style="'top:'+NAV_HEIGHT">
			<view class="shape"></view>
			<view class="box">
				<image class="img" src="../..https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/logo.png"></image>
				<text class="content">把“走路钱多多”添加到首页,以后使用更方便</text>
			</view>
		</view>	
		<button class="clearCache" v-if="isdev" @click="clearCache">清除缓存</button>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync()

	let app = getApp()
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import cache from '../../utils/cache.js'
	import {
		aui
	} from '@/common/aui/js/aui.js';
	import auiLoading from '@/components/aui-loading/aui-loading.vue';


	export default {
		components: {
			uniPopup,
			auiLoading
		},
		data() {
			let rate = systemInfo.windowWidth / systemInfo.windowHeight;
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",
				tipsTop: 0,
				showTips: false,
				gold: 0,
				step: 0,
				isLife: true,
				count: 0,
				scale: 0,

				receive: 0,

				bulletin: "",

				redList: [],
				activity: [],

				task_bubble: [],
				ad_more: [],

				ruleList: [
					"1. 每邀请1位新用户，步数加0.5%~2%, 加速上限为100%",
					"2. 加速奖励=实际步数x加速系数",
					"3. 加速奖励每天24点过期，记得及时领取哦~"
				],

				task: '',
				activeTask: '',
				activeDate: '',

				isLogin: false,

				showLoading: false,
				showCount: 0,

				getRunDataLock: false,
			};
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof option.invite_id == "string") {
				cache.set('invite_id', option.invite_id)
			}

			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.isLogin = res.success
					this.init()
				})
			} else {
				this.isLogin = true
				this.init()
			}
		},
		onShow() {
			this.completeTask()
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk',
				};
			}
		},
		mounted() {
			//this.$refs.ccc.show()
			setTimeout(() => {
				this.getBulletin()
				this.getRedPacketList()
			})

		},
		methods: {
			
			cs() {
				uni.navigateTo({
					url: "/pages/red/index"
				})
			},
			init() {
				this.getTask()
				this.getData()
				this.getActivity()
				this.updateRunData()
			},
			checkFollow(e) {
				this.isLife = e.detail.followed;
			},
			onCloseTap() {

			},
			tipsClick() {
				this.showTips = false;
			},
			// 获取任务
			getTask() {
				// 气泡任务
				this.getBubbleAd()
				// 获取更多步数
				this.getMoreStep()

				this.hideLoading()
			},

			// 获取气泡广告
			getBubbleAd() {
				ajax.get({
					url: 'Task/list',
					data: {
						category_tag: 'bubble'
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.task_bubble = res.data.data
					}
				}).catch((error) => {})
			},

			// 获取任务列表
			getMoreStep() {
				ajax.get({
					url: 'Task/list',
					data: {
						category_tag: 'morestep',
						is_filter: '0'
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.ad_more = res.data.data
					}
				}).catch((error) => {})
			},

			// 点击任务
			onTaskTap(task) {
				if (!task) {
					return;
				}

				if (task.type == 1) { // 链接跳转
					uni.navigateTo({
						url: "/pages/goods/webview?url=" + task.url,
						success: (res) => {
							this.task = task
							this.activeTask = task
							this.activeDate = new Date()
						}
					})
				} else if (task.type == 2) { // 跳转小程序
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
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
				} else if (task.type == 3) { // 跳转页面
					uni.navigateTo({
						url: task.path + "?" + task.extra_data,
						success: (res) => {
							this.task = task
							this.activeTask = task
							this.activeDate = new Date()
						}
					})
				} else if (task.type == 5) { // 跳转插件页面
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
					uni.navigateTo({
						url: task.url
					})
				} else if (task.type == 6) { // 跳转生活号
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
					my.ap.navigateToAlipayPage({
						path: task.url
					})
				} else if (task.type == 7) { // 跳转指定页面
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
					my.ap.navigateToAlipayPage({
						path: encodeURIComponent(
							'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
							encodeURIComponent(task.url)
						)
					});
				} else if (task.type == 13) { // 饿了么小程序指定网页跳转
					this.task = task
					this.activeTask = task
					this.activeDate = new Date()
					my.navigateToMiniProgram({
						appId: '2018090761255717',
						path: 'pages/webview-redirect/webview-redirect?url=' + encodeURIComponent(task.url)
					});
				}
			},

			// 完成任务
			completeTask() {
				if (this.activeTask && !this.activeTask.isComplete) {
					if ((new Date() - this.activeDate) / 1000 < 10) {
						uni.showModal({
							title: '提示',
							content: '访问10秒以上,才能领取奖励哦',
							showCancel: false,
							confirmText: "知道了"
						})
					} else {
						ajax.get({
							url: 'Task/complete',
							data: {
								task_id: this.activeTask.id
							},
							login: true,
						}).then((res) => {
							if (res.data.code == 200 && res.data.data == '1') {
								this.$refs.popup2.open()
								this.upUserInfo()
							}
							this.init()
						}).catch((error) => {
							this.init()
						})
					}
				}
				this.activeTask = ''
				this.activeDate = ''
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
								url: 'Run/exchangeStep',
								data: {
									sign: res.sign,
									encryptContent: res.response
								},
								login: true,
								loading: true,
							}).then((res) => {
								if (res.data.code == 200) {
									this.receive = res.data.data
									this.$refs.popup1.open()
									this.upUserInfo()
									this.updateRunData()
								} else {
									uni.showToast({
										title: res.data.msg,
									});
								}
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
								uni.showToast({
									title: res.errorMessage,
								})
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

			// 获取数据
			getData() {
				ajax.get({
					url: 'run/runInfo',
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.count = res.data.data.count
						this.scale = res.data.data.scale
					}
				}).catch((error) => {})
			},

			// 获取红包规格
			getRedPacketList() {
				ajax.get({
					url: 'Redeem/getRedPacketList',
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.redList = res.data.data
					}
					this.showCount++
					this.hideLoading()
				}).catch((error) => {
					this.showCount++
					this.hideLoading()
				})
			},

			// 获取网站公告
			getBulletin() {
				ajax.get({
					url: 'Public/getBulletin',
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.bulletin = res.data.data
					}
				}).catch((error) => {})
			},

			// 获取活动
			getActivity() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 5
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.activity = res.data.data
					}
					this.showCount++
					this.hideLoading()
				}).catch((error) => {
					this.showCount++
					this.hideLoading()
				})
			},

			// 兑换现金
			redeem(format) {
				ajax.post({
					url: 'Redeem/redeem',
					data: {
						format: format
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
						});
						this.upUserInfo();
					} else {
						uni.showToast({
							title: res.data.msg,
						});
					}
				}).catch((error) => {})
			},
			upUserInfo() {
				ajax.post({
					url: 'Profile/userInfo'
				}).then((res) => {
					if (res.data.code == 200) {
						this.$store.commit('increment', res.data.data)
					}
				}).catch((error) => {})
			},
			hideLoading() {
				if (this.showCount >= 2) {
					//this.$refs.ccc.hide()
					setTimeout(() => {
						this.showTips = true;
						setTimeout(() => {
							this.showTips = false;
						}, 4000)
					}, 2000)
				}
			},
			clearCache() {
				uni.clearStorage();
			},
			onClose() {
				this.$refs.popup1.close()
			},
			onRule() {
				uni.navigateTo({
					url: '/pages/walk/strategy'
				})
			},
			onKnow() {
				this.$refs.popup.close()
			},
			onCancel() {
				this.$refs.popup.close()
			},
			// 关闭公告
			closeBulletin() {
				this.bulletin = '';
			},
			// 点击帮助
			onHelpTap() {
				this.$refs.popup.open()
			},
			// 点击排行榜
			onRankTap() {
				uni.navigateTo({
					url: '/pages/rank/rank'
				})
			},
			// 邀请
			onShowSharePanelTap() {
				console.log(this.user)
				my.showSharePanel();
			},

			// 点击广告
			onAdTap(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad);
			},

			completeClose() {
				this.$refs.popup2.close()
			},

			// 更新步数
			updateRunData() {
				if (!this.isLogin) {
					return
				}
				my.getRunData({
					countDate: utils.dateFtt('yyyy-MM-dd', new Date()),
					timeZone: 'Asia/Shanghai',
					success: (res) => {
						let that = this;
						ajax.post({
							url: "Run/updateStep",
							data: {
								sign: res.sign,
								encryptContent: res.response
							}
						}).then((res) => {
							if (res.data.code == 200) {
								this.step = res.data.data.count
							} else {
								uni.showToast({
									title: res.data.msg,
									duration: 1e4
								});
							}
						}).catch((error) => {})
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
							uni.showToast({
								title: res.errorMessage,
							})
						}
					}
				})
			}
		},
		computed: {
			user() {
				return typeof(this.$store.state.user.uid) !== 'undefined' ? this.$store.state.user : {
					integral: 0
				}
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.life_box {
		background-color: rgb(255, 255, 255);
		margin: 0px 0.32rem 0.27rem;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		border-radius: 16rpx;

		.img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.content {
			flex: 1;
		}

		.life {}

	}

	.clearCache {
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
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

	.seeing {
		position: absolute;
		top: 60%;
		left: 50%;
		transform: translateX(-50%);

		.amin {
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/sprite.gif);
			background-size: auto 100%;
			background-repeat: no-repeat;
			width: 200rpx;
			height: 200rpx;
			margin: 0 auto;
			// animation: move 1s steps(20) infinite;
		}
	}

	@keyframes move {
		0% {
			background-position: 0 0;
		}

		100% {
			background-position: calc(-4000rpx) 0;
		}
	}

	@keyframes breath {
		0% {
			-webkit-transform: scale(0.9);
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		30% {
			-webkit-transform: scale(0.9);
			transform: scale(0.9);
		}

		45% {
			-webkit-transform: scale(1);
		}

		to {
			-webkit-transform: scale(0.9);
		}
	}

	#walkPage {
		margin: 0;
		padding: 0;
		background-color: #003643;
		display: flex;
		flex-direction: column;

		.head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;
			background-color: #fffff5;

			.headLeft {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				.leftpic {
					width: 21rpx;
					height: 18rpx;
					display: block;
				}

				/deep/ .uni-noticebar {
					margin-bottom: 0;
					width: 87vw;

				}
			}

			.headRight {
				width: 13rpx;
				height: 13rpx;
				display: block;
			}
		}

		.main {
			flex: 1;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			background-color: #003643;
			padding-bottom: 5rpx;

			.head_main {
				position: relative;

				.mian_bg {
					width: 100vw;
					height: 650rpx;
					display: block;
				}

				.main-fix {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						position: absolute;
						top: 0;
						left: 0;
						padding-left: 32rpx;
						padding: 22rpx 0 22rpx 32rpx;
						font-size: 26rpx;
						font-weight: bold;
						color: #666666;
					}

					.right {
						position: absolute;
						top: 0;
						right: 0;
						padding: 22rpx 32rpx 22rpx 0;
						display: flex;
						align-items: center;
						justify-content: center;

						.rightTit {
							font-weight: bold;
							font-size: 24rpx;
							color: #666666;
							margin-right: 15rpx;
						}

						.rightImg {
							width: 9rpx;
							height: 18rpx;
							display: block;
						}
					}
				}

				.progress {
					position: absolute;
					top: 10%;
					padding-left: 32rpx;

					.progress-fix {
						position: relative;

						.progress_left {
							width: 174rpx;
							height: 55rpx;
							display: block;
						}

						.progress_right {
							position: absolute;
							top: 18%;
							left: 40%;
							font-weight: bold;
							font-size: 30rpx;
							letter-spacing: 0rpx;
							color: #ffffff;
						}
					}
				}

				.main-contents {
					text-align: center;
					position: absolute;
					top: 5%;
					left: 50%;
					transform: translateX(-50%);

					.steps {
						font-weight: bold;
						font-size: 30rpx;
						letter-spacing: 1rpx;
						color: #0c5560;
						margin-bottom: 20rpx;

					}

					.nums {
						font-weight: bold;
						font-size: 80rpx;
						color: #0c5560;
					}

					.btns {
						margin: 20rpx auto 16rpx;
						width: 340rpx;
						background-image: linear-gradient(90deg,
							#00af97 0%,
							#2fd883 100%),
							linear-gradient(#2ea799,
							#2ea799);
						background-blend-mode: normal,
							normal;
						border-radius: 40rpx;

						.testes {
							padding: 22rpx 0;
							font-weight: bold;
							font-size: 30rpx;
							color: #ffffff;
							text-align: center;
						}
					}

					.spams {
						font-size: 22rpx;
						color: #818181;
					}
				}

				.picLeft {
					position: absolute;
					top: 15%;
					left: 0;

					.leftTop,
					.leftBottom {
						width: 110rpx;
						min-height: 110rpx;
						display: block;
						animation: breath 1.2s ease-in-out infinite;

						image {
							width: 110rpx;
							min-height: 110rpx;
						}

						text {
							width: 110rpx;
							text-align: center;
							font-size: 20rpx;
							position: absolute;
							z-index: 1;
							top: 16rpx;
						}
					}

					.leftt {
						padding-left: 25rpx;
						margin-top: 85rpx;
					}

					.leftb {
						padding-left: 160rpx;
						margin-top: 30rpx;
					}
				}

				.picRight {
					position: absolute;
					top: 18%;
					right: 0;

					.rightTop,
					.rightBottom {
						width: 110rpx;
						min-height: 110rpx;
						display: block;
						animation: breath 1.2s ease-in-out infinite;

						image {
							width: 110rpx;
							min-height: 110rpx;
						}

						text {
							width: 110rpx;
							text-align: center;
							font-size: 20rpx;
							position: absolute;
							z-index: 1;
							top: 16rpx;
						}
					}

					.rightst {
						padding-left: 85rpx;
						margin-top: 85rpx;
					}

					.rightsb {
						padding-right: 100rpx;
						margin-top: 50rpx;
					}
				}
			}

			.inviteding {
				margin: 0 32rpx 27rpx;
				background-color: #ffffff;
				border-radius: 16rpx;

				.inviteFix {
					padding: 36rpx 32rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.inviteLeft {
						.leftTops {
							display: flex;
							align-items: center;
							justify-content: flex-start;

							.blacktet,
							.orangetet {
								font-weight: bold;
								font-size: 33rpx;
								color: #000000;
							}

							.orangetet {
								color: #ff7f01;
							}

							.inviteImg {
								width: 26rpx;
								height: 26rpx;
								display: block;
							}
						}

						.leftBottoms {
							display: flex;
							align-items: center;
							justify-content: flex-start;
							margin-top: 18rpx;

							.bottoms {
								color: #000000;
								font-size: 26rpx;
							}

							.bottomimg {
								width: 18rpx;
								height: 30rpx;
								display: block;
							}
						}
					}

					.inviteRight {
						width: 194rpx;
						background-image: linear-gradient(90deg,
							#ffb033 0%,
							#ff8400 100%),
							linear-gradient(#46991c,
							#46991c);
						background-blend-mode: normal,
							normal;
						border-radius: 40rpx;

						.rightTit {
							padding: 24rpx;
							text-align: center;
							font-size: 27rpx;
							color: #ffffff;
							letter-spacing: 3rpx;
						}
					}
				}

				.invitess {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 30rpx;

					.ess {
						font-size: 24rpx;
						color: #777777;
					}

					.longs {
						color: #ff7f01;
					}

					.lis {
						margin-left: 5rpx;
					}

					.seeImg {
						width: 7rpx;
						height: 14rpx;
						display: block;
						margin-left: 4rpx;
					}
				}

			}

			.activity {
				margin: 0 32rpx 27rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 36rpx 32rpx;

				&__hd {
					color: #000;
					font-size: 33rpx;
					font-weight: bold;
					margin-bottom: 32rpx;
				}

				&__bd {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					&__item {
						width: 300rpx;
						height: 132rpx;
						margin-bottom: 18rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

			.cash {
				margin: 0rpx 32rpx 27rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 36rpx 32rpx;

				.cashTit {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.cashLeft {
						color: #000000;
						font-size: 33rpx;
						font-weight: bold;
					}

					.cashRight {
						display: flex;
						align-items: center;
						justify-content: flex-start;

						.cashpro,
						.cashnum {
							font-size: 25rpx;
							color: #777777;
						}

						.cashnum {
							color: #ff7f01;
						}
					}
				}

				.ress {
					margin: 61rpx 0 39rpx;

					.redList {
						display: flex;
						align-items: flex;
						justify-content: flex-start;
						overflow-x: scroll;

						.reds {
							position: relative;
							margin-right: 17rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;

							.redImg {
								width: 134rpx;
								height: 179rpx;
								display: block;
							}

							.price {
								position: absolute;
								top: 10%;
								letter-spacing: 1rpx;
								color: #ffffff;
								font-size: 26rpx;
								font-weight: bold;
							}

							.listFixd {
								display: flex;
								align-items: center;
								justify-content: center;
								position: absolute;
								bottom: 8%;

								.pandaes {
									width: 21rpx;
									height: 21rpx;
									display: block;
									margin-right: 5rpx;
								}

								.money {
									letter-spacing: 1rpx;
									color: #feeb7f;
									font-size: 26rpx;
									font-weight: bold;
									line-height: 15rpx;
								}
							}
						}
					}

				}

				.Tips {
					display: flex;
					align-items: center;
					justify-content: center;

					.tiptire {
						color: #ff7f01;
						font-size: 24rpx;

					}

					.tipsImgs {
						width: 20rpx;
						height: 20rpx;
						display: block;
					}
				}
			}

			.stepNumber {
				margin: 0 32rpx;
				background-color: #ffffff;
				border-radius: 16rpx;
				padding: 36rpx 32rpx 0;

				.stepTit {
					font-weight: bold;
					font-size: 33rpx;
					color: #000000;
				}

				.stepList {
					.mainFix {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin: 36rpx 0;
						border-bottom: 2rpx solid #f5f5f5;

						.gixLeft {
							.bigTit {
								font-weight: bold;
								font-size: 30rpx;
								letter-spacing: -1rpx;
								color: #333333;
							}

							.smlTit {
								font-size: 26rpx;
								color: #808080;
								margin: 21rpx 0;
							}
						}

						.gixRight {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 176rpx;
							height: 62rpx;
							background-image: linear-gradient(90deg,
								#ffc02a 0%,
								#ff9102 100%),
								linear-gradient(#df8d37,
								#df8d37);
							background-blend-mode: normal,
								normal;
							border-radius: 31rpx;

							.pandas {
								width: 37rpx;
								height: 37rpx;
								display: block;
							}

							.times {
								font-weight: bold;
								font-size: 28rpx;
								color: #ffffff;
							}
						}
					}

					.mainFix:last-child {
						border: none
					}

				}
			}
		}
	}

	.pop-content {
		color: #000000;
		width: 600rpx;
		position: relative;
		margin-top: 140rpx;

		.tanbg {
			width: 600rpx;
			height: 712rpx;
			display: block;
		}

		.rule_Tips {
			position: absolute;
			top: 0;
			left: 0;

			.rulees {
				font-weight: bold;
				font-size: 58rpx;
				letter-spacing: -1rpx;
				color: #0c5560;
				text-align: center;
				margin: 56rpx 0 39rpx;
			}

			.ruleList {
				padding: 0 40rpx;

				.rules {
					font-size: 30rpx;
					line-height: 48rpx;
					color: #666666;
				}

			}

		}

		.knows {
			position: absolute;
			bottom: 16%;
			left: 15%;

			.knowImg {
				width: 415rpx;
				height: 86rpx;
				display: flex;
				margin: 0 auto;
			}

		}

		.cancel {
			.cancelPic {
				width: 58rpx;
				height: 58rpx;
				display: block;
				margin: 30rpx auto 0;
			}
		}
	}

	// 兑换成功
	.exchange-success {
		width: 677rpx;
		height: 884rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/exchange-success-popup-bg.png);
		background-size: 100% 100%;
		border-radius: 20rpx;

		&__hd {
			font-size: 50rpx;
			color: #333333;
			text-align: center;
			padding-top: 370rpx;
		}

		&__bd {
			margin-top: 20rpx;
			text-align: center;

			image {
				width: 83rpx;
				height: 64rpx;
				vertical-align: middle;
				margin-top: 10rpx;
			}

			text {
				font-size: 80rpx;
				font-weight: bold;
				vertical-align: middle;
				color: #ff9000;
			}
		}

		&__ft {
			margin-top: 20rpx;
			font-size: 35rpx;
			color: #888888;
			text-align: center;

			view {
				margin-bottom: 21rpx;
			}
		}

		&__button {
			margin: 30rpx auto;
			width: 450rpx;
			height: 100rpx;
			line-height: 100rpx;
			background-image: linear-gradient(90deg,
				#fdad00 0%,
				#fc8200 100%),
				linear-gradient(#46991c,
				#46991c);
			background-blend-mode: normal,
				normal;
			border-radius: 50rpx;
			font-size: 42rpx;
			font-weight: 500;
			color: #ffffff;
			text-align: center;
		}
	}

	// 领取成功
	.complete {
		width: 610rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		position: relative;
		padding-bottom: 58rpx;

		&__hd {
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/complete_bg.png);
			background-size: 343rpx 234rpx;
			background-repeat: no-repeat;
			background-position: top;

			font-size: 44rpx;
			color: #333333;
			text-align: center;
			padding: 245rpx 0 0;
			position: relative;
			top: -112rpx;
		}

		&__bd {
			margin-top: -42rpx;
			margin-bottom: 79rpx;
			text-align: center;

			image {
				width: 83rpx;
				height: 64rpx;
				vertical-align: middle;
				margin-right: 10rpx;
			}

			text {
				font-size: 90rpx;
				font-weight: bold;
				color: #ff9102;
				vertical-align: middle;
			}
		}

		&__ft {
			text-align: center;
			font-size: 30rpx;
			color: #8c8c8c;
			margin-bottom: 43rpx;
		}

		&__button {
			width: 500rpx;
			height: 96rpx;
			line-height: 96rpx;
			background-image: linear-gradient(90deg,
				#fb9400 0%,
				#ff4f02 100%),
				linear-gradient(#111111,
				#111111);
			background-blend-mode: normal,
				normal;
			border-radius: 48rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #ffffff;
			margin: 0 auto;
		}

		&__close {
			margin: 42rpx 0 0;
			text-align: center;

			image {
				width: 66rpx;
				height: 66rpx;
			}
		}
	}


	.task {
		background-color: #ffffff;
		border-radius: 16rpx;
		margin: 0 31rpx 21rpx;

		&__header {
			// height: 110rpx;
			// background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/task_bg.png) 0 0 / 100% no-repeat;
			font-size: 33rpx;
			font-weight: 600;
			line-height: 1;
			padding: 36rpx 32rpx 16rpx;
			color: #000000;
		}

		&__body {
			padding: 0 31rpx;
		}

		&__list {
			&__item {
				border-bottom: 1px solid #f5f5f5;
				padding: 35rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item__left {
					&__header {
						display: flex;
						align-items: center;

						&__title {
							font-size: 30rpx;
							color: #333333;
							max-width: 300rpx;
							font-weight: 600;
							white-space: nowrap;
							margin-right: 12rpx;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						&__image {
							width: 35rpx;
							height: 27rpx;
							margin-right: 5rpx;
						}

						&__integral {
							font-size: 26rpx;
							color: #ff7800;
						}
					}

					&__body {
						margin-top: 21rpx;
						font-size: 26rpx;
						color: #808080;
						max-width: 400rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						vertical-align: middle;
					}
				}

				.item__right {
					&__button {
						width: 176rpx;
						height: 62rpx;
						background-image: linear-gradient(90deg,
							#ffc02a 0%,
							#ff9102 100%),
							linear-gradient(#df8d37,
							#df8d37);
						background-blend-mode: normal,
							normal;
						border-radius: 31rpx;

						text-align: center;
						font-size: 28rpx;
						line-height: 62rpx;
						letter-spacing: 1rpx;
						color: #ffffff;
					}

					&__button--complete {
						background-image: none;
						background-color: #b2b2b2;
					}
				}
			}
		}
	}
</style>
