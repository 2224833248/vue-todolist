<template>
	<view class="main">
	  <view class="block">
	    <image class="img" mode="scaleToFill" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/youhui/alipayxcx/privilege/feedbackok.png"/>
	    <text class="title">提交成功</text>
	    <text class="content">您的反馈我们已收到，我们会在三个工作日内处理</text>
	    <text>祝您生活愉快!</text>
	  </view>
	  <button class="submit" @click="submit" size="default" type="primary">完成</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			submit(){
				uni.navigateBack({
					
				})
			}
			
		}
	}
</script>

<style>
.main{
    width: 100vw;
    height: 100vh;
    background: #f6f6f6;
}

.block{
    background: white;
    margin-bottom: 30rpx;
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.img{
    width:170rpx;
    height: 170rpx;
    display: block;
    margin-bottom: 40rpx;
}

.title{
    font-size: 45rpx;
    font-weight: bold;
    margin: 20rpx;
}

.content{
    font-size: 30rpx;
    line-height: 60rpx;
}

.submit{
    margin: 70rpx 50rpx 0rpx 50rpx;
    background: #debe76;
    color:white;
    border:none;
}
</style>