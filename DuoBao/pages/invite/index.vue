<template>
	<view class="content">
		<view class="header"></view>
		<view class="invite-card step">
			<view class="invite-card__hd">
				<view class="invite-card__hd__title">
					三步轻松赢好礼
				</view>
			</view>
			<view class="invite-card__bd">
				<view class="step__list">
					<view class="step__list__item">
						<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/icon_step.png"
						 mode="aspectFill"></image>
						<view class="item__textarea">
							分享链接,邀请好友
						</view>
					</view>
					<view class="step__list__item">
						<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/icon_step.png"
						 mode="aspectFill"></image>
						<view class="item__textarea">
							好友成功参与夺宝
						</view>
					</view>
					<view class="step__list__item">
						<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/icon_step.png"
						 mode="aspectFill"></image>
						<view class="item__textarea">
							获得100金币
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="new_invite" @click="onShowSharePanelTap">立即邀请</view>
		<view class="rule" @click="goRule">
			<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/rule.png" mode="aspectFill"></image>
		</view>
		<view class="invite-card earnings">
			<view class="invite-card__hd">
				<view class="invite-card__hd__title">
					我的活动收益
				</view>
			</view>
			<view class="invite-card__bd">
				<view class="earnings__list">
					<view class="earnings__list__item">
						<view class="item__number">
							<text>{{base.stay}}</text>金币
						</view>
						<view class="item__textarea">
							在路上收益
						</view>
					</view>
					<view class="earnings__list__item">
						<view class="item__number">
							<text>{{base.integral}}</text>金币
						</view>
						<view class="item__textarea">
							累计收益
						</view>
					</view>
					<view class="earnings__list__item">
						<view class="item__number">
							<text>{{base.num}}</text>人
						</view>
						<view class="item__textarea">
							邀请好友
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="invite-card rand">
			<view class="invite-card__hd">
				<view class="invite-card__hd__title">
					邀请达人排名榜
				</view>
			</view>
			<view class="invite-card__bd">
				<view class="rand__number">
					共 <text>{{listBase.all}}</text> 人参与
				</view>
				<view class="rand__tab">
					<view class="rand__tab__item rand__tab__item--left " :class="thisMonth?'rand__tab__item--selected':''" @click="ckMonth('thisMonth')">
						<view class="item__title">
							7月榜单
						</view>
						<view class="item__subtitle">
							本月截止今日排名
						</view>
					</view>
					<view class="rand__tab__item rand__tab__item--right " :class="lastMonth?'rand__tab__item--selected':''" @click="ckMonth('lastMonth')">
						<view class="item__title">
							6月榜单
						</view>
						<view class="item__subtitle">
							查看上个月邀请排名
						</view>
					</view>
				</view>
				<view class="rand__top3">
					<view class="rand__top3__item" v-for="(item,index) in list.top" :key="index">
						<view class="item__image">
							<image :src="item.headimg" mode="aspectFill"></image>
						</view>
						<view class="item__name">
							{{item.nickname}}
						</view>
						<view class="item__textarea">
							已赚{{item.integral}}金币
						</view>
					</view>
				</view>
				<view class="rand__top10">
					<view class="rand__top10__item" v-for="(item,index) in list.lower" :key="index">
						<view class="item__number">
							{{index+4}}
						</view>
						<image :src="item.headimg" mode="aspectFill"></image>
						<view class="item__name">
							{{item.nickname}}
						</view>
						<view class="item__gold">
							{{item.integral}} 金币
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import cache from '../../utils/cache.js'
	export default {
		data() {
			return {
				base: {},
				listBase: {},
				list: {
					top: [],
					lower: []
				},
				thisMonth: true,
				lastMonth: false,
			}
		},
		methods: {
			init() {
				this.getBase();
			},
			getBase() {
				ajax.get({
					url: 'invite/getBase',
					data: {}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.base = resp.data.data;
					}
				})
				ajax.get({
					url: 'invite/getList',
					data: {}
				}).then((resp) => {
					if (resp.data.code == 200) {
						this.listBase = resp.data.data;
						this.list = this.listBase.thisMonth;
					}
				})
			},
			ckMonth(value) {
				if (value == 'thisMonth') {
					this.thisMonth = true;
					this.lastMonth = false;
					this.list = this.listBase.thisMonth;
				} else {
					this.thisMonth = false;
					this.lastMonth = true;
					this.list = this.listBase.lastMonth;
				}
			},
			// 邀请
			onShowSharePanelTap() {
				my.showSharePanel();
			},
			goRule() {
				uni.navigateTo({
					url: "/pages/webview/webview?url=" + encodeURIComponent('https://mobile.yhshapp.com/Article/detail?aid=65')
				});
			},
		},
		mounted() {
			this.init()
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
				};
			}
		},
		computed: {

			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #4e66ea;
		color: #333333;
	}

	.invite-card {
		width: 690rpx;
		background-color: #ffffff;
		box-shadow: 0rpx 4rpx 43rpx 0rpx #1b30a5;
		border-radius: 20rpx;
		margin: 24rpx auto 69rpx;
		position: relative;

		&__hd {
			width: 690rpx;
			position: absolute;
			top: -27rpx;

			&__title {
				width: 445rpx;
				height: 70rpx;
				background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/invite_hd.png);
				background-size: 100%;
				text-align: center;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 70rpx;
				letter-spacing: 1rpx;
				color: #ffffff;
				margin: 0 auto;
			}
		}

		&__bd {
			padding: 85rpx 42rpx 56rpx;
		}
	}

	.header {
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/invite_hd_bg.png);
		background-size: 100%;
		height: 555rpx;
	}

	.step {
		margin-top: -60rpx;
		text-align: center;

		&__list {
			margin-top: 31rpx;
			display: flex;
			justify-content: space-between;

			&__item {
				flex: 1;

				.item__image {
					width: 106rpx;
					height: 106rpx;
					margin-bottom: 30rpx;
				}

				.item__textarea {
					margin: 0 auto;
					width: 150rpx;
					font-size: 24rpx;
					line-height: 42rpx;
					letter-spacing: 0rpx;
					color: #333333;
				}
			}
		}
	}

	.new_invite {
		width: 650rpx;
		height: 90rpx;
		background-image: linear-gradient(0deg,
			#fdb201 0%,
			#fcd80a 100%);
		border-radius: 45rpx;

		font-size: 34rpx;
		line-height: 90rpx;
		color: #3c3011;
		text-align: center;
		margin: 0 auto 34rpx;
	}

	.rule {
		text-align: center;
		margin-bottom: 60rpx;

		image {
			width: 153rpx;
			height: 33rpx;
		}
	}

	.earnings {
		&__list {
			display: flex;
			text-align: center;

			&__item {
				flex: 1;

				.item__number {
					font-size: 28rpx;
					color: #333333;
					margin-bottom: 31rpx;

					text {
						font-size: 42rpx;
						font-weight: bold;
						line-height: 1;
						color: #333333;
					}
				}

				.item__textarea {
					font-size: 24rpx;
					line-height: 1;
					color: #333333;
				}
			}
		}
	}

	.rand {
		margin-bottom: 20rpx;

		&__number {
			text-align: center;
			font-size: 24rpx;

			text {
				color: #fd7940;
			}
		}

		&__tab {
			display: flex;
			text-align: center;
			margin: 41rpx 0 20rpx;

			&__item {
				border: solid 1rpx #3752e4;
				flex: 1;
				padding: 22rpx 0;

				.item__title {
					font-size: 32rpx;
					font-weight: bold;
					line-height: 1;
					letter-spacing: 0rpx;

				}

				.item__subtitle {
					margin-top: 14rpx;
					font-size: 22rpx;
					line-height: 1;
				}

				&--left {
					border-radius: 55rpx 0rpx 0rpx 55rpx;
				}

				&--right {
					border-radius: 0rpx 55rpx 55rpx 0rpx;
				}

				&--selected {
					background-color: #3752e4;
					color: #ffffff;
					position: relative;
				}

				&--selected:after {
					content: "";
					width: 0;
					height: 0;
					position: absolute;
					left: 132rpx;
					top: 112rpx;
					border-left: solid 20rpx transparent;
					border-right: solid 20rpx transparent;
					border-top: solid 20rpx #3752e4;
				}
			}
		}

		&__top3 {
			margin-top: 40rpx;
			padding-bottom: 32rpx;
			display: flex;
			justify-content: space-between;
			text-align: center;

			border-bottom: #999999 solid 2rpx;

			&__item {
				width: 30%;
				position: relative;

				.item__image {
					padding-top: 22rpx;
					padding-bottom: 48rpx;

					image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}
				}

				.item__image:after {
					content: "";
					width: 116rpx;
					height: 89rpx;
					position: absolute;
					left: 50%;
					top: 52rpx;
					margin-left: -58rpx;
					background-size: 100%;
				}

				.item__name {
					font-size: 24rpx;
					color: #333333;
					margin-bottom: 21rpx;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item__textarea {
					font-size: 24rpx;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

			}

			&__item:nth-of-type(1) {
				.item__image:after {
					background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/top2.png);
				}

				.item__textarea {
					color: #989899;
				}
			}

			&__item:nth-of-type(2) {
				.item__image {
					padding-top: 0rpx;

					image {
						width: 120rpx;
						height: 120rpx;
					}
				}

				.item__image:after {
					width: 138rpx;
					margin-left: -69rpx;
					height: 111rpx;
					top: 37rpx;
					background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/top1.png);
				}

				.item__textarea {
					color: #fa6440;
				}
			}

			&__item:nth-of-type(3) {
				.item__image:after {
					background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/invite/top3.png);
				}

				.item__textarea {
					color: #b77d6e;
				}
			}
		}

		&__top10 {
			&__item {
				margin: 30rpx 0;
				display: flex;
				align-items: center;

				.item__number {
					width: 35rpx;
					font-size: 28rpx;
					color: #333333;
					text-align: center;
					margin-right: 16rpx;
				}

				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					margin-right: 21rpx;
				}

				.item__name {
					width: 300rpx;
					font-size: 24rpx;
					color: #333333;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.item__gold {
					width: 200rpx;
					font-size: 30rpx;
					color: #333333;
					text-align: right;

					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>
