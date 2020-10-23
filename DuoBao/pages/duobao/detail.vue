<template>
	<view class="content">
		<view class="goods_pic">
			<swiper class="goods_pic__swiper" :autoplay="true" interval="2000" duration="500" @change="swiperChange">
				<swiper-item class="goods_pic__swiper__item" v-for="(item,index) in goods_info.goods_slide" :key="index">
					<image :src="item+'_xcxwep'" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<view class="goods_pic__rule_button" :style="{'top': NAVIGATION_BAR_HEIGHT}" @click="navigateTo('/pages/duobao/rule')">
				规则公示
			</view>
			<view class="goods_pic__pagination">
				{{current}}/{{goods_info.goods_slide.length}}
			</view>
		</view>
		<view class="goods_price">
			<view class="goods_price__info">
				<view class="goods_price__info__number">
					<text class="goods_price__info__number__new_price">{{goods_info.gold_bets}}</text>
					金币夺宝
					<text class="goods_price__info__number__original_price">
						￥{{goods_info.goods_price}}
					</text>
				</view>
			</view>
			<view class="goods_price__status" v-if="goods_info.status == 1">
				已揭晓
			</view>
			<view class="goods_price__status" v-if="goods_info.status != 1 && kxzb_examine == 1">
				待开奖
			</view>
			<view class="goods_price__countdown" v-if="goods_info.status != 1 && kxzb_examine == 0">
				<view class="goods_price__countdown__text">距结束剩</view>
				<view class="goods_price__countdown__time">
					<text>{{shi}}</text>:<text>{{min}}</text>:<text>{{miao}}</text>
				</view>
			</view>
		</view>
		<view class="goods_info">
			<view class="goods_info__title">{{goods_info.goods_title}}</view>

			<block v-if="goods_info.status == 1">
				<view class="goods_info__prize-winner" v-for="(item,index) in winningUser" :key="index">
					<image class="goods_info__prize-winner__corner" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/prize-winner.png"
					 mode="aspectFill"></image>
					<view class="goods_info__prize-winner__avatar">
						<image class="goods_info__prize-winner__avatar__image" :src="item.user_avatar" mode="aspectFill"></image>
					</view>
					<view class="goods_info__prize-winner__info">
						<view class="goods_info__prize-winner__info__text">获奖者:{{item.user_name}}</view>
						<view class="goods_info__prize-winner__info__text">本期参与:{{participantCount}}人次</view>
						<view class="goods_info__prize-winner__info__text">揭晓时间:{{goods_info.lottery_time|dateFtt}}</view>
					</view>
				</view>

				<view class="goods_info__lucky_number" v-for="(item,index) in winningUser" :key="index">
					<view class="goods_info__lucky_number__text">
						幸运号码:{{item.id}}
					</view>
					<!-- <view class="goods_info__lucky_number__button">
						计算详情
					</view> -->
				</view>
			</block>

			<block v-else>
				<view class="goods_info__time">
					<image class="goods_info__time__image" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/time.png"
					 mode="aspectFill"></image>
					<view class="goods_info__time__text">开奖时间:{{goods_info.lottery_time|dateFtt}}</view>
				</view>
				<view class="goods_info__participant">
					<view class="goods_info__participant__user">
						<image v-for="(item,index) in participants" :key="index" class="goods_info__participant__user__item" :src="item.user_avatar"
						 mode="aspectFill"></image>
					</view>
					<view class="goods_info__participant__info">已有<text>{{participantCount}}</text>人参与夺宝 I
						{{goods_info.min_start_numer}}人次参与即达标</view>
				</view>
			</block>

			<view class="goods_info__merchant" @click="jump(goods_info.merchant_url)">
				<image class="goods_info__merchant__hd" :src="goods_info.merchant_logo" mode="aspectFill"></image>
				<view class="goods_info__merchant__bd">
					<view class="goods_info__merchant__bd__name">
						本宝贝由<text>{{goods_info.merchant_name}}</text>赞助
					</view>
					<view class="goods_info__merchant__bd__describe">
						{{goods_info.merchant_description}}
					</view>
				</view>
				<view class="goods_info__merchant__bd__stroll">
					逛一逛
				</view>
				<image class="goods_info__merchant__ft" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/more.png"
				 mode="aspectFill"></image>
			</view>
			<view class="goods_info__apply">
				成为天天夺宝赞助商<text @click="onPage('enroll/index')">点击报名</text>
			</view>
		</view>

		<view class="duobao_ad">
			<image :src="goods_info.ad_pic" mode="widthFix" @click="jump(goods_info.ad_url)"></image>
		</view>

		<view class="duobao_number">
			<view class="duobao_number__hd">
				<view class="duobao_number__hd__title">
					夺宝号码
				</view>
				<view class="duobao_number__hd__subtitle">
					您共参与夺宝:<text>{{count}}</text>次
				</view>
			</view>
			<view class="duobao_number__bd">
				<view class="duobao_number__bd__item" v-for="(item,index) in betting" :key="index">{{item.id}}</view>
			</view>
		</view>

		<view style="height: 108rpx;"></view>

		<view class="bottom_bar">
			<view class="bottom_bar__merchant" @click="jump(goods_info.merchant_url)">
				<image class="bottom_bar__merchant__logo" :src="goods_info.merchant_logo" mode="aspectFill"></image>
				<view class="bottom_bar__merchant__title">
					{{goods_info.merchant_name}}
				</view>
			</view>
			<view class="bottom_bar__buttons">
				<view class="bottom_bar__buttons__invite" @click="onShowSharePanelTap()">
					邀请好友
				</view>
				<view class="bottom_bar__buttons__duobao" v-if="goods_info.status == 1">
					已揭晓
				</view>
				<view v-else class="bottom_bar__buttons__duobao" @click="newCapture">
					立即夺宝
				</view>
			</view>
		</view>

		<uni-popup ref="buyPopup" type="bottom" :maskClick='false'>
			<view class="buy_popup">
				<image class="buy_popup__close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close.png"
				 mode="aspectFill" @click="this.$refs.buyPopup.close()"></image>
				<view class="buy_popup__title">
					我要夺宝
				</view>
				<view class="buy_popup__describe">
					{{goods_info.gold_bets}}金币兑换1幸运号，单个宝贝最多可兑换<text>{{goods_info.max_number_bets}}</text>个幸运号
				</view>
				<view class="buy_popup__gold">
					消耗{{glod}}金币
				</view>
				<view class="buy_popup__number">
					<view class="buy_popup__number__dec" @click="dec">-</view>
					<view class="buy_popup__number__number">{{number}}</view>
					<view class="buy_popup__number__inc" @click="inc">+</view>
				</view>
				<view class="buy_popup__balance">
					您当前账号剩余:{{integral}}金币,
					<block v-if="!isSufficient"><text>金币不足</text><text class="buy_popup__balance--bold" @click="goIndex">去做任务赚金币</text>
						<image src="../../static/index/arrows.png" mode="aspectFill"></image>
					</block>
					<block v-else><text class="buy_popup__balance--bold" @click="all">全部投注</text></block>
				</view>
				<view class="buy_popup__button" @click="submit">
					确定夺宝
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="succeedPopup" type="center">
			<view class="succeedPopup">
				<image class="succeedPopup__hd_bg" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/succeedPopup__hd_bg.png"
				 mode="widthFix"></image>
				<image class="succeedPopup__close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close2.png"
				 mode="aspectFill" @click="this.$refs.succeedPopup.close()"></image>
				<view class="succeedPopup__title">
					参与夺宝成功
				</view>
				<view class="succeedPopup__logo">
					<image class="succeedPopup__logo__img" :src="goods_info.succeed_ad_pic" mode="aspectFill" @click="jump(goods_info.succeed_ad_url)"></image>
				</view>
				<view class="succeedPopup__bg">
					<view class="succeedPopup__text">
						{{goods_info.succeed_ad_title}}
					</view>
					<view class="succeedPopup__button" @click="jump(goods_info.succeed_ad_url)">
						{{goods_info.succeed_ad_button}}
					</view>
					<view class="succeedPopup__ft">
						{{goods_info.succeed_ad_description}}
					</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="openlife" type="center">
			<view class="attention-openlife">
				<image class="attention-openlife__close" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/close2.png"
				 mode="aspectFill" @click="this.$refs.openlife.close()"></image>
				<button class="attention-openlife__img" open-type="lifestyle" @click="attention" publicId="2021001171668332"></button>
			</view>
		</uni-popup>


		<view class="display_none">
			<life-follow v-if="show" sceneId="d29409bda9c942d999f2bcab484043e5" :checkFollow="checkFollow" @checkFollow.native="checkFollowCb" />
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	let atten
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				STATUS_BAR_HEIGHT: "25px",
				TITLE_BAR_HEIGHT: "48px",
				NAVIGATION_BAR_HEIGHT: "70px",

				id: 0,

				current: 1,

				shi: '00',
				min: '00',
				miao: '00',

				glod: 0,
				number: 0,

				participantCount: 0,
				participants: [],
				winningUser: [],

				goods_info: {
					start_time: 0,
					lottery_time: 0,
					min_start_numer: 0,
					goods_slide: [''],
					goods_title: '　',
					goods_description: '　',
					goods_price: 0,
					gold_bets: 0,
					max_number_bets: 0,
					merchant_name: '',
					merchant_description: '',
				},

				count: 0,
				betting: [],

				isSufficient: false,

				show: false,
				checkFollow: true,
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success:(res)=> {
					this.TITLE_BAR_HEIGHT = res.titleBarHeight + "px"
					this.STATUS_BAR_HEIGHT = res.statusBarHeight + "px"
					this.NAVIGATION_BAR_HEIGHT = res.titleBarHeight + res.statusBarHeight + "px"
				}
			})
			this.id = option.id
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
				};
			}
		},
		mounted() {
			this.getDetail()
			this.getMyBetting()
		},
		methods: {
			attention() {
				setTimeout(() => {
					this.show = true
				}, 2000)
				// atten = setInterval(()=>{
				// 	this.show = !this.show
				// },1000)
			},
			newCapture() {
				this.show = true
				// this.$refs.buyPopup.open()
			},
			// 获取商品详情
			getDetail() {
				ajax.get({
					url: 'Capture/detail',
					data: {
						id: this.id
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.goods_info = res.data.data.capture
						this.participantCount = res.data.data.participantCount
						this.participants = res.data.data.participants
						this.winningUser = res.data.data.winningUser
						this.countDown()

						if (parseInt(this.user.integral) > parseInt(res.data.data.capture.gold_bets)) {
							this.number == 0 && this.inc()
							this.isSufficient = true
						} else {
							this.isSufficient = false
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							complete: () => {
								uni.navigateTo();
							}
						});
					}
				}).catch((error) => {})
			},
			// 获取夺宝号码
			getMyBetting() {
				ajax.get({
					url: 'Capture/myBetting',
					data: {
						id: this.id
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.count = res.data.data.count
						this.betting = res.data.data.data
					}
				}).catch((error) => {})
			},
			// 提交数据
			submit() {
				ajax.post({
					url: 'Capture/betting',
					data: {
						id: this.id,
						number: this.number
					}
				}).then((res) => {
					// 下注成功
					if (res.data.code == 200) {
						this.count = res.data.data.count
						this.betting = res.data.data.data

						this.$refs.buyPopup.close()
						this.$refs.succeedPopup.open()
					} else {
						uni.showToast({
							title: res.data.msg,
						});
					}
					this.getDetail()
					this.getMyBetting()
					ajax.login2()
				}).catch((error) => {})
			},
			// 邀请好友
			onShowSharePanelTap() {
				my.showSharePanel();
			},
			// 跳转页面
			jump(e) {
				if(!e){
					return;
				}
				// 统计点击
				ajax.post({
					url: "Capture/statis",
					data: {
						captureId: this.id
					}
				})

				if (e.search(/^http:\/\//) === 0 || e.search(/^https:\/\//) === 0 || e.search(/^\/\//) === 0) {
					// 页面跳转
					if(e.search(/mobile.yhshapp.com/) == -1){
						// 支付宝跳转
						my.ap.navigateToAlipayPage({
							path: encodeURIComponent(
								'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' +
								encodeURIComponent(encodeURIComponent(e))
							)
						});
					}else{
						// 内部跳转
						uni.navigateTo({
							url: "/pages/webview/webview?url=" + e,
						})
					}
				} else if ((e.search(/^alipays:\/\//) === 0)) {
					// 小程序跳转
					let query = e.substr(e.indexOf('?') + 1);
					let params = this.parseQuery(query)

					uni.navigateToMiniProgram({
						appId: params.appId,
						path: params.page,
						extraData: params.query
					})
				} else if ((e.search(/^plugin:\/\//) === 0)) {
					uni.navigateTo({
						url: e
					})
				} else {
					// 生活号
				}
			},
			parseQuery(query) {
				let params = {}
				if (query.indexOf('?') !== false) {
					let tmp = query.substr(query.indexOf('?'))
					let tmp1 = '';
					if (tmp.indexOf('&query') !== -1) {
						tmp1 = tmp.substring(0, tmp.indexOf('&query'));
					} else {
						tmp1 = tmp;
					}
					query = query.replace(tmp1, encodeURIComponent(tmp1))
				}
				for (let item of query.split('&')) {
					var tmp = item.split('=')
					params[tmp[0]] = decodeURIComponent(tmp[1])
				}
				return params
			},

			// 检测用户是否关注
			checkFollowCb(e) {
				const {
					followed,
					closeCount
				} = e.detail
				if (!followed) { // 如果没有关注
					this.$refs.openlife.open()
				} else {
					this.$refs.openlife.close()
					this.$refs.buyPopup.open()
					// clearInterval(atten)
				}
				this.show = false
			},
			follow(e) {},

			// 增加下注数量
			inc() {
				if (this.number < this.goods_info.max_number_bets) {
					this.number++
					this.glod = this.number * this.goods_info.gold_bets
				}
			},
			// 减少下注数量
			dec() {
				if (this.number > 0) {
					this.number--
					this.glod = this.number * this.goods_info.gold_bets
				}
			},
			all() {
				let count = parseInt(this.user.integral / this.goods_info.gold_bets)
				this.number = count > this.goods_info.max_number_bets ? this.goods_info.max_number_bets : count
				this.glod = this.number * this.goods_info.gold_bets
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			goIndex() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			onPage(url) {
				uni.navigateTo({
					url: "/pages/" + url
				})
			},

			// 幻灯切换事件
			swiperChange(e) {
				this.current = e.detail.current + 1
			},
			// count down 
			countDown() {
				// 倒计时
				var interval = setInterval(() => {
					let modulo = parseInt((new Date(this.goods_info.lottery_time * 1000) - new Date()) / 1000)
					if (this.goods_info.status == 0 && modulo > 1) {
						let hours = Math.floor(modulo / (60 * 60));
						modulo = modulo % (60 * 60);
						let minutes = Math.floor(modulo / 60);
						let seconds = modulo % 60;

						this.shi = this.timeFormat(hours);
						this.min = this.timeFormat(minutes);
						this.miao = this.timeFormat(seconds);
					} else {
						this.shi = '00';
						this.min = '00';
						this.miao = '00';
						clearInterval(interval);
					}
				}, 500)
			},
			// 时间转换
			timeFormat(param) {
				return param < 10 ? '0' + param : param;
			},
		},
		filters: {
			dateFtt(val) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', val);
			},
		},
		computed: {
			kxzb_examine() {
				return this.$store.state.setUp.kxzb_examine;
			},
			user() {
				return typeof(this.$store.state.user.uid) !== 'undefined' ? this.$store.state.user : {
					integral: 0
				}
			},
			integral() {
				return typeof(this.$store.state.user.uid) !== 'undefined' ? this.$store.state.user.integral : 0
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.display_none {
		position: absolute;
		top: -999999rpx;
		left: -999999rpx;
	}

	.attention-openlife {
		&__img {
			width: 500rpx;
			height: 700rpx;
			background-color: rgba($color: #000000, $alpha: 0);
			background-image: url(../../static/index/openlife.png);
			background-size: 100%;
			border: none;
		}

		&__close {
			width: 60rpx;
			height: 60rpx;

			position: absolute;
			top: 623rpx;
			left: 220rpx;
		}
	}


	.goods_pic {
		position: relative;

		&__swiper {
			&__item {
				image {
					width: 750rpx;
					height: 750rpx;
				}
			}
		}

		&__rule_button {
			width: 154rpx;
			height: 61rpx;
			background-color: rgba($color: #000000, $alpha: 0.3);
			border-radius: 30rpx;

			font-size: 24rpx;
			line-height: 61rpx;
			color: #ffffff;
			text-align: center;

			position: absolute;
			right: 21rpx;
		}

		&__pagination {
			position: absolute;
			right: 26rpx;
			bottom: 22rpx;

			padding: 6rpx 16rpx;
			line-height: 36rpx;
			text-align: center;
			background-color: #ffffff;
			border-radius: 18rpx;

			font-size: 24rpx;
			color: #333333;
		}
	}

	.goods_price {
		display: flex;
		height: 101rpx;

		&__info {
			display: flex;
			align-items: center;
			width: 496rpx;
			height: 101rpx;
			background-color: #000000;
			opacity: 0.7;
			color: #fd7940;

			&__number {
				font-size: 24rpx;
				color: #fd7940;
				margin-left: 34rpx;

				&__new_price {
					font-weight: bold;
					font-size: 40rpx;

				}

				&__original_price {
					margin-left: 28rpx;
					font-size: 22rpx;
					color: #ffffff;
					text-decoration: line-through;
				}
			}
		}

		&__status {
			width: 254rpx;
			height: 101rpx;
			text-align: center;
			background-image: linear-gradient(90deg, #fc9248 0%, #fe5833 100%);

			font-size: 24rpx;
			color: #ffffff;

			line-height: 101rpx;
		}

		&__countdown {
			width: 254rpx;
			height: 101rpx;
			text-align: center;
			background-image: linear-gradient(90deg, #fc9248 0%, #fe5833 100%);

			font-size: 24rpx;
			color: #ffffff;

			&__text {
				margin-top: 13rpx;
			}

			&__time {
				font-size: 24rpx;
				color: #4c4c4c;
				display: flex;
				justify-content: space-between;
				width: 170rpx;
				margin: 12rpx auto;

				text {
					display: block;
					font-size: 24rpx;
					line-height: 39rpx;
					width: 39rpx;
					height: 39rpx;
					background-color: #4c4c4c;
					color: #ffffff;
				}
			}
		}


	}

	.goods_info {
		padding: 29rpx 29rpx 0 29rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;

		&__title {
			font-size: 32rpx;
			font-weight: bold;
			line-height: 48rpx;
			color: #333333;
			margin: 0 auto 15rpx;
		}

		&__prize-winner {
			margin-bottom: 15rpx;
			background-color: #faf4f1;
			border-radius: 10rpx;
			position: relative;
			display: flex;
			padding: 26rpx 26rpx 10rpx 26rpx;

			&__avatar {
				margin-right: 25rpx;

				&__image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
			}

			&__info {
				font-size: 24rpx;
				line-height: 1;
				color: #666666;

				&__text {
					margin-bottom: 16rpx;
				}
			}

			&__corner {
				position: absolute;
				top: 0;
				left: 0;
				width: 107rpx;
				height: 81rpx;
			}
		}

		&__lucky_number {
			margin-top: 9rpx;
			background-color: #fb4f66;
			border-radius: 12rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 26rpx 32rpx;
			color: #ffffff;

			&__text {
				font-size: 28rpx;
			}

			&__button {
				padding: 12rpx 21rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				border: solid 2rpx #ffffff;
			}
		}

		&__time {
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			&__image {
				width: 24rpx;
				height: 24rpx;
				margin-right: 15rpx;
			}

			&__text {
				font-size: 24rpx;
				color: #333333;
			}
		}

		&__participant {
			margin-top: 30rpx;
			display: flex;
			align-items: center;

			&__user {
				margin-right: 49rpx;

				&__item {
					border-radius: 50%;
					width: 60rpx;
					height: 60rpx;
					border: 2rpx solid #FFFFFF;
					margin-right: -30rpx;
				}
			}

			&__info {
				font-size: 24rpx;
				color: #999999;

				text {
					color: #fd7940;
				}
			}
		}

		&__merchant {
			display: flex;
			align-items: center;
			padding: 16rpx 0;
			margin-top: 17rpx;

			&__hd {
				width: 73rpx;
				height: 73rpx;
				border: solid 1rpx #ececec;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			&__bd {
				width: 470rpx;
				margin-right: 13rpx;

				&__name {
					margin-bottom: 13rpx;
					font-size: 28rpx;
					color: #333333;

					text {
						color: #549ef8;
						margin: 10rpx;
					}
				}

				&__describe {
					font-size: 22rpx;
					color: #999999;

					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&__stroll {
					width: 70rpx;
					font-size: 22rpx;
					color: #fd7940;
					margin-right: 5rpx;
				}
			}

			&__ft {
				width: 16rpx;
				height: 26rpx;
			}
		}

		&__apply {
			margin-top: 14rpx;
			border-top: 1rpx #ececec solid;
			padding: 31rpx 0;

			font-size: 24rpx;
			color: #666666;

			text {
				font-size: 24rpx;
				color: #549ef8;
				margin-left: 42rpx;
			}
		}
	}

	.duobao_number {
		background-color: #FFFFFF;

		&__hd {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 28rpx;
			border-bottom: #e7e7e7 1rpx solid;

			&__title {
				font-size: 28rpx;
				font-weight: bold;
				color: #333333;
			}

			&__subtitle {
				font-size: 24rpx;
				color: #666666;

				text {
					color: #fd7940;
				}
			}
		}

		&__bd {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 29rpx 29rpx 9rpx 29rpx;

			&__item {
				width: 187rpx;
				height: 51rpx;
				background-color: #f7f7f7;
				border-radius: 6rpx;

				font-size: 24rpx;
				line-height: 51rpx;
				color: #333333;
				text-align: center;
				margin-bottom: 20rpx;
			}
		}
	}

	.bottom_bar {
		position: fixed;
		bottom: 0;

		border-top: #e7e7e7 1rpx solid;
		width: 690rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 13rpx 30rpx;

		&__merchant {
			width: 100rpx;
			text-align: center;

			&__logo {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				border: solid 1rpx #ececec;
			}

			&__title {
				font-size: 18rpx;
				color: #666666;

				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		&__buttons {
			display: flex;
			font-size: 24rpx;
			line-height: 72rpx;
			color: #ffffff;
			text-align: center;

			&__invite {
				width: 293rpx;
				height: 72rpx;
				background-color: #fc9248;
				border-radius: 36rpx 0rpx 0rpx 36rpx;
			}

			&__duobao {
				width: 294rpx;
				height: 72rpx;
				background-color: #fe5833;
				border-radius: 0rpx 36rpx 36rpx 0rpx;
			}
		}
	}

	.buy_popup {
		position: relative;
		background-color: #FFFFFF;
		padding: 30rpx;
		border-radius: 30rpx 30rpx 0rpx 0rpx;

		&__close {
			width: 30rpx;
			height: 30rpx;

			position: absolute;
			top: 33rpx;
			right: 30rpx;
		}

		&__title {
			text-align: center;
			font-size: 34rpx;
			font-weight: bold;
			color: #333333;
		}

		&__describe {
			margin-top: 20rpx;
			text-align: center;
			font-size: 24rpx;
			color: #999999;

			text {
				color: #fc8652;
			}
		}

		&__gold {
			margin: 44rpx auto 0;
			padding: 12rpx 0;
			width: 197rpx;
			height: 51rpx;
			line-height: 51rpx;
			background-color: #f5f5f5;
			border-radius: 25rpx;

			text-align: center;
			font-size: 24rpx;
			color: #fd7940;
		}

		&__number {
			display: flex;
			align-items: center;
			justify-content: space-between;
			text-align: center;
			width: 300rpx;
			margin: 60rpx auto;
			line-height: 70rpx;


			&__inc,
			&__dec {
				width: 70rpx;
				height: 70rpx;
				background-color: #f1f1f1;
				border-radius: 50%;
			}

			&__number {
				height: 70rpx;
				background-color: #f1f1f1;
				border-radius: 4rpx;

				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				padding: 0 49rpx;
			}
		}

		&__balance {
			text-align: center;
			font-size: 22rpx;
			color: #666666;

			image {
				width: 9rpx;
				height: 16rpx;
				margin-left: 3rpx;
				margin-top: -3rpx
			}
		}

		&__balance--bold {
			color: rgb(253, 121, 64);
		}

		&__button {
			margin-top: 23rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-image: linear-gradient(90deg, #fc9248 0%, #fe5833 100%);
			border-radius: 40rpx;

			font-size: 28rpx;
			color: #ffffff;
		}
	}


	.succeedPopup {
		background-color: #fda04d;
		width: 544rpx;
		border-radius: 30rpx;
		overflow: auto;

		&__hd_bg {
			width: 608rpx;
			position: absolute;

			top: -193rpx;
			left: -30rpx;
			z-index: -1;
		}

		&__close {
			width: 60rpx;
			height: 60rpx;

			position: absolute;
			top: 623rpx;
			left: 242rpx;
		}

		&__title {
			font-size: 40rpx;
			letter-spacing: 2rpx;
			color: #ffffff;
			text-align: center;
			margin-top: 41rpx;
		}

		&__logo {
			margin-top: 38rpx;
			text-align: center;

			&__img {
				width: 455rpx;
				height: 254rpx;
				background-color: #ffffff;
			}
		}

		&__bg {
			width: 544rpx;
			height: 256rpx;
			background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/duobao/duobao/succeedPopup_bg.png);
			background-size: 100%;
			margin-top: -60rpx;
			position: relative;
			overflow: auto;
		}


		&__text {
			font-size: 28rpx;
			line-height: 30rpx;
			color: #333333;
			text-align: center;
			margin-top: 60rpx;
		}

		&__button {
			width: 447rpx;
			height: 73rpx;
			line-height: 73rpx;
			text-align: center;

			margin: 25rpx auto 0;

			background-image: linear-gradient(0deg, #febfa8 0%, #ffffff 100%);

			border-radius: 36rpx;

			font-size: 28rpx;
			color: #ff3d00;
		}

		&__ft {
			margin-top: 20rpx;
			text-align: center;

			font-size: 22rpx;
			line-height: 30rpx;
			color: #fefefe;
		}
	}

	.duobao_ad {
		margin-bottom: 9rpx;

		image {
			width: 100%;
		}
	}
</style>
