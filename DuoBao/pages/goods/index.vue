<template>
	<view class="main">
		<!-- <bc-module v-if="showComponent" code="suite://bc.suite.union618/bc.template.banner" name="block-banner" @onError="bcError" />
		<bc-module v-if="showComponent" code="suite://bc.suite.union618/bc.template.nav" name="block-nav" @onError="bcError" />
		<bc-module v-if="showComponent" code="suite://bc.suite.union618/bc.template.nav" name="block-nav" @onError="bcError" />
		<bc-module v-if="showComponent" code="suite://bc.suite.union618/bc.template.dialog" name="block-dialog" @onError="bcError" />
		<bc-module v-if="showComponent" code="suite://bc.suite.union618/bc.template.icon" name="block-icon" @onError="bcError" /> -->
		<!-- <view class="header">
			<day :options="pluginOptions2" />
		</view>
		<view>
			<dayhot :options="pluginOptions3" />
		</view>
		<like :loadMoreTime="loadMoreTime" :pluginOptions="pluginOptions" /> -->
	</view>
</template>

<script>
	import bc from '@/static/miniapp-bc-user';
	getApp().globalData.bc = bc;
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import ajax from "@/utils/ajax.js"
	import utils from '@/utils/utils.js'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				showComponent: false,
				pluginOptions: {
					pid: 'mm_129925751_1961950382_110739900179',
				},
				pluginOptions2: {
					refpid: 'mm_129925751_1961950382_110734600295'
				},
				pluginOptions3: {
					refpid: 'mm_129925751_1961950382_110736650270'
				},
				loadMoreTime: 0,
				curr: 1,
				swipers: [],
				adList: [],
				down: {
					use: false
				},
				up: {
					noMoreSize: 1,
					textNoMore: '— 只显示最近7天的金币明细哦 —'
				},
				page: 1,
				goodsList: []
			}
		},
		components: {
			MescrollUni
		},
		onReachBottom() {
			this.loadMoreTime++;
		},
		mounted() {
			// bc.loadBC().then((e) => {
			// 	this.showComponent = true;
			// 	console.info(e);
			// }).catch(e => {
			// 	console.info(e)
			// });
			ajax.get({
				url: 'Ad/record',
				data: {
					slot_id: 3
				},
				login: true,
				loading: true,
			}).then((res) => {
				if (res.data.code == 200) {
					this.swipers = res.data.data
				}
			}).catch((error) => {

			})

			ajax.get({
				url: 'Ad/record',
				data: {
					slot_id: 4
				},
				login: true,
				loading: true,
			}).then((res) => {
				if (res.data.code == 200) {
					this.adList = res.data.data
				}
			}).catch((error) => {

			})
		},
		methods: {
			bcError(err) {
				console.log('err:', err)
			},
			change(e) {
				this.curr = e.target.current + 1;
			},
			mescrollInit() {

			},
			downCallback() {

			},
			upCallback(e) {
				ajax.get({
					url: 'goods/getList',
					data: {
						p: this.page
					},
					login: false
				}).then(data => {
					data = data.data
					if (data.code == 200) {
						this.page++;
						this.goodsList = this.goodsList.concat(data.data.list)
						e.endUpScroll(data.data.endPage);
					}
				})
			},
			jump(item) {
				ajax.get({
					url: 'goods/getUrl',
					data: {
						iid: item.num_iid
					},
					login: false
				}).then(data => {
					data = data.data;
					uni.navigateTo({
						url: './webview?url=' + encodeURIComponent(data.data.url),
						fail: (e) => {
							console.info(e);
						}
					})
				})
			},
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad,this);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		margin-bottom: 20rpx;
	}

	.main {
		height: 100vh;
		width: 100vw;
		background: #f5f5f5;
		padding-top: 20rpx;
	}

	.swiper {
		width: 100%;
		height: 340rpx;

		.img {
			width: 100%;
			height: 100%;
		}
	}

	.swiper-content {
		position: relative;

		>.dots {
			position: absolute;
			right: 17rpx;
			bottom: 17rpx;
			background-color: #000000;
			border-radius: 10rpx 0rpx 10rpx 0rpx;
			opacity: 0.55;
			font-size: 22rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
			padding: 4rpx 8rpx;
		}
	}

	.content {
		padding: 17rpx;

		.header-ad {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.aditem {
				width: 168rpx;
				height: 116rpx;
				margin-bottom: 14rpx;

				.pic {
					width: 100%;
					height: 100%;
				}
			}
		}

		.goodsheader {
			display: flex;
			justify-content: center;
			margin: 37rpx 0;

			.pic {
				width: 260rpx;
				height: 33rpx;
			}
		}

		.goodsList {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.info {
				padding: 15rpx;
			}

			.item {
				display: flex;
				flex-direction: column;
				width: 350rpx;
				background-color: #ffffff;
				border-radius: 12rpx;
				margin-bottom: 15rpx;
				overflow: hidden;

				.pic {
					width: 350rpx;
					height: 350rpx;
				}

				.title {
					display: flex;
					align-items: center;

					.img {
						width: 45rpx;
						height: 26rpx;
						border-radius: 4rpx;
						flex-shrink: 0;
						margin-right: 6rpx;
					}

					.txt {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						line-height: 26rpx;
						font-size: 24rpx;
					}
				}

				.pricebox {
					margin: 24rpx 0;

					.endprice {
						font-size: 22rpx;
						color: #ff6000;

						.money {
							font-size: 38rpx;
						}
					}

					.price {
						font-size: 22rpx;
						color: #999999;
						text-decoration: line-through;
					}
				}

				.endline {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.couponbox {
						background-color: #ff6000;
						border-radius: 6rpx;
						display: flex;

						.txt {
							font-size: 20rpx;
							letter-spacing: 1rpx;
							color: #ffffff;
							line-height: 1;
							margin: 6rpx 8rpx;
							display: flex;
							justify-content: center;
							align-items: center;
						}

						.moneybox {
							background-color: #fff;
							margin: 1px;
							border-top-right-radius: 6rpx;
							border-bottom-right-radius: 6rpx;
							display: flex;
							align-items: center;
							padding: 6rpx 8rpx;

							.money {
								color: #ff6000;
								font-size: 22rpx;
								line-height: 1;
								display: block;
							}
						}
					}

					.volume {
						font-size: 22rpx;
						color: #888888;
					}
				}
			}
		}
	}
</style>
