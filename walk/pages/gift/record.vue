<template>
	<view id="Record" class="page">
		<mescroll-uni ref="mescroll" @init="mescrollInit" @down="downCallback" :up="up" :down="down" @up="upCallback">
			<view class="list-box">
				<view class="list" v-for="(item,index) in list" :key="index" @click="ckOrder(item.id)">
					<view class="box-list">
						<text class="blo title">{{item.title}}</text>
						<text class="blo time">{{item.addtime|dateFtt()}}</text>
					</view>
					<view class="box-list txtr">
						<text class="blo num">{{item.integral}}</text>
						<text class="blo time">剩余多多币：{{item.balance}}</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>


<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'

	export default {
		data() {
			return {
				loadingData: false,
				down: {
					use: false
				},
				up: {
					noMoreSize: 1,
					textNoMore: '— 没有更多兑换商品了哦 —',
					empty: {
						icon: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/app_data_null.png',
						tip: '— 暂无兑换商品了哦 —'
					}
				},
				list: []
			}
		},

		components: {
			MescrollUni
		},
		methods: {
			change(e) {
				this.page = e.target.current + 1;
			},
			mescrollInit() {

			},
			downCallback() {

			},
			upCallback(e) {
				if (this.loadingData != true) {
					this.getList(e);
				}
			},
			ckOrder(id) {
				uni.navigateTo({
					url: '/pages/gift/pay?id=' + id
				})
			},
			getList(e) {
				this.loadingData = true;
				let mescroll = this.$refs.mescroll.mescroll;
				ajax.get({
					url: 'gift/getRecord',
					data: {
						page: mescroll.num
					},
					login: true,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						if (mescroll.num == 1) {
							this.list = [];
						}
						this.list = this.list.concat(res.data.data.list);
						mescroll.endSuccess(res.data.data.list.length, res.data.data.endPage);
					} else {
						mescroll.endErr()
					}
					this.loadingData = false;
				}).catch((error) => {
					mescroll.endUpScroll(true);
					this.loadingData = false;
				})
			}

		},
		filters: {
			dateFtt(val) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', val);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.list-box {
		width: 750rpx;
		border-top: 25rpx #f5f5f5 solid;
		padding: 0 32rpx;

		.list {
			width: 686rpx;
			height: 71rpx;
			padding: 36rpx 0;

			border-bottom: 2rpx #f5f5f5 solid;

			display: flex;
			align-items: center;
			justify-content: space-between;

			.box-list {
				display: block;

				.blo {
					display: block;
				}

				.title {
					height: 31rpx;
					font-family: PingFang-SC-Medium;
					font-size: 33rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 31rpx;
					letter-spacing: 0rpx;
					color: #000000;
				}

				.num {
					height: 24rpx;
					font-family: PingFang-SC-Bold;
					font-size: 32rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 24rpx;
					letter-spacing: 0rpx;
					color: #fb8201;
				}

				.time {
					height: 19rpx;
					font-family: PingFang-SC-Medium;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					line-height: 19rpx;
					letter-spacing: -1rpx;
					color: #999999;
					margin-top: 19rpx;
				}
			}

			.txtr {
				text-align: right;
			}
		}
	}
</style>
