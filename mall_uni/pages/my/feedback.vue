<template>
	<view class="main">
		<view class="block">
			<text class="title">问题反馈</text>
			<textarea v-model='content' class="inputbox content" placeholder="请尽可能详细描述您的问题，如涉及支付问题，请提供支付流水号"></textarea>
		</view>
		<view class="block">
			<text class="title">问题反馈</text>
			<input class="inputbox" v-model='mobile' placeholder="填写电话方便与您联系" />
		</view>
		<button class="submit" @click="submit" size="default" type="primary">提交</button>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	export default {
		data() {
			return {
				content: '',
				mobile: ''
			}
		},
		methods: {
			submit() {
				console.info('sss')
				ajax.post({
					url: 'index/submitFeedback',
					data: {
						content: this.content,
						mobile: this.mobile,
					}
				}).then((data) => {
					if (data.data.code == 200) {
						uni.reLaunch({
							url: './feedbackok'
						});
					} else {
						uni.showToast({
							content: data.data.msg
						});
					}
				})
			}
		}
	}
</script>

<style>
	.main {
		width: 100vw;
		height: 100vh;
		background: #f6f6f6;
	}

	.block {
		background: white;
		margin-bottom: 30rpx;
		padding: 30rpx;
	}

	.title {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		color: #333333;
		display: block;
		font-size: 35rpx;
	}

	.inputbox {
		border: 1px #e8e8e8 solid;
		font-size: 30rpx !important;
		line-height: 1 !important;
		padding: 15rpx;
		display: block;
	}

	.content {
		height: 300rpx;
	}

	.submit {
		margin: 70rpx 50rpx 0rpx 50rpx;
		background: #debe76;
		color: white;
		border: none;
	}
</style>