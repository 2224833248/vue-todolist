<template>
	<view class="tbody">
		<view class="header">
			<view class="header-left">
				<view class="imgBox">
					<image :src="user.headimg" mode="aspectFill"></image>
				</view>
				<view class="leftTetx">
					<view class="vip">{{user.nickname}}</view>
					<view class="user">用户ID：{{user.uid}}<text @click="myCopy(user.uid)">复制</text></view>
				</view>
			</view>
			<view class="header-right">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/my/vip.png" mode="aspectFill"></image>
				<text>超级会员</text>
				<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/right.png" mode="aspectFill"></image> -->
			</view>
		</view>
		<view class="banner">
			<view class="banner-cont">
				<view class="banner-cont-top">
					<view class="money">集分宝：<text>{{user.jfb*1000/10}}个</text></view>
					<view class="right" @click="deposit"><text>立即提现</text>
						<!-- <image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/listDatails/redR.png" mode="aspectFill"></image> -->
					</view>
				</view>

				<view class="banner-cont-estimate">
					<view class="list">
						<view class="listMoney"><text>{{userpro.day.money}}</text></view>
						<view class="estimate">今日预估</view>
					</view>
					<view class="list">
						<view class="listMoney"><text>{{userpro.yesterday.money}}</text></view>
						<view class="estimate">昨日预估</view>
					</view>
					<view class="list">
						<view class="listMoney"><text>{{userpro.month.money}}</text></view>
						<view class="estimate">本月预估</view>
					</view>
				</view>
			</view>
			<view class="banner-img" v-if="adList.userAd.length > 0">
				<image :src="adList.userAd[0].image" mode="aspectFill" @click="adClick(adList.userAd[0])"></image>
			</view>
		</view>

		<view class="content">
			<!-- TO-DO收益中心 -->
			<view class="earnings" v-for="(item,index) in userNav">
				<view class="earnings-title">
					<view class="title">{{item.title}}</view>
					<view class="titleRight" @click="navSkip(item)">
						<text>{{item.small_title}}</text>
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/contreVip/right.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="earnings-list">
					<view class="earnings-list-item" @click="navSkip(items)" v-for="(items,indexs) in item.list">
						<template v-if="items.type=='server'">
							<contact-button tnt-inst-id="27k_hzAR" scene="SCE00336683" :icon="items.img" size="60rpx" />
						</template>
						<template v-else>
							<image :src="items.img" mode="aspectFill"></image>
						</template>
						<view class="text">{{items.title}}</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	import $utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				userNav: [],
				userpro: {
					money: 0
				},
				userAd: [],
				hides: true
			}
		},
		mounted() {
			this.init();
			this.getUserNav()
			this.getUserprofilt()
		},
		methods: {
			init() {
				if (this.user.nickname == 'YH_USER') {
					$axios.login();
				}
			},
			navSkip(items) {

				let type = items.type

				if (type == 'page') {
					uni.navigateTo({
						url: items.data
					})
				} else if (type == 'url') {
					my.ap.navigateToAlipayPage({
						path: encodeURIComponent(
							'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
							encodeURIComponent(items.data)),
					});
				} else if (type == 'invite') {
					my.showSharePanel();
				}
			},
			// 提现跳转
			deposit() {
				uni.navigateTo({
					url: '../carryCash/carryCash?money=' + this.userpro.money
				});
			},
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

			// 点击广告
			adClick(ad) {
				$axios.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				$utils.adJump(ad, this);
			},
			getUserprofilt() {
				$axios.get({
					url: 'User/getProfit'
				}).then(res => {
					if (res.data.code == 200) {
						this.userpro = res.data.data

					}
				}).catch(err => {})
			},
			getUserNav() {
				$axios.get({
					url: 'Base/getUserNav'
				}).then((res) => {
					if (res.data.code == 200) {
						this.userNav = res.data.data
					}

				}).catch(err => {})
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
		//获取用户信息
		computed: {
			adList() {
				let tmp = this.$store.state.adList;
				if (tmp.userAd && tmp.userAd.length > 0) {
					tmp.userAd.forEach(item => {
						$utils.addAdShowLog(item);
					})
				}
				return tmp;
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					money: 0,
					jfb: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';

			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.header {
		width: 100%;
		height: 413rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/my/bigBg.png)no-repeat;
		background-size: 100% 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&-left {
			padding-left: 30rpx;
			display: flex;

			.imgBox {
				width: 86rpx;
				height: 86rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 86rpx;
					height: 86rpx;
				}
			}

			.leftTetx {
				margin-left: 20rpx;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				padding: 10rpx 0;

				.vip {
					width: 300rpx;
					color: #fff;
					font-size: 30rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.user {
					font-size: 22rpx;
					color: #fff;
					display: flex;
					align-items: center;

					text {
						// display: block;
						box-sizing: border-box;
						width: 60rpx;
						height: 25rpx;
						font-size: 18rpx;
						border: 2rpx solid #FFFFFF;
						border-radius: 12px;
						line-height: 25rpx;
						text-align: center;
						margin-left: 16rpx;
					}
				}
			}
		}

		&-right {
			width: 175rpx;
			height: 51rpx;
			background: #FF9696;
			border-radius: 26rpx 0rpx 0rpx 26rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 27rpx;
				height: 25rpx;

				&:nth-of-type(2) {
					width: 10rpx;
					height: 17rpx;
				}
			}

			text {
				font-size: 22rpx;
				color: #fff;
				margin: 0 14rpx 0 10rpx;
			}
		}
	}

	// TO-DO banner
	.banner {
		width: 690rpx;
		margin: 0 auto;
		margin-top: -114rpx;

		&-cont {
			width: 100%;
			box-sizing: border-box;
			padding: 0 30rpx;
			background: #fff;
			border-radius: 14rpx;
			margin-bottom: 20rpx;

			&-top {
				box-sizing: border-box;
				border-bottom: 1px solid #ECECEC;
				line-height: 90rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.money {
					font-size: 24rpx;
					font-weight: 500;
					color: #1F1F1F;

					text {
						font-size: 34rpx;
						font-weight: 500;
						color: #1F1F1F;
					}
				}

				.right {
					text {
						font-size: 24rpx;
						font-weight: 500;
						color: #FF6666;
					}

					image {
						width: 11rpx;
						height: 19rpx;
						margin-left: 17rpx;
					}
				}
			}

			&-estimate {
				display: flex;
				align-items: center;
				box-sizing: border-box;

				.list {
					flex: 1;
					height: 125rpx;
					display: flex;
					box-sizing: border-box;
					padding: 27rpx 0 32rpx;
					flex-direction: column;
					justify-content: space-between;
					position: relative;

					&::before {
						content: '';
						right: 0;
						top: 50%;
						transform: translateY(-50%);
						position: absolute;
						width: 1px;
						height: 33rpx;
						background: #ECECEC;
					}

					.listMoney {
						text-align: center;
						font-size: 22rpx;
						font-weight: 500;
						color: #000000;

						text {
							font-size: 30rpx;
							color: #303030;
						}
					}

					.estimate {
						text-align: center;
						color: #666;
						font-size: 22rpx;
						margin-top: 10rpx;
					}
				}

				.list:nth-last-child(1) {
					&::before {
						display: none;
					}
				}
			}
		}

		&-img {
			width: 690rpx;
			height: 140rpx;
			border-radius: 12rpx;
			overflow: hidden;
			background: #ccc;

			image {
				width: 690rpx;
				height: 140rpx;
			}
		}
	}

	// TO-DO 收益中心
	.content {
		padding: 0 30rpx 57rpx 30rpx;

		.earnings {
			margin-top: 20rpx;
			background: #fff;
			border-radius: 14rpx;

			&-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;
				height: 66rpx;
				padding: 0 30rpx;
				border-bottom: 1px solid #ECECEC;

				.title {
					font-size: 26rpx;
					font-weight: 500;
					color: #000000;
				}

				.titleRight {
					display: none;
					align-items: center;

					text {
						font-size: 22rpx;
						margin-right: 16rpx;
						font-weight: 500;
						color: #999999;
					}

					image {
						width: 10rpx;
						height: 17rpx;
					}
				}
			}

			&-list {
				display: flex;
				flex-wrap: wrap;
				padding: 0 0 42rpx 0;

				&-item {
					width: 25%;
					margin-top: 30rpx;
					text-align: center;

					image {
						width: 60rpx;
						height: 60rpx;
					}

					.text {
						text-align: center;
						font-size: 22rpx;
						font-weight: 500;
						color: #666666;
					}
				}
			}

			&:nth-of-type(1) {
				.earnings-title {
					.titleRight {
						display: flex;
					}
				}
			}
		}

	}
</style>
