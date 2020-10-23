<template>
	<view class="tbody">
		<view class="freedraw-content">
			<view class="top-bk-img">
				<image class="top_backimg" src="../../static/freedraw/index/bg.png" mode="aspectFill"></image>
			</view>
			<view class="top-bk-img-scroll" :style="{height: allHeight}">
				<view class="page_title_box">
					<text class="pages_title">0元抽奖</text>
					<text class="top_bk_text">千万大奖等你来</text>
				</view>
			</view>
			<view class="content_box">
				<view class="top_tishi_box">
					<view class="box_top">
						<view class="left_redbao" @click="adClick(index_ads.item)">
							<image class="redbao" :src="index_ads.image" mode="aspectFill"></image>
							<text class="text">{{index_ads.title}}</text>
							<!-- <image class="toleft" src="../../static/freedraw/index/toleft.png" mode="aspectFill"></image> -->
						</view>
						<view class="right_draw" @click="toshare()">
							<text class="text">
								抽奖机会
							</text>
							<image class="jin_dou" src="../../static/freedraw/index/luck_dpu.png" mode="aspectFill"></image>
							<view class="dou_num_box">
								<text class="ride">
									×
								</text>
								<text class="num">
									{{user.lucky_bean}}
								</text>
							</view>
							<image class="toleft" src="../../static/freedraw/index/toleft.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="box_bottom">
						<!-- <image class="bot_img" src="../../static/freedraw/index/taotiao_text.png" mode=""></image> -->
						<view class="bot_img_box">
							
						</view>
						<view class="page-section-spacing">
							<swiper class="swiper" 
								:indicator-dots="false" 
								:autoplay="true" 
								:interval="1500" 
								:duration="200"
								:vertical="true"
								:circular='true'>
								<swiper-item v-for="(item , index) in luck_persons" :key="index">
									<view class="text_icon_box">
										<text>恭喜</text><image class="headimg" :src="item.headimg" mode="aspectFit"></image><text>{{item.text}}</text>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
				</view>
				<view class="read_person" style="display: none;">
					<text class="read_per_msg">点击查看中奖打卡记录/我的钱包</text>
					<view class="attention">
						关注公众号
					</view>
				</view>
				<view class="good_list">
					<view v-for="(item,index) in goods" :key="index" class="good_box" @click="toDetail(item.id)">
					 	<view class="left_good_img">
							<text class="prix" v-if="item.issale != ''">
								{{item.issale}}
							</text>
					 		<image class="good_img" :src="item.good_img" mode="aspectFit"></image>
					 	</view>
						<view class="right_good_info">
							<view class="good_name">
								{{item.good_name}}
							</view>
							<view class="price">
								市场价 <text class="pri_num">￥{{item.price}}</text>
							</view>
							<view class="per_num">
								{{item.person_num}}<text class="per_text">人参与</text>
							</view>
							<view class="botbox">
								<!-- //已开始 -->
								<view class="abort" v-if="item.isstart == true && item.isjoin ==false">
									<text class="time hour">
										{{item.hour}}
									</text>
									<text class="colon">:</text>
									<text class="time min">
										{{item.min}}
									</text>
									<text class="colon">:</text>
									<text class="time second">
										{{item.second}}
									</text>
									<text class="abort_text">截止</text>
								</view>
								<!-- //未开始 -->
								<view class="notStart" v-else-if="item.isstart == true && item.isend == false && item.isjoin ==true" >
									<text class="notstart_time">{{item.notstart_time}}</text><text>点自动抽奖</text>
								</view>
								<!-- //已结束 -->
								<view class="endDate" v-if="item.isend == true">
									<text class="endDate_text">此商品的抽奖已经结束</text>
								</view>
								<view class="draw_btn" v-if="item.isjoin == false">
									<!-- <text class="btn_text">0元抽奖</text> -->
									0元抽奖
								</view>
								<!-- <view class="draw_btn_isjoin" @click="toDetail(item.id)"  v-else> -->
								<view class="draw_btn_isjoin" v-else>
									<text class="btn_text">已参与</text>
								</view>
							</view>	
						</view>
					 </view>
				</view>
				<loading v-if='!noData' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
			</view>
		</view>
	</view>
</template>
<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import adSwiper from '../../components/adSwiper/adSwiper.vue'
	import load from '../../components/load/load.vue'
	import taskList from '@/components/task-list/task-list.vue'
	
	let app = getApp()
	
	export default {
		components: {
			adSwiper,
			load,
			taskList
		},
		computed:{
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: '',
					lucky_bean:'0',
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			allHeight(){
				return this.STATUS_HEIGHT + this.NAV_HEIGHT + "px";
			},
			
		},
		
		mounted() {
			uni.$on('redGetBase', (res) => {
				this.goods.forEach((ele,index)=>{
					if(ele.id == res){
						ele.isjoin = true;
						let num = ele.person_num;
						num = Number(num) + 1;
						ele.person_num = num;
					}
				})
			})
		},
		data() {
			return {
				NAV_HEIGHT:'48px',//标题栏高度
				STATUS_HEIGHT:'24px',//状态栏高度
				loading:true,//页面加载
				loadingMore: true,//正在加载
				noMoreData: false,//没有更多数据
				noData: false,//没有数据
				goods:[],
				index:0,
				top:0,
				topText:'top:-0rpx',
				page:1,
				lastPage:0,
				douNum:'',
				luck_persons:[],//头条数据
			
				background: ['blue', 'red', 'yellow'],
				indicatorDots: true,
				autoplay: false,
				vertical: false,
				interval: 1000,
				circular: false,
				
				index_ads:{
					image:'../../static/freedraw/index/redbao3x.png',
					title:'100元',
					item:'',
				},//首页广告
			}
		},
		created() {
			// console.log(this.$store.state.user);
			if (this.isLogin) {
				this.init();
			} else {
				uni.$on('login', (res) => {
					this.init()
				})
			}
		},
		onLoad(option) {
			// 保存邀请人ID
			if (typeof(option.invite_id) == "string") {
				uni.setStorage({
					key: 'invite_id',
					data: option.invite_id
				})
				
				app.globalData.invite_id = option.invite_id
			}
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.NAV_HEIGHT =  res.titleBarHeight;
					this.STATUS_HEIGHT = res.statusBarHeight;
				}
			})
		},
		
		//触底
		onReachBottom(e){
			if(this.page>=this.lastPage){
				this.noMoreData = true;
				this.loadingMore = false;
			}else{
				this.page += 1;
				this.getgoodlist();
			}
		},
		methods: {
			//抽奖机会跳转
			toshare(){
				uni.navigateTo({
					url:"../exchange/exchange",
				})
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
			
			//获取
			
			//初始获取数据
			init(){
				// ajax.login2();
				this.gettoutiao();
				this.getgoodlist();
				ajax.get({
					url:'UserLuckyDraw/getDayLuckDraw',
					data:{
						
					}
				}).then(res =>{
					if(res.data.code == 200){
						
						ajax.login2();
					}
				}).catch(err =>{
					
				})
			},
			
			//头条滚动
			luckPerson(){
				this.index = 0;
				let timer = setInterval(()=>{
					if(this.luck_persons.length-1 > this.index){
						this.index +=1;
						this.topText = `top:-${this.index*40}rpx`;
					}else{
						this.topText = `top:-${(this.index+1)*40}rpx;visibility: hidden;`;
						
						setTimeout(()=>{
							let index = 1;
							this.topText = `top:${(index)*40}rpx;visibility: hidden;`;
							setTimeout(()=>{
								this.topText = `top:${40}rpx;`;
								// this.index = 0;
								// setTimeout(()=>{
								// 	this.topText = `top:${40}rpx;`;
								// 	this.index = 0;
								// },1000)
							},100)
						},500)
						this.index = 0;
					}
				},1000);
			},
			
			//时间跳动
			timer(){
				let timer = setInterval(()=>{
					this.goods.forEach((ele,index)=>{
						this.countTime(ele,index);
					})
				},1000)
			},
			
			//获取商品列表数据
			getgoodlist(){
				this.loadingMore = true;
				ajax.get({
					url:'UserLuckyDraw/getList',
					data:{
						page:this.page,
						size:'8',
						status:'0'
					}
				}).then(res =>{
					if(res.statusCode == 200){
						if(res.data.code == 200){
							this.lastPage = res.data.data.last_page;
							this.goodsdeal(res.data.data.data);
						}
					}
				}).catch(err =>{
					
				})
			},
			
			//获取头条数据
			gettoutiao(){
				ajax.get({
					url:'UserLuckyDraw/getLuckyUser',
					data:{
						
					}
				}).then(res =>{
					if(res.statusCode == 200){
						if(res.data.code == 200){
							if(res.data.data.length != 0){
								this.luck_persons = res.data.data;
								this.luckPerson()
							}
						}
					}
				}).catch(err =>{
					
				})
			},
			
			//商品数据处理
			goodsdeal(goodarr){
				if(this.page>this.lastPage){
					this.noMoreData = true;
					this.loadingMore = false;
				}else{
					goodarr.forEach((ele,index)=>{
						let item = {
							good_img:ele.goods_pic,
							good_name:ele.goods_title,
							price:ele.goods_price,
							person_num:ele.participant_count,
							issale:ele.subscript,
							start_time:ele.create_time*1000,
							abort_time:ele.lottery_time*1000,
							isstart:false,
							isend:false,
							hour:'',
							min:'',
							second:'',
							notstart_time:'',
							id:ele.id,
							isjoin:(ele.c == 1 ? true : false),
						}
						this.countTime(item,index);
						this.goods.push(item);
					})
					this.index_ads={
						image:this.$store.state.adList.indexTop[0].image,
						title:this.$store.state.adList.indexTop[0].title,
						item:this.$store.state.adList.indexTop[0],
					}
					
					this.timer();
					this.loadingMore = false;
				}
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
			//时间跳动执行函数
			countTime(goods_msg,index) {
				 //获取当前时间  
				 let date = new Date();  
				 let now = date.getTime();  
				 
				 //设置截止时间  
				 let str = goods_msg.abort_time;
				 let endDate = new Date(str); 
				 let end = endDate.getTime();  
				 
				//设置开始时间
				let starDate = new Date(goods_msg.start_time);
				let star = starDate.getTime();
				 //时间差  
				 let leftTime = star-now; 
				 
				 let rightTime = end-now;
				 
				 //定义变量 d,h,m,s保存倒计时的时间  
				 let d,h,m,s;  
				 
				 //抽奖状态判断
				 if(leftTime>0){
					goods_msg.isstart = false;
					goods_msg.notstart_time = this.dateFormat("mm-dd HH",new Date(goods_msg.start_time));
				 }else if(leftTime <= 0 && rightTime > 0){
					let totalSeconds = parseInt(rightTime / 1000);
					//天数
					 let days = Math.floor(totalSeconds / (60 * 60 * 24));
					 //取模（余数）
					 // let modulo = totalSeconds % (60 * 60 * 24);
					 let modulo = totalSeconds;
					 //小时数
					 let hours = Math.floor(modulo / (60 * 60));
					 modulo = modulo % (60 * 60);
					 //分钟
					 let minutes = Math.floor(modulo / 60);
					 //秒
					 let seconds = modulo % 60;
					 // goods_msg.hour = hours;
					 goods_msg.hour = this.timeDeal(hours);
					 // goods_msg.min = minutes;
					 goods_msg.min = this.timeDeal(minutes);
					 // goods_msg.second = seconds;
					 goods_msg.second = this.timeDeal(seconds);
					 goods_msg.isstart = true;
					 goods_msg.notstart_time = this.dateFormat("mm-dd HH",new Date(goods_msg.abort_time));
				 }else if(leftTime <= 0 && rightTime <= 0){
					 // goods_msg.isend = true;
					 // goods_msg.isstart = false;
					 // this.goods = [];
					 // this.loadingMore = true;
					 // this.getgoodlist();
					 this.goods.splice(index,1);
				 }
			},
			timeDeal(timstr){
				return (timstr > 9 ? timstr : '0'+timstr);
			},
			toDetail(id){
				uni.navigateTo({
					url:`/pages/apply/apply?good_id=${id}`,
				})
			},
		},
	}
</script>
<style lang="less">
	.swiper{
		height: 45rpx;
		top: 5rpx;
	}
	// swiper-item 里面的图片高度
	swiper-item{
		padding:2rpx 0 0 0;
	}
	swiper-item image{
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		.text_icon_box{
			// .headimg{
			// 	width: 32rpx;
			// 	height: 32rpx;
			// 	border-radius: 50%;
			// }
		}
	}
	
	.top-bk-img-scroll{
		background: url(../../static/freedraw/bg.png) no-repeat;
		width: 100%;
		height: 150rpx;
		background-size: 100%;
		position: fixed;
		top: 0;
		padding: 80rpx 0 0 20rpx;
		box-sizing: border-box;
		z-index: 30;
		.page_title_box{
			position: absolute;
			bottom: 15%;
			left: 36rpx;
			.pages_title{
				font-size: 34rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 14px;
				white-space: 2rpx;
				margin-right: 10rpx;
			}
			.top_bk_text{
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
	}
	
	.top-bk-img{
		// position: relative;
		// z-index: 15;
		.top_bk_text{
			position:fixed;
			z-index: 30;
			top: 94rpx;
			left: 22%;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
		}
		.top_backimg{
			width: 100%;
			height: 350rpx;
		}
		.pages_title{
			position:fixed;
			z-index: 30;
			top: 94rpx;
			left: 5%;
			font-size: 34rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			line-height: 14px;
			white-space: 2rpx;
		}
	}
	
	.content_box{
		position: relative;
		padding: 40rpx 20rpx;
		// top: -90px;
		margin-top: -200rpx;
		// z-index: 18;
	}
	.top_tishi_box{
		border-radius: 16rpx;
		background-color: #FFFFFF;
		padding: 40rpx 20rpx 30rpx 20rpx;
		.box_top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
		}
		.box_top::after{
			display: block;
			content: '';
			position: absolute;
			width: 100%;
			height: 2rpx;
			background: #F5F5F5;
			left: 0;
			bottom: -22rpx;
		}
		.left_redbao{
			display: flex;
			align-items: center;
			.redbao{
				width: 30rpx;
				height: 37rpx;
				margin-right: 9rpx;
			}
			.toleft{
				width: 10rpx;
				height: 16rpx;
				margin-left: 9rpx;
			}
			.text{
				position: relative;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FF3236;
				font-size: 28rpx;
				top: 4rpx;
			}
		}	
		.right_draw{
			display: flex;
			align-items: center;
			.jin_dou{
				width: 32rpx;
				height: 34rpx;
				margin-right: 9rpx;
			}
			.toleft{
				width: 10rpx;
				height: 16rpx;
				margin-left: 9rpx;
			}
			.text{
				font-size: 14px;
				font-family: PingFang SC;
				font-weight: 600;
				color: #FF3236;
				
				margin-right: 9rpx;
			}
			.dou_num_box{
				display: flex;
				align-items: center;
				.ride{
					font-size: 18px;
					font-family: PingFang SC;
					font-weight: 600;
					color: #FF3236;
				}
				.num{
					font-size: 18px;
					font-family: PingFang SC;
					font-weight: 600;
					color: #FF3236;
				}
			}
		}
		.box_bottom{
			display: flex;
			align-items: center;
			margin-top: 40rpx;
			.page-section-spacing{
				width: 362rpx;
				height: auto;
				.text_icon_box{
					height: 32rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #111111;
					display: flex;
					align-items: center;
				}
			}
			.bot_img{
				width: 120rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
			.bot_img_box{
				position: relative;
				width: 115rpx;
				height: 29rpx;
				margin-right: 10rpx;
				background: url(../../static/freedraw/index/taotiao_text.png) no-repeat;
				background-size: 100%;
			}
			.bot_text{
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #121212;
				width: 400rpx;
				height: 40rpx;
				overflow: hidden;
				position: relative;
				.msg_list{
					position: absolute;
					left: 0;
					transition: all .3s;
				}
				.msg_box{
					height: 40rpx;
					// padding: 4rpx 0 4rpx 0;
					.text_icon_box{
						display: flex;
						align-items: center;
						height: 32rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #111111;
					}
				}
				.headimg{
					width: 32rpx;
					height: 32rpx;
					border-radius: 50%;
				}
			}
		}
	}
	.read_person{
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		border-radius: 5px;
		padding: 20rpx 20rpx;
		margin-top: 20rpx;
		.read_per_msg{
			font-size: 12px;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FF3236;
			
		}
		.attention{
			background: #FF3236;
			border-radius: 23px;
			font-size: 12px;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			
			padding: 10rpx 20rpx;
			cursor: pointer;
		}
	}
	.good_list{
		.good_box{
			display: flex;
			align-items: center;
			background-color: #FFFFFF;
			margin-top: 20rpx;
			border-radius: 12rpx;
			padding: 20rpx;
			.left_good_img{
				width: 200rpx;
				height: 200rpx;
				margin-right: 20rpx;
				border-radius: 12rpx;
				overflow: hidden;
				position: relative;
				.prix{
					position: absolute;
					top: 0rpx;
					display: block;
					background: url(../../static/freedraw/index/specail_goods.png) no-repeat;
					width: 100rpx;
					height:30rpx;
					background-size: 100%;
					font-size: 10px;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					text-align: center;
					padding: 5rpx 0 0 0;
					box-sizing: border-box;
				}
				.good_img{
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.right_good_info{
				flex: 1;
				.good_name{
					// height: 32rpx;
					
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					line-height: 34rpx;
					color: #000000;
					
					margin-bottom: 15rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.price{
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #888888;
					
					margin-bottom: 15rpx;
					.pri_num{
						position: relative;
						margin-left: 5rpx;
					}
					.pri_num:after{
						content: "";
						display: block;
						position: absolute;
						height: 2rpx;
						width: 100%;
						background-color: #888888;
						top: 50%;
						left: 2rpx;
						z-index: 10;
					}
				}
				.per_num{
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FF3236;
					
					margin-bottom: 20rpx;
					.per_text{
						color: #888888;
					}
				}
				.botbox{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.abort{
						.colon{
							color: #FF511B;
							margin: 0 6rpx;
						}
						.time{
							display: inline-block;
							background: #FEF3F3;
							border: 1px solid #FF4238;
							border-radius: 8rpx;
							font-size: 12px;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FF4238;
							
							padding: 4rpx 0rpx;
							width: 44rpx;
							text-align: center;
						}
						.abort_text{
							font-size: 12px;
							font-family: PingFang SC;
							font-weight: 500;
							color: #565656;
							
							margin-left: 8rpx;
						}
					}
					.notStart{
						font-size: 12px;
						font-family: PingFang SC;
						font-weight: 500;
						color: #555555;
						display: flex;
						align-items: center;
						.notstart_time{
							margin-right: 5rpx;
						}
					}
					.endDate{
						.endDate_text{
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #555555;
						}
					}
					.draw_btn{
						background: url(../../static/freedraw/index/btn.png) no-repeat;
						width: 174rpx;
						height: 58rpx;
						background-size: 100%;
						// padding-top: 10rpx;
						box-sizing: border-box;
						position: relative;
						text-align: center;
						// .btn_text{
						// 	// font-size: 32rpx;
						// 	font-family: PingFang SC;
						// 	font-weight: 500;
						// 	color: #FFFFFF;
						// 	line-height: 14px;
						// 	white-space: 2rpx;
							
						// 	font-size: 28rpx;
						// }
						font-family: PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 58rpx;
						white-space: 2rpx;
						
						font-size: 28rpx;
					}
					.draw_btn_isjoin{
						background: rgba(153, 153, 153, 0);
						border: 2rpx solid #FF402B;
						border-radius: 29rpx;
						line-height: 58rpx;
						
						width: 174rpx;
						height: 58rpx;
						text-align: center;
						.btn_text{
							font-size: 28rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #FF402B;
						}
					}
				}
			}
		}	
	}
</style>
