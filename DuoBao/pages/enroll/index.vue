<template>
	<view class="main">
		<image class="top_bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/enroll/bm.png" mode="widthFix"></image>
		<image class="tips_bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/enroll/tips.png" mode="widthFix"></image>

		<view class="card ">
			<view class="tips">01</view>
			<view class="title_box">
				请问你是否开设小程序或生活号？（目前仅支持小程序或生活号的商家报名开心赚宝）
			</view>
			<view class="uni-list">
				<radio-group @change="isxcxChange">
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="1" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title">有</view>
					</label>
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="0" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title noborder">没有</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="card ">
			<view class="tips">01</view>
			<view class="title_box">
				请问你要提供开心赚宝的奖品，市场价在多少？（单个奖品能给小程序或生活号导留1K-2W不等）

			</view>
			<view class="uni-list">
				<radio-group @change="priceChange">
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="1" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title">100-300</view>
					</label>
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="2" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title">300-500</view>
					</label>
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="3" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title">500-1000</view>
					</label>
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="4" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title">1000-2000</view>
					</label>
					<label class="uni-list-cell">
						<view class="radio_ck">
							<radio value="5" style="transform:scale(0.7)" color="#fd743d" />
						</view>
						<view class="title noborder">3000以上</view>
					</label>
				</radio-group>
			</view>
		</view>


		<view class="card ">
			<view class="tips">01</view>
			<view class="title_box">
				请填写你的手机号（手机号码仅用户做开心赚宝招商报名，在必要时会通过您的手机号联系您）
			</view>
			<view class="uni-list">
				<input class="uni-input" type="number" placeholder="请输入您的手机号" v-model="mobile" />
			</view>
		</view>

		<button class="submit" @click="submit" size="default" type="primary">立即报名</button>
	</view>
</template>

<script>
	import ajax from "@/utils/ajax.js"
	export default {
		data() {
			return {
				mobile: '',
				isxcx: 0,
				price: 0,
			}
		},
		methods: {
			isxcxChange(evt) {
				this.isxcx = evt.target.value;
			},
			priceChange(evt) {
				this.price = evt.target.value;
			},
			submit() {
				ajax.post({
					url: 'Enroll/setPost',
					data: {
						mobile: this.mobile,
						isxcx: this.isxcx,
						price: this.price
					}
				}).then((data) => {
					if (data.data.code == 200) {
						uni.showToast({
							content: data.data.msg
						});
						this.mobile = '';
						this.isxcx = 0;
						this.price = 0;
					} else {
						uni.showToast({
							content: data.data.msg
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 100vw;
		height: 100vh;
		text-align: center;
		background: #f6f6f6;

		.top_bg {
			width: 100%;
		}

		.tips_bg {
			width: 60%;
			margin: 40rpx 0;
		}

		.card {
			width: 690rpx;
			background-color: #ffffff;
			border-radius: 4rpx;
			border-bottom: 29rpx;

			.tips {
				width: 70rpx;
				height: 70rpx;
				line-height: 70rpx;
				background-image: linear-gradient(90deg,
					#fc9248 0%,
					#fe5833 100%);
				border-radius: 4rpx 0rpx 60rpx 0rpx;
				font-size: 28rpx;
				letter-spacing: 3rpx;
				color: #ffffff;
			}

			.title_box {
				width: 587rpx;
				height: 63rpx;
				font-family: AdobeHeitiStd-Regular;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 36rpx;
				letter-spacing: 0rpx;
				color: #333333;
				margin-left: 87rpx;
				margin-top: -50rpx;
			}

			.uni-list {
				width: 690rpx;
				margin-top: 14rpx;

				.uni-input {
					width: 650rpx;
					height: 80rpx;
					background-color: #f1f1f1;
					border-radius: 8rpx;
					text-align: center;
					font-size: 24rpx;
					padding: 0 0;
					margin: 28rpx 0;
				}

				.uni-list-cell {
					width: 666rpx;
					height: 80rpx;
					line-height: 80rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-left: 24rpx;

					.radio_ck {
						width: 60rpx;
						height: 80rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						text-align: center;
					}

					.title {
						width: 586rpx;
						height: 80rpx;
						text-align: left;
						border-bottom: 2rpx solid #f1f1f1;

						font-family: PingFangSC-Medium;
						font-size: 24rpx;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 0rpx;
						color: #333333;
					}

					.title.noborder {
						border-bottom: none;
					}
				}
			}
		}

		.submit {
			width: 690rpx;
			height: 80rpx;
			margin: 69rpx auto 32rpx;
			background-image: linear-gradient(90deg,
				#fc9248 0%,
				#fe5833 100%);
			border-radius: 40rpx;
			border: none;
		}
	}
</style>
