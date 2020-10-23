<template>
	<view class="tbody">
		<view class="remind">
			<view class="left"><text>{{sum}}</text>条未读消息</view>
			<view class="right">
				<image :src="item.img" mode="aspectFill"></image><text @click="deletGift">清除未读</text>
			</view>
		</view>
		<!-- 消息列表 -->
		<view class="cont">
			<view class="cont-list" v-for="(item,index) in giftData" :key='index' @click="listClickFn(index)">
				<view class="cont-list-left">
					<view class="imgBox" :class="{ddimg:item.actimg}">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/gift/icon.png" mode="aspectFill"></image>
					</view>
					<view class="textBox">
						<view class="title">{{item.title}}</view>
						<view class="text">{{item.content}}</view>
					</view>
				</view>
				<view class="cont-list-right">{{item.addtime}}</view>
			</view>
		</view>
	
		<view class="cont2" v-if='noIncome'>
			<view class="cont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/gift/nogift.png" mode="aspectFit"></image>
			</view>
			<text>还没有消息哦~</text>
		</view>
	</view>
</template>
<script>
	import $axios from '../../utils/ajax.js'
	export default {

		data() {
			return {
				actimg: true,
				giftData: [],
				actimgSum:[],
				sum: 0,
				noIncome : false
			};
		},
		mounted() {
			this.getPush()
		},
		methods: {
			deletGift(){
				this.postSetGift()
			},
			// 消息点击事件
			listClickFn(index) {
				if(this.giftData[index].actimg == true){
					this.giftData[index].actimg = false
					this.sum --;
				}
				
				
			},
			// 转换时间戳
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
			getPush() {
				$axios.get({
					url: 'push/getList',
					data: {
						p: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.list.length != 0) {
							this.noIncome = false
							res.data.data.list.forEach(item => {
								item.addtime = this.happenTimeFun(item.addtime)
								
								if(item.read == 1){
									item.actimg = false
								}else{
									item.actimg = true	
									this.actimgSum.push(item.read)
								}
							})
							this.giftData = res.data.data.list
							this.sum = this.actimgSum.length
						}else{
							this.noIncome = true
						}
					}
					console.log(res)
				}).catch(err => {
					console.log(err)
				})
			},
			postSetGift(){
				$axios.post({
					url:'push/setRead'
				}).then(res =>{
					console.log(res)
				})
			}
		}

	}
</script>

<style lang="less" scoped>
	.tbody {
		padding: 0 20rpx;

		.remind {
			display: flex;
			justify-content: space-between;
			line-height: 66rpx;

			.left {
				font-size: 24rpx;
				font-weight: 500;
				color: #666666;

				text {
					color: #FE312C;
				}
			}

			.right {
				image {
					width: 20rpx;
					height: 20rpx;
					vertical-align: middle;
				}

				text {
					font-size: 20rpx;
					color: #999;
					vertical-align: middle;
				}
			}
		}

		.cont {
			&-list {
				margin-bottom: 18rpx;
				background: #FFFFFF;
				border-radius: 16rpx;
				padding: 25rpx 19rpx 25rpx 18rpx;
				display: flex;
				justify-content: space-between;

				// align-items: center;
				&-left {
					display: flex;

					.imgBox {
						width: 80rpx;
						height: 80rpx;

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 50%;
						}
					}

					.ddimg {
						position: relative;

						&::before {
							position: absolute;
							content: '';
							right: 5rpx;
							top: 5rpx;
							width: 12rpx;
							height: 12rpx;
							background: #FE312C;
							border-radius: 50%;
						}
					}

					.textBox {
						padding: 8rpx 0;
						margin-left: 18rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.title {
							font-size: 26rpx;
							font-weight: 500;
							color: #333333;
						}

						.text {
							color: #888888;
							font-size: 20rpx;
						}
					}
				}

				&-right {
					font-size: 18rpx;
					color: #888;
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
