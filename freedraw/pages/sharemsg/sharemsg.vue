<template>
	<view class="content">
		<view class="msg_list" v-if="!noDataCont">
			<view class="msg_box" v-for="(item,index) in dataList" :key="index">
				<view class="msg_time">
					{{item.addtime}}
				</view>
				<view class="msg_content">
					<view class="msg_content_text">
						{{item.title}}
					</view>
					<view class="msg_content_box">
						<image class="msg_img" :src="item.image" mode="widthFix"></image>
						<view class="msg_text">
							<view class="title">
								{{item.contents.title}}
							</view>
							<view class="info">
								{{item.contents.description}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<loading :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
		<view class="no_msg" v-else>
			<image class="no_msg_img" src="../../static/freedraw/msg/no_msg2x.png" mode="aspectFit"></image>
			<view class="fir_text">
				暂无消息
			</view>
			<view class="sec_text">
				您还没有收到消息哦
			</view>
		</view>
	</view>
</template>

<script>
	import load from '../../components/load/load.vue'
	import ajax from '../../utils/ajax.js'
	import adSwiper from '../../components/adSwiper/adSwiper.vue'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				loadingMore: false,
				noMoreData: false,
				noData: false,
				paging: 1,
				isnomsg: true,

				noDataCont: false,
				dataList: []
			}
		},
		mounted() {
			this.getNewsList()
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
			getNewsList() {
				this.isInit = true
				// if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				this.noMoreData = false;
				ajax.get({
					url: 'UserLuckyNews/getList',
					data: {
						types: 1,
						page: this.paging
					}
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.data.endPage == true){
							this.paging--;
							if(res.data.data.list.length == 0){
								this.noData = true;
								this.noDataCont = true;
							}else{
								if(this.dataList.length == 0){
									res.data.data.list.forEach(item => {
										item.addtime = this.happenTimeFun(item.addtime);
										this.dataList.push(item);
									})	
								}
								this.noData = false;
								this.noMoreData = true;
							}
						}else{
							res.data.data.list.forEach(item => {
								item.addtime = this.happenTimeFun(item.addtime);
								this.dataList.push(item);
							})
							this.noData = false;
						}
						// if (res.data.data.list.length > 0) {
						// 	res.data.data.list.forEach(item => {
						// 		item.addtime = this.happenTimeFun(item.addtime)
						// 		this.dataList.push(item)
						// 	})
						// } else {
						// 	this.isnomsg = false
						// }

						// if (res.data.data.list.length) {
						// 	this.paging++
						// } else {
						// 	if (this.paging == 1 && res.data.data.list.length == 0) {
						// 		this.noMoreData = true
						// 		this.noDataCont = true
						// 		this.noData = true
						// 	} else {
						// 		this.noMoreData = true
						// 	}
						// }
					}
					this.loadingMore = false;
				}).catch(err => {
					this.loadingMore = false;
				})
			},
		},
		onReachBottom() {
			this.paging++;
			this.getNewsList()
		}
	}
</script>

<style lang="less" scoped>
	.content {
		padding: 0 28rpx;

		.msg_list {
			.msg_box {
				.msg_time {
					text-align: center;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #888888;
					padding: 20rpx 0;
				}

				.msg_content {
					background: #FFFFFF;
					border-radius: 24rpx;
					padding: 40rpx 24rpx;

					.msg_content_text {
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #343434;
						margin-bottom: 30rpx;
					}

					.msg_content_box {
						display: flex;
						align-items: center;

						background: #F8F8F8;
						border-radius: 20rpx;
						padding: 14rpx;
						.msg_img{
							width: 108rpx;
							height: 108rpx;
							border-radius: 10rpx;
							margin-right: 20rpx;
						}

						.msg_text {
							.title {
								font-size: 28rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #121212;
								margin-bottom: 20rpx;
							}

							.info {
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #888888;
							}
						}
					}
				}
			}
		}

		.no_msg {
			text-align: center;
			padding: 250rpx 0 0 0;

			.no_msg_img {
				display: inline-block;
				width: 428rpx;
				height: 276rpx;
				margin-bottom: 42rpx;
			}

			.fir_text {
				font-size: 37rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				margin-bottom: 30rpx;
			}

			.sec_text {
				font-size: 24rpx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #999999;
			}
		}
	}
</style>
