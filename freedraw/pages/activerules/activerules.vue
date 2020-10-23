<template>
	<view class="rules_box">
		<!-- <view class="not_img_content" style="display: none;">
			<view class="rules_title">
				分享有礼规则
			</view>
			<view class="rules_info">
				-邀请好友最高可得99元现金红包- 
			</view>
			<view class="rules_text_box">
				<view class="title">
					规则说明
				</view>
				<view class="rule_list_box">
					<view class="rules_item_box" v-for="(item,index) in rules">
						<view class="index_icon">
							0{{index}}
						</view>
						<view class="rules_text">
							{{item.content}}
						</view>
					</view>
				</view>
			</view>
		</view>	 -->
		<image class="rule_img" src="../../static/freedraw/rule_img.png" mode="aspectFit"></image>
		<!-- <view>
			<image class="img" src="/static/freedraw/rule_img.png" mode="widthFix"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules:[
					{
						content:'当用户分享的好友通过分享链接访问小程序',
					},
					{
						content:'同一用户每天参与邀请有礼后不能帮助好友，只能邀请其他未参与邀请有礼的好友帮助自己，才能获得现金红包',
					},
					{
						content:'同一用户每天仅可获得一个邀请红包，分享好友不限次数',
					},
					{
						content:'分享有礼活动数据将在每天00:00被重置，重置后邀请好友数将清空',
					},
					{
						content:'完成邀请任务后，即可获得最高99元的现金红包，现金红包将直接转账到支付宝账户，一般情况转账将在10s内到达，若遇到高峰期，到账时间可能会有延迟，请耐心等待',
					},
					{
						content:'如果遇到问题，可通过"我的"->"建议反馈"告知我们，我们会在一个工作日内处理您反馈的问题',
					},
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="less" scoped>
	// .rules_box{
	// 	width: 100%;
	// 	height: 100vh;
	// 	.rule_img{
	// 		display: block;
	// 		width: 100%;
	// 		height: 100%;
	// 	}
	// 	.img{
	// 		width: 100vw;
	// 	}
	// }
	.rules_box{
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		background-color: #FC5F31;
	}
	.rule_img{
		display: block;
		width: 100%;
		height: 1334rpx;
	}
</style>
