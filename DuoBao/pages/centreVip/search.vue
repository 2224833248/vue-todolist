<template>
	<!-- //充值中心 -->
	<view class="searchBody">
		<view class="search">
			<input type="text" v-model="search" value="" placeholder="请输入订单号查询" />
			<text @click="searchBtn">搜索</text>
		</view>
		<view class="searContBox">
			<view class="searContList" v-if="Object.keys(searchList).length > 0" v-for="(item,index) in searchList" :key="index"
			 @click="status(item)">
				<view class="order">
					<text>订单号:{{item.id}}</text>
					<text>{{item.statusName}}</text>
				</view>
				<view class="orderCont">
					<view class="orderLeft">
						<view class="leftImg">
							<image :src="item.class_img" mode="aspectFit"></image>
						</view>
						<view class="leftText">
							<text>{{item.title}}</text>
							<text>共{{item.num}}件</text>
						</view>
					</view>
					<view class="orderRight">
						<text>￥</text>
						<text>{{item.pay_price}}</text>
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/right.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>

			<view class="dataNo" v-show="dataHides" v-if="Object.keys(searchList).length <= 0">
				<view class="dataImgBox">
					<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/wujilu.png" mode="aspectFit"></image>
				</view>
				<view style="padding:49rpx 0px 72rpx;text-align: center;" class="">
					<text>您当前没有任何充值记录</text>
				</view>
				<navigator url="./centreVip">
					<view class="goTocz">
						去充值
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	export default {
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.orderFrom = option.orderFrom;
			this.price = option.price;
		},
		data() {
			return {
				searchList: [], //原本的数据
				searchData: [],
				search: '', //双向绑定的数据
				price: 0,
				orderFrom: 0,
				dataHides:false
			};
		},
		methods: {
			orderList() {
				$axios.get({
					url: 'Equity/getOrder',
					data: {
						type: 1,
						p: 1,
						tid: this.search
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.searchList = res.data.data.list;
						this.dataHides = true;
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			// 订单未完成点击跳转
			status(item) {
				if (item.status == 0) {
					uni.navigateTo({
						url: 'payment?price=' + item.price + '&pay_price=' + item.pay_price + '&orderFrom=' + item.alipay_num
					})
				}
			},
			// 搜索
			searchBtn() {
				this.orderList();


				// let search = this.search;
				// if(search){
				// 	this.searchData = this.searchList.filter(valId => valId.id.indexOf(this.search) !== -1)
				// 	console.log(this.searchData)
				// }
			}
		},
		created() {
			console.log(this.search)
			this.searchList = [];
			this.orderList()
		},
		watch: {
			// TO DO 监听数据变化
			"search": function(newVal, oldVal) {
				if (newVal == '') {
					this.orderList()
				}
			}
		}
	}
</script>

<style lang="less">
	.searchBody {
		font-family: PingFangSC-Medium;

		.search {
			width: 100%;
			height: 95rpx;
			box-sizing: border-box;
			padding: 0 30rpx;
			background: #fff;
			display: flex;
			justify-content: space-between;
			border-radius: 0 0 15px 15px;
			box-shadow: 0rpx 10rpx 20rpx 5rpx rgba(236, 236, 236, 0.3);

			input {
				height: 100%;
				margin: 0;
				padding: 0;
				font-size: 28rpx;
				color: #999;
			}

			text {
				font-size: 28rpx;
				color: #288ffe;
				line-height: 95rpx;
			}
		}

		.searContBox {
			.searContList {
				background: #fff;
				width: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;
				border-radius: 14rpx;
				margin-top: 24rpx;

				.order {
					display: flex;
					justify-content: space-between;
					height: 80rpx;
					box-sizing: border-box;
					border-bottom: 1px solid #ECECEC;

					text {
						font-size: 24rpx;
						color: #333;
						line-height: 80rpx;
					}

					text:nth-of-type(2) {
						color: #999;
					}
				}

				.orderCont {
					padding: 30rpx 0;
					display: flex;
					justify-content: space-between;

					.orderLeft {
						display: flex;

						.leftImg {
							width: 88rpx;
							height: 88rpx;
							background-color: #ffffff;
							box-shadow: 0rpx 2rpx 6rpx 0rpx #ececec;
							border-radius: 8rpx;
							margin-right: 18rpx;
							overflow: hidden;

							image {
								width: 100%;
								height: 100%;
							}
						}

						.leftText {
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							text {
								font-size: 24rpx;
								color: #333;
							}

							text:nth-of-type(2) {
								color: #999;
							}
						}
					}

					.orderRight {
						line-height: 88rpx;

						text {
							color: #333;
							font-weight: bold;
						}

						text:nth-of-type(1) {
							font-size: 20rpx;
						}

						text:nth-of-type(2) {
							font-size: 32rpx;
						}

						image {
							width: 13rpx;
							height: 23rpx;
							margin-left: 20rpx;
						}
					}
				}
			}

			.dataNo {
				width: 397rpx;
				height: 407rpx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				 

				.dataImgBox {
					image {
						width: 397rpx;
						height: 190rpx;
					}
				}

				text {
					text-align: center;
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
				}

				.goTocz {
					width: 331rpx;
					height: 68rpx;
					background-image: linear-gradient(90deg,
						#fc721c 0%,
						#ef1b5d 100%);
					border-radius: 34rpx;
					color: #fff;
					text-align: center;
					margin: 0 auto;
					font-size: 28rpx;
					line-height: 68rpx;
				}
			}
		}
	}
</style>
