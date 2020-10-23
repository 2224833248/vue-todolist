<template>
	<view class="content">
		<swiper class="banner" :indicator-dots="true" :autoplay="true" :interval="2000" :duration="500">
			<swiper-item class="banner__item" v-for="(item,index) in swiperAd" :key="index" @click="adClick(item)">
				<image class="item__image" :src="item.image+'_xcxwep'" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<view class="navigate">
			<view class="navigate__item" v-for="(item,index) in navAd" :key="index" @click="adClick(item)">
				<image class="item__image" :src="item.image+'_xcxwep'" mode="aspectFill"></image>
				<view class="item__textarea">{{item.title}}</view>
			</view>
		</view>

		<view class="card">
			<view class="card__hd">
				<image class="card__hd__title" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/duobao__title.png_xcx100"
				 mode="aspectFill"></image>
				<view class="card__hd__subtitle">无限投注，投注越多越容易中奖</view>
			</view>
			<view class="card__bd">
				<view class="duobao-list">
					<view class="duobao-list__item" v-for="(item,index) in capture_list" :key="index" @click="goDetails(item.id)">
						<view class="item__image">
							<image :src="item.goods_pic+'_xcx200'" mode="aspectFill"></image>
							<view v-if="kxzb_examine != 1">{{item.countdown|totime}}</view>
						</view>
						<view class="item__info">
							<view class="item__info__title">
								{{item.goods_title}}
							</view>
							<view class="item__info__subtitle">
								{{item.goods_description}}
							</view>
							<view class="item__info__other">
								<view class="item__info__other__left">
									<view class="item__info__other__left__gold">
										<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/gold.png_xcx50" mode="aspectFill"></image>
										<view>{{item.gold_bets}}金币夺宝</view>
									</view>
									<view class="item__info__other__left__price">
										<view class="item__info__other__left__price__old">
											￥{{item.goods_price}}
										</view>
										<view class="item__info__other__left__price__number">
											共<text>{{item.participantCount}}</text>人参与
										</view>
									</view>
								</view>
								<!-- item__info__other__right--gray -->
								<view class="item__info__other__right">
									夺宝
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'

	let countdown;
	export default {
		data() {
			return {
				swiperAd: [],
				navAd: [],
				capture_list: [],
			}
		},
		onLoad() {

		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				this.getAd()
			},
			getAd() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 10
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.navAd = res.data.data
						this.navAd.forEach((item) => {
							utils.addAdShowLog(item)
						})
					}
				}).catch((error) => {

				})
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 11
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.swiperAd = res.data.data
					}
				}).catch((error) => {

				})
			},
			// 获取夺宝列表
			getCaptureList() {
				ajax.get({
					url: 'Capture/list',
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item) => (
							item.start_time = utils.dateFtt('hh:mm:ss', item.lottery_time * 1000)
						))
						this.capture_list = res.data.data.list

						countdown = setInterval(() => {
							this.capture_list.forEach((e) => {
								if (e.countdown > 0) {
									e.countdown--
								}
							})
						}, 1000)
					}
				}).catch((error) => {})
			},
			// 跳转详情页
			goDetails(id) {
				uni.navigateTo({
					url: 'detail?id=' + id
				});
			},
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			}
		},
		mounted() {
			this.getCaptureList()
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
		},
		computed: {
			kxzb_examine() {
				return this.$store.state.setUp.kxzb_examine;
			}
		}
	}
</script>

<style lang="scss">
	.banner {
		&__item {
			.item__image {
				width: 750rpx;
				height: 297rpx;
			}
		}
	}

	.navigate {
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		padding: 59rpx 0 39rpx;
		position: relative;
		top: -0.3rem;
		background-color: #f7f7f7;

		display: flex;
		justify-content: space-evenly;

		&__item {
			text-align: center;

			.item__image {
				width: 68rpx;
				height: 68rpx;
				margin-bottom: 24rpx;
			}

			.item__textarea {
				font-size: 24rpx;
				font-weight: bold;
				color: #333333;
			}
		}
	}

	.card {
		width: 690rpx;
		margin: 0 auto 53rpx;
		background-color: #ffffff;
		border-radius: 14rpx;

		&__hd {
			display: flex;
			align-items: center;
			border-bottom: 1rpx #ececec solid;
			padding: 28rpx 29rpx 22rpx;

			&__title {
				width: 133rpx;
				height: 30rpx;
				margin-right: 6rpx;
			}

			&__subtitle {
				font-size: 24rpx;
				font-weight: bold;
				font-stretch: normal;
				color: #000000;
			}
		}
	}

	.duobao-list {
		&__item {
			display: flex;
			padding: 24rpx 14rpx 24rpx;
			border-bottom: #ececec 1rpx solid;

			.item__image {
				margin-right: 20rpx;

				image {
					width: 240rpx;
					height: 240rpx;
					border-radius: 14rpx;
					display: block;
				}

				view {
					width: 240rpx;
					height: 40rpx;
					background-color: rgba($color: #1c1c1c, $alpha: 0.4);
					border-radius: 0rpx 0rpx 14rpx 14rpx;
					font-size: 22rpx;
					line-height: 40rpx;
					color: #ffffff;
					text-align: center;
					margin-top: -40rpx;
				}
			}

			.item__info {
				width: 390rpx;

				&__title {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 21rpx;
					color: #333333;

					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&__subtitle {
					font-size: 22rpx;
					color: #666666;
					margin-bottom: 65rpx;

					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&__other {
					display: flex;
					align-items: center;
					justify-content: space-between;

					&__left {
						&__gold {
							display: flex;
							align-items: center;
							margin-bottom: 28rpx;

							image {
								width: 39rpx;
								height: 30rpx;
								margin-right: 8rpx;
							}

							view {
								font-size: 26rpx;
								font-weight: bold;
								color: #fd7940;
							}
						}

						&__price {
							display: flex;
							align-items: center;
							font-size: 22rpx;
							color: #666666;

							&__old {
								text-decoration: line-through;
								margin-right: 10rpx;
							}

							&__number {
								text {
									color: #fd7940;
								}
							}
						}
					}

					&__right {
						width: 127rpx;
						height: 57rpx;
						background-image: linear-gradient(90deg, #fc9248 0%, #fe5833 100%);
						border-radius: 29rpx;

						font-size: 24rpx;
						font-weight: bold;
						line-height: 57rpx;
						color: #ffffff;
						text-align: center;

						&--gray {
							background-image: linear-gradient(90deg, #999999 0%, #999999 100%);
						}
					}
				}
			}
		}
	}
</style>
