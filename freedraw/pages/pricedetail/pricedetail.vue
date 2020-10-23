<template>
	<view class="detail_content">
		<view class="top_img" :style="{height: allHeight}">
			
		</view>
		<view class="content_box">
			<view class="top_good_img">
				<image class="good_img" :src="msg.img" mode="aspectFit"></image>
			</view>
			<view class="good_text">
				<view class="good_name">
					{{msg.good_name}}
				</view>
				<view class="good_info">
					<view class="goof_time">
						{{msg.timeStr}}点自动开奖
					</view>
					<view class="join_num">
						<image class="hot_good" src="../../static/freedraw/pricedetail/fire2x.png" mode="aspectFit"></image>
						<text class="join_num_text">{{msg.participant_count}}人已参与</text>
					</view>
					<image class="participate" src="../../static/freedraw/pricedetail/yinzhang2x.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="other_classes_box">
				<view :class="'fir_box ' + (index == 0 ? '' : 'sec')" v-for="(item,index) in classes" :key="index" v-if="item.name != ''">
					<view class="class_box">
						<view class="left">
							<view class="class_img">
								<image class="img" :src="item.img" mode="aspectFit"></image>
							</view>
							<view class="class_info">
								<view class="class_name">
									{{item.name}}
								</view>
								<view class="class_text">
									{{item.text}}
								</view>
							</view>
						</view>
						<view class="rig_btn" v-if="index == 0"  @click="jump(item.url)">
							去逛逛
						</view>
						<view class="rig_btn sec_btn" v-else @click="adClick(item.item)">
							马上抢
						</view>
					</view>
				</view>
			</view>
			<view class="good_ads_text">
				<text class="ads_text">{{msg.ads_text1}}</text><br>
				<text class="ads_text">{{msg.ads_text2}}</text><br>
				<text class="ads_text">{{msg.ads_text3}}</text><br>
			</view>
			<view class="see_draw_status" @click="seeDrawStatus()">
				查看我的中奖状态
			</view>
		</view>
		<view class="bto_nav">
			<view class="func_btn" @click="toIndex()">
				<image class="func_icon" src="../../static/freedraw/draw_detail/draw.png" mode="aspectFit"></image>
				<view class="func_text">
					0元抽奖
				</view>
			</view>
			<view class="func_btn">
				
			</view>
			<view class="func_btn" @click="toshare()">
				<image class="func_icon" src="../../static/freedraw/draw_detail/share.png" mode="aspectFit"></image>
				<view class="func_text">
					分享好友
				</view>
			</view> 
		</view>
		<view class="not_win_price" v-if="showIsWin == true && isWin == false">
			<view class="not_win_content">
				<view class="top_title_close">
					<text class="titie">{{msg.notWinText}}</text>
					<image @click="closeIsWin()" class="close" src="../../static/freedraw/pricedetail/close2x.png" mode="aspectFit"></image>
				</view>
				<view class="give_welfare">
					<view class="welfare_text">
						为你准备了如下福利：
					</view>
					<!-- <image class="ads_img" :src="nowinads.img" mode="aspectFit" @click="adClick(nowinads.item)"></image> -->
					<view class="nowin_ads">
						<view class="ads_item" v-for="(item,index) in nowinads" :key="index">
							<view class="title">
								{{item.title}}
							</view>
							<view class="info">
								{{item.info}}
							</view>
							<view class="click_ads_btn" @click="adClick(item.item)">
								试试手气
							</view>
						</view>
					</view>
				</view>
				<view class="lucky_person">
					<view class="luck_text">
						幸运名单
					</view>
					<view class="good_name">
						<view class="text">
							{{msg.good_name}}
						</view> 
					</view>
					<view class="win_person">
						<image class="user_icon" :src="msg.usericon" mode="aspectFit"></image>
						<view class="user_name">
							{{msg.username}}
						</view>
						<view class="win_text">
							中奖用户
						</view>
					</view>
				</view>
				<view class="continue_draw" @click="continueDraw()">
					继续抽奖
				</view>
			</view>
		</view>
		<view class="is_win_price" v-else-if="isWin == true && showIsWin == true">
			<view class="is_win_price_content">
				<view class="top_title_close">
					<text class="titie">恭喜您，中奖啦！</text>
					<image @click="closeIsWin()" class="close" src="../../static/freedraw/pricedetail/close2x.png" mode="aspectFit"></image>
				</view>
				<view class="show_win_price">
					<view class="text">
						恭喜获得以下奖品：
					</view>
					<view class="price_box">
						<image class="price_img" src="../../static/freedraw/pricedetail/jifenbao2x.png" mode="aspectFit"></image>
						<view class="price_text">
							集分宝 ×1
						</view>
					</view>
				</view>
				<view class="continue_draw" @click="continueDraw()" v-if="msg.isreceive == true">
					奖励已领取，继续抽奖
				</view>
				<view class="continue_draw" @click="reciveprice(msg.goods_id)" v-else>
					立即领取
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				msg:{
					img:'',
					good_name:'',
					username:'',
					usericon:'',
					isreceive:false,
					notWinText:'',
					goods_id:'',
					timeStr:'',
					participant_count:'',
					ads_text1:'免费抽取苹果笔记本电脑',
					ads_text2:'邀请三位好友助力',
					ads_text3:'赢取高额现金红包，快来参与吧！', 
				},
				showIsWin:false,//中奖弹窗显示
				isWin:'',//是否中奖
				classes:[],
				nowinads:[],//没中奖的广告
				STATUS_HEIGHT:'',
				NAV_HEIGHT:'',
				share_img:'',//分享圖片
				good_id:'',//请求分享图片的商品id
			};
		},
		onLoad(option) {
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.NAV_HEIGHT =  res.titleBarHeight;
					this.STATUS_HEIGHT = res.statusBarHeight;
				}
			})
			this.good_id = option.goodsId;
			this.getpriceMsg(option.goodsId);
			this.showIsWin = true;
			this.getshareimg();
		},
		computed:{
			allHeight(){
				return this.STATUS_HEIGHT + this.NAV_HEIGHT + 20 + "px";
			},
		},
		methods:{
			//获取分享图片
			getshareimg(){
				ajax.get({
					url:'UserLuckyDraw/getInfoId',
					data:{
						id:this.good_id,
					}
				}).then(res =>{
					// console.log('分享图',res);
					if(res.statusCode == 200){
						if(res.data.code == 200){
							this.share_img = res.data.data;
						}
					}
				}).catch(err =>{
					
				})
			},
			//没中奖广告
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
			
			toshare(){
				// my.showSharePanel();
				if(this.share_img != ''){
					my.showSharePanel();
				}
			},
			closeIsWin(){
				this.showIsWin == true ? this.showIsWin = false : '';
			},
			seeDrawStatus(){
				this.showIsWin == false ? this.showIsWin = true : '';
			},
			continueDraw(){
				uni.reLaunch({
					url:"../index/index",
				})
			},
			
			//立即领取
			reciveprice(id){
				ajax.post({
					url: 'UserLuckyDraw/setSendJfb',
					data:{
						id:id,
					}
				}).then(res => {
					if(res.statusCode == 200){
						if(res.data.code == 200){
							my.showToast({
								content:res.data.msg,
								duration:1000,
							})
							// uni.reLaunch({
							// 	url:'../index/index',
							// })
							this.msg.isreceive = true;
						}else{
							my.showToast({
								content:res.data.msg,
								duration:1000,
							})
						}
					}
				}).catch(err => {})
			},
			//获取奖品详情
			getpriceMsg(id){
				ajax.get({
					url: 'UserLuckyDraw/getStatusUser',
					data:{
						id:id,
					}
				}).then(res => {
					if(res.statusCode == 200){
						if(res.data.code == 200){
							this.dataDeal(res.data.data);
						}
					}
				}).catch(err => {})
			},
			
			toIndex(){
				uni.reLaunch({
					url:'../index/index'
				})
			},
			
			//数据处理
			dataDeal(data){
				this.isWin = (data.status == 0 ? true : false);
				let msg = {
					img:data.goods_pic,
					good_name:data.goods_title,
					username:data.nickname,
					usericon:data.avatar,
					isreceive:(data.is_exchange == 0 ? false : true),
					notWinText:data.title,
					goods_id:data.id,
					timeStr:this.dateFormat('mm-dd HH',new Date(data.lottery_time*1000)),
					participant_count:data.participant_count,
					ads_text1:'免费抽取苹果笔记本电脑',
					ads_text2:'邀请三位好友助力',
					ads_text3:'赢取高额现金红包，快来参与吧！',                        
				};
				this.msg = msg;
				
				let ads = {
					name:data.goods_ad_title,
					text:data.goods_ad_description,
					img:data.goods_ad_pic,
					url:data.goods_ad_url,
				}
				let spcads = this.$store.state.adList;
				let secads = {
					name:spcads.goods_details[0].title,
					text:spcads.goods_details[0].description,
					img:spcads.goods_details[0].image,
					url:spcads.goods_details[0].url,
					item:spcads.goods_details[0],
				}
				this.classes[0] = ads;
				this.classes[1] = secads;
				
				console.log(this.$store.state);
				// let adsmsg = {
				// 	img:this.$store.state.adList.draw[0].image,
				// 	item:this.$store.state.adList.draw[0],
				// }
				// this.nowinads = adsmsg;
				
				this.$store.state.adList.draw.forEach((ele,index)=>{
					let adsmsg = {
						img:ele.image,
						item:ele,
						title:ele.title,
						info:(ele.subtitle == '' ? '测试广告副标题测试广告副标题测试广告副标题测试广告副标题测试广告副标题' : ele.subtitle),
					};
					this.nowinads.push(adsmsg);
				})
			},
			//时间处理important
			dateFormat(fmt, date) {
			  let ret;
			  const opt = {
				  "Y+": date.getFullYear().toString(),        // 年
				  "m+": (date.getMonth() + 1).toString(),     // 月
				  "d+": date.getDate().toString(),            // 日
				  "H+": date.getHours().toString(),           // 时
				  "M+": date.getMinutes().toString(),         // 分
				  "S+": date.getSeconds().toString()          // 秒
				  // 有其他格式化字符需求可以继续添加，必须转化成字符串
			  };
			  for (let k in opt) {
				  ret = new RegExp("(" + k + ")").exec(fmt);
				  if (ret) {
					  fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				  };
			  };
			  return fmt;
			},
			//粉红广告
			jump(e) {
				if(!e){
					return;
				}
			
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
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				utils.adJump(ad, this);
			},
		},
		
		//邀请链接
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '抽个奖',
					desc: '精选好物等你来抽,快和我一起来抽个奖',
					// bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/share_img2.png',
					bgImgUrl: this.share_img,
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '抽个奖',
					desc: '精选好物等你来抽,快和我一起来抽个奖',
					// bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/uniapp/share_img2.png',
					bgImgUrl: this.share_img,
					path: '/pages/index/index',
				};
			}
		},
	}
</script>
<style lang="less" scoped>
	.top_img{
		width: 100%;
		height: 200rpx;
		background-image: url(../../static/freedraw/my/bk_12.png);
		background-size: 100%;
	}
	
	.content_box{
		position: relative;
		background-color: #FFFFFF;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		margin-top: -40rpx;
		padding: 20rpx 20rpx 140rpx 20rpx ;
		box-sizing: border-box;
		.top_good_img{
			
			background: #F8F8F8;
			border-radius: 16rpx;
			text-align: center;
			padding: 46rpx 0;
			.good_img{
				display: inline-block;
				width: 275rpx;
				height: 175rpx;
			}
		}
		.good_text{
			padding: 0 0 0 14rpx;
			margin-top: 30rpx;
			position: relative;
			.good_name{
				width: 560rpx;
				margin: 0 0 30rpx 0;
				height: 68rpx;
				font-size: 30rpx;
				line-height: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #121212;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.good_info{
				display: flex;
				align-items: center;
				.goof_time{
					padding: 9rpx 21rpx;
					background: #F2F2F2;
					border-radius: 4rpx;
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #787878;
					margin-right: 48rpx;
				}
				.join_num{
					.hot_good{
						width: 21rpx;
						height: 23rpx;
						margin: 0 5rpx 0 0;
					}
					.join_num_text{
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #888888;
					}
				}
				.participate{
					position: absolute;
					right: 0;
					top: 5%;
					width: 106rpx;
					height: 106rpx;
				}
			}
		}
		.good_ads_text{
			margin: 35rpx 0 53rpx 0;
			
			.ads_text{
				display: inline-block;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #343434;
				margin-bottom: 15rpx;
			}
		}
		.see_draw_status{
			display: inline-block;
			background: rgba(255, 50, 54, 0);
			border: 2rpx solid #FF3236;
			border-radius: 35rpx;
			
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FF3236;
			
			padding: 20rpx 60rpx;
			
			position: relative;
			left: 50%;
			margin-left: -182rpx;
		}
	}
	
	.other_classes_box{
		margin: 40rpx 0 0 0;
		.fir_box{
			margin-bottom: 20rpx;
			.class_box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 20rpx;
				background-color: #FFEFF0;
				border-radius: 16rpx;
				.left{
					display: flex;
					// align-items: center;
					justify-content: space-between;
				}
				.class_img{
					// width: 100rpx;
					// height: 100rpx;
					margin-right: 20rpx;
					border-radius: 16rpx;
					overflow: hidden;
					.img{
						display: block;
						width: 100rpx;
						height: 100rpx;
						// object-fit: cover;
					}
				}
				.class_info{
					// flex: 1;
					width: 336rpx;
					display: flex;
					flex-flow: column;
					justify-content: space-between;
					padding: 10rpx 0;
					.class_name{
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #343434;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					.class_text{
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #666666;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
				}
				.rig_btn{
					width: 176rpx;
					height: 62rpx;
					
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
					line-height: 62rpx;
					
					background: linear-gradient(90deg, #FF5E62, #FF3236);
					border-radius: 40rpx;
					// padding: 12rpx 40rpx;
				}
				.sec_btn{
					width: 176rpx;
					height: 62rpx;
					background: linear-gradient(90deg, #5DA5FF, #0071FF);
				}
			}
		}
		.sec{
			.class_box{
				background: #DDECFF;
			}
		}
	}

	.bto_nav{
		position: fixed;
		z-index: 20;
		bottom: 0;
		width: 100%;
		padding: 20rpx 0 ;
		background-color: #FFFFFF;
		display: flex;
		text-align: center;
		.func_btn{
			flex: 1;
			.func_icon{
				width: 50rpx;
				height: 50rpx;
			}
			.func_text{
				font-size: 22rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #888888;
			}
		}
	}
	
	.is_win_price{
		position: fixed;
		width: 100%;
		height: 100vh;
		z-index: 30;
		bottom: 0;
		background-color: rgba(0,0,0,0.5);
		.is_win_price_content{
			height: 628rpx;
			width: 100%;
			position: absolute;
			bottom: 0;
			background-color: #FFFFFF;
			padding: 40rpx 31rpx 0 31rpx;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			box-sizing: border-box;
			.top_title_close{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 0 20rpx 0 ;
				border-bottom: 2rpx solid #F2F2F2;
				margin-bottom: 20rpx;
				.titie{
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #000000;
				}
				.close{
					width: 24rpx;
					height: 24rpx;
				}
			}
			.show_win_price{
				margin: 0 0 77rpx 0;
				.text{
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #343434;
					margin: 0 0 98rpx 0;
				}
				.price_box{
					text-align: center;
					.price_img{
						display: inline-block;
						width: 83rpx;
						height: 83rpx;
						margin: 0 0 24rpx 0;
					}
					.price_text{
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #000000;
					}
				}
			}
			.continue_draw{
				background: linear-gradient(90deg, #FF5E62, #FF3236);
				border-radius: 45rpx;
				
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				text-align: center;
				padding: 28rpx 0;
			}
		}
	}
	
	.not_win_price{
		position: fixed;
		width: 100%;
		height: 100vh;
		z-index: 30;
		top: 0;
		background-color: rgba(0,0,0,0.5);
		.not_win_content{
			height: 977rpx;
			width: 100%;
			position: absolute;
			bottom: 0;
			background-color: #FFFFFF;
			padding: 40rpx 31rpx 0 31rpx;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			box-sizing: border-box;
		}
		.top_title_close{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 0 20rpx 0 ;
			border-bottom: 2rpx solid #F2F2F2;
			margin-bottom: 20rpx;
			.titie{
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #000000;
			}
			.close{
				width: 24rpx;
				height: 24rpx;
			}
		}
		.give_welfare{
			.welfare_text{
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #343434;
				margin: 0 0 20rpx 0;
			}
			.ads_img{
				width: 100%;
				height: 160rpx;
			}
			.nowin_ads{
				display: flex;
				justify-content: space-between;
				.ads_item{
					width: 340rpx;
					height: 211rpx;
					background: rgba(109, 82, 216, 0);
					border: 2rpx solid #FFA3A5;
					border-radius: 10rpx;
					padding: 22rpx;
					box-sizing: border-box;
					.title{
						margin: 0 0 13rpx 0;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #FF3135;
					}
					.info{
						// height: 30rpx;
						font-size: 24rpx;
						line-height: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #777777;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						margin: 0 0 30rpx 0;
					}
					.click_ads_btn{
						width: 166rpx;
						// height: 50rpx;
						padding: 12rpx 0;
						margin: 0 auto;
						background: linear-gradient(90deg, #FF5E61, #FF3135);
						border-radius: 25rpx;
									
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						text-align: center;
					}
				}
			}
		}
		.lucky_person{
			margin: 20rpx 0 0 0;
			.luck_text{
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #343434;
				margin: 0 0 20rpx 0;
			}
			.good_name{
				padding: 22rpx 0;
				.text{
					text-align:center;
					margin: 0 auto;
					width: 600rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #343434;
				}
				background: #FFEFEF;
				border-radius: 9rpx;
				
				// height: 60rpx;
				
				// line-height: 30rpx;
			}
			.win_person{
				text-align: center;
				margin: 30rpx 0 0 0;
				.user_icon{
					display: inline-block;
					width: 120rpx;
					height: 120rpx;
					border-radius: 10rpx;
				}
				.user_name{
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #343434;
					margin:16rpx 0;
				}
				.win_text{
					display: inline-block;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					
					background: #FF3236;
					border-radius: 27rpx;
					
					padding: 14rpx 25rpx;
				}
			}
		}
		.continue_draw{
			margin: 45rpx 0 0 0;
			background: linear-gradient(90deg, #FF5E62, #FF3236);
			border-radius: 45rpx;
			
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
			padding: 27rpx 0;
		}
	}
	
</style>
