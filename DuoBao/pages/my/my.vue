<template>
	<view class="content">
		<view class="header">
			<view class="header__avatar">
				<image :src="user.headimg" mode="aspectFill"></image>
			</view>
			<view class="header__data"  v-if="isLogin">
				<view class="header__data__username">{{user.nickname}}</view>
				<view class="header__data__userid">ID：{{user.uid}}</view>
			</view>
			<view class="nologin" v-else>
				<view class="loginbtn" @click="login">登录</view>
			</view>
		</view>
		
		<view class="property">
			<view class="balance_goid" @click="goid(1)">
				<image src="/static/icon/balance.png" mode="aspectFit"></image>
				<view class="right">
					<view class="price">{{user.capture_money}}</view>
					<view class="title">我的余额</view>
				</view>
				<image class="icon" src="/static/icon/left.png" mode="aspectFit"></image>
			</view>
			<view class="balance_goid" @click="goid(2)">
				<image src="/static/icon/goid.png" mode="aspectFit"></image>
				<view class="right">
					<view class="price">{{user.integral}}</view>
					<view class="title">我的金币</view>
				</view>
				<image class="icon" src="/static/icon/left.png" mode="aspectFit"></image>
			</view>
		</view>
		
		
		<form class="card quick_nav" @submit="formSubmit" :report-submit="true">
			<button class="quick_nav__item clear_button" hover-class="none" formType="submit" @click="onPage('my/seting')">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/setting.png_xcx100" mode="aspectFill"></image>
				<view class="item__title">用户设置</view>
			</button>
			<button class="quick_nav__item clear_button" hover-class="none" formType="submit" @click="onRuleTap()">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/rule.png_xcx100" mode="aspectFill"></image>
				<view class="item__title">平台规则</view>
			</button>
			<button class="quick_nav__item clear_button" hover-class="none" formType="submit" @click="onPage('my/feedback')">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/feedback.png_xcx100" mode="aspectFill"></image>
				<view class="item__title">建议反馈</view>
			</button>
			<button class="quick_nav__item clear_button" hover-class="none" formType="submit" @click="onPage('myFeedback/myFeedback')">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/index/feedback.png?" mode="aspectFill"></image>
				<view class="item__title">我的反馈</view>
			</button>
			<button class="quick_nav__item clear_button" hover-class="none" formType="submit" @click="onPage('withdraw/withdraw')">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/tx.png_xcx100" mode="aspectFill"></image>
				<view class="item__title">提现</view>
			</button>
		</form>

		<form class="card dblog" @submit="formSubmit" :report-submit="true">
			<view class="dblog__title">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/dblog.png_xcx100" mode="aspectFill"></image>
				<view class="item__title">夺宝记录</view>
			</view>
			<view class="dblog__nav">
				<button class="dblog__nav__item clear_button" hover-class="none" formType="submit" @click="onPage('my/record?currentType=0')">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/dblog_all.png_xcx100" mode="aspectFill"></image>
					<view class="item__title">全部</view>
				</button>
				<button class="dblog__nav__item clear_button" hover-class="none" formType="submit" @click="onPage('my/record?currentType=1')">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/dblog_no.png_xcx100" mode="aspectFill"></image>
					<view class="item__title">待开奖</view>
				</button>
				<button class="dblog__nav__item clear_button" hover-class="none" formType="submit" @click="onPage('my/record?currentType=2')">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/dblog_ok.png_xcx100" mode="aspectFill"></image>
					<view class="item__title">已开奖</view>
				</button>
			</view>
		</form>

		<view class="card logbox">
			<view class="logbox__list" @click="onPage('exchange/exchange')">
				<view class="logbox__list__left">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/dhlog.png_xcx50" mode="aspectFill"></image>
					<view class="item__title">兑换记录</view>
				</view>
				<view class="logbox__list__right">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/more.png_xcx50" mode="aspectFill"></image>
				</view>
			</view>
			<view class="logbox__list" @click="onPage('invite/index')">
				<view class="logbox__list__left">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/invite.png_xcx50" mode="aspectFill"></image>
					<view class="item__title">邀请记录</view>
				</view>
				<view class="logbox__list__right">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/more.png_xcx50" mode="aspectFill"></image>
				</view>
			</view>
			<view class="logbox__list" @click="onPage('address/list')">
				<view class="logbox__list__left">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/icon/address.png_xcx50" mode="aspectFill"></image>
					<view class="item__title">收货地址</view>
				</view>
				<view class="logbox__list__right">
					<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/more.png_xcx50" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<view class="card adbox" v-if="userAd.length >0">
			<view v-for="(item,index) in userAd" :key="index" @click="adClick(item)">
				<image class="item__image" :src="item.image+'_xcxwep'" mode="aspectFill"></image>
			</view>
		</view>

		<!-- <view class="goods">

			<view class="goods__top">
				<image class="item__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/jxtitle.png" mode="aspectFill"></image>
			</view>
			<!-- <like :loadMoreTime="loadMoreTime" :pluginOptions="pluginOptions" /> ->

		</view> -->

		<uni-popup ref="popup" type="center">
			<view class="rule">
				<text class="title">规则</text>
				<view class="content">
					<view class="item">
						<text class="wen">01如何找到【天天夺宝】？</text>
						<text class="da">支付宝搜索【天天夺宝】，并在右上角收藏【天天夺宝】，就可以在”支付宝首页--我的小程序”中找到您收藏的【天天夺宝】哦。</text>
					</view>
					
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import cache from '../../utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'

	export default {
		data() {
			return {
				loadMoreTime: 0,
				pluginOptions: {
					pid: 'mm_129925751_1897950001_110664150163',
				},
				userAd: []
			}
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
		methods: {
			// 跳转我的多多币/我的余额
			goid(item) {
				if (item == 1) {
					uni.navigateTo({
						url: '/pages/withdraw/withdraw'
					})
				} else {
					uni.navigateTo({
						url: '/pages/exchange/exchange'
					})
				}
			},
			
			
			init() {
				if(this.user.nickname=='YH_USER'){
					ajax.login();
				}
				this.getAd()
			},
			getAd() {
				ajax.get({
					url: 'Ad/record',
					data: {
						slot_id: 9
					},
					login: false,
					loading: true,
				}).then((res) => {
					if (res.data.code == 200) {
						this.userAd = res.data.data
						this.userAd.forEach(item=>{
							utils.addAdShowLog(item)
						})
					}
				}).catch((error) => {

				})
			},
			// 跳转页面
			onPage(url) {
				uni.navigateTo({
					url: '/pages/' + url
				})
			},
			onRuleTap() {
				uni.navigateTo({
					url:'/pages/webview/webview?url='+encodeURIComponent('https://mobile.yhshapp.com/Article/detail?aid=66')
				})
			},
			adClick(ad){
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad,this);
			},
			login(){
				ajax.login()
			},
			formSubmit(e){
				ajax.post({
					url: 'Base/collectFormId',
					data: {
						formId: e.detail.formId
					},
				})
			},
		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid:0,
					nickname:''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.nologin{
		display: flex;
		height: 124rpx;
		align-items: center;
		justify-content: center;
		margin-left:20rpx;
	}
	.loginbtn{
		width: 176rpx;
		height: 62rpx;
		background-image: linear-gradient(90deg,
			#fe9349 0%,
			#fe5332 100%),
			linear-gradient(#df8d37,
			#df8d37);
		background-blend-mode: normal,
			normal;
		border-radius: 31rpx;
		text-align: center;
		font-size: 28rpx;
		line-height: 62rpx;
		letter-spacing: 1rpx;
		color: #ffffff;
	}
	.rule {
		background: white;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		border-radius: 20rpx;
		width: 70vw;
		height: 55vh;

		.title {
			align-self: center;
			font-size: 35rpx;
			font-weight: bold;
		}

		.content {
			font-size: 30rpx;
			color: black;
			overflow-y: scroll;
			padding: 10rpx 0rpx;
			.item{
				display: flex;
				flex-direction: column;
				.wen{
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom:8rpx;
				}
				.da{
					font-size: 30;
				}
			}
		}
	}

	.goods {
		width: 694rpx;
		text-align: center;

		.goods__top {
			padding: 25rpx 0;
		}

		image {
			width: 296rpx;
			height: 34rpx;
		}
	}

	.adbox {
		width: 694rpx;

		image {
			width: 694rpx;
			height: 140rpx;
		}
	}

	.header {
		height: calc(472rpx - 48px - var(--status-bar-height));
		padding-top: calc(48px + var(--status-bar-height));
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/my/header_bg.png);
		background-size: 100%;
		text-align: center;
		line-height: 1;
		padding-left: 34rpx;
		display: flex;
		flex-wrap: wrap;


		&__avatar {
			image {
				width: 124rpx;
				height: 124rpx;
				background-color: #fff147;
				border: solid 3rpx #ffffff;
				border-radius: 50%;

			}
		}

		&__data {
			text-align: left;
			height: 124rpx;
			margin-left: 34rpx;
			color: #FFF;
			font-family: PingFang-SC-Medium;
			display: flex;
			flex-wrap: wrap;
			/* 水平居中 */
			// justify-content: center;
			/* 垂直居中 */
			align-items: center;

			&__username {
				width: 300rpx;
				font-size: 34rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			&__userid {
				width: 100%;
				font-size: 26rpx;
			}
		}


	}

	
	.property {
		background-color: rgb(255, 255, 255);
		margin: 0 20rpx;
		margin-top: -130rpx;
		display: flex;
		justify-content: space-between;
		width: 694rpx;
		height: 132rpx;
		box-sizing: border-box;
		padding: 20rpx 0;
		border-radius: 16rpx;
	
		.balance_goid {
			display: flex;
			align-items: center;
			flex: 1;
			border-right: 1px solid #F5F5F5;
			margin-left: 18rpx;
			position: relative;
	
			&:nth-last-child(1) {
				border: none;
			}
	
			image {
				width: 72rpx;
				height: 72rpx;
				margin-right: 20rpx;
			}
	
			.right {
				margin-right: 100rpx;
	
				.price {
					font-size: 30rpx;
					font-weight: bold;
					color: #555555;
					margin: 10rpx 0 6rpx 0;
				}
	
				.title {
					font-size: 24rpx;
					font-weight: 500;
					color: #858585;
				}
			}
	
			.icon {
				position: absolute;
				top: 50%;
				right: 24rpx;
				width: 12rpx;
				transform: translateY(-50%);
				margin: 0;
			}
		}
	
	
	}
	


	.quick_nav {
		width: 694rpx;
		height: 170rpx;
		// margin-top: -110rpx;
		display: flex;
		flex-wrap: wrap;
		/* 水平居中 */
		justify-content: center;
		/* 垂直居中 */
		align-items: center;

		&--no_margin {
			margin-top: 0;
		}

		&__item {
			width: 20%;
			text-align: center;

			.item__image {
				width: 70rpx;
				height: 70rpx;
			}

			.item__title {
				font-size: 26rpx;
				line-height: 1;
				color: #333333;
			}
		}
	}

	.dblog {
		width: 694rpx;
		height: 259rpx;

		&__title {
			width: 647rpx;
			margin: 0 auto;
			padding: 26rpx 0;
			display: flex;
			flex-wrap: wrap;
			border-bottom: 1rpx solid #f5f5f5;

			image {
				width: 27rpx;
				height: 31rpx;
			}

			.item__title {
				height: 31rpx;
				margin-left: 10rpx;
				font-family: PingFang-SC-Medium;
				font-size: 30rpx;
				font-weight: normal;
				font-stretch: normal;
				color: #000000;
			}
		}

		&__nav {
			height: 179rpx;
			display: flex;
			flex-wrap: wrap;
			/* 水平居中 */
			justify-content: center;
			/* 垂直居中 */
			align-items: center;

			&__item {
				width: 231rpx;
				text-align: center;

				.item__image {
					width: 76rpx;
					height: 60rpx;
				}

				.item__title {
					font-size: 26rpx;
				}
			}
		}
	}

	.logbox {
		width: 694rpx;
		// height: 264rpx;

		&__list {
			margin: 0 24rpx;
			border-bottom: 1rpx solid #f5f5f5;
			padding: 22rpx 0;
			display: flex;
			flex-wrap: wrap;
			/* 水平居中 */
			justify-content: space-between;
			/* 垂直居中 */
			align-items: center;

			&__left {

				display: flex;
				flex-wrap: wrap;
				/* 水平居中 */
				justify-content: center;
				/* 垂直居中 */
				align-items: center;

				.item__image {
					width: 27rpx;
					height: 32rpx;
				}

				.item__title {
					display: block;

					height: 32rpx;
					line-height: 32rpx;
					font-size: 32rpx;
					margin-left: 20rpx;
				}
			}

			&__right {
				.item__image {
					width: 11rpx;
					height: 20rpx;
				}
			}
		}

		&__list:last-child {
			border-bottom: none;
		}

	}
</style>
