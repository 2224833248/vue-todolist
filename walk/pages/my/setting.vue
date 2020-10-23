<template>
	<view class="main">
		<view class="item" v-for="(item,index) in list" :key="index" @click="jump(item)">
			<text class="title">{{item.title}}</text>
			<text class="left">&gt;</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						title:'用户协议',
						url:'https://mobile.yhshapp.com/Article/detail?aid=63'
					},
					{
						title:'隐私政策',
						url:'https://mobile.yhshapp.com/Article/detail?aid=64'
					}
				]
			}
		},
		methods: {
			jump(item){
				uni.navigateTo({
					url:'/pages/goods/webview?url='+encodeURIComponent(item.url)
				})
			}
		}
	}
</script>

<style>
	.main{
		width:100vw;
		height:100vh;
		background-color: #f3f3f3;
		padding-top: 10rpx;
	}
	.item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx;
		border-bottom: #e5e5e5 solid 1px;
		padding-bottom: 20rpx;
		
	}
	.title{
		font-size: 35rpx;
		color:#3e3e3e;
		font-weight: bold;
	}
</style>
