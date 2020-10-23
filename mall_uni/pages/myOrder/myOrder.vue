<template>
	<view class="tbody">
		<!-- TO-DO tab列表 -->
		<view class="tab">
			<scroll-view class="tabScorll" scroll-x='true' show-scrollbar='false'>
				<view class="tab-item" :class="{tabBer:tabActive == index}" v-for="(item,index) in tabList" @click="isTab(index)">{{item.title}}</view>
			</scroll-view>

		</view>
		<view class="cont" v-if="myorder">
			<view class="cont-remind">温馨小提醒：订单付款成功后1-10分钟才会同步显示哦~</view>
			<view class="cont-list">
				<view class="cont-list-item" v-for="(contItem,contIndex) in dataList" :key="contIndex">
					<view class="cont-list-item-title">
						<view class="title-left">
							<view class="odd">订单单号：{{contItem.trade_id}}</view>
							<view class="btn">自购订单</view>
						</view>
						<view class="title-right" :style="{color:isColor}">{{contItem.status_name}}</view>
					</view>
					<view class="cont-list-item-center">
						<view class="imgBox">
							<image :src="contItem.pic" mode="aspectFit"></image>
						</view>
						<view class="centerRight">
							<view class="centerTitle">
								<view class="iconImgBox">
									<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/myOrder/tbIcon.png" mode="aspectFit"></image>
								</view>
								<view class="iconText">{{contItem.title}}</view>
							</view>
							<view class="centerPrice">
								<view class="centerPriceItem">
									<view class="name">付款金额</view>
									<view class="price">￥{{contItem.pay_price}}</view>
								</view>
								<view class="centerPriceItem">
									<view class="name">预估收入</view>
									<view class="price">{{contItem.user_money}}集分宝</view>
								</view>
							</view>
						</view>
					</view>
					<view class="cont-list-item-data">
						<view class="itemData">
							<view>付款时间：{{contItem.create_time}}</view>
							<view>结算时间：{{contItem.earning_time}}</view>
						</view>
						<view class="affirm">确认收货后次月21号到账</view>
					</view>
				</view>

			</view>
		</view>

		<view class="cont2" v-else='myorder'>
			<view class="cont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/myOrder/noorder.png" mode="aspectFit"></image>
			</view>
			<text>您还没有订单哦~</text>
			<view class="cont2-btn" @click="noMyorder">去下单</view>
		</view>
	</view>
</template>

<script>
	// import Header from '@/components/head/head.vue'
	import $axios from '../../utils/ajax.js'
	export default {
		components: {
			// Header
		},
		data() {
			return {
				tabList: [],
				tabActive: 0,
				dataList: [],
				myorder: true,
				isColor: '',
				isStatus: -2
			}
		},
		mounted() {
			this.getTab()
			this.getList()
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
			// 暂无数据跳转
			noMyorder() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			// tab列表
			getTab() {
				$axios.get({
					url: 'Order/getOption'
				}).then((res) => {
					if (res.data.code == 200) {
						this.tabList = res.data.data.status.list
					}
				}).catch(err => {})
			},
			//获取订单列表
			getList() {
				$axios.get({
					url: "Order/getList",
					data: {
						p: 1,
						status: this.isStatus
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.list.length == 0) {
							this.myorder = false
						} else {
							this.myorder = true
							this.dataList = res.data.data.list
							this.dataList.forEach((item) => {
								item.user_money = parseInt(item.user_money *100);
								item.create_time = this.happenTimeFun(item.create_time)
								item.earning_time = this.happenTimeFun(item.earning_time)
								switch (item.status) {
									case -1: //失效
										this.isColor = '#999'
										break;
									case 0: //付款
										this.isColor = '#000'
										break;
									case 1: //已收货
										this.isColor = '#00b004'
										break;
									case 2: //结算
										this.isColor = '#00b004'
										break;
									case 3: //维权创建
										this.isColor = '#f57900'
										break;
									case 4: //维权成功
										this.isColor = '#f57900'
										break;
									case 5: //违规
										this.isColor = '#ff0000'
										break;
								}
							})
						}
					}

				})
			},
			isTab(index) {
				this.tabActive = index
				this.isStatus = this.tabList[index].type
				this.getList()
			}
		}
	}
</script>

<style lang="less">
	.tbody {

		// TO-DO tab列表
		.tab {
			width: 100%;
			box-sizing: border-box;
			position: fixed;
			top: 0;
			left: 0;
			padding: 0 35rpx 0 40rpx;

			background: #ff0000;

			.tabScorll {
				width: 100%;
				white-space: nowrap;

				.tab-item {
					display: inline-block;
					color: #fff;
					font-size: 28rpx;
					margin: 0 30rpx;
					box-sizing: border-box;
					padding: 15rpx 0;

					&:nth-of-type(1) {
						margin-left: 0;
					}
				}

				.tabBer {
					border-bottom: 5rpx solid #fff;
				}
			}
		}

		.tabScorll::-webkit-scrollbar {
			display: none;
		}

		.cont {
			padding-top: 67rpx;
			@red: #ff3632;

			&-remind {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background-color: #ffe7e6;
				font-size: 24rpx;
				color: @red;
			}

			&-list {
				padding: 0 20rpx;
				margin-bottom: 60rpx;

				&-item {
					margin-top: 18rpx;
					padding: 25rpx 18rpx 13rpx 18rpx;
					background: #fff;
					border-radius: 16rpx;

					&-title {
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid #f5f5f5;
						padding-bottom: 15rpx;

						.title-left {
							display: flex;

							.odd {
								font-size: 24rpx;
								color: #111;
								margin-right: 15rpx;
							}

							.btn {
								width: 96rpx;
								height: 32rpx;
								box-sizing: border-box;
								border-radius: 16rpx;
								border: solid 1rpx @red;
								font-size: 20rpx;
								color: @red;
								line-height: 32rpx;
								text-align: center;
							}
						}

						.title-right {
							font-size: 26rpx;
							color: @red;
						}
					}

					&-center {
						display: flex;
						padding: 20rpx 0 30rpx 0;

						.imgBox {
							width: 201rpx;
							height: 201rpx;

							image {
								width: 201rpx;
								height: 201rpx;
							}
						}

						.centerRight {
							margin-left: 13rpx;
							padding-top: 14rpx;

							.centerTitle {
								display: flex;
								align-items: center;

								.iconImgBox {
									width: 32rpx;
									height: 32rpx;

									image {
										width: 32rpx;
										height: 32rpx;
										flex-shrink: 0;
									}
								}

								.iconText {
									padding-left: 8rpx;
									font-size: 26rpx;
									color: #111;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box; //作为弹性伸缩盒子模型显示。
									-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
									-webkit-line-clamp: 1;
								}
							}

							.centerPrice {
								display: flex;
								justify-content: space-between;
								margin-top: 40rpx;

								.centerPriceItem {
									text-align: enter;

									.name {
										font-size: 24rpx;
										color: #666;
									}

									.price {
										font-size: 26rpx;
										color: @red;
										padding-top: 15rpx;
									}
								}
							}
						}
					}

					&-data {
						border-top: 1px solid #f5f5f5;
						padding-top: 25rpx;
						display: flex;
						justify-content: space-between;

						.itemData {
							view {
								font-size: 22rpx;
								color: #888;
								padding-bottom: 17rpx;
							}
						}

						.affirm {
							font-size: 22rpx;
							color: #333;
						}
					}
				}
			}

		}

		// 暂无数据
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
					width: 100%;
					height: 100%;
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
