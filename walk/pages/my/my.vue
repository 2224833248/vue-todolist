<template>
	<view class="page">

		<view class="header">
			<view class="haederCont" :style="{'margin-top':NAV_HEIGHT}">
				<view class="header__avatar">
					<image :src="user.headimg" mode="aspectFill"></image>
				</view>
				<view class="rightBox">
					<view class="butss" v-if="!isLogin" @click="login">登陆</view>
					<view class="header__nickname" v-if="isLogin">{{user.nickname}}</view>
					<view class="header__userid" v-if="isLogin"><text>ID：{{user.uid}}</text><text class="btn" @click="myCopy(user.uid)">复制</text></view>
				</view>
			</view>
		</view>

		<view class="property">
			<view class="balance_goid" @click="goid(1)">
				<image src="/static/walk/amend/balance.png" mode="aspectFit"></image>
				<view class="right">
					<view class="price">{{user.walk_money}}</view>
					<view class="title">我的余额</view>
				</view>
				<image class="icon" src="/static/walk/amend/left.png" mode="aspectFit"></image>
			</view>
			<view class="balance_goid" @click="goid(2)">
				<image src="/static/walk/amend/goid.png" mode="aspectFit"></image>
				<view class="right">
					<view class="price">{{user.walk_integral}}</view>
					<view class="title">我的多多币</view>
				</view>
				<image class="icon" src="/static/walk/amend/left.png" mode="aspectFit"></image>
			</view>
		</view>

		<view class="card">
			<view class="card__item" v-for="(item,index) in contList" :key='index' @click="listItemClick(item.url)">
				<view class="border-box">
					<view class="item__icon">
						<image :src="item.icon" mode="widthFix"></image>
						<view class="item__text">{{item.title}}</view>
					</view>
					<image src="/static/walk/amend/left2.png" mode="aspectFill"></image>
				</view>
			</view>

			<view class="card__item" style="position: relative;">
				<view class="border-box">
					<view class="item__icon">
						<image src="/static/walk/icon/zxkf.png" mode="widthFix"></image>
						<view class="item__text">在线客服</view>
						<view class="box" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;overflow: hidden;">
							<contact-button class='service' tnt-inst-id="27k_hzAR" scene="SCE00407020" icon="https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/d4f5c2c94881b8db27f83be1703bfbef.png"
							 size="2000rpx" />
						</view>
					</view>
					<image src="/static/walk/amend/left2.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<task-list ref="task" tag="morestep" :size="0"></task-list>
		<!-- 支付宝广告插件 -->
		<view class="card aliad" v-if="adUnitId">
			<view class="aliad_head" v-if="showali">
				<image class="aliad_head_l" src="../../static/index/xsjf.png?v2" mode="aspectFill"></image>
				<view class="aliad_head_r">
					<image src="../../static/index/redbag.png" mode="aspectFill"></image>
					<view>点击浏览广告,可随机获得<text>0.01-0.5元红包</text></view>
				</view>
			</view>
			<view class="aliad_body" @click="onAliTaskTap()">
				<ad :unit-id="adUnitId" @load="onRenderSuccess" @error="onRenderFail" />
			</view>
		</view>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync();
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import cache from '../../utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import taskList from '@/components/task-list/task-list.vue'
	export default {
		components: {
			taskList,
			uniPopup
		},
		data() {
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",
				task_list: [],
				task: '',
				activeTask: '',
				activeDate: '',

				// 阿里广告
				isShowAliAd: 0,
				adUnitId: 'ad_tiny_2021001167680229_202010222200004360',
				aliAdTaskId: 363,
				cur: 1,
				contList: [{
						icon: '/static/walk/icon/dhjl.png',
						title: '兑换记录',
						url: '/pages/exchange/exchange?cur=1'
					},
					{
						icon: '/static/walk/icon/yqjl.png',
						title: '邀请记录',
						url: '/pages/inviteRecord/inviteRecord'
					},
					{
						icon: '/static/walk/icon/wdfk.png',
						title: '我的反馈',
						url: '/pages/myFeedback/myFeedback'
					},
					{
						icon: '/static/walk/icon/yjfk.png',
						title: '建议反馈',
						url: '/pages/my/feedback'
					},
					{
						icon: '/static/walk/icon/ptys.png',
						title: '用户设置',
						url: './setting'
					},
					// {
					// 	icon:'/static/walk/icon/yhxy.png',
					// 	title:'在线客服',
					// },

				]

			}
		},
		onShow() {
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		mounted() {
			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
		},
		methods: {
			// 点击复制
			myCopy(val) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: '复制成功'
						})
					},
					fail: function() {
						uni.showToast({
							title: '复制失败'
						})
					}
				})
			},
			// 跳转我的多多币/我的余额
			goid(item) {
				if (item == 1) {
					uni.navigateTo({
						url: '/pages/balance/balance'
					})
				} else {
					uni.navigateTo({
						url: '/pages/exchange/exchange'
					})
				}
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
			onTaskTap(task) {
				if (this.$refs.task && this.$refs.task.onTaskTap) {
					this.$refs.task.onTaskTap(task);
				}
			},
			init() {
				ajax.get({
					url: 'Task/isShowAliAd',
				}).then((res) => {
					if (res.data.code == 200) {
						this.isShowAliAd = res.data.data.isShowAliAd
					}
				}).catch((error) => {})
			},
			// 
			listItemClick(item) {
				uni.navigateTo({
					url: item
				})
			},
			upUserInfo() {
				ajax.login2()
			}
		},
		computed: {
			user() {
				return typeof(this.$store.state.user) !== 'undefined' ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					integral: '',
					headimg: '',
					nickname: '',
					money: ''
				};
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
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
					return true
				} else {
					return false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
		padding-bottom: 26rpx;
		box-sizing: border-box;
	}

	image {
		display: block;
	}

	.property {
		background-color: rgb(255, 255, 255);
		margin: 0 auto;
		margin-top: -66rpx;
		display: flex;
		justify-content: space-between;
		width: 710rpx;
		height: 132rpx;
		box-sizing: border-box;
		padding: 20rpx 0;
		border-radius: 16rpx;

		.balance_goid {
			display: flex;
			align-items: center;
			flex: 1;
			border-right: 1px solid #F5F5F5;
			margin-left: 18rpx;
			position: relative;

			&:nth-last-child(1) {
				border: none;
			}

			image {
				width: 72rpx;
				height: 72rpx;
				margin-right: 20rpx;
			}

			.right {
				margin-right: 100rpx;

				.price {
					font-size: 30rpx;
					font-weight: bold;
					color: #555555;
					margin: 10rpx 0 6rpx 0;
				}

				.title {
					font-size: 24rpx;
					font-weight: 500;
					color: #858585;
				}
			}

			.icon {
				position: absolute;
				top: 50%;
				right: 24rpx;
				width: 12rpx;
				transform: translateY(-50%);
			}
		}


	}

	.rule {
		background: white;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		border-radius: 20rpx;
		width: 70vw;
		height: 55vh;

		.title {
			align-self: center;
			font-size: 35rpx;
			font-weight: bold;
		}

		.content {
			font-size: 30rpx;
			color: #666;
			overflow-y: scroll;
		}
	}

	.header {
		overflow: hidden;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/my/header_new_bg.png) 0 0 / 100% 100%;
		height: 400rpx;

		.haederCont {
			display: flex;
			margin-left: 38rpx;
			margin-right: auto;
			padding-top: 20rpx;

			.header__avatar {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				border: 2px solid #fff;
				box-sizing: border-box;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			.rightBox {
				margin-left: 16rpx;

				.header__nickname {
					width: 300rpx;
					font-size: 30rpx;
					color: #ffffff;
					margin-top: 14rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.header__userid {
					display: flex;
					align-items: center;

					text {
						font-size: 26rpx;
						color: #ffffff;
						margin-top: 13rpx;
						text-align: center;
					}

					.btn {
						padding: 8rpx 22rpx;
						margin-left: 18rpx;
						background: rgba(35, 24, 21, 0);
						border: 1px solid #FFFFFF;
						border-radius: 25rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #FFFFFF;
					}
				}
			}

		}
	}

	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		margin: 18rpx;
		width: 710rpx;
		box-sizing: border-box;
		padding: 10rpx 0;

		&__item {
			text-align: center;


			.border-box {
				padding: 30rpx 18rpx;
				margin: 0 18rpx;
				border-bottom: 1rpx solid #F2F2F2;
				align-items: center;
				display: flex;
				justify-content: space-between;
			}

			&:nth-last-child(1) {
				border: none;
			}

			.item__icon {
				display: flex;
				align-items: center;

				image {
					width: 44rpx;
				}

				.item__text {
					padding-left: 20rpx;
					font-size: 32rpx;
					color: #121212;
				}
			}

			image {
				width: 12rpx;
				height: 22rpx;
			}
		}
		
		.card__item:last-child .border-box {
			border-bottom: none !important;
		}
	}

	.aliad {
		width: 94vw;
		margin: 0 auto;
		margin-top: 18rpx;


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

	.advertising {
		width: 710rpx;
		margin-top: 20rpx;
		background: #2CB0B2;
		border-radius: 16rpx;
		margin: 0 auto;

		image {
			width: 710rpx;
		}
	}
</style>
