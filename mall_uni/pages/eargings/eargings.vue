<template>
	<view class="tbody">
		<!-- TO-DO 累计收益 -->
		<view class="cumulative">
			<view class="ativeTitle">收入累计（集分宝）</view>
			<view class="activePrice"><text>{{income.money*1000/10}}</text></view>
			<view class="theGoods">
				<view class="goodsLis">
					<view class="">本月确认收货</view>
					<text>{{income.thismonth_receiving*1000/10}}</text>
				</view>
				<view class="goodsLis">
					<view class="">上月确认收货</view>
					<text>{{income.lastmonth_receiving*1000/10}}</text>
				</view>
				<view class="goodsLis">
					<view class="">待确认收货</view>
					<text>{{income.notreceiving}}</text>
				</view>
			</view>
			<view class="remind">
				每月21号可提现，上月确认收货的订单收入
			</view>
		</view>
		<!-- TO-DO 日收益 -->
		<view class="dayRemind">
			<view class="dayRemind-Title">
				<view class="dayRemind-Title-left">
					<view class=""></view>
					<text>日预估收益</text>
				</view>
				<view class="dayRemind-Title-right" @click="dayName">
					<text>名词解释</text>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/egrgings/icon.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="dayRemind-cont">
				<view class="dayRemind-cont-icon">
					今日
				</view>
				<view class="dayRemind-cont-list">
					<view class="goodsLis">
						<view class="">{{income.day.num}}</view>
						<text>付款订单数</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.day.money*1000/10}}</view>
						<text>付款预估收益</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.day.settl_money}}</view>
						<text>结算预估收益</text>
					</view>
				</view>
			</view>
			<view class="dayRemind-cont">
				<view class="dayRemind-cont-icon yesterday">
					昨日
				</view>
				<view class="dayRemind-cont-list">
					<view class="goodsLis">
						<view class="">{{income.yesterday.num}}</view>
						<text>付款订单数</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.yesterday.money*1000/10}}</view>
						<text>付款预估收益</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.yesterday.settl_money}}</view>
						<text>结算预估收益</text>
					</view>
				</view>
			</view>
		</view>

		<!-- TO-DO 月收益 -->
		<view class="dayRemind">
			<view class="dayRemind-Title">
				<view class="dayRemind-Title-left">
					<view class=""></view>
					<text>月预估收益</text>
				</view>
				<view class="dayRemind-Title-right" @click="monthName">
					<text>名词解释</text>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/egrgings/icon.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="dayRemind-cont">
				<view class="dayRemind-cont-icon">
					本月
				</view>
				<view class="dayRemind-cont-list">
					<view class="goodsLis">
						<view class="">{{income.month.num}}</view>
						<text>付款订单数</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.month.money*1000/10}}</view>
						<text>付款预估收益</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.month.settl_money}}</view>
						<text>结算预估收益</text>
					</view>
				</view>
			</view>
			<view class="dayRemind-cont">
				<view class="dayRemind-cont-icon yesterday">
					上月
				</view>
				<view class="dayRemind-cont-list">

					<view class="goodsLis">
						<view class="">{{income.lastmonth.num}}</view>
						<text>付款订单数</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.lastmonth.money*1000/10}}</view>
						<text>付款预估收益</text>
					</view>
					<view class="goodsLis">
						<view class="">{{income.lastmonth.settl_money}}</view>
						<text>结算预估收益</text>
					</view>
				</view>
			</view>
		</view>
		<view class="hideShowBox" v-show="isHideShow">
			<view class="hideShow">
				<view class="title">{{contTitle}}</view>
				<view class="textBox">
					<view class="text" v-for="(show,showIn) in isHideShowArr" :key='showIn'>{{show}}</view>
				</view>
				<view class="btn" @click="isHides">
					我知道了
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	export default {
		data() {
			return {
				income: {
					money: 0,
					sum_money: 0,
					lastmonth_receiving: 0,
					thismonth_receiving: 0,
					notreceiving: 0,
					day: {
						num: 0,
						money: 0,
						settl_money: 0
					},
					yesterday: {
						num: 0,
						money: 0,
						settl_money: 0
					},
				},
				isHideShow: false,
				isHideShowArr:[],
				contTitle:''
			}
		},
		mounted() {
			this.getUserprofilt()
		},
		methods: {
			// 日
			dayName() {
				this.isHideShowArr = this.income.day_descr
				this.isHideShow = true
				this.contTitle = '日预估收益'
			},
			// 我知道了
			isHides(){
				this.isHideShow = false
			},
			// 月
			monthName(){
				this.isHideShowArr = this.income.month_descr
				this.isHideShow = true
				this.contTitle = '月预估收益'
			},
			getUserprofilt() {
				$axios.get({
					url: 'User/getProfit'
				}).then(res => {
					if (res.data.code == 200) {
						this.income = res.data.data
						console.log(this.income)
					}
				}).catch(err => {})
			},
		}
	}
</script>

<style lang="less">
	.tbody {

		// TO-DO haed收益累计
		.cumulative {
			background: #fff;

			.ativeTitle {
				color: #333;
				font-size: 28rpx;
				padding-top: 30rpx;
				text-align: center;
			}

			.activePrice {
				text-align: center;
				color: #ff3632;
				font-size: 38rpx;
				margin-top: 20rpx;

				text {
					font-size: 56rpx;
				}
			}

			.theGoods {
				padding-top: 50rpx;
				display: flex;
				padding-bottom: 20rpx;

				.goodsLis {
					box-sizing: border-box;
					flex: 1;
					text-align: center;
					border-right: 1px solid #e6e6e6;

					view {
						font-size: 24rpx;
						color: #6e6e6e;
					}

					text {
						font-size: 22rpx;
						color: #000;
					}
				}
			}

			.remind {
				font-size: 24rpx;
				color: #ff3632;
				line-height: 60rpx;
				padding-left: 38rpx;
				background: rgba(255, 238, 238, 0.7);
			}
		}

		// TO-DO预估收益
		.dayRemind {
			margin-top: 38rpx;
			padding: 0 20rpx 15rpx 20rpx;

			&-Title {
				display: flex;
				justify-content: space-between;
				align-items: center;

				&-left {
					display: flex;
					align-items: center;

					view {
						width: 4rpx;
						height: 30rpx;
						background-color: #1e1e1e;
						border-radius: 2rpx;
						margin-right: 14rpx;
					}

					text {
						font-size: 30rpx;
						color: #000;
					}
				}

				&-right {
					display: flex;
					align-items: center;

					text {
						font-size: 24rpx;
						color: #999;
					}

					image {
						width: 29rpx;
						height: 29rpx;
						margin-left: 8rpx;
					}
				}
			}

			&-cont {
				background-color: #ffffff;
				border-radius: 16rpx;
				margin-top: 23rpx;

				&-icon {
					width: 111rpx;
					height: 41rpx;
					background-image: linear-gradient(90deg,
						#ff6662 0%,
						#ff423e 100%),
						linear-gradient(#ea3200,
						#ea3200);
					background-blend-mode: normal,
						normal;
					border-radius: 16rpx 0rpx 20rpx 0rpx;
					font-size: 26rpx;
					color: #fff;
					text-align: center;
					line-height: 41rpx;
				}

				.yesterday {
					background: #999;
				}

				&-list {
					display: flex;
					padding: 32rpx 0 40rpx 0;

					.goodsLis {
						box-sizing: border-box;
						flex: 1;
						text-align: center;
						border-right: 1px solid #e6e6e6;

						&:nth-last-child(1) {
							border: none;
						}

						view {
							font-size: 32rpx;
							color: #000;
						}

						text {
							font-size: 24rpx;
							color: #666;
						}
					}
				}
			}
		}

		.hideShowBox {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			background: rgba(0, 0, 0, 0.6);

			.hideShow {
				position: absolute;
				left: 50%;
				top: 50%;
				width: 530rpx;
				transform: translate(-50%,-50%);
				border-radius: 20rpx 20rpx 21rpx 21rpx;
				overflow: hidden;
				padding-bottom: 48rpx;
				background: #fff;

				.title {
					width: 100%;
					height: 134rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/egrgings/earginBG.png)no-repeat;
					background-size: 100% 100%;
					line-height: 134rpx;
					text-align: center;
					color: #fff;
					font-size: 34rpx;
				}

				.textBox {
					padding: 36rpx 50rpx 38rpx 53rpx;

					.text {
						font-size: 24rpx;
						color: #444;
						font-weight: 500;
						line-height: 49rpx;
					}
				}

				.btn {
					width: 441rpx;
					height: 86rpx;
					margin: 0 auto;
					text-align: center;
					line-height: 86rpx;
					background: linear-gradient(90deg, #FF6662, #FF433E);
					border-radius: 43rpx;
					font-size: 30rpx;
					color: #fff;
				}
			}
		}
	}
</style>
