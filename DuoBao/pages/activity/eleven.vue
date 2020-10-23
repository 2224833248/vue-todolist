<template>
	<view class="body_box" :style="{backgroundColor:base.bg_color}">
		<view class="top_bg">
			<image :src="base.bg_img" mode="aspectFill"></image>
		</view>
		<view class="btn_box" @click="goUrl">
			<view class="titles">去领红包</view>
			<image src="../../static/activity/more.png" mode="aspectFill"></image>
		</view>

		<view class="desc_box">
			<view class="texts">{{base.copy_desc}}</view>
			<view class="btntxt" @click="textCopy">{{base.copy_title}}</view>
			<view class="tips">{{base.tips}}</view>
		</view>
		<task-list ref="task" tag="shareBubble" :size="0"></task-list>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	import utils from '@/utils/utils.js'
	import taskList from '@/components/task-list/task-list.vue'

	export default {
		components: {
			taskList
		},
		data() {
			return {
				id: 0,
				base: {
					title: '分享赚更多',
					bg_color: ' #e43837',
					bg_img: '',
					tips: '邀请好友领红包，可以获得集分宝',
					copy_desc: '',
					copy_title: '',
					go_url: ''
				}
			}
		},
		onLoad(option) {
			if (typeof(option.id) !== 'undefined') {
				this.id = option.id;
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
				this.getBase()
			},
			// 获取数据
			getBase() {
				ajax.get({
					url: 'goods/getActivity',
					data: {
						id: this.id,
					},
					login: false,
					loading: false,
				}).then((res) => {
					if (res.data.code == 200) {
						this.base = res.data.data
						uni.setNavigationBarTitle({
							title: this.base.title
						})
					}
				}).catch((error) => {})
			},
			// 点击复制
			textCopy() {
				let thia = this;
				uni.setClipboardData({
					data: this.base.copy_desc,
					success: function() {
						uni.showToast({
							title: '复制成功'
						})
						thia.onTaskTap()
					},
					fail: function() {
						uni.showToast({
							title: '复制失败，请重新复制'
						})
					}
				})
			},
			goUrl() {
				my.ap.navigateToAlipayPage({
					path: encodeURIComponent(
						'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
						encodeURIComponent(encodeURIComponent(this.base.go_url)))
				});
			},
			onTaskTap() {
				if (this.shareBubble == null) {
					my.showSharePanel();
				} else {
					if (this.$refs.task && this.$refs.task.onTaskTap) {
						this.$refs.task.onTaskTap(this.shareBubble);
					}
				}
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
			},
			shareBubble() {
				let tmp = typeof(this.$store.state.taskList.shareBubble) == 'undefined' ? [] : this.$store.state.taskList.shareBubble;
				if (tmp.length > 0) {
					if (!tmp[0].isComplete) {
						//任务展示量统计
						utils.taskShowLog('shareBubble', [tmp[0]]);
						return tmp[0];
					} else {
						return null;
					}
				}
				return null;
			}
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/20/18/017a06abf4f38cb4bed9bf2ba783d2ef.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							console.info(1111)
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/20/18/017a06abf4f38cb4bed9bf2ba783d2ef.jpg',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							console.info(2222)
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
	}
</script>

<style lang="scss" scoped="scoped">
	.body_box {

		min-height: 100vh;
		text-align: center;

		.top_bg {
			width: 750rpx;
			height: 543rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.btn_box {
			width: 317rpx;
			height: 79rpx;
			line-height: 79rpx;
			margin: 62rpx auto 0;
			font-size: 38rpx;
			text-align: center;
			background-image: linear-gradient(0deg,
				#ffdb91 0%,
				#fff5d6 100%),
				linear-gradient(#fff6ed,
				#fff6ed);
			background-blend-mode: normal,
				normal;
			border-radius: 34rpx;
			color: #f84522;
			animation: breath 1.2s ease-in-out infinite;

			display: flex;
			justify-content: center;
			align-items: center;

			.titles {
				width: 180rpx;
			}

			image {
				width: 11rpx;
				height: 22rpx;
			}
		}

		.desc_box {
			width: 675rpx;
			height: 318rpx;
			margin: 64rpx auto 0;
			background-color: #ffffff;
			border-radius: 10rpx;
			box-sizing: border-box;
			padding: 47rpx 60rpx 36rpx;

			.texts {
				width: 100%;
				height: 72rpx;
				font-family: PingFangSC-Medium;
				font-size: 27rpx;
				line-height: 36rpx;
				color: #4d4d4d;
				text-align: left;
				overflow: hidden;
			}

			.btntxt {
				width: 316rpx;
				height: 70rpx;
				line-height: 70rpx;
				margin: 40rpx auto 35rpx;
				text-align: center;
				background-image: linear-gradient(0deg,
					#f84522 0%,
					#ff755a 100%),
					linear-gradient(#fff6ed,
					#fff6ed);
				background-blend-mode: normal,
					normal;
				border-radius: 34rpx;
				color: #ffffff;
			}

			.tips {
				font-family: PingFangSC-Medium;
				font-size: 27rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #f84522;
			}
		}
	}

	@keyframes breath {
		0% {
			-webkit-transform: scale(0.9);
		}

		15% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}

		30% {
			-webkit-transform: scale(0.9);
			transform: scale(0.9);
		}

		45% {
			-webkit-transform: scale(1);
		}

		to {
			-webkit-transform: scale(0.9);
		}
	}
</style>
