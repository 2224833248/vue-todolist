<template>
	<view class="tbody">
		<view class="top_bk">
			<view class="left_person_msg">
				<view :class="'login_icon_box '+ (islogin == false ? '' : 'login_icon_box_login')">
					<image v-if="islogin == false" class="no_login_icon_img" src="../../static/freedraw/my/nologin.png" mode="aspectFit"></image>
					<image v-else class="login_icon_img" :src="user.headimg" mode="aspectFit"></image>
				</view>
				<view class="tologin" v-if="islogin == false" >
					立即登录
				</view>
				<view class="user_msg" v-else>
					<view class="tologin">
						{{user.nickname}}
					</view>
					<view class="uid">
						ID:{{user.uid}}
					</view>
				</view>
			</view>
		</view>
		<view class="items_box top">
			<view class="item" @click="toallDraw()">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/liwu2x.png" mode="aspectFit"></image>
					<view class="item_text">
						全部抽奖
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
			<view class="item" @click="recode()">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/record2x.png" mode="aspectFit"></image>
					<view class="item_text">
						中奖记录
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="items_box bottom">
			<view class="item" @click="jump('https://mobile.yhshapp.com/Article/detail?aid=73')">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/book2x.png" mode="aspectFit"></image>
					<view class="item_text">
						新手引导
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
			<view class="item" @click="toQuestions()">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/question2x.png" mode="aspectFit"></image>
					<view class="item_text">
						常见问题
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
			<view class="item" @click="tomyfeedback()">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/xf_2x.png" mode="aspectFit"></image>
					<view class="item_text">
						我的反馈
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
			<view class="item" @click="tofeedback()">
				<view class="item_left">
					<image class="item_icon" src="../../static/freedraw/my/fankui_my2x.png" mode="aspectFit"></image>
					<view class="item_text">
						意见反馈
					</view>
				</view>
				<image class="toright" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import adSwiper from '../../components/adSwiper/adSwiper.vue'
	import load from '../../components/load/load.vue'
	import taskList from '@/components/task-list/task-list.vue'
	export default {
		components: {
			adSwiper,
			taskList
		},
		data() {
			return {
				page: 1,
				type: 'card',
				base: [],
				list: [],
				shouHide: false,
				sign: '../sign/sign',
				feedback: '../feedback/feedback',
				myFeedback: '../myFeedback/myFeedback',
				issue: '../issue/issue',

				// 阿里广告
				isShowAliAd: 1,
				adUnitId: 'ad_tiny_2021001167643261_202009262200004062',
				aliAdTaskId:229,
				islogin:true,
				username:'测试用户名',
				usericon:'../../static/freedraw/my/question2x.png',
			};
		},
		computed:{
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '测试用户名',
					lucky_bean:'0',
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
		},
		onShow() {},
		mounted() {},
		onLoad() {
			// console.log(this.$store.state.user);
		},
		methods: {
			////新手粉红广告
			jump(e) {
				// 内部跳转
				uni.navigateTo({
					url: "/pages/webview/webview?url=" + e,
				})
			},
			
			recode(){
				uni.navigateTo({
					url:'../winprice/winprice',
				})
			},
			tomyfeedback(){
				uni.navigateTo({
					url:'../myFeedback/myFeedback',
				})
			},
			tofeedback(){
				uni.navigateTo({
					url:'../feedback/feedback',
				})
			},
			login(){
				if(this.islogin == false){
					this.islogin = true;
				}else{
					this.islogin = false;
				}
			},
			toallDraw(){
				uni.navigateTo({
					url:'/pages/sign/sign'
				})
			},
			toQuestions(){
				uni.navigateTo({
					url:'/pages/withdrawal/withdrawal'
				})
			},
		},
		//获取用户信息
		created(){
			if (this.isLogin) {
				this.init();
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		// height: 100vh;
	}
	.top_bk{
		width: 100%;
		height: 400rpx;
		background: url(../../static/freedraw/my/bk_12.png) no-repeat;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		.left_person_msg{
			position: absolute;
			left: 32rpx;
			bottom: 41rpx;
			display: flex;
			align-items: center;
			.login_icon_box{
				display: block;
				width: 98rpx;
				height: 98rpx;
				background: #FFFFFF;
				border-radius: 10rpx;
				overflow: hidden;
				text-align: center;
				padding: 20rpx 0 0 0;
				box-sizing: border-box;
				margin: 0 24rpx 0 0;
				.login_icon_img{
					// display: inline-block;
					width: 98rpx;
					height: 98rpx;
					border-radius: 10rpx;
				}
				.no_login_icon_img{
					width: 48rpx;
					height: 59rpx;
				}
			}
			.login_icon_box_login{
				padding: 0;
				background-color: transparent;
			}
			.tologin{
				width: 300rpx;
				height: 38rpx;
				font-stretch: normal;
				// line-height: 30rpx;
				letter-spacing: 0rpx;
				// margin-top: 22rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: left;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				margin-bottom: 10rpx;
			}
			.uid{
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
		.right_toright{
			.right_toright_img{
				width: 19rpx;
				height: 37rpx;
			}
		}
	}
	
	.items_box{
		margin: 24rpx 0 0 0;
		position: relative;
		.item{
			padding: 26rpx 40rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			.item_left{
				display: flex;
				align-items: center;
				.item_icon{
					width: 36rpx;
					height: 36rpx;
					margin-right: 30rpx;
				}
				.item_text{
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #333333;
				}
			}
			.toright{
				width: 15rpx;
				height: 27rpx;
			}
		}
		.item::after{
			display: block;
			position: absolute;
			bottom: 0;
			right: 0;
			content: '';
			width: 86%;
			height: 0;
			border-top: 2rpx solid #EFEFEF;
		}
		.item:last-child::after{
			border-top: 0rpx solid #EFEFEF;
		}
	}
	.bottom{
		margin-top: 19rpx;
	}
</style>
 