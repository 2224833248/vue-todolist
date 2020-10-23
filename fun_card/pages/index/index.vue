<template>
	<view class="tbody">
		<view class="top_bc_box">
			<!-- <view class="bigger_box"> -->
			<view :class="'bigger_box '+ (could == true ? 'bigger_box_after '+(disable == true ? 'dis' : '') : '')">
				<!-- <image class="bigger_box_img" src="../../static/index/new/nv1.jpg" mode="aspectFit"></image> -->
				<view class="small_box">
					
				</view>
			</view>
			<image class="bigger_box_img" src="../../static/index/new/nv1.jpg" mode="aspectFit"></image>
			<view :class="'top_bubbles ' + item.position" v-for="(item,index) in top_prices" :key="index">
				<view class="show_price_num">
					<view class="price_name">
						集分宝
					</view>
					<view class="num">
						+{{item.num}}
					</view>
				</view>
				<view class="box_text">
					今日大奖
				</view>
			</view>
			<!-- <form class="header_bubble" @submit="onSubmit" :report-submit="true">
				<view class="bubbleBox" v-for="(item,index) in taskBubble" :key="index" @click="onTaskTap(item)">
					<view class="bubble">
						<image :src="item.image_bubble" mode="widthFix"></image>
						<text class="title">{{item.bubble_title}}</text>
					</view>
				</view>
			</form> -->
		</view>
		<view class="aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/fuli.png?v1" mode="widthFix"></image>
				<view class="aliad_head_r">
					<image src="/static/index/jfb.png" mode="widthFix"></image>
					<view>点击浏览广告,可随机获得<text>1~9集分宝</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>
		<view class="bottom_content">
			<!-- <view class="top_ads_box">
				<view class="top_text">
					<image class="top_text_img" src="../../static/index/new/top_ads_text.png" mode="aspectFit"></image>
					<view class="right_text">
						<image class="right_text_icon" src="../../static/index/new/ads_right_icon.png" mode="aspectFit"></image>   
						<view class="text_content">
							浏览广告，可随机获得
							<text class="num_text">
                                1-9
                            </text>
							集分宝
						</view>
					</view>
				</view>
				<image class="top_ads_img" src="../../static/index/new/ads_img2x.png" mode="widthFix"></image>
			</view> -->
			
			<view class="task_title_box">
				<image class="task_title_img" src="../../static/index/new/task_img.png" mode="aspectFit"></image>
			</view>
			<view class="task_list_box">
				<view class="list_item" v-for="(item,index) in taskarr" :key="index">
					<view class="item_top">
						<view class="top_left">
							<image class="item_img" :src="item.img" mode="aspectFit"></image>
							<view class="left_text">
								<view class="item_title">
									{{item.title}}
								</view>
								<view class="item_info">
									{{item.info}}
								</view>
							</view>
						</view>
						<view class="top_right">
							去完成
						</view>
					</view>
					<view class="item_bottom">
						<view class="bot_left">
							{{item.text}}
						</view>
						<view class="bot_right">
							{{item.redtext}}
						</view>
					</view>
					<image src="../../static/index/new/finish_icon.png" class="finish_img" v-if="item.isfinish == true" mode="aspectFit">
						
					</image>
				</view>
			</view>
			<view class="recommend_title_box">
				<image class="recommend_title_img" src="../../static/index/new/recommend_img.png" mode="aspectFit"></image>
			</view>
			
			<view class="tabCont">
				<view class="tabCont-item" v-for="(item,index) in recommend" @click="getUrl(item)">
					<image :src="item.pic" mode="widthFix"></image>
					<view class="tabCont-bottom">
						<view class="title">
							{{item.title}}
						</view>
						<view class="price">
							<view class="priceLeft"><text>￥</text>{{item.endprice}}</view>
							<view class="juan">
								<image class="imgJuan" src="../../static/new/juan.png" mode="aspectFill"></image>
								<view class="text">{{item.coupon_money}}元</view>
							</view>
						</view>
						<view class="overPrice">
							<view class="overPrice-left">￥{{item.price}}</view>
							<view class="overPrice-right">已抢{{item.format_volume}}件</view>
						</view>
					</view>
				</view>
			</view>
			<loading v-if="!noData && !load" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
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

	let clickLock = false
	
	export default {
		components: {
			adSwiper,
			load,
			taskList
		},
		data() {
			return {
				could:false,
				disable:false,
				
				isShowAliAd: 1,
				adUnitId: 'ad_tiny_2021001167643261_202009262200004062',
				aliAdTaskId: 229,
				
				loadingMore: false,
				noMoreData: false,
				noData: false,
				load: false,
				
				paging:1,
				
				top_prices:[
					{
						num:30,
						position:'fir',
					},
					{
						num:30,
						position:'sec',
					},
					{
						num:30,
						position:'thr',
					},
					{
						num:30,
						position:'fou',
					},
				],
				taskarr:[
					{
						img:'../../static/index/new/nv1.jpg',
						title:'折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐',
						info:'打开页面点击两个商品打开页面点击两个商品打开页面点击两个商品',
						isfinish:true,
						text:'点击2个商品并浏览10s+1集分宝',
						redtext:'人人有福利',
					},
					{
						img:'../../static/index/new/nv1.jpg',
						title:'折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐',
						info:'打开页面点击两个商品打开页面点击两个商品打开页面点击两个商品',
						isfinish:false,
						text:'点击2个商品并浏览10s+1集分宝',
						redtext:'人人有福利',
					},
					{
						img:'../../static/index/new/nv1.jpg',
						title:'折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐折扣商品推荐',
						info:'打开页面点击两个商品打开页面点击两个商品打开页面点击两个商品',
						isfinish:true,
						text:'点击2个商品并浏览10s+1集分宝',
						redtext:'人人有福利',
					},
				],
				recommend: [],

				
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
				applys: true, //默认
				type: 'card',
				isApply: true, //默认打卡时间

				STATUS_BAR_HEIGTH: 44,
				TITLE_BAR_HEIGTH: 48,
				NAV_HEIGHT: '92px',


				loading: true,
				loadingNum: 0,
				showTips: false,
				NAV_HEIGHT: "0px",

				// 阿里广告
				isShowAliAd: 0,
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
			
			this.getRecommend();
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
		onReachBottom() {
			this.paging++;
			this.getRecommend();
		},
		methods: {
			
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
			// 推荐好货
			getRecommend() {
				// if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'SaveMoneyShop/getGoodRecommendList',
					data: {
						// albumId: this.albumId,
						albumId: 7,
						page:this.paging,
						size:10,
					}
				}).then(res => {
					if (res.data.code == 200) {
						console.log(res);
						if(res.data.data.endPage == true){
							if(res.data.data.list.length != 0){
								this.noMoreData = true;
								res.data.data.list.forEach(item => {
									this.recommend.push(item)
								})
							}else{
								this.noMoreData = true;//没有更多数据
								this.paging -= 1;
							}
						}else{
							res.data.data.list.forEach(item => {
								this.recommend.push(item)
							})
						}
					}
				this.loadingMore = false;
				}).catch(err => {
					this.loadingMore = false;
				})
			},
			// 跳转
			getUrl(e) {
				if(clickLock)return;
				clickLock = true;
				setInterval(()=> {
					clickLock = false
				},3000);
				ajax.get({
					url: 'SaveMoneyShop/getUrl',
					data: {
						iid: e.num_iid,
						gtype: e.goods_type,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(encodeURIComponent(res.data.data.url)))
						});
					}
				}).catch((error) => {})
			},
		
			onSubmit(e) {
				if (this.$refs.task && this.$refs.task.onSubmit) {
					this.$refs.task.onSubmit(e);
				}
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
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task, 'funcardBubble');
				}
			},
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
			},
			taskBubble() {
				let tmp = typeof(this.$store.state.taskList.funcardBubble) == 'undefined' ? [] : this.$store.state.taskList.funcardBubble;
				let ret = [];
				for (let item of tmp) {
					if (!item.isComplete) {
						ret.push(item)
					}
				}
				ret = ret.slice(0, 4);
				//任务展示量统计
				utils.taskShowLog('funcardBubble', ret);
				return ret;
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
	@keyframes myfirst
	{
		0% {
			transform: scale(1);
			background-color: rgba(40,165,254,1);
		}
		25% {
			
		}
		50% {
			
		}
		75% {
			background-color: rgba(40,165,254,0.6);
		}
		100% {
			transform: scale(1.5);
			background-color: rgba(40,165,254,0);
		}
	}
	@keyframes myfirst2
	{
		0% {
			background-color: rgba(74,179,253,1);
		}
		25% {
			
		}
		50% {
			
		}
		75% {
			background-color: rgba(74,179,253,0.6);
		}
		100% {
			background-color: rgba(74,179,253,0);
		}
	}
	
	.top_bc_box{
		width: 100%;
		height: 688rpx;
		background-image: url(../../static/index/new/index_top_bg.png);
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
		z-index: 5;
		.bigger_box{
			position: absolute;
			top: 150rpx;
			left: 50%;
			margin-left: -143.5rpx;
			
			width: 287rpx;
			height: 287rpx;
			background-color: #28A5FE;
			// background-color: #55B7FF;
			border-radius: 50%;
			
			box-sizing: border-box;
			padding: 22rpx;
			
			
			animation: myfirst 3s infinite;
			.small_box{
				width: 243rpx;
				height: 243rpx;
				background-color: #4AB3FD;
				// background-color: #6ABEFC;
				animation: myfirst2 3s infinite;
				
				border-radius: 50%;
			}
		}
		.bigger_box_after{
			transform: scale(2);
		}
		.dis{
			opacity: 0;
		}
		
		.bigger_box_img{
			position: absolute;
			margin-left: -143.5rpx;
			width: 287rpx;
			height: 287rpx;
			border-radius: 50%;
			top: 150rpx;
			left: 50%;
		}
		.bubbleBox {
			position: absolute;
			// left: 50rpx;
			// bottom: 102rpx;
			left: 66rpx;
			bottom: 161rpx;
		
			.bubble {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
		
				image {
					width: 80rpx;
				}
		
				.title {
					margin-top: 18rpx;
					font-size: 20rpx;
				}
			}
		
			.title {
				// padding-top: 10rpx;
				font-size: 20rpx;
				color: #fff;
				text-align: center;
				animation: bubbl 1.5s infinite;
			}
		
			&:nth-of-type(2) {
				// left: 153rpx;
				// bottom: 30rpx;
				left: 229rpx;
				bottom: 79rpx;
			}
		
			&:nth-of-type(3) {
				left: inherit;
				// right: 50rpx;
				// bottom: 102rpx;
				left: 424rpx;
				bottom: 79rpx;
			}
		
			&:nth-of-type(4) {
				left: inherit;
				// right: 153rpx;
				// bottom: 30rpx;
				right: 63rpx;
				bottom: 161rpx;
			}
		}
		.top_bubbles{
			display: inline-block;
			position: absolute;
			.show_price_num{
				width: 96rpx;
				height: 109rpx;
				background-image: url(../../static/index/new/con_bubble.png);
				background-size: 100%;
				background-repeat: no-repeat;
				position: relative;
				.price_name{
					position: absolute;
					font-size: 14rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					top: 31rpx;
					left: 27rpx;
				}
				.num{
					position: absolute;
					font-size: 21rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					top: 51rpx;
					left: 29rpx;
				}
			}
			.box_text{
				text-align: center;
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.fir{
			left: 66rpx;
			bottom: 161rpx;
		}
		.sec{
			left: 229rpx;
			bottom: 79rpx;
		}
		.thr{
			left: 424rpx;
			bottom: 79rpx;
		}
		.fou{
			right: 63rpx;
			bottom: 161rpx;
		}
	}
	
	.bottom_content{
		position: relative;
		padding: 0 20rpx;
		box-sizing: border-box;
		// margin: -65rpx 0 0 0;
		z-index: 10;
		.top_ads_box{
			padding: 10rpx;
			background: #FFFFFF;
			border-radius: 15rpx;
			.top_text{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10rpx
				;
				.top_text_img{
					height: 26rpx;
					width: 223rpx;
				}
				.right_text{
					display: flex;
					align-items: center;
					.right_text_icon{
						width: 25rpx;
						height: 25rpx;
						margin-right: 6rpx;
					}
					.text_content{
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #333333;
						.num_text{
							color: #F70707;
						}
					}
				}
			}
			.top_ads_img{
				width: 100%;
				height: 145rpx;
				border-radius: 6rpx;
				margin-top: 6rpx;
			}
		}
	}
	
	.aliad {
		position: relative;
		z-index: 10;
		width: 690rpx;
		margin: 0 auto;
		margin-top: -65rpx;
		background: #fff;
		border-radius: 14rpx;
	
		.aliad_head {
			display: flex;
			justify-content: space-between;
			box-sizing: border-box;
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
	
	.task_title_box{
		width: 100%;
		text-align: center;
		padding: 30rpx 0;
		.task_title_img{
			display: inline-block;
			margin: 0 auto;
			width: 445rpx;
			height: 28rpx;
		}
	}
	
	.task_list_box{
		.list_item{
			background: #FFFFFF;
			border-radius: 15rpx;
			margin: 0 0 20rpx 0;
			position: relative;
			.item_top{
				padding: 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 2rpx solid #ECECEC;
				.top_left{
					display: flex;
					align-items: center;
					.item_img{
						width: 74rpx;
						height: 74rpx;
						border-radius: 6rpx;
						margin-right: 20rpx;
					}
					.left_text{
						display: flex;
						flex-flow: column;
						justify-content: space-between;
						height: 74rpx;
						padding: 2rpx 0;
						box-sizing: border-box;
						.item_title{
							width: 400rpx;
							font-size: 30rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #333333;
							line-height: 38rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box; //作为弹性伸缩盒子模型显示。
							-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
							-webkit-line-clamp: 1;
						}
						.item_info{
							width: 400rpx;
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #999999;
							line-height: 26rpx;						
							width: 300rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box; //作为弹性伸缩盒子模型显示。
							-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
							-webkit-line-clamp: 1;
						}
					}
				}
				.top_right{
					width: 140rpx;
					background: #46B0FB;
					border-radius: 25rpx;

					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					padding: 14rpx 0;
					box-sizing: border-box;
					text-align: center;
					position: relative;
					z-index: 2;
				}
			}
			.item_bottom{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 15rpx 20rpx;
				box-sizing: border-box;
				.bot_left{
					
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #333333;
				}
				.bot_right{
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #FC0808;
				}
			}
			.finish_img{
				position: absolute;
				width: 106rpx;
				height: 75rpx;
				top: 0;
				right: 0;
			}
		}
		.list_item:last-child{
			margin-bottom: 0;
		}
	}
	
	.recommend_title_box{
		width: 100%;
		text-align: center;
		padding: 30rpx 0;
		.recommend_title_img{
			display: inline-block;
			width: 346rpx;
			height: 28rpx;
		}
	}
	
	.tabCont {
		display: flex;
		flex-wrap: wrap;
	
		&-item {
			width: 346rpx;
			margin: 0 16rpx 16rpx 0;
			border-radius: 12rpx;
			overflow: hidden;
			background: #fff;
	
			&:nth-of-type(2n+0) {
				margin-right: 0;
			}
	
			image {
				width: 346rpx;
				height: 346rpx;
			}
	
			.tabCont-bottom {
				padding: 0 20rpx 24rpx;
	
				.title {
					padding-top: 26rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #333333;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; //作为弹性伸缩盒子模型显示。
					-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
					-webkit-line-clamp: 2;
					text-align: left;
					min-height: 56rpx;
				}
	
				.price {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-top: 22rpx;
	
					.priceLeft {
						font-size: 32rpx;
						color: #F84A23;
	
						text {
							font-size: 24rpx;
						}
					}
	
					.juan {
						width: 133rpx;
						height: 34rpx;
						border-radius: 4rpx;
						display: flex;
						overflow: hidden;
	
						.imgJuan {
							width: 44rpx;
							height: 34rpx!important;
						}
	
						.text {
							flex: 1;
							text-align: center;
							font-size: 20rpx;
							font-weight: 400;
							color: #F84A23;
							line-height: 34rpx;
							border: 2rpx solid #F84A23;
							border-left: none;
							border-radius: 0 4rpx 4rpx 0;
						}
					}
				}
	
				.overPrice {
					padding-top: 16rpx;
					display: flex;
					justify-content: space-between;
	
					&-left {
	
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
						text-decoration: line-through;
					}
	
					&-right {
						font-size: 22rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}
	
		}
	}
</style>
