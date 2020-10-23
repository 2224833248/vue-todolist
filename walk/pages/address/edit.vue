<template>
	<view id="Edit" class="page">
		<view class="addres-box border-top">
			<view class="item">
				<input type="text" placeholder-class="moren" v-model="info.nickname" placeholder="收货人" />
			</view>
			<view class="item">
				<input type="text" placeholder-class="moren" v-model="info.mobile" placeholder="手机号码" />
			</view>
			<view class="item address" @click="btnClick">
				<text :class="info.province=='所在地区'?'moren':''">{{info.province}}</text>
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/jt.png" class="jt"></image>
			</view>
			<view class="item">
				<textarea placeholder="详细地址" v-model="info.address"></textarea>
			</view>
		</view>
		<view class="label-def border-top">
			<view class="label displays">
				<text>地址标签</text>
				<view class="list">
					<text class="icons" @click="cklabel(0)" :class="info.label==0?'def':''">家</text>
					<text class="icons" @click="cklabel(1)" :class="info.label==1?'def':''">公司</text>
					<text class="icons" @click="cklabel(2)" :class="info.label==2?'def':''">学校</text>
				</view>
			</view>
			<view class="def displays">
				<text>设置为默认地址</text>
				<view>
					<switch @change="switchChange" :checked="info.def==1" class="switchbtn" color="#ff5002" />
				</view>
			</view>
		</view>
		<view class="del-box border-top" @click="delAddress">
			<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/gift/del.png" class="del"></image>
			<text class="">删除该地址</text>
		</view>
		<view class="addbtn" @click="edit">保存</view>
		<selectAddress ref='selectAddress' @selectAddress="successSelectAddress"></selectAddress>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="base" title="" content="删除该地址？" :duration="2000" @confirm="confirmDelAddress"></uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="messagePopup" type="center">
			<uni-popup-message :type="type" :message="message" :duration="1500"></uni-popup-message>
		</uni-popup>
	</view>

</template>

<script>
	import selectAddress from '@/components/yixuan-selectAddress/yixuan-selectAddress.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import ajax from '../../utils/ajax.js'

	export default {
		behaviors: ['uni://form-field'],
		components: {
			selectAddress,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				type: 'success',
				message: '',
				info: {
					aid: 0,
					user_id: 0,
					nickname: '',
					mobile: '',
					province: '所在地区',
					address: '',
					label: 0,
					def: 0
				}
			};
		},
		onLoad: function(option) {
			if (option.aid != undefined) {
				ajax.get({
					url: 'address/getFind',
					data: {
						aid: option.aid
					},
					login: false,
				}).then(ret => {
					if (ret.data.code == 200) {
						this.info = ret.data.data;
					} else {
						this.type = 'error';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					}
				})
			}
		},
		methods: {
			delAddress() {
				this.$refs.popup.open()
			},
			confirmDelAddress(done, value) {
				ajax.post({
					url: 'address/del',
					data: {
						aid: this.info.aid
					},
					login: false,
				}).then(ret => {
					if (ret.data.code == 200) {
						this.type = 'success';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
						done();
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					} else {
						this.type = 'error';
						this.message = ret.data.msg;
						this.$refs.messagePopup.open()
					}
				})
			},
			cklabel(label) {
				this.info.label = label;
			},
			btnClick() {
				this.$refs.selectAddress.show()
			},

			successSelectAddress(address) {
				this.info.province = address;
			},
			switchChange: function(e) {
				this.info.def = e.target.value ? 1 : 0;
			},
			edit() {
				if (this.info.nickname == '') {
					this.type = 'error';
					this.message = '收货人不能为空';
					this.$refs.messagePopup.open()
				} else if (this.info.mobile == '') {
					this.type = 'error';
					this.message = '手机号码不能为空';
					this.$refs.messagePopup.open()
				} else if (this.info.province == '') {
					this.type = 'error';
					this.message = '收货地址不能为空';
					this.$refs.messagePopup.open()
				} else {
					ajax.post({
						url: 'address/setFind',
						data: this.info,
						login: false,
					}).then(ret => {
						if (ret.data.code == 200) {
							this.type = 'success';
							this.message = ret.data.msg;
							this.$refs.messagePopup.open()
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1000);
						} else {
							this.type = 'error';
							this.message = ret.data.msg;
							this.$refs.messagePopup.open()
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	#Edit {
		background-color: #f5f5f5;
	}

	.addbtn {
		position: fixed;
		left: 32rpx;
		bottom: 44rpx;

		width: 686rpx;
		height: 90rpx;
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

	.border-top {
		margin-top: 18rpx;
		background-color: #FFF;
	}

	.del-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 108rpx;
		line-height: 108rpx;
		font-size: 28rpx;
		color: #ff5002;

		.del {
			width: 30rpx;
			height: 32rpx;
			margin-right: 8rpx;
		}
	}

	.label-def {
		padding: 0 32rpx;

		.displays {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 108rpx;
			line-height: 108rpx;
			font-size: 28rpx;
		}

		.label {
			border-bottom: 2rpx #f5f5f5 solid;

			.icons {
				width: 96rpx;
				height: 50rpx;
				line-height: 50rpx;
				border-radius: 25rpx;
				font-family: MicrosoftYaHei;
				font-size: 20rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				display: inline-block;
				text-align: center;
				margin-left: 16rpx;
				background-color: #e9e9e9;
				color: #666666;
			}

			.icons.def {
				color: #ff5002;
				background-color: #ffdccd;
			}
		}

		>.def {
			.switchbtn {
				transform: scale(0.7)
			}
		}

	}

	.addres-box {
		padding: 0 32rpx;

		.item {
			height: 108rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			font-family: PingFang-SC-Medium;
			font-size: 28rpx;
			font-weight: normal;
			font-stretch: normal;
			line-height: 108rpx;
			letter-spacing: 1rpx;
			color: #000000;
			border-bottom: 2rpx #f5f5f5 solid;

			input,
			text {
				width: 100%;
			}

			text {
				font-size: 28rpx;
				padding-left: 10rpx;
			}

			text.moren {
				padding-left: 20rpx;
			}

			.moren {
				color: #cbcbcb;
				font-size: 28rpx;
			}


			textarea {
				width: 100%;
				height: 130rpx;
			}

			.jt {
				width: 11rpx;
				height: 19rpx;
			}
		}

		.item:last-child {
			height: 130rpx;
			padding: 20rpx 0;
			border-bottom: none;
		}
	}
</style>
