<template>
	<view class="content">
		<view v-if="nav_show" style=" width:100%;height: 160rpx;position:fixed;top:0;background-color:#FF6C5E;z-index: 99; transition: 1.5s;"></view>
		<view class="header-content">
			<image class="qipao" @click="adClick(adList.signFloatAd[0])" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/qp-hb2x.png" />
			<view class="monny">{{user.jfb*1000/10}}</view>
			<!-- 签到按钮 -->
			<div class="btn" v-if="!signInfo.isSign" @click="goSign">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hb-qd2x.png" />
				<div class="qdxj">{{sign_renwu[0]}}</div>
			</div>
			<div v-else class="renwu" @click="open_popup">{{sign_renwu[1]}}</div>
			<view v-if="signInfo.isSign" class="seven">
				今天您已经签到过了喔!
			</view>
			<view class="sevenchai">
				<view class="day">
					<span class="day_num" :class="signInfo.sign_count==dayList_index+1?'active':''" v-for="(dayList_item,dayList_index) in dayList"
					 :key="dayList_index">{{dayList_item.content}}</span>
				</view>
				<!-- 签到进度条 -->
				<view class="progress">
					<view id="run_progress" ref="run_progress" :style="{'width':(signInfo.sign_count/7*100)+'%'}"></view>
				</view>
				<image class="the_seven" :class="signInfo.sign_count==7?'yaohuang':''" :src="redMonny_status?'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hb-yc2x.png':'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hb-c2x.png'"></image>
				<span v-if="signInfo.sign_count==7" class="seventh">12</span>
			</view>
		</view>
		<view class="main_content">
			<view class="monny_text">拆红包得集分宝</view>
			<view class="btn_tixian" @click="to_tixian">支付宝快速提现</view>
			<!-- 
			  当日红包 默认是待拆开状态 图片 "https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/红包@2x.png" 
			  红包拆开后  图片"https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/红包-已拆@2x.png"   
			  其余是没拆状态 图片 "https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/红包-锁@2x.png"
			  -->
			<!-- 天天拆红包 -->
			<view class="week_chai">
				<view class="every_day" :class="item.isSign ? 'yichai' : 'weichai'" v-for="(item,index) in signInfo.sign_log" :key="index">
					<p :class="item.isToday?'isToday':''">{{item.week}}</p>
					<!-- @click.once="chb(item)" -->
					<image :src="item.isSign?'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hb-yc2x.png':'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hb-s2x.png'">
						<span v-if="item.isSign" class='redMonny'>{{item.jfb}}</span>
					</image>
				</view>
			</view>
			<!-- 本周累计收益 -->
			<!-- <view class="week_shouyi">本周累计收益：{{signInfo.jfb}} 集分宝</view> -->
			<!-- 提现 -->
			<view class="ti_xian" @click="to_tixian">提现</view>
			<!-- <view class="detail">
				<p>每周开出集分宝累计超过50，周日可提现</p>
			</view>-->
			<!-- 好物推荐 -->
		</view>
		<view class="footer_content">
			<view class="hwtj">
				<view class="goods" v-for="(item,indexs) in similar" :key='indexs' @click="datails(item)">
					<view class="image">
						<image lazy-load="true" :src="item.pic" mode="aspectFit"></image>
					</view>
					<view class="title">
						{{item.title}}
					</view>
					<view class="desc">
						<span class="price">到手价￥<span class="monny">{{item.endprice}}</span></span>
						<span class="sale-num">
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/h.png" /> 热卖 <i>{{item.format_volume}}</i>
							件</span>
					</view>
					<view class="listIcon">
						<view class="listIconL" v-if="item.coupon_money>0">
							<text class="juan">券</text>
							<text>{{item.coupon_money}}元</text>
						</view>
						<view class="listIconR">
							<text>返{{user.is_team==1?Number(item.up_money_fraction):Number(item.user_money_fraction)}}集分宝</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 任务弹窗 -->
		<uni-popup ref="popup" type="bottom" :maskClick='false'>
			<view class="tanchu_renwu">
				<p>做任务赚集分宝<span>每天0点更新</span>
					<image @click="close_popup" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/gb-tc2x.png" />
				</p>
				<view class="uni-list">
					<view class="uni-list-item" :class="{ isCompleted: task_list_item.isComplete }" v-for="task_list_item in taskList"
					 :key="task_list_item.id">
						<view class="img">
							<image :src="task_list_item.image" />
						</view>
						<view class="renwu_title">
							<view class="p1">
								{{task_list_item.title}}
								<template v-if="task_list_item.reward_type=='1'">
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/task/gold.png" mode="aspectFill"></image>
									<span>+{{task_list_item.integral}}</span>
								</template>
								<template v-if="task_list_item.reward_type=='2'">
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/task/gold.png" mode="aspectFill"></image>
									<span>+{{task_list_item.step}}</span>
								</template>
								<template v-if="task_list_item.reward_type=='3'">
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/task/redbag.png" mode="aspectFill"></image>
									<span>+{{task_list_item.money}}元</span>
								</template>
								<template v-if="task_list_item.reward_type=='4'">
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/task/jfb.png" mode="aspectFill"></image>
									<span>+{{task_list_item.jfb}}集分宝</span>
								</template>
							</view>
							<view class="p2">{{task_list_item.subtitle}}</view>
						</view>
						<view class="iscomplete_btn" @click.prevent="onTaskTap(task_list_item)">
							{{task_list_item.isComplete?'已完成':`${task_list_item.button_text}`}}
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 签到弹窗 -->
		<uni-popup class="popups" ref="sign_popup" type="center" :maskClick='false'>
			<view class="popups">
				<view class="taskpopupscompletes">
					<!-- <view class="taskpopupscompletes__hd" v-if="task.reward_type == 1">恭喜获得金币</view> -->
					<!-- <view class="taskpopupscompletes__hd" v-if="task.reward_type == 2">恭喜获得步数</view> -->
					<view class="taskpopupscompletes__hd">签到成功，恭喜获得</view>
					<view class="taskpopupscompletes__bd">
						<template>
							<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/jfb.png" mode="aspectFill"></image> -->
							<text>+{{sign.data}}集分宝</text>
						</template>
					</view>
					<view class="taskpopupscompletes__ft">
						<view>我们还为您准备了以下福利：</view>
					</view>
					<view class="taskpopupscompletes__ad" @click="adClick(popupAd)">
						<image :src="popupAd.image" mode="aspectFill" v-if="!isGoods" class="adimage"></image>
						<view class="adgoods" v-else>
							<image :src="popupAd.image" mode="aspectFill"></image>
							<view class="title-box">
								<view class="title">{{popupAd.title}}</view>
								<view class="tips">{{popupAd.subtitle}}</view>
							</view>
						</view>
					</view>
					<view class="taskpopupscompletes__button" @click="adClick(popupAd)">立即领取</view>
				</view>
			</view>
			<view class="taskpopupscompletes__close">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/cancel.png" @click="completeClose"></image>
			</view>
		</uni-popup>

		<complete-task v-if="isinit" :info="task"></complete-task>


		<!-- 授权 -->
		<view class="hide" v-show="publisher.show">
			<view class="authorization">
				<view class="tops">
					<image :src="publisher.hideSrc" mode="aspectFill"></image>
				</view>
				<view class="bottoms">
					<view class="title">{{publisher.msg}}</view>
					<text>{{publisher.text}}</text>
					<view class="btn" @click="btnFn">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	import completeTask from '@/components/complete-task/complete-task.vue'

	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import store from '@/store.js'

	export default {
		data() {
			return {
				option: {}, //参数
				//授权弹窗配置
				publisher: {
					show: false,
					msg: '进入小程序查看更多优惠吧！',
					text: '使用购物商城享受更多收益',
					hideSrc: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/succeed.png'
				},

				isFilter: false,
				tag: 'tnpsign',
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
				whitelist: {},

				isGoods: false,
				popupAd: {},


				//签到是否成功   code:200 成功 ->signInfo.isSign:true signInfo.sign_count + 1   signInfo.jfb+12
				//code:-1 失败 -> 提示用户该日已经签到过了  -> btn按钮显示  做任务赚集分宝
				sign: [],
				signInfo: [], //签到总信息
				sign_renwu: ["签到领现金", "做任务赚现金"], //签到按钮与任务按钮内容值
				runProgressWidth: [], // 进度条宽度
				redMonny_status: 0, //0，表示待拆开   1，表示已经拆开

				similar: [],
				nav_show: false,

				dayList: [{
						content: '第1天'
					},
					{
						content: '第2天'
					},
					{
						content: '第3天'
					},
					{
						content: '第4天'
					},
					{
						content: '第5天'
					},
					{
						content: '第6天'
					}
				],
			}
		},
		components: {
			completeTask,
			uniPopup
		},

		onShow() {
			this.completeTask()
		},
		mounted() {
			this.getSignInfo();
			this.similarity();
			this.popUpFn();

			this.isinit = true

			let ee = this.$scope.__e
			this.$scope.__e = (e, b) => {
				if (!e || typeof(e.type) == 'undefined') {
					if (e.success == false) {
						this.showbcGroup = false
					} else {
						this.showbcGroup = false
						this.completeTask();
					}
				} else {
					ee.call(this.$scope, e)
				}
			}
		},
		methods: {

			// 判断弹框是否显示
			popUpFn() {
				if (typeof(this.option.code) !== 'undefined') {
					ajax.login2();
					if (this.option.code == 1) {
						this.publisher.show = true
					} else if (this.option.code == 2) {
						this.publisher.show = true
						this.publisher.msg = this.option.msg
						this.publisher.text = '授权失败将无法获得收益'
						this.publisher.hideSrc = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/fail.png'
					}
				} else {
					this.publisher.show = false
				}
			},

			// 弹窗点击
			btnFn() {
				this.publisher.show = false
			},

			getRunProgress() {
				uni.createSelectorQuery().in(this).select('#run_progress').boundingClientRect(result => {
					if (result) {
						this.runProgressWidth = result.offsetWidth
					} else {
						this.getRunProgress()
					}
				}).exec()
			},
			// 点击签到
			goSign() {
				if (this.user.relation_id == '') {
					let state = this.user.uid + ":sign";
					utils.setRelationId(state);
				} else {
					this.getSign()
					//第七天签到拆红包动画效果   切换图片src   显示红包金额
					if (this.signInfo.sign_count == 7) {
						setTimeout(() => {
							this.redMonny_status = 1
						}, 3800)
					}
				}
			},
			//关闭签到弹窗
			completeClose() {
				try {
					this.$refs.sign_popup.close()
				} catch (e) {

				}
			},
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad);
			},


			// // 获取签到集分宝信息
			getSignInfo() {
				ajax.get({
					url: 'signMoney/info',
					data: {}
				}).then((res) => {
					if (res.data.code == 200) {
						this.signInfo = res.data.data
					}
				}).catch((error) => {
					请求失败
				})

			},
			// 获取用户签到信息
			getSign() {

				ajax.post({
					url: 'signMoney/signIn'
				}).then((res) => {
					if (res.data.code == 200) {
						utils.upUserInfo()
						this.getSignInfo()
						this.sign = res.data

						ajax.get({
							url: 'Ad/record',
							data: {
								slot_id: 33
							},
							login: true,
							loading: true,
						}).then((res) => {
							if (res.data.code == 200) {
								if (res.data.data.isGoods == 1) {
									this.isGoods = true;
								} else {
									this.isGoods = false;
								}
								this.popupAd = res.data.data;
							}
						}).catch((error) => {})

						this.$refs.sign_popup.open()
					}
				}).catch((error) => {})

			},
			// 监听页面滚动事件
			onPageScroll: function(e) {
				if (e.scrollTop >= 100) {
					this.nav_show = true
				} else {
					this.nav_show = false
				}
			},
			// 跳转至提现页面
			to_tixian() {
				uni.navigateTo({
					url: "/pages/carryCash/carryCash",
				})
			},

			// 天天拆红包  红包点击事件
			// chb(item) {
			// 	// 点击判断 是否是当日(isToday:1 为当日   红包待拆状态 否则不可拆)  点击拆开之后 切换图片src    集分宝总数:signInfo.jfb+=item.jfb
			// 	if(item.isToday==1){
			// 		this.is_chai=true
			// 		console.log(this.signInfo)
			// 		this.signInfo.jfb=Number(this.signInfo.jfb)+Number(item.jfb)
			// 		if(item.isSign==1){
			// 			item.jfb=Number(item.jfb)+12
			// 		}else{
			// 			this.week_jfb_all=Number(this.week_jfb_all)+Number(item.jfb)
			// 		}
			// 	}
			// },

			// 打开任务弹窗
			open_popup() {
				this.$refs.popup.open()
			},
			// 关闭任务弹窗
			close_popup() {
				this.$refs.popup.close()
			},

			// 相似推荐
			similarity() {
				ajax.get({
					url: 'Goods/getList',
					data: {}
				}).then(res => {
					if (res.data.code == 200) {
						this.similar = res.data.data.list
					}
				}).catch(err => {})
			},
			// 点击跳转详情页面
			datails(item) {
				this.dataLid = item.num_iid
				this.dataType = item.goods_type
				uni.navigateTo({
					url: '../listDatails/listDatails?iid=' + item.num_iid + '&type=' + item.goods_type
				})
			},

			loadData() {
				utils.upTaskInfo();
			},
			// 点击任务
			onTaskTap(task, tag = '') {
				// 任务完成时,点击失效
				if (task.isComplete == true) {
					return;
				}
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
					if(task.url==''){
						bk&&bk();
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
				} else if (task.type == 8) { //系统桌面打开小程序
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
						path: 'pages/index/index?originAppId=2021001168613324&newUserTemplate=KP20200911000002699738'
					});
				} else if (task.type == 11) { // 邀请好友
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
			completeTask(isLife = false) {
				if (this.activeTask && !this.activeTask.isComplete) {
					//关注任务不能通过onShow时间触发完成
					if (this.activeTask.type == 4 && isLife) {
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
			postTask(isLife, isNoSet = false) {
				let isEmpty = this.activeTask.integral == 0 && this.activeTask.step == 0 && this.activeTask.jfb == 0 && this.activeTask
					.money == 0;
				if (((new Date() - this.activeDate) / 1000 < 10) && !isLife && !isEmpty && !isNoSet) {
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
							is_no_set: isNoSet
						},
						login: true,
					}).then((res) => {
						if (res.data.code == 200 && res.data.data == 1) {
							if (!isNoSet) {
								this.task.isComplete = true;
								utils.editTask(this.task);
							}
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
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '淘牛品',
					desc: '淘牛品',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/08/14/bf170c3bae606409a8ffee5b9f0cc692.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '淘牛品',
					desc: '淘牛品',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/08/14/bf170c3bae606409a8ffee5b9f0cc692.jpg',
					path: '/pages/index/index',
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
			adList() {
				let tmp = this.$store.state.adList;
				if(tmp.signFloatAd && tmp.signFloatAd.length>0){
					utils.addAdShowLog(tmp.signFloatAd[0]);
				}
				return tmp;
			},
			taskList() {
				let tmp = [];
				if (this.tag == '@all') {
					let allList = {};
					for (let item of this.$store.state.taskList) {
						if (item.key.indexOf('ubble') !== -1) {
							continue;
						}
						for (let item1 of item.value) {
							allList[item1.id] = item1;
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
				if (this.tag != '@all') {
					if (tmp.length > this.size) {
						tmp = tmp.slice(0, this.size)
					}
				}
				//任务展示量统计
				utils.taskShowLog(this.tag, tmp);
				return tmp;
			}
		},
		onLoad(option) {

			this.option = option;
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		//font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0rpx;
		background-color: #F2F2F2;
		overflow-x: hidden;

		.header-content {
			height: 625rpx;
			width: 750rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/bg2x.png);
			background-size: 100% 100%;
			position: relative;
			z-index: 1;

			.qipao {
				width: 96rpx;
				height: 101rpx;
				margin-top: 180rpx;
				margin-left: 39rpx;
			}

			.monny {
				position: absolute;
				left: 300rpx;
				top: 185rpx;
				display: inline-block;
				font-size: 75rpx;
				width: 151rpx;
				height: 101rpx;
				text-align: center;
				line-height: 101rpx;
				color: #ffffff;
				margin-left: 3rpx;
			}

			.btn {
				width: 570rpx;
				height: 96rpx;
				margin-left: 89rpx;
				background-image: linear-gradient(0deg, #ffc341 0%, #fff2b4 100%), linear-gradient(#000000, #000000);
				background-blend-mode: normal, normal;
				border-radius: 48rpx;

				image {
					float: left;
					width: 62rpx;
					height: 53rpx;
					margin-top: 25rpx;
					margin-right: 10rpx;
					margin-left: 157rpx;
				}

				.qdxj {
					float: left;
					display: inline-block;
					height: 96rpx;
					line-height: 96rpx;
					font-size: 36rpx;
					font-weight: 650;
					color: #962e00;
				}
			}

			.renwu {
				width: 570rpx;
				height: 96rpx;
				margin: 0 auto;
				border-radius: 48rpx;
				background-image: linear-gradient(0deg, #ffc341 0%, #fff2b4 100%), linear-gradient(#000000, #000000);
				text-align: center;
				height: 96rpx;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #962e00;
				font-weight: 700;
			}


			.seven {
				font-size: 24rpx;
				color: #ffffff;
				margin-top: 23rpx;
				margin-left: 260rpx;
			}

			.sevenchai {
				width: 710rpx;
				height: 140rpx;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 16rpx;
				// background-color: #fff5a2;
				// opacity: 0.25;
				background-color: rgba(255, 245, 162, 0.25);
				margin-top: 23rpx;
				margin-left: 20rpx;

				.day {
					height: 26rpx;
					width: 596rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;
					margin-right: 80rpx;

					.day_num {
						width: 90rpx;
						height: 40rpx;
						line-height: 45rpx;
						padding-bottom: 7rpx;
						text-align: center;
						font-weight: normal;
						font-stretch: normal;
						font-size: 24rpx;
						color: #FFFFFF;

						&.active {
							background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/jt2x.png);
							background-size: 100% 100%;
							background-blend-mode: normal, normal;
							border-radius: 17rpx;
							color: #f01c00;
						}
					}
				}

				.progress {
					width: 668rpx;
					height: 26rpx;
					background-color: #e40100;
					border-radius: 13rpx;
					margin-top: 19rpx;
					background: #e40100;
					position: relative;

					#run_progress {
						position: absolute;
						left: 0;
						top: 0;
						height: 26rpx;
						background-image: linear-gradient(0deg, #ffc341 0%, #fff2b4 100%), linear-gradient(#cd1915, #cd1915);
						background-blend-mode: normal, normal;
						border-radius: 13rpx;
						transition: 2s;
					}
				}

				.the_seven {
					position: absolute;
					right: 19rpx;
					top: 23rpx;
					width: 68rpx;
					height: 83rpx;

					&.yaohuang {
						animation: zy 2.5s .15s linear 2;

						@keyframes zy {
							10% {
								transform: rotate(15deg);
							}

							20% {
								transform: rotate(-10deg);
							}

							30% {
								transform: rotate(5deg);
							}

							40% {
								transform: rotate(-5deg);
							}

							50%,
							100% {
								transform: rotate(0deg);
							}
						}
					}
				}

				.seventh {
					position: absolute;
					display: block;
					left: 646rpx;
					top: 38rpx;
					font-size: 22rpx;
					color: #f04023;
				}
			}
		}

		.main_content {
			// display: flex;
			// flex-direction: column;
			// // justify-content: flex-start;
			// align-items: center;
			height: 460rpx;
			width: 100%;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/bg-chbdxj2x.png);
			background-size: 100%;
			margin-top: -21rpx;
			//overflow: hidden;
			//box-sizing: border-box;
			position: relative;

			.monny_text {
				width: 100%;
				height: 34rpx;
				font-weight: normal;
				font-size: 35rpx;
				letter-spacing: -1rpx;
				color: #960000;
				margin-top: 54rpx;
				margin-left: 38rpx;
			}

			.btn_tixian {
				width: 200rpx;
				height: 38rpx;
				line-height: 38rpx;
				text-align: center;
				border-radius: 19rpx;
				border: solid 1rpx #78400f;
				font-size: 23rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #78400f;
				margin-top: 14rpx;
				margin-left: 40rpx;
				//box-sizing: border-box;
				padding-top: 1.5rpx;
			}

			.week_chai {
				display: flex;
				justify-content: space-around;
				align-items: center;
				width: 710rpx;
				height: 200rpx;
				margin: 26rpx auto;
				background-color: #ffffff;
				border-radius: 16rpx 16rpx 0rpx 0rpx;

				.every_day {
					display: flex;
					height: 200rpx;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					position: relative;

					p {
						height: 20rpx;
						line-height: 20rpx;
						text-align: center;
						font-size: 22rpx;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 0rpx;
						color: #333333;
						margin-top: 24rpx;

						&.isToday {
							color: #b90400;
						}
					}

					image {
						margin-bottom: 23rpx;
					}

					&.yichai image {
						width: 86rpx;
						height: 91rpx;
					}

					&.chai image {
						width: 86rpx;
						height: 109rpx;
					}

					&.weichai image {
						width: 77rpx;
						height: 98rpx;
						opacity: 0.5;
					}

					.redMonny {
						position: absolute;
						display: block;
						width: 25rpx;
						height: 25rpx;
						line-height: 25rpx;
						text-align: center;
						left: 29.8rpx;
						top: 100rpx;
						z-index: 88;
						font-size: 22rpx;
						color: #f04023;
					}
				}
			}

			.ti_xian {
				width: 96rpx;
				height: 38rpx;
				background-color: #ff5146;
				border-radius: 19rpx;
				font-size: 23rpx;
				line-height: 38rpx;
				text-align: center;
				color: #ffffff;
				position: absolute;
				top: 382rpx;
				left: 50%;
				margin-left: -48rpx;
				padding-top: 3rpx;
				//margin: 0 auto;
			}

			.detail {
				height: 22rpx;
				line-height: 22rpx;
				text-align: center;
				font-size: 22rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #333333;
				margin-top: 25rpx;

				p {
					margin-top: 35rpx;
				}
			}
		}

		/** 好物推荐 */
		.footer_content {
			width: 715rpx;
			margin: 0 auto;
			background: #F2F2F2 url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/hwtj2x.png) no-repeat center 27rpx;
			background-size: 200rpx 25rpx;

			.hwtj {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-top: 85rpx;

				.goods {
					width: 48%;
					display: flex;
					flex-direction: column;
					font-weight: normal;
					font-stretch: normal;
					border-radius: 16rpx;
					background-color: #F0F0F0;
					margin-bottom: 20rpx;
					background-color: #FFFFFF;

					.image {
						border-radius: 16rpx;

						image {
							display: block;
							width: 343rpx;
							height: 343rpx;
							border-radius: 16rpx 16rpx 0 0;
						}
					}

					.title {
						padding: 6px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						font-size: 24rpx;
						margin-top: 5rpx;
					}

					.desc {
						display: flex;
						width: 100%;
						justify-content: space-between;
						padding: 14rpx;
						display: inline-block;
						margin-top: -5rpx;
						box-sizing: border-box;

						.price {
							color: #f00;
							font-size: 20rpx;

							.monny {
								font-size: 34rpx;
							}
						}

						.sale-num {
							display: inline-block;
							color: #888888;
							font-size: 20rpx;
							float: right;
							margin-top: 14rpx;

							image {
								width: 16rpx;
								height: 18rpx;
								margin-right: 5rpx;
							}

							i {
								font-style: normal;
								color: #ff4844;
								display: inline;
							}
						}
					}

					.listIcon {
						width: 100%;
						display: flex;
						justify-content: space-around;
						margin-bottom: 10rpx;

						.listIconL {
							width: 140rpx;
							height: 40rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							line-height: 40rpx;
							display: flex;

							text {
								color: #ff4844;
								font-size: 22rpx;
								flex: 1;
								text-align: center;
								display: block;
							}

							.juan {
								width: 40rpx;
								line-height: 40rpx;
								color: #fff;
								flex: none;
							}
						}

						.listIconR {
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 10rpx;
							line-height: 40rpx;

							text {
								color: #ff3a00;
								font-size: 22rpx;
							}
						}
					}
				}
			}
		}
	}

	.tanchu_renwu {
		width: 100%;
		max-height: 1022rpx;
		display: flex;
		flex-direction: column;
		padding: 0 20rpx 19rpx 20rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		font-weight: normal;
		font-stretch: normal;

		p {
			height: 89rpx;
			line-height: 89rpx;
			font-size: 30rpx;
			color: #000000;
			position: relative;
			border-bottom: 1rpx solid #f5f5f5;

			span {
				font-size: 22rpx;
				line-height: 11rpx;
				letter-spacing: -1rpx;
				color: #888888;
				margin-left: 12rpx;
			}

			image {
				width: 35rpx;
				height: 35rpx;
				position: absolute;
				right: 0;
				top: 21rpx;
			}

		}

		.uni-list {
			width: 100%;
			flex: 1;
			overflow-y: auto;

			&::-webkit-scrollbar {
				display: none;
			}

			.uni-list-item {
				height: 130rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1rpx solid #f5f5f5;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;

				.img {
					width: 74rpx;
					height: 74rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.renwu_title {
					display: flex;
					width: 360rpx;
					height: 130rpx;
					padding-top: 15rpx;
					padding-bottom: 15rpx;
					margin-right: 100rpx;
					box-sizing: border-box;
					flex-direction: column;
					justify-content: space-around;

					.p1 {
						height: 27rpx;
						line-height: 27rpx;
						font-size: 27rpx;
						color: #333333;

						image {
							width: 31rpx;
							height: 24rpx;
							line-height: 24rpx;
							margin: 0 0 0 9rpx;
						}

						span {
							display: inline-block;
							font-size: 24rpx;
							color: #ff3e3e;
							margin-left: 5rpx;
						}
					}

					.p2 {
						font-size: 22rpx;
						color: #888888;
					}
				}

				.iscomplete_btn {
					width: 148rpx;
					height: 56rpx;
					line-height: 56rpx;
					text-align: center;
					font-size: 26rpx;
					letter-spacing: 1rpx;
					color: #ffffff;
					background-image: linear-gradient(90deg, #ff7a68 0%, #ff5c53 37%, #ff3d3d 100%),
						linear-gradient(#000000, #000000);
					background-blend-mode: normal, normal;
					border-radius: 28rpx;
				}

			}

			.isCompleted {
				background: #f5f5f5 url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/sign/ywckb2x.png) no-repeat 442rpx -34rpx;
				background-size: 114rpx;
				border-radius: 12rpx;
				opacity: 0.5;
			}
		}
	}

	// 签到成功广告弹窗
	.taskpopupscompletes {
		width: 663rpx;
		height: 740rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/11/10/be7da22c649ea684291c9e468d9bfa7e.png);
		background-size: 663rpx 740rpx;
		background-repeat: no-repeat;
		background-position: top;
		margin-top: 100rpx;
		padding-left: 30rpx;

		&__hd {
			width: 663rpx;
			height: 30rpx;
			font-size: 30rpx;
			color: #333333;
			padding-top: 100rpx;
			text-align: center;
		}

		&__bd {
			margin: 50rpx 0 110rpx 0;
			text-align: center;

			image {
				width: 78rpx;
				height: 62rpx;
				vertical-align: middle;
			}

			text {
				font-size: 44rpx;
				color: #FF2023;
				vertical-align: middle;
				font-weight: 600;
				margin-left: 18rpx;
			}
		}

		&__ft {
			text-align: center;
			font-size: 29rpx;
			letter-spacing: 1rpx;
			margin-bottom: 35rpx;
			color: #ffffff;
		}

		&__ad {
			width: 510rpx;
			height: 160rpx;
			border-radius: 10rpx;
			margin: 0 auto;
			margin-bottom: 36rpx;

			.adimage {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}

			.adgoods {
				width: 510rpx;
				height: 160rpx;
				border-radius: 10rpx;
				background-color: #fbebd2;

				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 120rpx;
				}


				.title-box {
					width: 324rpx;
					margin-left: 26rpx;

					font-family: PingFang-SC-Medium;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 0rpx;
					text-align: left;

					.title {
						height: 32rpx;
						font-size: 28rpx;
						color: #652d0e;
						text-align: left;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.tips {
						height: 26rpx;
						font-size: 24rpx;
						color: #fe4c4b;
						margin-top: 18rpx;
					}
				}
			}



		}

		&__button {
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			background-image: linear-gradient(0deg,
				rgba(243, 210, 80, 1) 0%,
				#fbea93 100%),
				linear-gradient(#ee7a34,
				#ee7a34);
			background-blend-mode: normal,
				normal;
			border-radius: 40rpx;

			text-align: center;
			font-size: 34rpx;
			font-weight: normal;
			font-stretch: normal;
			letter-spacing: 1rpx;
			color: #df1f1e;
			margin: 0 auto;
			font-weight: 600;
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

	// 授权弹窗
	.hide {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 99999;

		.authorization {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%) translateY(-50%);
			width: 591rpx;
			height: 738rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			text-align: center;

			.tops {
				width: 100%;
				height: 420rpx;
				box-sizing: border-box;
				padding-top: 50rpx;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/bg.png)no-repeat;
				background-size: 100% 100%;
				text-align: center;

				image {
					width: 200rpx;
					height: 200rpx;
				}
			}

			.bottoms {
				padding-bottom: 40rpx;

				.title {
					padding: 0 45rpx;
					font-size: 32rpx;
					font-weight: 500;
					color: #343434;
					margin-bottom: 45rpx;
					font-weight: 600;
					;
				}

				text {
					font-size: 29rpx;
					color: #9A9A9A;
				}

				.btn {
					margin: 0 auto;
					margin-top: 67rpx;
					width: 412rpx;
					height: 74rpx;
					background: #FF4E4A;
					border-radius: 37rpx;
					text-align: center;
					line-height: 74rpx;
					font-size: 29rpx;
					color: #fff;
				}
			}
		}
	}
</style>
