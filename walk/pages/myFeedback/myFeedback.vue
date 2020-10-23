<template>
	<view class="tbody">
		<view class="cont" v-if="feedback">
			<view class="item" v-for="(item,index) in list" :key='index' @click="toClick(index)">
				<view class="user">
					<image :src="user.headimg" mode="widthFix"></image>
					<view class="userRight">
						<view class="userName">{{user.nickname}}</view>
						<view class="userDate">{{item.addtime}}</view>
					</view>
				</view>
				<view class="itemCont">
					<view class="feedClass">反馈类型:&nbsp;{{item.typeName}}</view>
					<text class="feedBack">反馈意见:&nbsp;{{item.content}}</text>
				</view>
				<!-- <view class="imgBox">
					<image :src="items" v-for="(items,indexs) in item.images" mode="widthFix"></image>
				</view> -->
			</view>
		</view> 
		<view class="cont2" v-else>
			<view class="boxs">
				<image src="/static/index/nodata.png" mode="widthFix"></image>
				<view class="text">暂无数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				list: [],
				feedback: true,
				loading: true,
				loadingNum: 0
			};
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
		},
		mounted() {
			if (this.isLogin) {
				this.getList();
			} else {
				uni.$on('login', (res) => {
					this.getList();
				})
			}
		},
		methods: {
			toClick(index) {
				uni.navigateTo({
					url: '../myFeedDatails/myFeedDatails?id=' + this.list[index].id
				})
			},
			getList() {
				ajax.get({
					url: "News/getList",
					data: {
						p: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.list.length == 0) {
							this.feedback = false
						} else {
							this.list = res.data.data.list
							this.feedback = true
						}
						this.loading = false
					}
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="less">
	.cont {
		width: 690rpx;
		margin: 0 auto;

		.item {
			width: 100%;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 14rpx;
			padding: 30rpx 35rpx 28rpx 30rpx;
			margin-top: 30rpx;

			.user {
				display: flex;
				align-items: center;

				image {
					width: 74rpx;
					height: 74rpx;
					border-radius: 50%;
				}

				.userRight {
					padding: 5rpx 0;
					margin-left: 24rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;

					.userName {
						font-size: 28rpx;
						color: #666;
					}

					.userDate {
						font-size: 24rpx;
						color: #9A9A9A;
					}
				}
			}

			.itemCont {
				padding-top: 30rpx;

				.feedClass {
					padding-bottom: 20rpx;
					color: #343434;
					font-size: 28rpx;
					font-weight: 500;
				}

				.feedBack {
					color: #343434;
					font-size: 28rpx;
					line-height: 36rpx;
					font-weight: 500;
					word-break:break-all;
				}
			}

			.imgBox {
				margin-top: 25rpx;

				image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 14rpx;
					margin-right: 17rpx;
				}
			}
		}
	}

	.cont2 {
		position: relative;
		height: 100vh;

		.boxs {
			position: absolute;
			top: 50%;
			left: 50%;			
			margin-left: -30%;
			margin-top: -30%;
			width: 60%;
			text-align: center;
			
			
			image {
				width: 100%;
			}

			.text {
				color: #666666;
				font-size: 28rpx;
			}
		}

	}
</style>
