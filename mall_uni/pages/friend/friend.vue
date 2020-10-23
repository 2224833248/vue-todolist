<template>
	<view class="content">
		<view class="friend-hd" :style="{'padding-top':STATUS_BAR_HEIGTH + TITLE_BAR_HEIGTH + 'px' }">
			<view class="friend-hd__overview">
				<view class="friend-hd__overview__item">
					<view class="friend-hd__overview__item__number">
						<!-- 1235 -->
						{{friendNum.total}}
					</view>
					<view class="friend-hd__overview__item__textarea">
						会员总数
					</view>
				</view>
				<view class="friend-hd__overview__item">
					<view class="friend-hd__overview__item__number">
						<!-- 1235 -->
						{{friendNum.today_num}}
					</view>
					<view class="friend-hd__overview__item__textarea">
						今日已邀
					</view>
				</view>
				<view class="friend-hd__overview__item">
					<view class="friend-hd__overview__item__number">
						<!-- 1235 -->
						{{friendNum.month_num}}
					</view>
					<view class="friend-hd__overview__item__textarea">
						本月已邀
					</view>
				</view>
			</view>
			<view class="friend-hd__nav">
				<view class="friend-hd__nav__item" :class="{'friend-hd__nav__item__active':item.active}" @click="tabClick(item)"
				 v-for="(item,index) in firendsmsg" :key='index'>
					{{item.title}} ({{item.num}})
					<view class=""></view>
				</view>
			</view>
		</view>
		<view class="userCont" v-if="nofriend">
			<view class="userList" v-for="(item,index) in friend" :key="index">
				<view class="left">
					<view class="userIcon">
						<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/store.png" mode="aspectFit"></image> -->
						<image :src="item.headimg" mode="aspectFit"></image>
					</view>
					<view class="userName">
						<!-- <text class="userTitle">用戶名</text> -->
						<text class="userTitle">{{item.nickname}}</text>
						<!-- <text>注册时间: 2020-08-12 10:25:36</text> -->
						<text>注册时间: {{item.reg_time}}</text>
						<!-- <text>最近登录: 2020-08-14 12:29:08</text> -->
						<text>最近登录: {{item.login_time}}</text>
					</view>
				</view>

				<view class="userPrice">
					<view class="">贡献金额</view>
					<!-- <view class="">￥ 1269.90</view> -->
					<view class="">￥ {{item.money*100}}</view>
				</view>
			</view>
		</view>
		<view class="userCont2" v-else='nofriend'>
			<view class="userCont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/friend/icont.png" mode="aspectFit"></image>
			</view>
			<text>您还有没有好友哦~</text>
			<!-- <view class="userCont-btn" @click="placeorder">去下单</view> -->
			<view class="userCont2-btn" @click="invite">去邀请好友</view>
		</view>
	</view>
</template>

<script>
	import $ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				active: 0,
				firendsmsg: [], //数据
				// allvipnum: '0', //会员总数
				// todaynum: '0', //今日
				// thismonth: '0', //本月
				// commonum: '0', //普通会员
				// vipnum: '0', //vip会员
				friend: [],
				friendNum: {
					month_num: 0,
					today_num: 0,
					total: 0
				},
				nofriend: true
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					// console.log('成功',res);
					this.STATUS_BAR_HEIGTH = res.statusBarHeight;
					this.TITLE_BAR_HEIGTH = res.titleBarHeight;
				},
				fail: () => {
					console.log('失败');
				}
			})

			this.getvipnum();
		},
		methods: {
			tabClick(item) {
				this.firendsmsg.forEach(items => {
					items.active = false
				})
				item.active = true
				this.firstGetmsg(item.option)
			},

			happenTimeFun(num) { //时间戳数据处理
				let date = new Date(num * 1000);
				//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM; //月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d; //天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				let s = date.getSeconds()
				s = s < 10 ? ('0' + s) : s; //秒
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s; //年月日

			},
			//第一次数据获取
			firstGetmsg(option) {
				$ajax.get({
					url: 'Team/getTeamUser',
					data: {
						option: option,
						p: 1
					}
				}).then((res) => {
					if (res.data.code == 200) {
						if (res.data.data.list.length != 0) {
							this.nofriend = true
							this.friend = res.data.data.list
							this.friend.forEach(item => {
								item.reg_time = this.happenTimeFun(item.reg_time)
								item.login_time = this.happenTimeFun(item.login_time)
							})
						} else {
							this.nofriend = false
						}
					}
				}).catch((res) => {
					console.log('失败');
				})
			},
			//获取不同会员的数量
			getvipnum() {
				$ajax.get({
					url: 'Team/getTeamBase',
					data: {
						team_uid: this.$store.state.user.uid,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						console.log('会员的数量', res);
						this.firendsmsg = res.data.data.option
						this.friendNum = res.data.data
						this.firstGetmsg(this.firendsmsg[0].option);
					}
				})
			},
			invite() {
				my.showSharePanel();
			},
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
	}
</script>

<style lang="less">
	.friend-hd {
		width: 750rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/friend/friend_bd.png);
		background-size: 100% auto;
		overflow: auto;

		.friend-hd__overview {
			margin: 0 20rpx 26rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			height: 160rpx;
			display: flex;
			align-items: center;
			text-align: center;

			.friend-hd__overview__item {
				box-sizing: border-box;
				border-right: 1px solid #f5f5f5;
				flex: 1;

				.friend-hd__overview__item__number {
					font-size: 34rpx;
					letter-spacing: -1rpx;
					color: #111111;
				}

				.friend-hd__overview__item__textarea {
					font-size: 26rpx;
					color: #666666;
					margin-top: 19rpx;
				}
			}
		}

		.friend-hd__nav {
			display: flex;
			justify-content: space-around;

			.friend-hd__nav__item {
				font-size: 28rpx;
				line-height: 66rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
			}

			.friend-hd__nav__item__active {
				font-weight: bold;

				view {
					width: 100rpx;
					height: 4rpx;
					background-color: #ffffff;
					border-radius: 2rpx;
					margin: 0 auto;
					margin-bottom: 6rpx;
				}
			}

			.friend-hd__nav__item__active::before {
				content: "";
				width: 100rpx;
				height: 4rpx;
				background-color: #ffffff;
				border-radius: 2rpx;
			}
		}
	}

	.userCont {
		padding: 0 20rpx;

		.userList {
			height: 180rpx;
			box-sizing: border-box;
			padding: 0 18rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			margin-top: 18rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {
				display: flex;
			}

			.userIcon {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.userName {
				margin-left: 14rpx;

				text {
					display: block;
					font-size: 22rpx;
					color: #777777;
					margin-top: 10rpx;
				}

				.userTitle {
					font-size: 28rpx;
					letter-spacing: 1rpx;
					color: #111111;
					margin: 0 0 10rpx 0;
				}
			}

			.userPrice {
				margin-left: 85rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				view {
					text-align: center;
					font-size: 26rpx;
					color: #ff3632;
				}

				view:nth-of-type(2) {
					font-size: 30rpx;
					margin-top: 20rpx;
				}
			}
		}
	}

	.userCont2 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		text-align: center;

		&-img {
			width: 212rpx;
			height: 200rpx;
			margin-bottom: 25rpx;
			margin: 0 auto;

			image {
				width: 100%;
				height: 100%;
			}
		}

		text {

			font-size: 24rpx;
			color: #999;
		}

		&-btn {
			width: 240rpx;
			height: 64rpx;
			margin-top: 40rpx;
			background-image: linear-gradient(90deg,
				#ff6662 0%,
				#ff423e 100%),
				linear-gradient(#fde5c3,
				#fde5c3);
			border-radius: 32rpx;
			color: #fff;
			font-size: 28rpx;
			text-align: center;
			line-height: 64rpx;
		}
	}
</style>
