<template>
	<view class="content">
		<view class="rule">
			<image src="../../static/index/rule.png" mode="widthFix"></image>

			<view class="rule__item">
				1、用户通过【天天夺宝】小程序金币规则免费获得金币，并用于【夺宝抽奖专区】的活动参与。每次抽奖需消耗一定的金币数量，每个奖品参与次数及消耗的金币数量以该活动商品详情页所示为准。参与夺宝抽奖资格不限于金币，如：本平台会不定时免费赠送抽奖次数或完成相应的任务则可参与夺宝抽奖。
			</view>

			<view class="rule__item">
				2、如因支付宝账号非实名认证导致用户无法参与抽奖，视为用户自动放弃抽奖资格。
			</view>

			<view class="rule__item">
				3、参加抽奖活动需遵守相关法律法规，如涉及违反相关规定，一经发现将根据违规程度对用户采取相应的处理措施，清洁严重者，本平台将依法追究其法律责任。
			</view>

			<view class="rule__item">
				4、参与抽奖过程中，如用户出现违规行为（如利用黑客工具，软件作弊者），本平台有权取消用户中奖资格。
			</view>

			<view class="rule__item">
				5、本平台会在开奖结果页面展示中奖用户的头像和中奖资格。
			</view>

			<view class="rule__item">
				6、开奖后，中奖用户需主动领取奖品，超过三天未领取则视为自动放弃该奖品。
			</view>

			<view class="rule__item">
				7、本平台会在开奖结果页面展示中奖用户的头像和中奖资格。
			</view>

			<view class="rule__item">
				8、用户收货地址填写错误造成的奖品损失，将由用户承担责任。如已发放并邮寄出的实物奖品无人收件、视为放弃领取，退回后不再补发。
			</view>

			<view class="rule__item">
				9、本平台只作为提供发起与参与抽奖的公共平台，活动奖品由三方赞助商提供并发放，本平台会在法律范围内尽可能规范督促用户遵守相关法律，营造良好的平台使用环境。
			</view>

			<view class="rule__item">
				10、抽奖期间发生任何不可抗力事件使本抽奖活动或本次抽奖目的不能实现，本平台因此免费。不可抗力是指不能控制，不可预见或不能避免，及时预见亦无法避免的时间，该事件使任何一方根据本协议履行其全部或部分义务已不可能。包括社会异常事件，自然灾害或政府管制行为而造成的网络关闭等非本平台过错的行为。
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fd9148;
	}

	.rule {
		image {
			width: 750rpx;
		}

		&__item {
			width: 668rpx;
			margin: 0 auto;
			margin-bottom: 48rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			letter-spacing: 0rpx;
			color: #ffffff;
			text-align: justify;
			text-align-last: left;
		}
	}
</style>
