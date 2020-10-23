<template>
	<view class="tbody">
		<view class="cont" v-if="noIncome">
			<view class="contList" v-for="(item,index) in contData">
				<view class="priceTop">
					<text>{{item.typeName}}</text>
					<text>{{item.money*1000/10}}</text>
				</view>
				<view class="priceBottom">
					<text>{{item.descr}}</text>
					<view class="">
						{{item.addtime}}
						<!-- <text>10:16</text> -->
					</view>
				</view>
			</view>
		</view>
		<view class="cont2" v-else='noIncome'>
			<view class="cont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/income/cont.png" mode="aspectFit"></image>
			</view>
			<text>还没有收入哦~</text>
			<view class="cont2-btn" @click="noincome">去购买</view>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				contData: [],
				dataTime: 0,
				noIncome:true
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				},
			})
		},
		mounted() {
			this.getEarnings()
		},
		methods: {
			// 暂无数据跳转
			noincome(){
				uni.navigateTo({
					url:'../index/index'
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
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m; //年月日
			
			},
			getEarnings() {
				$axios.get({
					url: 'User/getFlow',
					data: {
						p: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.contData = res.data.data.list
						if(this.contData.length == 0){
							this.noIncome = false
						}else{
							this.contData.forEach(item =>{
								item.addtime = this.happenTimeFun(item.addtime)
							})
						}
						
						
					}
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		.income-hd {
			background-image: linear-gradient(90deg,
				#ff6662 0%,
				#ff423e 100%),
				linear-gradient(#ff6666,
				#ff6666);
		}

		.cont {
			background: #fff;
			padding: 44rpx 20rpx 0 20rpx;

			.contList {
				padding: 0 17rpx 35rpx 18rpx;
				border-bottom: 1px solid #f5f5f5;
				margin-bottom: 34rpx;

				.priceTop {
					display: flex;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 30rpx;
						color: #111;
					}

					text:nth-of-type(2) {
						font-size: 32rpx;
						color: #ff3632;
					}
				}

				.priceBottom {
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;

					text {
						font-size: 24rpx;
						color: #777;
					}

					view {
						font-size: 24rpx;
						color: #777;

						text {
							margin-left: 15rpx;
						}
					}
				}
			}
		}
	
		.cont2 {
			position: absolute;
			top: 429rpx;
			left: 50%;
			transform: translateX(-50%);
			text-align: center;
			&-img {
				width: 212rpx;
				height: 200rpx;
				margin-bottom: 25rpx;
				margin: 0 auto;
				image {
					width: 212rpx;
					height: 200rpx;
				}
			}
		
			text {
				
				font-size: 24rpx;
				color: #999;
			}
		
			&-btn {
				width: 240rpx;
				height: 64rpx;
				margin-top: 40rpx;
				background-image: linear-gradient(90deg,
					#ff6662 0%,
					#ff423e 100%),
					linear-gradient(#fde5c3,
					#fde5c3);
				border-radius: 32rpx;
				color: #fff;
				font-size: 28rpx;
				text-align: center;
				line-height: 64rpx;
			}
		}
	}
</style>
