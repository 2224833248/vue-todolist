<template>
	<div class="main">
		<div class="block header">
			<div class="line">
				<div class="item">
					<span class="tip">可兑换金币<span class="num">(10000=1元)</span></span>
				</div>
				<div class="exchange">
					<span class="money">{{integral}}</span>
					<div class="button" @click="jump"><span class="text">兑换</span></div>
				</div>
			</div>
			<div class="info">
				<div class="item">
					<span class="title">今日金币</span>
					<span class="value">{{today}}</span>
				</div>
				<div class="item">
					<span class="title">累计金币</span>
					<span class="value">{{cumulative}}</span>
				</div>
			</div>
		</div>
		<div class="block tab">
			<wuc-tab tabClass="tabclass" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
			<swiper class="swiper" :current="TabCur" duration="300" @change="swiperChange">
				<swiper-item v-for="(item,index) in tabList" :key="index">
					<div class="list">
						<template v-if="index==0">
							<mescroll-uni ref="mescroll" @init="mescrollInit" @down="downCallback" :up="up" :down="down" @up="upCallback">
								<div v-for="(item,index) in integralList" class="integral-item" :key="index">
									<div class="label">
										<div class="quan"></div>
										<span class="text">{{item.name}}</span>
									</div>
									<div class="list">
										<div v-for="(log,key) in item.list" :key="key" class="log">
											<span class="time">{{log.time}}<span class="typeName">{{log.typeName}}</span></span>
											<div class="integral">
												<image class="img" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/exchange/gold.png"></image><span
												 class="text">{{log.integral>=0?'+':''}}{{log.integral}}</span>
											</div>
										</div>
									</div>
								</div>
							</mescroll-uni>
						</template>
						<template v-else>
							<mescroll-uni ref="mescroll" @init="mescrollInit" @down="downCallback" :up="up1" :down="down" @up="upCallback">
								<div v-for="(item,index) in exchangeList" class="exchange-item" :key="index">
									<div class="top">
										<div class="label">
											<div class="quan"></div>
											<span class="text">{{item.title}}({{item.integral}}金币)</span>
										</div>
									</div>
									<div class="bottom">
										<span class="time">{{item.addtime}}</span>
										<div class="status">{{item.statusName}}</div>
									</div>
								</div>
							</mescroll-uni>
						</template>
					</div>
				</swiper-item>
			</swiper>
		</div>
	</div>
</template>

<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import utils from '../../utils/utils.js'
	import ajax from "@/utils/ajax.js"
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				option: {
					cur: 0
				},
				TabCur: 0,
				p1: 1,
				p2: 1,
				cumulative: 0,
				today: 0,
				integral: 0,
				down: {
					use: false
				},
				up: {
					noMoreSize: 1,
					textNoMore: '— 只显示最近7天的金币明细哦 —'
				},
				up1: {
					noMoreSize: 1,
					textNoMore: '— 没有更多兑换记录了哦 —'
				},
				tabList: [{
						name: '金币明细'
					},
					{
						name: '兑换记录'
					}
				],
				integralList: [],
				exchangeList: [],
			}
		},
		onLoad(option) {
			if (typeof(option) != undefined) {
				this.option = option
			}
		},
		mounted() {
			this.TabCur = parseInt(this.option.cur);
		},
		components: {
			WucTab,
			MescrollUni
		},
		methods: {
			tabChange(v) {},
			swiperChange(v) {
				this.TabCur = v.detail.current;
			},
			mescrollInit() {

			},
			downCallback() {

			},
			getTab(e) {
				let tab = 0;
				if (typeof(this.$refs.mescroll) !== undefined) {
					this.$refs.mescroll.some((item)=>{
						if(typeof(item.viewId)=='undefined'){
							return;
						}
						if (item.viewId == e.viewId) {
							tab = 0;
						} else {
							tab = 1;
						}
						return true;
					})
				}
				
				return tab;
				
			},
			jump() {
				uni.switchTab({
					url: '../gift/index'
				})
			},
			upCallback(e) {
				let tab = this.getTab(e);
				if (tab === 0) {
					ajax.get({
						url: 'Integral/getIntegralLog',
						data: {
							type: 0,
							p: this.p1
						}
					}).then((res) => {
						let data = res.data;
						this.integralList = this.integralList.concat(data.data.list)
						if (data.data.topData) {
							this.cumulative = data.data.topData.cumulative
							this.today = data.data.topData.today;
							this.integral = data.data.topData.integral
						}
						e.endUpScroll(data.data.endPage);
					})
				} else {
					ajax.get({
						url: 'Gift/getRecord',
						data: {
							page: this.p2
						}
					}).then((res) => {
						let data = res.data;
						data.data.list.map((item) => {
							item.addtime = utils.dateFtt('yyyy-MM-dd hh:mm:ss', item.addtime)
						})
						this.exchangeList = this.exchangeList.concat(data.data.list)
						e.endUpScroll(data.data.endPage);
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.main {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}

	.block {
		margin-bottom: 25rpx;
		background-color: #fff;
		padding: 40rpx 50rpx;
	}

	.header {
		.line {
			.item {
				.tip {
					font-size: 26rpx;
					color: #323232;

					.num {
						color: #ff8900;
					}
				}
			}

			.exchange {
				display: flex;
				justify-content: space-between;
				padding-top: 30rpx;

				.money {
					font-size: 60rpx;
					color: #323232;
				}

				.button {
					padding: 5rpx 40rpx;
					background-image: linear-gradient(90deg, #ffc02a 0%, #ff9102 100%), linear-gradient(#df8d37, #df8d37);
					background-blend-mode: normal, normal;
					border-radius: 80rpx;
					margin: 10rpx 0rpx;
					font-size: 28rpx;
					color: #ffffff;
					display: flex;
					justify-content: center;
					align-items: center;

					.text {
						line-height: 1;
					}
				}
			}

		}

		.info {
			border-top: 1px solid #f5f5f5;
			margin-top: 20rpx;
			padding-top: 20rpx;
			display: flex;

			.item {
				flex: 1;
				display: flex;
				flex-direction: column;

				.title {
					font-size: 22rpx;
					color: #555555;
					margin-bottom: 10rpx;
				}

				.value {
					font-size: 38rpx;
					color: #323232;
				}
			}
		}
	}

	.tab {
		padding-top: 10rpx;
		flex: 1;
		display: flex;
		flex-direction: column;

		.swiper {
			flex: 1;
		}
	}

	/deep/.tabclass {
		margin-bottom: 20rpx;

		.uni-scroll-view-content {
			display: flex;
			justify-content: center;
		}

		>._div {
			display: flex;
			justify-content: center;
		}

		>._div>div {
			display: flex;
		}

		.uni-scroll-view-content>div {
			display: flex;
		}

		.wuc-tab-item {
			height: auto;
			font-size: 28rpx;
			color: #333333;
			border: none;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			line-height: 60rpx;
		}

		.wuc-tab-item::after {
			content: '';
			width: 70%;
			height: 6rpx;
			background-color: transparent;
			border-radius: 6rpx;
			font-weight: bold;
		}

		.wuc-tab-item.cur::after {
			background-color: #111111;
		}
	}

	/deep/.list .mescroll-uni-fixed {
		top: 0 !important;
	}

	.integral-item {
		.label {
			font-size: 30rpx;
			color: #111111;
			display: flex;
			align-items: center;
		}

		.list {
			margin: 48rpx 0rpx 48rpx 32rpx;
		}

		.log {
			margin-top: 41rpx;
			display: flex;
			justify-content: space-between;

			.time {
				color: #555555;
				font-size: 25rpx;
			}

			.integral {
				font-size: 28rpx;
				color: #ff8900;
				display: flex;
				align-items: center;

				.img {
					display: block;
					width: 33rpx;
					height: 33rpx;
					margin-right: 9rpx;
				}
			}
		}
	}

	.exchange-item {

		.top,
		.bottom {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.label {
			font-size: 30rpx;
			color: #111111;
			display: flex;
			align-items: center;
		}

		.money {
			color: #ff8900;
		}

		.bottom {
			margin-top: 30rpx;
			font-size: 22rpx;
			color: #666666;
		}

		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 1px solid #f5f5f5;

	}

	.quan {
		width: 16rpx;
		height: 16rpx;
		background: #17ce8f;
		border: 4rpx solid #a2ebd2;
		border-radius: 20rpx;
		margin-right: 8rpx;
	}
</style>
