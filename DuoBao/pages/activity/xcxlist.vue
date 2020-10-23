<template>
	<view class="body_box">
		<view class="list_box" v-for="(item,index) in adList" :key="inex" @click="goUrls(index)">
			<view class="img_box">
				<image :src="item.image" mode="aspectFill" :lazy-load="true"></image>
				<view class="tips">{{item.subtitle}}</view>
			</view>
			<view class="count_box">
				<view class="title">{{item.title}}</view>
				<view class="btn">去看看</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	import utils from '@/utils/utils.js'

	export default {
		data() {
			return {
				adList: []
			}
		},
		mounted() {
			if (this.isLogin) {
				setTimeout(() => {
					this.init()
				})
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		methods: {
			init() {
				this.getAd()
			},
			getAd() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: '59'
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.adList = res.data.data;
						this.adList.forEach(item => {
							utils.addAdShowLog(item)
						})
					}
				}).catch((error) => {

				})
			},
			goUrls(index) {
				utils.adJump(this.adList[index], this)
			}
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					integral: 0
				};
			},
			isdev() {
				return this.isLogin ? (this.$store.state.user.dev == '1') : false;
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.body_box {
		min-height: 80vh;
		text-align: center;
		background-color: #F5F5F5;
		padding: 25rpx 20rpx;

		.list_box {
			width: 710rpx;
			height: 306rpx;
			background-color: #ffffff;
			border-radius: 20rpx;
			margin-bottom: 20rpx;

			.img_box {
				position: relative;
				width: 710rpx;
				height: 194rpx;

				image {
					width: 710rpx;
					height: 194rpx;
					border-radius: 20rpx 20rpx 0 0;
				}

				.tips {
					position: absolute;
					top: 0;
					left: 0;

					width: 140rpx;
					height: 44rpx;
					line-height: 44rpx;
					font-size: 24rpx;
					text-align: center;
					background-image: linear-gradient(120deg,
						#fc8548 0%,
						#fe5736 100%),
						linear-gradient(#ffffff,
						#ffffff);
					background-blend-mode: normal,
						normal;
					border-radius: 20rpx 0rpx 20rpx 0rpx;
					color: #FFF;
				}

			}

			.count_box {
				width: 710rpx;
				height: 112rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-sizing: border-box;
				padding: 0 30rpx;

				.title {
					font-family: PingFang-SC-Medium;
					font-size: 28rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 84rpx;
					letter-spacing: 0rpx;
					color: #333333;
				}

				.btn {
					width: 128rpx;
					height: 54rpx;
					line-height: 54rpx;
					font-size: 24rpx;
					background-image: linear-gradient(90deg,
						#fc8548 0%,
						#fe5937 100%),
						linear-gradient(#ffffff,
						#ffffff);
					background-blend-mode: normal,
						normal;
					border-radius: 27rpx;
					color: #ffffff;
				}
			}


		}
	}
</style>
