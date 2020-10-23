<template>
	<view class="bodys">
		<view class="tabBox" @click.self="offUp">
			<view class="tabTitle">
				<view v-for="(item,index) in tabTitle" :key="item.id" :class="{special:tabId == index,defat:defats}" @click.stop="titleLis(index,$event)">
					{{item.class_title}}
				</view>
			</view>
			<view class="tabCont" :class="{hide:txHide}" v-for="(itemCont,index) in tabTitle" v-show="index == tabId">
				<view :class="mcClass == index?'tabList':'mencen tabList'"  v-for="(item,index) in itemCont.list" :key='item.index' @click.stop="mcClassHander(index)">
					<image :src="item.img" mode="aspectFit"></image>
					<view class="videoTitle">{{item.title}}</view>
					<view class="videoText" v-if="item.price!='0'"><text class="price" :decode="true">{{item.price+' '}}</text>元起</view>
					<view class="videoText" v-else>{{item.small_title}}</view>
				</view>
			</view>

			<!-- 下拉箭头 -->
			<view class="xiala" :class="{up:txHide}"></view>
		</view>

		<!-- 输入框 -->
		<view class="inputBox">
			<view class="input">
				<input type="text" :placeholder="listVip.account_type" value="" v-model="massge" />
			</view>
			<view class="imgBox" @click="deletVal">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/delet.png" mode="aspectFit"></image>
				<image class="aqy" :src="listVip.class_img" mode="aspectFit"></image>
			</view>
		</view>

		<!-- 选项 -->
		<view class="option">
			<!-- 选项标题 -->
			<view class="optionVip">
				<view class="vipBox" :class="{lisVip:classVip == items,oneList:vipOneList}" @click="vipSpecial(items)" v-for="(item,items) in listVip.list"
				 :key="items">
					{{item.c_title}}
					<!-- <view class="">{{item.text}}</view> -->
				</view>
			</view>
			<!-- 选项内容年卡 -->
			<view class="yearCard" v-for="(yearItem,isYear) in listVip.list" v-show="isYear == classVip">
				<view class="yearCardLis" v-for="(year,index) in yearItem.list" :key='index' :class="{speYearCard:yearActive == index,oneYearCard:oneYearCard}"
				 @click="isYearCard(index)">
					<text>{{year.title}}</text>
					<view class="yearPrice">售价{{year.promotion_price}}元</view>
				</view>
			</view>
		</view>

		<!-- 底部 -->

		<view class="footerBox">
			<view class="footerIcon">
				<view class="iconLis">
					<contact-button tnt-inst-id="27k_hzAR" scene="SCE00309045" icon="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/index/concat.png" size="40rpx"/>
				</view>
				<view class="iconLis">
					<navigator url="./search">
						<image src='https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/dd.png' mode="aspectFit"></image>
						<text>订单</text>
					</navigator>
				</view>
				<view class="iconLis" @click="xzClick">
					<view class="">
						<image src='https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/xz.png' mode="aspectFit"></image>
						<text>须知</text>
					</view>
				</view>
			</view>
			<view class="btn" @click="btns">
				提交订单
			</view>
		</view>
		<!-- 遮层 -->
		<view :class="{covering:txHide}"></view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				isActive: '',
				txHide: false,
				defats: true,
				massge: '',
				oneList: true,
				vipOneList: true,
				yearActive: 0,
				oneYearCard: true,
				mcClass: 0, //蒙层
				tabId: 0,
				classVip: 0,
				tabTitle: [],
				tabList: [],
				listVip: [],
				payData: []
			};
		},
		methods: {
			// 获取页面tab标题数据
			gitTitle() {
				$axios.get({
					url: 'Equity/getList',

				}).then((res) => {

					if (res.data.code == 200) {
						this.tabTitle = res.data.data;
						this.gitDatails();
					}
				}).catch((err) => {

				})
			},
			// 获取列表详情
			gitDatails() {
				$axios.get({
					url: 'Equity/getEquityInfo',
					data: {
						id: this.tabTitle[this.tabId].list[this.mcClass].data,
					}
				}).then((res) => {
					this.listVip = res.data.data;
				}).catch((err) => {
				})
			},
			// 跳转支付页面
			btns() {
				uni.showLoading({
				   title:'请求中',
				   mask:true
				});
				$axios.post({
					url: 'Equity/setPay',
					data: {
						type: 1,
						payType: 1,
						rid: this.listVip.list[this.classVip].list[this.yearActive].id,
						cid: '',
						account: this.massge,
						num: 1
					}
				}).then((res) => {
					
					if (res.data.code == 200) {
						uni.navigateTo({
							url: 'payment?orderFrom=' + res.data.data.payUrl + '&pay_price=' + res.data.data.pay_price + '&price=' + res.data.data.price
						})
					} else {
						
						uni.showToast({
							title:res.data.msg
						})
					}
					uni.hideLoading()
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
				})
			},
			// 标题
			titleLis(index) {
				this.tabId = index;
				this.defats = false;
				this.gitDatails()
			},
			// 下拉
			offUp(e) {
				console.log(e);
				if (this.txHide) {
					this.txHide = false;
				} else {
					this.txHide = true;
				}
			},
			mcClassHander(index) {
				this.mcClass = index
				this.gitDatails()
			},
			// 清空输入框
			deletVal() {
				this.massge = ''
			},
			// 会员高亮以及切换
			vipSpecial(items) {
				this.classVip = items;
				this.vipOneList = false
			},
			// 年卡
			isYearCard(index) {
				this.yearActive = index;
				this.oneYearCard = false
			},

			// 须知点击事件
			xzClick() {
				uni.navigateTo({
					url: '../webview/webview?url=' + encodeURIComponent('https://mobile.yhshapp.com/article/detail?aid=67')
				})
			},
			init() {
				this.gitTitle()
				// this.btns()
			},
		},
		created() {
			this.gitTitle();
		},
		mounted() {
			if (this.isLogin) {
				this.init()
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		computed: {
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			}
		}
	}
</script>

<style lang="less">
	.bodys {
		font-family: PingFangSC-Medium;
		background-color: #fff;
		padding-top: 400rpx;

		.tabBox {
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: #00aaff;
			border-radius: 0 0 34rpx 34rpx;
			padding-bottom: 18rpx;
			box-shadow: 0rpx 10rpx 20rpx 5rpx rgba(0, 170, 255, 0.3);
			z-index: 9;

			.tabTitle {
				display: flex;
				box-sizing: border-box;
				height: 100rpx;
				border-bottom: 1px solid rgba(37, 182, 255);

				view {
					flex: 1;
					text-align: center;
					margin: 39rpx 0 35rpx 0;
					color: #fff;
					font-size: 28rpx;
					padding-top: 4rpx;
					border-right: 1px solid rgba(37, 182, 255);
				}

				.defat:nth-of-type(1) {
					font-size: 32rpx;
					font-weight: bold;
					margin: 35rpx 0;
					padding: 0;
				}

				.special {
					font-size: 32rpx;
					font-weight: bold;
					margin: 35rpx 0;
					padding: 0;
				}
			}

			.tabCont {
				padding: 35rpx 12rpx 12rpx 12rpx;
				display: flex;
				flex-wrap: wrap;
				align-content: flex-start;
				height: 217rpx;
				overflow: hidden;

				.tabList {
					width: 159rpx;
					height: 212rpx;
					background-color: #ffffff;
					border-radius: 22rpx;
					text-align: center;
					box-sizing: border-box;
					padding-top: 36rpx;
					margin: 0 0 18rpx 18rpx;
					position: relative;

					&.mencen {
						opacity: 0.7;
					}

					image {
						width: 64rpx;
						height: 64rpx;
					}

					.videoTitle {
						font-family: PingFangSC-Medium;
						font-size: 24rpx;
						font-weight: bold;
						color: #333333;
						margin: 20rpx 0 15rpx 0;
					}

					.videoText {
						width: 159rpx;
						font-size: 24rpx;
						color: #666666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

						.price {
							font-size: 26rpx;
							font-weight: bold;
							color: #f3323a;
						}
					}
				}

			}

			.hide {
				height: 900rpx;
				overflow-y: auto;
			}

			.xiala {
				width: 69rpx;
				height: 19rpx;
				margin: 0 auto;
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/off.png)no-repeat;
				background-size: 100% 100%;
			}

			.up {
				background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/contreVip/up.png)no-repeat;
				background-size: 100% 100%;
			}
		}

		// 输入框
		.inputBox {
			width: 690rpx;
			height: 90rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			border: solid 2rpx #ececec;
			margin: 0 auto;
			display: flex;
			margin-top: 36rpx;

			.input {
				padding-left: 30rpx;

				input {
					width: 500rpx;
					outline: none;
					border: none;
					font-size: 30rpx;
					color: #999;
					height: 90%;
					line-height: 90%;
				}
			}

			.imgBox {
				// line-height: 90rpx;
				display: flex;
				align-items: center;

				image {
					width: 28rpx;
					height: 28rpx;

				}

				.aqy {
					margin-left: 40rpx;
					width: 50rpx;
					height: 40rpx;
				}
			}
		}


		//vip类型
		.option {
			width: 690rpx;
			margin: 0 auto;
			margin-top: 24rpx;

			.optionVip {
				box-sizing: border-box;
				height: 98rpx;
				width: 100%;
				display: flex;
				background-color: #f8f9f9;
				border-radius: 14rpx;

				.vipBox {
					flex: 1;
					box-sizing: border-box;
					border-radius: 14rpx;
					text-align: center;
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					padding: 0;
					line-height: 98rpx;

					view {
						font-size: 22rpx;
						color: #ff3f3e;
						margin-top: 11rpx;
					}
				}

				// .vipBox:nth-of-type(2) {
				// 	padding: 0;
				// 	line-height: 98rpx;
				// }

				.lisVip {
					background-color: #ff3f3e;
					color: #fff;

					view {
						color: #fff;
					}
				}

				.oneList:nth-of-type(1) {
					background-color: #ff3f3e;
					color: #fff;

					view {
						color: #fff;
					}
				}
			}
		}

		//年卡
		.yearCard {
			width: 690rpx;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			padding-bottom: 188rpx;

			.yearCardLis {
				box-sizing: border-box;
				width: 214rpx;
				height: 108rpx;
				border-radius: 12rpx;
				border: solid 2rpx #e5e5e5;
				margin: 24rpx 24rpx 0 0;
				padding: 22rpx 0;
				text-align: center;

				text {
					color: #333;
					font-size: 34rpx;
					font-weight: bold;
				}

				.yearPrice {
					font-size: 20rpx;
					color: #666;
					margin-top: 11rpx;
				}
			}

			.yearCardLis:nth-of-type(3n) {
				margin-right: 0;
			}

			.speYearCard {
				border: solid 3rpx #ff3f3e;
				background: rgba(255, 63, 62, 0.1);

				text {
					color: #ff3f3e;
				}

				.yearPrice {
					color: #ff3f3e;
				}
			}
		}

		// 底部footer
		.footerBox {
			width: 100%;
			height: 98rpx;
			background-color: #ffffff;
			box-shadow: 0rpx -6rpx 15rpx 0rpx rgba(0, 0, 0, 0.12);
			border-radius: 49rpx;
			position: absolute;
			bottom: 60rpx;
			left: 0;
			box-sizing: border-box;
			padding: 18rpx 58rpx;
			display: flex;
			justify-content: space-between;

			.footerIcon {
				display: flex;

				.iconLis {
					margin-right: 69rpx;
					width: 40rpx;

					navigator,
					view {
						display: flex;
						flex-wrap: wrap;
						justify-content: center;
					}

					image {
						width: 32rpx;
						height: 30rpx;
					}

					text {
						font-size: 20rpx;
						color: #666;
						margin-top: 8rpx;
					}
				}

				.iconLis:nth-of-type(1) {
					image {
						width: 40rpx;
						height: 58rpx;
					}
				}

				.iconLis:nth-last-chid(1) {
					margin-right: 0;
				}
			}

			.btn {
				width: 338rpx;
				height: 64rpx;
				background-image: linear-gradient(90deg,
					#fc721c 0%,
					#ef1b5d 100%);
				border-radius: 32rpx;
				color: #fff;
				font-size: 24rpx;
				text-align: center;
				line-height: 64rpx;
			}

			.uni-transition {
				bottom: 100rpx;

				.uni-popup__success {
					background: none;
					border: none;
					justify-content: center;
					padding-top: 20rpx;

					text {
						color: red;
					}
				}
			}
		}

		// 遮层
		.covering {
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.9);
			position: absolute;
			left: 0;
			top: 0;
		}

		.mcRemove {
			display: none;
		}
	}
</style>
