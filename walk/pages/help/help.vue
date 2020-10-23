<template>
	<view class="page">
		<navbar customStyle="borderBottom:1px solid rgba(231, 231, 231, 0.6);backgroundColor:#fff;">
			<view class="ui-row" style="height:46px;">
				<view class="ui-col-content align-center valign-middle">
					<view>
						获取多多币
					</view>
				</view>
			</view>
		</navbar>
		<view :style="{height:NAV_HEIGHT}"></view>

		<view class="header">
			<view class="header__title">
				如何获得多多币
			</view>
			<view class="header__body">
				你可以通过以下方式去获得多多币
			</view>
		</view>
		
		<view class="body">
			<view class="body__item">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/static/help/sign.png" mode="aspectFill"></image>
			</view>
			
			<view class="body__item">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/static/help/walk.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync();
	export default {
		data() {
			return {
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.page{
	}
	
	.header {
		padding: 37rpx 33rpx;

		&__title {
			font-size: 44rpx;
			font-weight: bold;
			color: #111111;
		}

		&__body {
			margin-top: 28rpx;
			font-size: 28rpx;
			line-height: 14rpx;
			color: #999999;
		}
	}
	
	.body{
		padding: 40rpx 10rpx;
		
		&__item{
				background-color: #ffffff;
				margin-bottom: 44rpx;
				
				image{
					width: 100%;
					height: 258rpx;
				}
		}
	}
</style>
