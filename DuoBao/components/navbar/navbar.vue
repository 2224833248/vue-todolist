<template>
	<view class="ui-nav-bar" :style="customStyle + selfCustomStyle">
		<view class="ui-nav-bar-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				selfCustomStyle: ''
			}
		},
		props: {
			customStyle: {
				type: String,
				default: ''
			},
		},
		mounted() {
			uni.getSystemInfo({
				success:(data)=> {
					let systemInfo = wx.getSystemInfoSync()
					var height = systemInfo.statusBarHeight + systemInfo.titleBarHeight
					var paddingTop = systemInfo.statusBarHeight;
					this.selfCustomStyle = "padding-top: " + paddingTop + "px;height: " + height + "px;";
				}
			});
		},
		methods: {
		}
	}
</script>

<style>

</style>
