<template>
	<view class="tbody"> 
		<view class="color_white">
			<view class="draw_rules" @click="torules()">
				<image class="rules_icon" src="../../static/freedraw/draw_detail/alern3x.png" mode="aspectFit"></image>
				<text class="rules_icon_text">
					规则
				</text>
			</view>
			<!-- <view class="top_good_box" :style="{height: allHeight}"> -->
			<view class="top_good_box" :style="{'padding-top': allHeight}">
				<image class="top_good_img" :src="detail_good.good_img" mode="aspectFit"></image>
			</view>
			<!-- 商品描述 -->
			<view class="good_info">
				<view class="good_name">
					{{detail_good.good_name}}
				</view>
				<view class="draw_personum">
					<view class="botbox">
						<!-- //已开始 -->
						<view class="abort" v-if="detail_good.isstart == true">
							<text class="time hour">
								{{detail_good.hour}}
							</text>
							<text class="colon">:</text>
							<text class="time min">
								{{detail_good.min}}
							</text>
							<text class="colon">:</text>
							<text class="time second">
								{{detail_good.second}}
							</text>
							<text class="abort_text">截止</text>
						</view>
						<!-- //未开始 -->
						<view class="notStart" v-else-if="detail_good.isstart == false && detail_good.isend == false">
							<text class="notstart_time">{{detail_good.notstart_time}}</text><text>点自动开奖</text>
						</view>
						<!-- //已结束 -->
						<view class="endDate" v-if="detail_good.isend == true">
							<text class="endDate_text">此商品的抽奖已经结束</text>
						</view>
					</view>
					<view class="per_num">
						{{detail_good.person_num}}<text class="per_text">人参与</text>
					</view>
				</view>
			</view>
			<!-- 去往更多分类 -->
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
			<!-- 奖品详情 -->
			<view class="title_box">
				奖品详情
			</view>
			<view class="good_detail">
				<image v-for="(item,index) in detail_good.good_detail" :key="index" style="width: 100%;" :src="item" mode="widthFix"></image>
			</view>
		</view>
		<!-- 推荐抽奖 -->
		<view :class="'more_draw '+(isclicked == true ? 'isclicked' : '')">
			<view class="title_box">
				推荐抽奖
			</view>
			<view class="good_list">
				<view v-for="(item,index) in goods" :key="index" class="good_box"  @click="toDetail(item.id)">
				 	<view class="left_good_img">
						<!-- <text class="prix">
							万元大奖
						</text> -->
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
							<view class="abort" v-if="item.isstart == true">
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
							<view class="notStart" v-else-if="item.isstart == false && item.isend == false && item.isjoin ==true">
								<text class="notstart_time">{{item.notstart_time}}</text><text>点开始抽奖</text>
							</view>
							<!-- //已结束 -->
							<view class="endDate" v-if="item.isend == true">
								<text class="endDate_text">此商品的抽奖已经结束</text>
							</view>
							<view class="draw_btn" v-if="item.isjoin == false">
								<text class="btn_text">0元抽奖</text>
							</view>
							<view class="draw_btn_isjoin" @click=""  v-else>
								<text class="btn_text">已参与</text>
							</view>
						</view>	
					</view>
				 </view>
			</view>
		</view>
		<!-- 底部导航 -->
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
			<view class="nav_draw_bk" @click="gotoDraw()" v-if="isclicked == false">
				<view class="nav_draw_btn">
					<view class="main_text">
						{{btn_text}}
					</view>
					<view class="info_text">
						消耗{{need_num}}颗心愿豆
					</view>
				</view>
			</view>
			<view class="nav_draw_bk_clicked" @click="jump(classes[0].url)" v-else>
				<view class="nav_draw_btn">
					<view class="main_text">
						去看看
					</view>
				</view>
				<view class="tishi_text" v-if="finishDraw_text != ''">
					<view class="text">
						{{finishDraw_text}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	import taskList from '@/components/task-list/task-list.vue'

	let app = getApp();
	
	let couldClick = false;
	export default {
		onLoad: function(option) {
			this.timer();
		},
		data() {
			return {
				detail_good:{
					good_img:'',
					good_name:'',
					good_detail:'',
					price:'',
					person_num:'',
					issale:true,
					start_time:'',
					abort_time:'',
					isstart:false,
					isend:false,
					hour:'',
					min:'',
					second:'',
					notstart_time:''
				},
				
				loadingMore: false,
				noMoreData: false,
				noData: false,
				
				need_num:'',
				btn_text:'',
				
				finishDraw_text:'立即抽奖',
				// canClick:true,
				
				good_id:'',
				
				classes:[],
				goods:[],
				isclicked:false,//是否已抽奖
				NAV_HEIGHT:'',
				STATUS_HEIGHT:'',
				
				share_img:'',
			};
		},
		onLoad(option) {
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.NAV_HEIGHT =  res.titleBarHeight;
					this.STATUS_HEIGHT = res.statusBarHeight;
				}
			})
			this.good_id = option.good_id
			// this.getDetail(option.good_id);
			// this.getgoodlist(option.good_id);
		},
		onShow() {
			this.getDetail(this.good_id);
			if(this.goods.length == 0){
				this.getgoodlist(this.good_id);
			}
			this.getshareimg();
		},
		methods: {
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
			torules(){
				uni.navigateTo({
					url:'../drawrule/drawrule',
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
			//去往抽奖详情
			toDetail(id){
				uni.redirectTo({
					url:`/pages/apply/apply?good_id=${id}`,
				})
			},
			//抽奖详情跳转首页
			toIndex(){
				uni.reLaunch({
					url:'../index/index'
				})
			},
			//时间跳动
			timer(){
				let timer = setInterval(()=>{
					this.getGoodList.forEach(ele=>{
						this.countTime(ele);
					})
				},1000)
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
			//时间跳动功能执行
			countTime(goods_msg) {
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
				 }else if(leftTime <= 0 && rightTime <= 0){
					 goods_msg.isend = true;
					 goods_msg.isstart = false;
				 }
			},
			timeDeal(timstr){
				return (timstr > 9 ? timstr : '0'+timstr);
			},
			//抽奖
			gotoDraw(){
				if(couldClick == false){
					couldClick = true;
					setTimeout(()=>{
						couldClick = false;
					},3000)
					ajax.post({
						url:'UserLuckyDraw/setLucky',
						data:{
							id:this.good_id,
							invite_id:app.globalData.invite_id,
						}
					}).then(res =>{
						if(res.statusCode == 200){
							if(res.data.code == 200){
								uni.$emit('redGetBase', this.good_id)
								this.isclicked = true;
								my.showToast({
									content:res.data.msg,
									duration:500,
								})
								let num = this.detail_good.person_num;
								num = Number(num) + 1;
								this.detail_good.person_num = num;
							}else{
								my.showToast({
									content:res.data.msg,
									duration:500,
								})
								uni.navigateTo({
									url:'../exchange/exchange',
								})
							}
						}
						ajax.login2();
					}).catch(err =>{
						
					})
				}else{
					my.showToast({
						content:'请耐心等待参与结果',
						duration:100,
					})
				}
				
			},
			
			toshare(){
				// uni.navigateTo({
				// 	url:'../exchange/exchange'
				// })
				if(this.share_img != ''){
					my.showSharePanel();
				}
			},
			//获取详情信息
			getDetail(id){
				ajax.get({
					url:'UserLuckyDraw/getInfo',
					data:{
						id:id,
					}
				}).then(res =>{
					if(res.statusCode == 200){
						if(res.data.code == 200){
							this.detailDeal(res.data.data);
						}
					}
				}).catch(err =>{
					
				})
			},
			//详情处理
			detailDeal(data){
				this.detail_good = {
					good_img:data.goods_pic,
					good_name:data.goods_title,
					good_detail:data.goods_description,
					price:data.goods_price,
					person_num:data.participant_count,
					issale:true,
					start_time:'2020-10-08 00:00:00',
					abort_time:data.lottery_time*1000,
					isstart:false,
					isend:false,
					hour:'',
					min:'',
					second:'',
					notstart_time:''
				}
				this.need_num = data.lucky_count;
				this.btn_text = (data.button_text == '' ? '立即抽奖' :  data.button_text);
				this.finishDraw_text = data.goods_ad_title;
				this.isclicked = (data.log_status == 1 ? true : false);
				
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
				this.timer2();
			},
			//详情时间处理
			timer2(){
				this.detail_good.notstart_time = this.dateFormat("mm-dd HH",new Date(this.detail_good.abort_time));
			},
			countTime(goods_msg) {
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
				 }else if(leftTime <= 0 && rightTime <= 0){
					 goods_msg.isend = true;
					 goods_msg.isstart = false;
				 }
			},
			//获取商品列表数据
			getgoodlist(id){
				ajax.get({
					url:'UserLuckyDraw/getList',
					data:{
						page:'1',
						size:'2',
						id:id,
						status:'0',
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
			//商品数据处理
			goodsdeal(goodarr){
				goodarr.forEach(ele=>{
					let item = {
						good_img:ele.goods_pic,
						good_name:ele.goods_title,
						price:ele.goods_price,
						person_num:ele.participant_count,
						issale:ele.subscript,
						start_time:new Date(ele.create_time*1000),
						abort_time:new Date(ele.lottery_time*1000),
						isstart:false,
						isend:false,
						hour:'',
						min:'',
						second:'',
						notstart_time:'',
						id:ele.id,
						isjoin:(ele.c == 1 ? true : false),
					}
					this.countTime(item);
					this.goods.push(item);
				})
				this.timer();
			},
			//列表时间处理
			timer(){
				let timer = setInterval(()=>{
					this.goods.forEach(ele=>{
						this.countTime(ele);
					})
				},1000)
			},
		},
		loadData() {
			
		},
		computed: {
			allHeight(){
				return this.STATUS_HEIGHT + this.NAV_HEIGHT + "px";
			},
			adList() {
				let tmp = this.$store.state.adList;
				if (!tmp) {
					tmp = [];
				}
				return tmp;
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

<style lang="less">
	.tbody{
		.color_white{
			background-color: #FFFFFF;
			padding: 0 20rpx 10rpx 20rpx;
			.draw_rules{
				position: absolute;
				display: flex;
				align-items: center;
				right: 0;
				top: 12%;
				background: #000000;
				opacity: 0.4;
				border-radius: 22rpx 0rpx 0rpx 22rpx;
				padding: 9rpx 21rpx;
				.rules_icon{
					width: 26rpx;
					height: 26rpx;
					margin-right: 3rpx;
				}
				.rules_icon_text{
					font-size: 22rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
		}
	}
	.top_good_box{
		// width: 100%;
		// height: 350rpx;
		// text-align: center;
		// padding-top: 200rpx;
		// position: relative;
		width: 100%;
		height: 100vw;
		overflow: hidden;
		.top_good_img{
			display: inline-block;
			width: 100%;
			height: 100vw;
		}
	}
	
	.good_info{
		padding: 0 20rpx;
		box-sizing: border-box;
		.good_name{
			// height: 34rpx;
			font-size: 30rpx;
			line-height: 34rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #000000;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
		.draw_personum{
			margin-top: 20rpx   ;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.notStart{
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #565656;
				line-height: 14rpx;
			}
			.per_num{
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FF3236;
				line-height: 14px;
				.per_text{
					color: #888888;
				}
			}
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
						height: 30rpx;
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
						height: 26rpx;
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
	
	.title_box{
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #343434;
		margin: 0 auto;
		margin-bottom: 20rpx;
		text-align: center;
		position: relative;
	}
	.title_box::after{
		display: block;
		position: absolute;
		content: '';
		width: 30rpx;
		height: 0;
		border-top: 2rpx solid #343434;
		top: 49%;
		right: 35%;
	}
	.title_box::before{
		display: block;
		position: absolute;
		content: '';
		width: 30rpx;
		height: 0;
		border-top: 2rpx solid #343434;
		top: 49%;
		left: 35%;
	}
	
	.more_draw{
		padding: 30rpx 20rpx 170rpx 20rpx;
		.title_box{
			margin-bottom: 30rpx;
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
						height: 32rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #000000;
						
						margin-bottom: 15rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
					.price{
						font-size: 12px;
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
							padding-top: 10rpx;
							box-sizing: border-box;
							position: relative;
							text-align: center;
							.btn_text{
								font-size: 32rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #FFFFFF;
								line-height: 14px;
								white-space: 2rpx;
								
							}
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
	}
	
	.isclicked{
		padding-bottom: 230rpx;
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
		.nav_draw_bk,.nav_draw_bk_clicked{
			position: absolute;
			vertical-align: middle;
			text-align: center;
			top: -70rpx;
			left: 50%;
			margin-left: -90rpx;
			width: 180rpx;
			height: 180rpx;
			background: rgba(255,193,166,0.3);
			border-radius: 50%;
			padding-top: 15rpx;
			box-sizing: border-box;
			.nav_draw_btn{
				display: inline-block;
				width: 150rpx;
				height: 150rpx;
				background: linear-gradient(135deg, #FF995F, #FF2A1E);
				border-radius: 50%;
				padding-top: 50rpx;
				box-sizing: border-box;
				.main_text{
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 800;
					color: #FDF9E5;
					text-shadow: 0px 0px 6px rgba(223, 29, 14, 0.2);
				}
				.info_text{
					font-size: 16rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FDF9E5;
					line-height: 13px;
				}
			}
		}
		.nav_draw_bk_clicked{
			background-color: transparent;
			.nav_draw_btn{
				padding-top: 55rpx;
			}
			.tishi_text{
				position: absolute;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FF4D2C;
				top: -70rpx;
				left: 50%;
				margin-left: -150rpx;
				width: 300rpx;
				height: 80rpx;
				padding: 20rpx 0 0 0;
				box-sizing: border-box;
				background: url(../../static/freedraw/draw_detail/descript_2x.png) no-repeat;
				background-size: 100%;
				.text{
					width: 100%;
					text-align: center;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					box-sizing: border-box;
					padding: 0 6rpx;
				}
			}
		}
	}
</style>
