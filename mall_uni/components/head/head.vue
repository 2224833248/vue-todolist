<template>
	<view>
		<view class="eargings-hd" :style="{'padding-top':STATUS_BAR_HEIGTH + TITLE_BAR_HEIGTH + 'px' }"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
			}
		},
		methods: {

		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				},
			})
		}
	}
</script>

<style>
	.eargings-hd {
		background-image: linear-gradient(90deg,
			#ff6662 0%,
			#ff423e 100%),
			linear-gradient(#ff6666,
			#ff6666);	
	}
</style>
