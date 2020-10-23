<template>
	<view class="tbody">
		<view class="cont">
			<view class="item" v-for="(item,index) in datails" :key='index'>
				<view class="user">
					<image :src="item.headimg" mode="widthFix"></image>
					<view class="userRight">
						<view class="userName">{{item.nickname}}</view>
						<view class="userDate">{{item.addtime}}</view>
					</view>
				</view>
				<view class="itemCont">
					<view class="feedClass" v-if="item.typeName != ''">反馈类型:&nbsp;{{item.typeName}}</view>
					<view class="feedBack">
						<template v-if="item.my == 1">
							<template v-if="item.typeName != ''">
								反馈意见:&nbsp;{{item.content}}
							</template>
							<template v-else>
								{{item.content}}
							</template>
						</template>
						<template v-else>
							客服回复:&nbsp;{{item.content}}
						</template>
					</view>
				</view>
				<view class="imgBox" v-if="item.addtime != ''">
					<image v-for="(items,indexs) in item.images" :src="items" @click="isBigImg(items)" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="bigImg" @click="isBigImg(items)" v-if="actImg">
			<image :src="bigImg" mode="widthFix"></image>
		</view>
		<view id="wz" class="wz"></view>
		<view class="inpurt">
			<view class="inbutBox"><input type="text" @focus='inpurts' @blur='inputBlur' class="uni-input" cursor-spacing="0"
				 :adjust-position='true' v-model="content" value="" placeholder="输入消息..." /></view>
			<view class="btn" @click="replyClick">发送</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	export default {
		onLoad(option) {
			this.id = option.id
		},
		data() {
			return {
				interval: '',
				id: '',
				datails: [],
				content: '',
				bigImg: '',
				actImg: false,
			};
		},
		onUnload() {
			clearInterval(this.interval)
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
				this.getDatails();
			} else {
				uni.$on('login', (res) => {
					this.getDatails();
				})
			}
			this.interval = setInterval(() => {
				this.getDatails();
			}, 20000)
		},
		methods: {
			inpurts() {

				clearInterval(this.interval)
			},
			inputBlur() {
				this.interval = setInterval(() => {
					this.getDatails();
				}, 20000)
			},
			isBigImg(items) {
				if (this.bigImg == '') {
					this.actImg = true
					this.bigImg = items
				} else {
					this.actImg = false
					this.bigImg = ''
				}
			},
			getDatails() {
				ajax.get({
					url: 'News/getInfo',
					data: {
						id: this.id
					}
				}).then(res => {

					if (res.data.code == 200) {
						this.datails = res.data.data
						this.$nextTick(function() {
							// my.pageScrollTo({
							// 	scrollTop: 50000000,
							// 	duration: 0
							// })
						})
					}
				}).catch(err => {})
			},

			replyClick() {
				this.postReply()
				this.content = ''
			},
			// 发送消息
			postReply() {
				ajax.post({
					url: 'News/addReply',
					data: {
						id: this.id,
						content: this.content
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.getDatails();
					}
				}).catch(err => {

				})
			}
		}

	}
</script>

<style lang="less">
	.tbody {
		height: 100vh;
	}
	::-webkit-scrollbar {
		display: none;
	}

	.cont {
		width: 690rpx;
		margin: 0 auto;
		padding-top: 30rpx;
		.item {
			width: 100%;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 14rpx;
			padding: 30rpx 35rpx 28rpx 30rpx;
			margin-bottom: 30rpx;

			// &:nth-last-child(1) {
			// 	margin-bottom: 160rpx;
			// }

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
					word-break: break-all;
				}
			}

			.imgBox {
				margin-top: 25rpx;

				image {
					width: 140rpx;
					height: 140rpx !important;
					border-radius: 14rpx;
					margin-right: 17rpx;
				}
			}
		}
	}

	.wz {
		padding-bottom: 160rpx;
	}

	.bigImg {
		width: 100%;
		height: 100vh;
		position: absolute;
		background: #000;
		top: 0;
		left: 0;
		z-index: 999;

		image {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%)translateY(-60%);
			max-width: 100%;
			max-height: 100vh;
		}
	}

	.inpurt {
		width: 100%;
		height: 128rpx;
		position: fixed;
		bottom: 0rpx;
		left: 0;
		box-sizing: border-box;
		background: #F7F7F7;
		padding: 0 30rpx;
		box-shadow: 0px -1rpx 0rpx 0rpx #DEDEDE;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 9;

		.inbutBox {
			height: 70rpx;
			width: 524rpx;
			background: #fff;
			border: 1px solid #DCDCDC;
			border-radius: 35rpx;
			overflow: hidden;

			input {
				width: 100%;
				box-sizing: border-box;
				padding: 0;
				padding-left: 30rpx;
				height: 100%;
				font-size: 28rpx;
				border: none;
			}
		}

		.btn {
			width: 142rpx;
			height: 70rpx;
			background: #2892F3;
			border-radius: 35rpx;
			text-align: center;
			line-height: 70rpx;
			color: #fff;
			font-size: 28rpx;
		}
	}
</style>
