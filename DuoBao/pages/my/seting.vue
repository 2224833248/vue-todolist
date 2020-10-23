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
						url:'https://mobile.yhshapp.com/Article/detail?aid=63&search=%e8%b5%b0%e8%b7%af%e8%b5%9a%e9%92%b1&replace=%e5%a4%a9%e5%a4%a9%e5%a4%ba%e5%ae%9d'
					},
					{
						title:'隐私政策',
						url:'https://mobile.yhshapp.com/Article/detail?aid=64&search=%e8%b5%b0%e8%b7%af%e8%b5%9a%e9%92%b1&replace=%e5%a4%a9%e5%a4%a9%e5%a4%ba%e5%ae%9d'
					}
				]
			}
		},
		methods: {
			jump(item){
				uni.navigateTo({
					url:'/pages/webview/webview?url='+encodeURIComponent(item.url)
				})
			}
		}
	}
</script>

<style>
	.main{
		width:100vw;
		height:60vh;
		background-color: #fff;
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
