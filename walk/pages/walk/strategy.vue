<template>
	<view id="strategy">
		<view >
			<view class="head">
				<image class="headImg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/walk/head.png"></image>
			</view>
			<view class="main">
				<view class="much">
					<view class="idot"></view>
					<view class="somuch">如何更快的积累多多能量?</view>
				</view>
				<view class="list">
					<view class="tit" v-for="(item,index) in list" :key="index">{{item}}</view>
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
				list: [
					"1.加强运动:提高每天跑步、走路的运动量，即可兑换为更多的多多能量，每天兑换上限为30000步。",
					"2.邀请奖励:每成功邀请1名新用户，即可获得一个邀请奖励。需要手动点击气泡领取。邀请奖励气泡永久有效。",
					"3.步数加速:每成功邀请1名新用户，还可额外获得0.5%~2%的步数加速系数。步数加速=每日实际步数x加速系数，加速上限为100%。需要手动点击气泡领取，仅当日有效，次日重新计算。",
					"4.每日签到:签到并分享给好友可获得奖励步数，坚持签到天数越长，奖励步数越多，最高可得1200步。",
					"5.平台会不定期推出各种赠送多多能量的活动，敬请期待~",
					"有惠生活鼓励健康生活，运动请量力而为，让我们一起走路、一起钱多多~"
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
	#strategy {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		background-color: #003643;

		.head {
			.headImg {
				width: 100vw;
				display: block;
			}
		}

		.main {
			background-color: #003643;
			padding: 0 20rpx;
			padding-bottom: 176rpx;
			.much {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				margin-top: 32rpx;

				.idot {
					width: 14rpx;
					height: 14rpx;
					background-color: #f2ef55;
					border-radius: 50%;
					margin-right: 20rpx;

				}

				.somuch {
					font: bold 40rpx ingFang-SC-Bold;
					letter-spacing: -1rpx;
					color: #ffffff;
				}
			}

			.list {
				.tit {
					margin-top: 42rpx;
					font: normal 26rpx PingFang-SC-Medium;
					line-height: 45rpx;
					letter-spacing: 0rpx;
					color: #ffffff;
				}
			}
		}
	}
</style>