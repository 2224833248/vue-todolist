<template>
	<view id="SignRule">
		<view >
			<view class="head">
				<image class="imgd" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/sign/headrule.png?v2"></image>
			</view>
			<view class="main">
				<view class="list" v-for="(item,index) in ruleList" :key="index">
					<text class="title">{{item.title}}</text>
					<text class="content">{{item.content}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				ruleList: [
					{
						title:'什么是金币？',
						content:'金币是天天夺宝小程序用来参与抽奖/夺宝的专用门票。'
					},
					{
						title:'如何获的金币？',
						content:'每日签到、新手任务、每日任务、步数兑换都可以获得金币；连续签到获得的金币会有所增加。'
					},
					{
						title:'金币会过期吗？',
						content:'每年的12月31日24点都会清空当年的金币余额，请及时使用避免浪费。'
					},
					{
						title:'金币的获取和使用有什么限制吗？',
						content:'任何通过不正当手段（包括不限于侵犯第三人合法权益、作弊、扰乱系统、试图网络攻击、批量注册、用机器注册账户、用机器模拟客户端等方式）获得金币的，天天夺宝有权取消用户以此获得的金币并要求赔偿相关损失。'
					},
					{
						title:'',
						content:'金币规则最终解释权归成都有惠科技有限公司所有。'
					}
				]

			};
		}
	}
</script>

<style lang="scss">

	#SignRule {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		background-color: #f7ac5c;

		.head {
			width: 100vw;
			.imgd {
				width: 100%;
				height: 350rpx;
				display: block;
			}
		}

		.main {
			background-color: #f7ac5c;
			padding: 0 36rpx;
			.list {
				font: normal 26rpx PingFang-SC-Medium;
				line-height: 43rpx;
				color: #ffffff;
				margin: 10rpx 0 40rpx;
				display: flex;
				flex-direction: column;
				.title{
					font-size: 32rpx;
					font-weight: bold;
					color:white;
				}
				.content{
					color:white;
				}
			}
		}

	}
</style>
