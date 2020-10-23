<template>
	<view class="center">
		<view class="load">
			<view class="content">
				<div class="dot dot1"></div>
				<div class="dot dot2"></div>
				<div class="dot dot3"></div>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
	}

	.load {
		width: 100vw;
		height: 100vh;
		background-color: rgba($color: #fff, $alpha: 1);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;

		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			// width: 100rpx;
			height: 80rpx;

			.dot {
				width: 6px;
				height: 8px;
				background: #148fea;
				transform: skew(-30deg);
			}

			.dot1 {
				background: #2F9EFE;
				left: 0px;
				animation: dot-jump 0.6s cubic-bezier(0.77, 0.47, 0.64, 0.28) alternate infinite;
			}

			.dot2 {
				background: #148fea;
				margin-left: 10px;
				animation: dot-jump 0.6s 0.2s cubic-bezier(0.77, 0.47, 0.64, 0.28) alternate infinite;
			}

			.dot3 {
				background: #148fea;
				margin-left: 10px;
				animation: dot-jump 0.6s 0.4s cubic-bezier(0.77, 0.47, 0.64, 0.28) alternate infinite;
			}
		}
	}

	@keyframes dot-jump {
		0% {
			transform: scale(1.2) skew(-30deg);
		}

		
		100% {
			transform:scale(0) skew(-30deg);
		}
	}
</style>
