<template>
	<view id="Address" class="page">
		<view class="noadta" v-if="isLoad && list.length == 0">
			<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/noaddress.png" mode=""></image>
			<view class="title">
				<text>您还没有添加过收货地址哦</text>
			</view>
			<view class="inaddress" @click="myGetAddress">一键获取淘宝地址</view>
		</view>
		<mescroll-uni ref="mescroll" @init="mescrollInit" @down="downCallback" :up="up" @up="upCallback" v-if="!isLoad || list.length > 0">
			<view class="address-list" v-if="isLoad && list.length > 0">
				<view class="item" v-for="(item,index) in list" :key="index">
					<view class="default">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/default.png" v-if="item.def == 1"></image>
					</view>
					<view class="text-box" @click="ckOrderAddress(item.aid)">
						<view class="name-mobile">
							<text class="name">{{item.nickname}}</text>
							<text class="mobile">{{item.mobile}}</text>
							<text class="icons" v-if="item.def == 1">默认</text>
							<text class="icons label">{{item.labelName}}</text>
						</view>
						<text class="address">{{item.province}}{{item.city}}{{item.county}}{{item.address}}</text>
					</view>
					<view class="edit" @click="edit(item.aid)">
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/edit.png"></image>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<view class="addbtn-box" @click="edit()">
			<view class="addbtn">+新建地址</view>
		</view>
		<uni-popup ref="messagePopup" type="center">
			<uni-popup-message :type="type" :message="message" :duration="1500"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import ajax from '../../utils/ajax.js'

	export default {
		mixins: [MescrollMixin],
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			MescrollUni
		},
		data() {
			return {
				type: 'success',
				message: '',
				isLoad: false,
				canReset: false,
				orderId: 0,
				up: {
					noMoreSize: 1,
					textNoMore: '— 没有更多收货地址了哦 —',
					empty: {
						icon: '/static/app_data_null.png',
						tip: '— 暂无收货地址 —'
					}
				},
				list: []
			};
		},
		onLoad: function(option) {
			this.orderId = option.id;
		},
		onShow() {
			this.canReset && this.downCallback()
			this.canReset = true
		},
		methods: {
			// 编辑
			edit(aid) {
				let url = '/pages/address/edit';
				if (aid != undefined) {
					url = url + '?aid=' + aid;
				}
				uni.navigateTo({
					url: url
				})
			},
			change(e) {
				this.page = e.target.current + 1;
			},
			mescrollInit() {},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback() {
				this.$refs.mescroll.mescroll.resetUpScroll();
			},
			upCallback() {
				let mescroll = this.$refs.mescroll.mescroll;
				let list = [];
				ajax.get({
					url: 'address/getList',
					data: {
						page: mescroll.num
					},
					login: true,
				}).then(data => {
					this.isLoad = true;
					data = data.data
					if (data.code == 200) {
						if (mescroll.num == 1) this.list = [];
						this.list = this.list.concat(data.data.list);
						mescroll.endSuccess(data.data.list.length, data.data.endPage);
					} else {
						mescroll.endErr()
					}
				})
			},
			myGetAddress() {
				my.getAddress({
					success: (res) => {
						let info = {
							nickname: res.result.fullname,
							mobile: res.result.mobilePhone,
							province: res.result.prov + " " + res.result.city + " " + res.result.area,
							address: res.result.address,
							def: 1
						}
						ajax.post({
							url: 'address/setFind',
							data: info,
							login: false,
						}).then(ret => {
							if (ret.data.code == 200) {
								this.type = 'success';
								this.message = ret.data.msg;
								this.$refs.messagePopup.open()
								setTimeout(() => {
									this.downCallback()
								}, 1000);
							} else {
								this.type = 'error';
								this.message = ret.data.msg;
								this.$refs.messagePopup.open()
							}
						})
					}
				});
			},
			ckOrderAddress(aid){
				
				ajax.post({
					url: 'gift/modifyAddress',
					data: {aid:aid,id:this.orderId},
					login: true,
				}).then(ret => {
					if (ret.data.code == 200) {
						uni.navigateBack();
					} else {
						this.type = 'error';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
					}
				})
			}
		},
		mounted() {

		}
	}
</script>
<style lang="scss" scoped>
	#Address {
		background-color: #f5f5f5;

		display: flex;
		align-items: center;

		.noadta {
			width: 750rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: column;

			image {
				width: 244rpx;
				height: 199rpx;
				opacity: 0.8;
			}

			.title {
				height: 25rpx;
				font-family: PingFang-SC-Medium;
				font-size: 26rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 25rpx;
				letter-spacing: 1rpx;
				color: #999999;
				margin: 62rpx 0 32rpx 0;
			}

			.inaddress {
				width: 290rpx;
				height: 68rpx;
				text-align: center;
				background-image: linear-gradient(90deg,
					#fd9064 0%,
					#fe655c 100%),
					linear-gradient(#c6c1c1,
					#c6c1c1);
				background-blend-mode: normal,
					normal;
				border-radius: 34rpx;

				font-family: PingFang-SC-Medium;
				font-size: 28rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 68rpx;
				letter-spacing: 0rpx;
				color: #ffffff;
			}
		}

		.addbtn-box {
			width: 750rpx;
			height: 167rpx;
			background-color: #ffffff;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 1;
			// display: none;

			.addbtn {
				width: 686rpx;
				height: 90rpx;
				margin: 0 auto;
				margin-top: 32rpx;
				background-image: linear-gradient(90deg,
					#fb9400 0%,
					#ff4f02 100%),
					linear-gradient(#111111,
					#111111);
				background-blend-mode: normal,
					normal;
				border-radius: 45rpx;

				font-family: PingFang-SC-Medium;
				font-size: 36rpx;
				font-weight: normal;
				font-stretch: normal;
				text-align: center;
				line-height: 90rpx;
				letter-spacing: 2rpx;
				color: #ffffff;
			}
		}

		.address-list {
			margin-bottom: 48rpx;

			.item {
				height: 94rpx;
				padding: 36rpx 32rpx;
				margin-top: 18rpx;
				background-color: #FFFFFF;

				display: flex;
				align-items: center;
				justify-content: space-between;

				>.default {
					width: 58rpx;
					text-align: center;

					image {
						width: 31rpx;
						height: 21rpx;
					}
				}

				>.edit {
					image {
						width: 35rpx;
						height: 32rpx;
					}
				}

				.text-box {
					width: 612rpx;
					margin-left: 22rpx;
					display: flex;
					justify-content: space-between;
					flex-direction: column;

					.name-mobile {
						.name {
							height: 30rpx;
							font-family: PingFang-SC-Medium;
							font-size: 32rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 30rpx;
							letter-spacing: 1rpx;
							color: #000000;
						}

						.mobile {
							height: 18rpx;
							font-family: PingFang-SC-Medium;
							font-size: 24rpx;
							font-weight: normal;
							font-stretch: normal;
							line-height: 18rpx;
							letter-spacing: 0rpx;
							color: #595959;
							margin-left: 21rpx;
						}

						.icons {
							width: 60rpx;
							height: 30rpx;
							line-height: 30rpx;
							border-radius: 6rpx;
							font-family: MicrosoftYaHei;
							font-size: 20rpx;
							font-weight: normal;
							font-stretch: normal;
							letter-spacing: 1rpx;
							display: inline-block;
							text-align: center;
							margin-left: 16rpx;
						}

						.default {
							background-color: #ff5002;
							color: #ffffff;
						}

						.label {
							background-color: #ffdccd;
							color: #ff5002;
						}

					}

					.address {
						width: 98%;
						height: 32rpx;
						font-family: PingFang-SC-Medium;
						font-size: 24rpx;
						font-weight: normal;
						font-stretch: normal;
						line-height: 32rpx;
						letter-spacing: 1rpx;
						color: #000000;
						margin-top: 16rpx;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}
		}

	}
</style>
