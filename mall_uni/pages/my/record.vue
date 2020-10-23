<template>
	<view class="content">
		<view class="navigate">
			<view @click="switchingState" class="navigate__item" :class="currentType==0?'navigate__item--selected':''" data-type="0">
				全部
			</view>
			<view @click="switchingState" class="navigate__item" :class="currentType==1?'navigate__item--selected':''" data-type="1">
				开奖中
			</view>
			<view @click="switchingState" class="navigate__item" :class="currentType==2?'navigate__item--selected':''" data-type="2">
				已开奖
			</view>
			<view class="navigate__slider" :style="{'width': '80px','left': sliderLeft+'px', 'transform': 'translateX('+sliderOffset+'px)', '-webkit-transform': 'translateX('+sliderOffset+'px)'}"></view>
		</view>
		<view class="record">
				<view class="record__item" v-for="(item,index) in list" :key="index" @click="goCaptureDetail" :data-id="item.id">
					<image class="record__item__image" :src="item.goods_pic" mode="aspectFill"></image>
					<view class="record__item__info">
						<view class="record__item__info__title">
							{{item.goods_title}}
						</view>
						<view class="record__item__info__details">
							<view class="record__item__info__details__left">
								<view class="record__item__info__details__issue">
									期号：{{item.id}}
								</view>
								<view class="record__item__info__details__amount">
									参与次数：<text>{{item.userCount}}</text>人次
								</view>
								<view class="record__item__info__details__time">
									开奖时间：{{item.lottery_time|dateFtt}}
								</view>
							</view>
							<image v-if="item.log_status === '0'" class="record__item__info__details__right" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/record/status0.png" mode="aspectFill"></image>
							<image v-if="item.log_status === '1'" class="record__item__info__details__right" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/record/status1.png" mode="aspectFill"></image>
							<image v-if="item.log_status === '-1'" class="record__item__info__details__right" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/record/status2.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<loading v-if="!noData" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
			<view class="record__nodate" v-if="noData">
				<image class="record__nodate__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/record/nodate.png" mode="aspectFill"></image>
				<view class="record__nodate__title">
					您当前没有任何夺宝记录
				</view>
				<view class="record__nodate__subtitle">
					快去参与金币夺宝吧
				</view>
				<view class="record__nodate__button" @click="goCapture">
					立即夺宝
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from "../../utils/ajax.js";
	import utils from "../../utils/utils.js";

	export default {
		data() {
			return {
				currentType: 0,
				scrollTop: 0,
				activeIndex: 0,
				sliderLeft: 0,
				sliderOffset: 0,

				loadingMore: false,
				noMoreData: false,
				noData: false,
				currentPageNumber: 1,

				list: [],
			};
		},
		onLoad(option) {
			var that = this;
			if (option.currentType != '') {
				that.currentType = option.currentType
			}
			uni.getSystemInfo({
				success: function(res) {
					that.sliderLeft = (res.windowWidth / 3 - 80) / 2
					that.sliderOffset = res.windowWidth / 3 * (that.currentType)
				}
			});
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			// 切换栏目
			switchingState(e) {
				if(this.currentType == e.currentTarget.dataset.type) return
				this.sliderOffset = e.currentTarget.offsetLeft
				this.currentType = e.currentTarget.dataset.type
				
				this.list = []
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.currentPageNumber = 1
				this.getList()
			},
			
			// 获取数据
			getList() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'Capture/record',
					data: {
						page: this.currentPageNumber,
						type: this.currentType
					},
					login: false,
					loading: false,
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item, index, array) => {
							this.list.push(item)
						})
						if (res.data.data.list.length > 0) {
							this.currentPageNumber++
						} else {
							if (this.currentPageNumber == 1 && res.data.data.list.length == 0) {
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
			goCaptureDetail(e){
				uni.navigateTo({
				    url: '/pages/duobao/detail?id=' + e.currentTarget.dataset.id
				});
			},
			goCapture(){
				uni.navigateTo({
				    url: '/pages/duobao/index'
				});
			},
		},
		filters: {
			dateFtt(val) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', val);
			},
		},
	}
</script>

<style lang="scss">
	.navigate {
		background: #fff;
		width: 750rpx;
		position: fixed;
		top: 0px;
		left: 0;
		z-index: 999;
		display: flex;
		padding-bottom: 4rpx;

		&__item {
			flex: 1;
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;
			font-size: 32rpx;
			color: #333333;


			&--selected {
				color: #fe5b34;
				font-weight: bold;
			}
		}

		&__slider {
			position: absolute;
			content: " ";
			left: 0;
			bottom: 0;
			height: 4rpx;
			background-color: #fe5b34;
			border-radius: 1px 1px 0 0;
			-webkit-transition: -webkit-transform 0.3s;
			transition: -webkit-transform 0.3s;
			transition: transform 0.3s;
			transition: transform 0.3s, -webkit-transform 0.3s;
		}
	}

	.record {
		margin-top: 113rpx;
		padding-bottom: 20rpx;

		&__item {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx;

			&__image {
				width: 152rpx;
				height: 152rpx;
				background-color: #ecedef;
				border-radius: 10rpx;
				border: solid 2rpx #ececec;
			}

			&__info {
				width: 510rpx;

				&__title {
					font-size: 30rpx;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					vertical-align: middle;
				}

				&__details {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 13rpx;

					font-size: 24rpx;
					color: #666666;

					&__issue {}

					&__amount {
						text {
							color: #fe5b34;
						}
					}

					&__time {}

					&__left {
						width: 390rpx;

						view {
							margin-bottom: 13rpx;
						}
					}

					&__right {
						width: 110rpx;
						height: 110rpx;
						opacity: 0.8;
					}
				}
			}
		}

		&__nodate {
			text-align: center;

			&__image {
				width: 398rpx;
				height: 190rpx;
				margin-top: 227rpx;
			}

			&__title {
				margin-top: 50rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
			}

			&__subtitle {
				margin-top: 29rpx;
				font-size: 24rpx;
				color: #999999;
			}

			&__button {
				width: 330rpx;
				height: 67rpx;
				line-height: 67rpx;
				background-image: linear-gradient(90deg,
					#fc9248 0%,
					#fe5833 100%);
				border-radius: 34rpx;
				margin: 60rpx auto 0;

				font-size: 28rpx;
				color: #ffffff;
			}
		}
	}
</style>
