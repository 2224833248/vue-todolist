<template>
	<view class="page rank">
		<navbar customStyle="borderBottom:none;backgroundColor:rgba(225, 242, 185,1);">
			<view class="ui-row" style="height:46px;">
				<view class="ui-col-content align-center valign-middle">
					<view>
						走路钱多多
					</view>
				</view>
			</view>
		</navbar>
		<view :style="{height:NAV_HEIGHT}"></view>

		<view class="rank-head"></view>
		<view class="rank-statistics">
			<view class="rank-statistics-item">
				<view class="item-title">好友人数</view>
				<view class="item-content">{{count}}</view>
			</view>
			<view class="rank-statistics-item">
				<view class="item-title">步数加成</view>
				<view class="item-content">{{scale}}%</view>
			</view>
		</view>
		<scroll-view class="rank-list" scroll-y='true'>
			<view class="rank-list-item" v-for="(item,index) in rankList" :key="index">
				<view class="item-medal">
					<image v-if="index == 0" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/rank/medal1.png" mode="aspectFill"></image>
					<image v-if="index == 1" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/rank/medal2.png" mode="aspectFill"></image>
					<image v-if="index == 2" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/rank/medal3.png" mode="aspectFill"></image>
				</view>
				<view class="item-avatar">
					<image :src="item.avatar" mode="aspectFill"></image>
				</view>
				<view class="item-info">
					<view class="info-name">{{item.nickname}}</view>
					<view class="info-number">{{item.step}}步</view>
				</view>
			</view>
		</scroll-view>

		<view class="rank-button"></view>
	</view>
</template>

<script>
	let systemInfo = wx.getSystemInfoSync()
	import ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				STATUS_BAR_HEIGTH: systemInfo.statusBarHeight + "px",
				TITLE_BAR_HEIGHT: systemInfo.titleBarHeight + "px",
				NAV_HEIGHT: systemInfo.statusBarHeight + systemInfo.titleBarHeight + "px",

				count: '0',
				scale: '0',
				rankList: [],
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				ajax.get({
					url: 'Run/rank',
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.count = res.data.data.count
						this.scale = res.data.data.scale
						this.rankList = res.data.data.friends
					}
				}).catch((error) => {})
			}
		}
	}
</script>

<style>
	.rank-head {
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/rank/bg.png);
		background-size: 100%;
		height: 279rpx;
	}

	.rank-statistics {
		width: 686rpx;
		height: 172rpx;
		background-color: #ffffff;
		margin: -110rpx auto 0;
		border-radius: 16rpx;
		box-shadow: -3rpx 0rpx 15rpx 0rpx rgba(170, 170, 170, 0.4);
	}

	.rank-statistics {
		display: flex;
		text-align: center;

	}

	.rank-statistics-item {
		width: 343rpx;
	}

	.rank-statistics-item .item-title {
		margin-top: 43rpx;
		font-size: 28rpx;
		color: #000000;
	}

	.rank-statistics-item .item-content {
		margin-top: 29rpx;
		font-size: 40rpx;
		color: #ff7f01;
	}

	.rank-list {
		width: 686rpx;
		height: 50vh;
		margin: 36rpx auto 0;
	}

	.rank-list-item {
		border-bottom: #f5f5f5 2rpx solid;
		display: flex;
		padding: 23rpx 0;
		line-height: 104rpx;
	}

	.rank-list-item .item-medal {
		width: 37rpx;
		margin-right: 16rpx;
	}

	.rank-list-item .item-medal image {
		width: 37rpx;
		height: 55rpx;
		vertical-align: middle;
	}

	.rank-list-item .item-avatar {
		width: 100rpx;
		height: 100rpx;
		margin-right: 17rpx;
	}

	.rank-list-item .item-avatar image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 100rpx;
		border: solid 2rpx #73cca3;
	}

	.rank-list-item .item-info {
		width: 549rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}


	.item-info .info-name {
		font-size: 30rpx;
		color: #000000;
	}

	.item-info .info-number {
		font-size: 32rpx;
		color: #000000;
	}

	.rank-button {
		width: 686rpx;
		height: 116rpx;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/rank/btn-bg.png);
		background-size: 100%;
		margin: 0 auto;
		position: absolute;
		bottom: 32rpx;
		left: 0;
		right: 0;
	}
</style>
