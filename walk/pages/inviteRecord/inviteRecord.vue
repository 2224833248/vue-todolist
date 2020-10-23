<template>
	<view class="page">
		<view class="invite-hd">
			<view class="invite-hd__item">
				<view class="invite-hd__item__number">
					{{count}}
				</view>
				<view class="invite-hd__item__text">
					已邀好友
				</view>
			</view>
			<view class="invite-hd__item">
				<view class="invite-hd__item__number">
					{{scale}}%
				</view>
				<view class="invite-hd__item__text">
					步数加成
				</view>
			</view>
		</view>

		<view class="invite-bd">
			<view class="invite-table">
				<view class="invite-table__header">
					<view class="invite-table__header__td">
						邀请好友
					</view>
					<view class="invite-table__header__td">
						邀请时间
					</view>
					<view class="invite-table__header__td">
						获得奖励
					</view>
				</view>
				<view class="invite-table__body" v-if="!noData">

					<view class="invite-table__body__tr" v-for="(item,index) in list" :key="index">
						<view class="invite-table__body__tr__name">
							<image :src="item.headimg" mode="aspectFill"></image>
							<text>{{item.nickname}}</text>
						</view>
						<view class="invite-table__body__tr__time">
							<text>{{dateFtt(item.reg_time)}}</text>
						</view>
						<view class="invite-table__body__tr__reward">
							<text>+2000步</text>
						</view>
					</view>

				</view>
			</view>
			<loading v-if="!noData" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>

			<view class="noData" v-if="noData">
				<view class="noData__image">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/inviteRecord/no_data.png" mode="aspectFill"></image>
				</view>
				<view class="noData__text">您还没有邀请记录哦~</view>
				<button class="noData__button" type="default" @click="onShowSharePanelTap()">去邀请</button>
			</view>
		</view>

	</view>
</template>

<script>
	let app = getApp()
	let systemInfo = wx.getSystemInfoSync();
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",

				loadingMore: false,
				noMoreData: false,
				noData: false,
				currentPageNumber: 1,

				count: 0,
				scale: 0,
				list: [],
			}
		},
		onLoad() {
			this.getInviteGeneral()
			this.getInviteRecord()
		},
		onReachBottom() {
			this.getInviteRecord()
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk?invite_id=' + this.user.uid
				};
			} else {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk'
				};
			}
		},
		methods: {
			getInviteGeneral() {
				ajax.get({
					url: 'run/runInfo',
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.count = res.data.data.count
						this.scale = res.data.data.scale
					}
				}).catch((error) => {})
			},

			getInviteRecord() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'User/inviteRecord',
					data: {
						page: this.currentPageNumber
					},
					login: false,
					loading: false,
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.forEach((item, index, array) => {
							this.list.push(item)
						})
						if (res.data.data.length > 0) {
							this.currentPageNumber++
						} else {
							if (this.currentPageNumber == 1 && res.data.data.length == 0) {
								this.noMoreData = true
								this.noData = true
							} else {
								this.noMoreData = true
							}
						}
					}
					this.loadingMore = false;
				}).catch((error) => {
					this.loadingMore = false;
				})
			},

			// 邀请
			onShowSharePanelTap() {
				my.showSharePanel();
			},

			// 格式化时间
			dateFtt(time) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', time)
			}
		},
		computed: {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
	}

	.invite-hd {
		padding: 93rpx 0 96rpx;
		height: 91rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/3c3406ca55c9079613bc54fe2fa09b48.png);
		background-size: 100% 100%;
		display: flex;
		justify-content: space-around;
		text-align: center;
		color: #ffffff;
		margin: 20rpx;

		&__item {
			width: 200rpx;

			&__number {
				font-size: 60rpx;
				font-weight: 500;
				line-height: 1;
				letter-spacing: -2rpx;
				margin-bottom: 22rpx;
			}

			&__text {
				font-size: 26rpx;
				line-height: 1;
			}
		}
	}

	.invite-table {
		background-color: #FFFFFF;

		&__header {
			margin: 0 17rpx;
			display: flex;
			justify-content: space-around;
			border-bottom: 2rpx #f5f5f5 solid;

			font-size: 30rpx;
			line-height: 109rpx;
			letter-spacing: -1rpx;
			color: #111111;
		}

		&__body {
			&__tr {
				display: flex;
				justify-content: space-around;
				line-height: 110rpx;

				&__name {
					flex: 0 0 200rpx;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;

					image {
						width: 56rpx;
						height: 56rpx;
						border-radius: 50%;
						vertical-align: middle;
						margin-left: 15rpx;
						margin-right: 12rpx;
					}

					text {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						font-size: 25rpx;
						color: #333333;
						vertical-align: middle;
					}
				}

				&__time {
					flex: 0 0 250rpx;

					text {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						font-size: 24rpx;
						color: #333333;
						vertical-align: middle;
					}
				}

				&__reward {
					flex: 0 0 150rpx;

					text-align: right;

					text {
						font-size: 30rpx;
						font-weight: 500;
						color: #ff8900;
						vertical-align: middle;
					}
				}
			}
		}
	}

	.noData {
		text-align: center;

		&__image {
			margin-bottom: 39rpx;

			image {
				width: 232rpx;
				height: 202rpx;
				margin-top: 76rpx;
			}
		}

		&__text {
			font-size: 26rpx;
			line-height: 1;
			letter-spacing: 0rpx;
			color: #999999;
			margin-bottom: 60rpx;
		}

		&__button {
			width: 330rpx;
			height: 80rpx;
			margin: 0 auto;
			background-image: linear-gradient(90deg,
				#fb9400 0%,
				#ff4f02 100%),
				linear-gradient(#111111,
				#111111);
			background-blend-mode: normal,
				normal;
			border-radius: 40rpx;
			font-size: 34rpx;
			line-height: 80rpx;
			color: #ffffff;
		}
	}
</style>
