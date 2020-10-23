<template>
	<view id="Detail" class="page">
		<view class="swiper-content">
			<swiper class="swiper" :indicator-dots="false" @change="change" :autoplay="true" :interval="3000" :duration="300">
				<swiper-item v-for="(item,index) in detail.pic_list" :key="index">
					<image class="img" :src="item+'_xcxwep'"></image>
				</swiper-item>
			</swiper>
			<view class="dots">
				<text>{{curr}}/{{detail.pic_list.length}}</text>
			</view>
		</view>
		<view class="info">
			<view class="title">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/dui.png"></image>
				<text class="name">{{detail.title}}</text>
			</view>
			<view class="desc">
				{{detail.desc}}
			</view>
			<view class="integral-volume">
				<view class="integral-box">
					<template v-if="detail.money>0">
						<text class="jb">￥</text>
						<text class="money">{{detail.money}}</text>
						<text class="jia">+</text>
					</template>
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jb.png"></image>
					<text class="num">{{detail.integral}}</text>
				</view>
				<view class="volume-box">
					已兑{{detail.use_num}}件
				</view>
			</view>
		</view>
		<view class="desc-box">
			<view class="tab">
				<text class="icon"></text>
				<text class="title">商品详情</text>
			</view>
			<view v-for="(item,index) in detail.desc_list" :key="index" class="desc_list">
				<image class="img" mode="widthFix" :src="item+'_xcxwep'"></image>
			</view>
		</view>
		<view class="tbn" @click="onPay">立即兑换 </view>
		<uni-popup ref="messagePopup" type="center">
			<uni-popup-message :type="type" :message="message" :duration="1500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	let lock = false
	export default {
		components: {
			uniPopupMessage
		},
		data() {
			return {
				type: 'success',
				message: '',
				id: 0,
				curr: 1,
				detail: {
					pic_list: [],
					desc_list: [],
					title: '',
					desc: '',
					integral: 0,
					price: 0,
					use_num: 0,
				}
			}
		},
		onLoad: function(option) {
			this.id = option.id;
		},
		mounted() {
			this.getDetail();
		},
		methods: {
			change(e) {
				this.curr = e.target.current + 1;
			},
			onPay() {
				if(lock) return;
				lock = true
				setTimeout(res=>{
					lock = false
				},2000)
				ajax.get({
					url: 'gift/getOrder',
					data: {
						gid: this.id
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						uni.navigateTo({
							url: '/pages/gift/pay?id=' + res.data.data
						})
					} else {
						this.type = 'error';
						this.message = res.data.msg;
						this.$refs.messagePopup.open()
					}
				}).catch((error) => {
					this.type = 'error';
					this.message = res.data.msg;
					this.$refs.messagePopup.open()
				})
			},
			getDetail() {
				ajax.get({
					url: 'gift/getDetail',
					data: {
						id: this.id
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
						uni.setNavigationBarTitle({
							title: this.detail.title
						})
					} else {
						this.type = 'error';
						this.message = res.data.msg;
						this.$refs.messagePopup.open()
					}
				}).catch((error) => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tbn {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 750rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-image: linear-gradient(90deg,
			#fb9400 0%,
			#ff4f02 100%),
			linear-gradient(#ffffff,
			#ffffff);
		background-blend-mode: normal,
			normal;
		font-family: PingFang-SC-Medium;
		font-size: 40rpx;
		font-weight: normal;
		font-stretch: normal;
		letter-spacing: 0rpx;
		color: #FFFFFF;
	}

	.desc-box {
		margin-bottom: 100rpx;
		background-color: #FFF;

		.tab {
			width: 750rpx;
			height: 90rpx;
			padding: 0 32rpx;

			display: flex;
			align-items: center;

			.icon {
				display: block;
				width: 14rpx;
				height: 14rpx;
				border-radius: 14rpx;
				background-color: #fb8201;
			}

			.title {
				display: block;
				font-family: PingFang-SC-Medium;
				font-size: 32rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 34rpx;
				letter-spacing: -1rpx;
				margin-left: 10rpx;
			}
		}

		.desc_list {
			width: 100%;

			.img {
				width: 100%;
				display: block;
			}
		}
	}


	.swiper-content {
		position: relative;

		.swiper {
			width: 100%;
			height: 750rpx;

			.img {
				width: 100%;
				height: 100%;
			}
		}

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


	.info {
		padding: 31rpx;
		border-bottom: 20rpx #f5f5f5 solid;


		.title {

			height: 70rpx;
			font-family: PingFang-SC-Medium;
			font-size: 27rpx;
			font-weight: normal;
			font-stretch: normal;
			text-overflow: ellipsis;
			overflow: hidden;
			position: relative;
			line-height: 38rpx;
			text-indent: 38rpx;

			image {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				top: 2rpx;
				left: 0;
			}
		}

		.desc {
			font-family: PingFang-SC-Medium;
			font-size: 23rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 34rpx;
			letter-spacing: 0rpx;
			color: #999999;
			margin-bottom: 36rpx;
			color: #fb8201;
		}

		.integral-volume {
			height: 52rpx;
			font-family: PingFang-SC-Bold;
			color: #fb8201;
			letter-spacing: 0rpx;
			font-weight: normal;
			font-stretch: normal;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.integral-box {
				color: #fb8201;

				.jb {
					font-size: 27rpx;
				}

				.money {
					font-size: 39rpx;
					letter-spacing: -1rpx;
				}

				.jia {
					font-size: 32rpx;
					color: #999999;
				}

				image {
					width: 28rpx;
					height: 23rpx;
				}

				.num {
					font-size: 27rpx;
				}
			}

			.volume-box {
				height: 44rpx;
				font-family: PingFang-SC-Medium;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: -1rpx;
				line-height: 60rpx;
				color: #666666;
			}
		}
	}
</style>
