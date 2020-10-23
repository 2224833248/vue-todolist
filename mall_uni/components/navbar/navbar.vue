<template>
	<view class="ui-nav-bar" :style="customStyle + selfCustomStyle">
		<view class="ui-nav-bar-content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync()
	var height = systemInfo.statusBarHeight + systemInfo.titleBarHeight
	var paddingTop = systemInfo.statusBarHeight
	export default {
		data() {
			return {
				selfCustomStyle: "padding-top: " + paddingTop + "px;height: " + height + "px;"
			}
		},
		props: {
			customStyle: {
				type: String,
				default: ''
			},
		},
		methods: {
		}
	}
</script>

<style>

</style>
