<template>
	<view class="tbody">
		<view class="cont">
			<view class="itemBox">
				<view class="item" v-for="(item,index) in issue.list" :key='index'>
					<view class="item-title" @click="hideShow(index)">
						<view class="left">
							<view class="img">Q{{index+1}}</view>
							<view class="title">{{item.title}}</view>
						</view>
						<view class="rightImg" :class="item.active?'shang':''"></view>
					</view>
					<view class="itemCont" v-show="item.active" v-for="(isitem,isIndex) in item.count">
						{{isitem}}
					</view>
				</view>
			</view>

			<view class="textBox" v-for="(isitem,isIndex) in issue.count">
				{{isitem}}
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {

				issue: {
					list: [],
					count: ''
				}
			};
		},
		mounted() {
			this.getIssue();
		},
		methods: {
			hideShow(index) {
				if (this.issue.list[index].active == true) {
					
					this.issue.list[index].active = false
				} else {
					this.issue.list.forEach(item => {
						item.active = false
					})
					this.issue.list[index].active = true
				}
			},
			getIssue() {
				ajax.get({
					url: 'Base/problem'
				}).then(res => {
					if (res.data.code == 200) {
						this.issue = res.data.data
						// console.info(this.issue)
					}
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="less">
	.cont {
		width: 690rpx;
		margin: 30rpx auto 0;

		.itemBox {
			background: #fff;
			border-radius: 14rpx;

			.item {
				padding: 0 30rpx;

				&-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 100rpx;
					border-top: 1px solid #ECECEC;

					.left {
						display: flex;
						align-items: center;

						.img {
							width: 34rpx;
							height: 33rpx;
							color: #fff;
							font-size: 20rpx;
							text-align: center;
							background: url(../../static/icon/title.png)no-repeat;
							background-size: 100% 100%;
						}

						.title {
							padding-left: 24rpx;
							font-size: 28rpx;
							color: #343434;
							font-weight: 500;
						}
					}

					.rightImg {
						width: 22rpx;
						height: 11rpx;
						background: url(../../static/icon/xia.png)no-repeat;
						background-size: 100% 100%;
					}

					.shang {
						background: url(../../static/icon/shang.png)no-repeat;
						background-size: 100% 100%;
					}
				}

				&:nth-of-type(1) {
					.item-title {
						border-top: none;
					}
				}
			}

			.itemCont {
				padding-left: 55rpx;
				padding-bottom: 27rpx;
				font-size: 26rpx;
				color: #9A9A9A;
				line-height: 33rpx;
				text-align: justify;
			}
		}

		.textBox {
			font-size: 24rpx;
			color: #9A9A9A;
			line-height: 32rpx;
			margin-top: 20rpx;
			padding: 0 0 0 26rpx;
			text-align: justify;
			&:nth-last-child(1){
				padding-bottom: 20rpx;
			}
		}
	}
</style>
