<template>
	<view class="tBody">
		<view class="cont">
			<view class="cont-list">
				<view class="cont-list-item" v-for="(item,index) in record" :key='index'>
					<view class="dateTitle">
						<view class="title">{{item.typeName}}</view>
						<view class="notion">{{item.descr}}</view>
					</view>
					<view class="gold" :class="item.money>0?'':'isAct'">
						<text>{{item.money>0?'+'+item.money:item.money}}</text>
						<view class="date">{{item.addtime}}</view>
					</view>
				</view>
				<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				<view class="noData" v-if='noData'>
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
				type: 'babance',
				record: [],
				baban: false,
				btnText: '',
				paging: 1,
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
			};
		},
		onLoad(option) {
			this.type = option.type
		},
		mounted() {
			if (this.isLogin) {
				this.getMyGold()
				this.load = true
			} else {
				uni.$on('login', (res) => {
					this.getMyGold()
					this.load = true
				})
			}
		},
		methods: {
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
			getMyGold() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				if (this.type == 'babance') {
					this.baban = true
					this.btnText = '提现'
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
									this.noData = true
								} else {
									this.noMoreData = true
								}
							}
						}
						this.loadingMore = false;
					}).catch(err => {
						this.loadingMore = false;
					})
				} else {
					this.baban = false
					this.btnText = '赚金币'
					uni.setNavigationBarTitle({
						title: '我的金币'
					})
					ajax.get({
						url: 'Integral/getIntegralLog',
						data: {
							p: this.paging
						}
					}).then(res => {
						if (res.data.code == 200) {
							res.data.data.list.forEach((item) => {
								this.record.push(item)
							})
							this.record = this.record
							if (res.data.data.list.length) {
								this.paging++
							} else {
								if (this.paging == 1 && res.data.data.list.length == 0) {
									this.noMoreData = true
									this.noData = true
								} else {
									this.noMoreData = true
								}
							}
						}
						this.loadingMore = false;
					}).catch(err => {
						this.loadingMore = false;
					})

				}
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
		min-height: 100vh;
		background: #fff;
	}

	.banner {
		width: 100%;
		height: 443rpx;
		box-sizing: border-box;
		padding-top: 170rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner3.png)no-repeat;
		background-size: 100% 100%;

		.myGold {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx 0 50rpx;

			.left {
				.name {
					font-size: 28rpx;
					color: #fff;
				}

				.money {
					font-size: 50rpx;
					color: #fff;
					font-weight: bold;
					padding-top: 20rpx;
					text-align: center;
				}
			}

			.btns {
				width: 145rpx;
				height: 55rpx;
				background: #FFFFFF;
				border-radius: 28rpx;
				color: #3094F3;
				font-size: 24rpx;
				font-weight: bold;
				text-align: center;
				line-height: 55rpx;
			}
		}
	}

	.cont {
		margin: 0 auto;
		margin-bottom: 30rpx;
		box-sizing: border-box;
		padding: 30rpx;
		background: #FFFFFF;


		&-title {
			padding-top: 10rpx;
			font-size: 32rpx;
			color: #343434;
			font-weight: bold;
		}

		&-list {
			padding-top: 36rpx;

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
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;
				padding: 38rpx 0;
				border-bottom: 1px solid #f5f5f5;
				// &:nth-last-child(1){
				// 	border:none;
				// }
				.dateTitle {
					.title {
						font-size: 28rpx;
						color: #343434;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 1;
					}
					.notion{
						font-size: 24rpx;
						color: #777;
						margin-top: 16rpx;
					}
				}

				.gold {
					padding-left: 20rpx;
					text-align: right;
					.date {
						font-size: 22rpx;
						color: #9A9A9A;
						margin-top: 16rpx;
					}
					text {
						font-size: 32rpx;
						color: #ff2e12;
					}
				}
				.isAct{
					text{
						color: #111;
					}
				}
			}
			&-item:nth-last-of-type(2){
				border: none!important;
			}
		}
	
	}
</style>
