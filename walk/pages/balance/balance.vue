<template>
	<view class="tBody">
		<view class="banner">
			<view class="myGold">
				<view class="left">
					<view class="name">
						<image src="/static/walk/amend/wallet.png" mode="widthFix"></image><text>我的余额(元)</text>
					</view>
					<view class="button">
						<view class="money">{{user.walk_money}}</view>
						<view v-if="tpstry" class="btns" @click="toClick">提现</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cont">
			<!-- <view class="cont-title">{{type == 'babance'?'金额':'多多币'}}明细</view> -->
			<view class="cont-list">
				<view class="cont-list-item" v-for="(item,index) in record" :key='index'>
					<view class="dateTitle">
						<view class="title">{{item.typeName}}</view>
						<view class="money" :style="{color:item.money>0?'#FF7A07':'#121212' }">{{item.money>0?'+'+item.money:item.money}}</view>
					</view>
					<view class="content">
						<view class="contLeft">{{item.descr}}</view>
						<view class="time">{{item.addtime}}</view>
					</view>
				</view>
				<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				<view v-if='isShowds' class="noData">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/icon/nodata.png" mode="widthFix"></image>
					<view>暂无内容</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				isShowds: false,
				false: true,
				record: [],
				paging: 1,
				loadingMore: false,
				noMoreData: false,
				noData: true,
				isInit: false,
				tpstry: true,
			};
		},
		onLoad(option) {
			if (typeof option.types != 'undefined') {
				if (option.types == 1) {
					this.tpstry = false
				}
			}
		},
		mounted() {
			this.getMyGold()
		},
		methods: {
			toClick() {
				uni.navigateTo({
					url: '/pages/withdraw/withdraw'
				})
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
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m; //年月日

			},
			getMyGold() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'User/getFlow',
					data: {
						p: this.paging
					}
				}).then(res => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item) => {
							item.addtime = this.happenTimeFun(item.addtime)
							this.record.push(item)
						})
						this.record = this.record
						if (res.data.data.list.length) {
							this.paging++
						} else {
							if (this.paging == 1 && res.data.data.list.length == 0) {
								this.noMoreData = true
								this.isShowds = true
							} else {
								this.noData = false
								this.noMoreData = true
							}

						}
					}
					this.loadingMore = false;
				}).catch(err => {
					this.loadingMore = false;
				})
			}
		},
		onReachBottom() {
			this.getMyGold()
		},
		//获取用户信息
		computed: {
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

<style lang="less">
	.tBody {
		min-height: 100hv;
		background-color: #fff;
	}

	.banner {
		width: 710rpx;
		height: 220rpx;
		margin: 0 auto;
		background: url(/static/walk/amend/banner1.png)no-repeat;
		background-size: 100% 100%;

		.myGold {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 50rpx 40rpx 0 36rpx;

			.left {
				width: 100%;

				.name {
					text {
						font-size: 28rpx;
						color: #fff;
						padding-left: 8rpx;
					}

					image {
						width: 26rpx;
					}
				}

				.button {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					.money {
						font-size: 50rpx;
						color: #fff;
						font-weight: bold;
						padding-top: 20rpx;
					}

					.btns {
						width: 145rpx;
						height: 55rpx;
						box-sizing: border-box;
						border: 1px solid #fff;
						border-radius: 28rpx;
						color: #fff;
						font-size: 24rpx;
						font-weight: bold;
						text-align: center;
						line-height: 55rpx;
					}
				}
			}
		}
	}

	.cont {
		padding: 4rpx 38rpx 0 38rpx;
		background: #FFFFFF;
		border-radius: 24rpx;


		&-title {
			padding-top: 10rpx;
			font-size: 32rpx;
			color: #343434;
			font-weight: bold;
		}

		&-list {
			.noData {
				padding: 50rpx;
				text-align: center;
				font-size: 29rpx;
				font-weight: bold;
				color: #666666;

				image {
					width: 400rpx;
				}
			}

			&-item {
				box-sizing: border-box;
				padding: 34rpx 0;
				border-bottom: 1px solid #F5F5F5;

				&:nth-last-of-type(1) {
					border-bottom: none;
				}


				.dateTitle {
					width: 100%;
					display: flex;
					justify-content: space-between;

					.title {
						font-size: 30rpx;
						color: #121212;
						overflow: hidden;
					}

					.money {
						font-size: 32rpx;
						color: #FF7A07;
					}
				}

				.content {
					padding-top: 16rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.contLeft {
						font-size: 24rpx;
						color: #787878;
					}

					.time {
						font-size: 24rpx;
						color: #787878;
					}
				}
			}

			.border:nth-last-of-type(2) {
				border-bottom: none;
			}

		}
	}
</style>
