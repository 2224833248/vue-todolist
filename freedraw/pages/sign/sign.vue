<template>
	<view class="content">
		<!-- <view class="to_bk_img" :style="{height: allHeight}">
			
		</view> -->
		<view class="tab_card">
			<view class="card_item" @click="chooseTab(0)" >
				<view :class="'card_text '+(tabselect == true ? 'selected' : '')">
					待开奖
				</view>
			</view>
			<view class="card_item" @click="chooseTab(1)">
				<view :class="'card_text '+(tabselect == false ? 'selected' : '')">
					已结束
				</view>
			</view>
		</view>
		<view class="waitDraw" v-if="tabselect == true && isnogoods == false">
			<view class="goods_item_box" v-for="(item,index) in waitingDraw" :key="index" @click="towaitDetail(item.good_id)">
				<view class="goods_item">
					<image class="good_img" :src="item.good_img" mode="aspectFit"></image>
					<view class="good_info">
						<view class="good_name">
							{{item.good_name}}
						</view>
						<view class="time_info">
							{{item.waitStart}}自动开奖
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="isend" v-else-if="tabselect == false && isnogoods == false">
			<view class="goods_item_box" v-for="(item,index) in endDraw" :key="index" @click="toendDetail(item.good_id)">
				<view class="goods_item">
					<image class="good_img" :src="item.good_img" mode="aspectFit"></image>
					<view class="good_info">
						<view class="good_name">
							{{item.good_name}}
						</view>
						<view class="time_info">
							{{item.waitStart}}自动开奖
						</view>
					</view>
				</view>
			</view>
		</view>
		<loading v-if='!isnogoods' :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='isnogoods'></loading>
		<view class="no_goods" v-if="isnogoods == true">
			<image class="no_goods_img" src="../../static/freedraw/my/nomsg.png" mode="aspectFill"></image>
			<view class="no_good_text">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '@/utils/ajax.js'
	import cache from '@/utils/cache.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import taskList from '@/components/task-list/task-list.vue'
	import redTab from '@/components/red-tab.vue'
	import utils from '@/utils/utils.js' 
	export default {
		components: {
			uniPopup,
			taskList,
			redTab
		},
		data() {
			return {
				waitPage:1,
				endPage:1,
				tabselect:true,
				isnogoods:false,
				waitingDraw:[],
				endDraw:[],
				NAV_HEIGHT:'',
				STATUS_HEIGHT:'',
				loadingMore: true,//正在加载
				noMoreData: false,//没有更多数据
				noData: false,//没有数据
			};
		},
		mounted() {},
		onLoad(option) {
			this.getdrawdata();
			let systemInfo = my.getSystemInfo({
				success: (res) => {
					this.NAV_HEIGHT =  res.titleBarHeight;
					this.STATUS_HEIGHT = res.statusBarHeight;
				}
			})
		},
		onShow() {},
		computed: {
			allHeight(){
				return this.STATUS_HEIGHT + this.NAV_HEIGHT + "px";
			},
		},
		//触底
		onReachBottom(e){
			if(this.tabselect == true){
				this.waitPage += 1;
				this.getdrawdata();
			}else{
				this.endPage += 1;
				this.getdrawdata2();
			}
		},
		methods: {
			chooseTab(index){
				if(index == 0){
					if(this.waitingDraw.length != 0){
						this.isnogoods == false ? '' : this.isnogoods = false;
					}else{
						this.getdrawdata()
						this.isnogoods == true ? '' : this.isnogoods = true;
					}
					this.tabselect == true ? '' : this.tabselect = true;
				}else{
					if(this.endDraw.length != 0){
						this.isnogoods == false ? '' : this.isnogoods = false;
					}else{
						this.getdrawdata2()
						this.isnogoods == true ? '' : this.isnogoods = true;
					}
					this.tabselect == true ? this.tabselect = false : '';
				}
			},
			//获取待开奖抽奖数据
			getdrawdata(){
				this.loadingMore = true;//正在加载
				this.noMoreData = false;
				ajax.get({
					url: 'UserLuckyDraw/getLuckyLog',
					data:{
						page:this.waitPage,
						size:'8',
					}
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.data.endPage == true){
							if(res.data.data.data.length != 0){
								this.noMoreData = true;
								this.dataDeal(res.data.data);
							}else{
								this.loadingMore = false;//正在加载
								this.noMoreData = true;//没有更多数据
								this.waitPage -= 1;
							}
						}else{
							this.dataDeal(res.data.data);
						}
					}
				}).catch(err => {})
			},
			//数据处理
			dataDeal(datarr){
				datarr.data.forEach((ele,index)=>{
					let item = {
						good_name:ele.luckDrawInfo.goods_title,
						good_id:ele.luckDrawInfo.id,
						good_img:ele.luckDrawInfo.goods_pic,
						waitStart:this.dateFormat("mm-dd HH:MM",new Date(ele.luckDrawInfo.lottery_time*1000)),
					};
					this.waitingDraw.push(item);
				})
				this.isnogoods = false;
				this.loadingMore = false;//正在加载
			},
			//数据处理
			dataDeal2(datarr){
				datarr.data.forEach((ele,index)=>{
					let item = {
						good_name:ele.luckDrawInfo.goods_title,
						good_id:ele.luckDrawInfo.id,
						good_img:ele.luckDrawInfo.goods_pic,
						waitStart:this.dateFormat("mm-dd HH:MM",new Date(ele.luckDrawInfo.lottery_time*1000)),
					};
					this.endDraw.push(item);
				})
				this.isnogoods = false;
				this.loadingMore = false;//正在加载
			},
			//获取已结束抽奖数据
			getdrawdata2(){
				this.loadingMore = true;//正在加载
				this.noMoreData = false;
				ajax.get({
					url: 'UserLuckyDraw/getLuckyLog',
					data:{
						status:1,
						page:this.endPage,
						size:'8',
					}
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.data.endPage == true){
							if(res.data.data.data.length != 0){
								this.noMoreData = true;
								this.dataDeal2(res.data.data);
							}else{
								this.loadingMore = false;//正在加载
								this.noMoreData = true;//没有更多数据
								this.endPage -= 1;
							}
						}else{
							this.dataDeal2(res.data.data);
						}
					}
				}).catch(err => {})
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
		
			towaitDetail(id){
				uni.navigateTo({
					url:`../apply/apply?good_id=${id}`,
				})
			},
			
			toendDetail(id){
				uni.navigateTo({
					url:`../pricedetail/pricedetail?goodsId=${id}`,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.to_bk_img{
		width: 100%;
		height: 220rpx;
		background: url(../../static/freedraw/my/bk_12.png) no-repeat;
		background-size: 100%;
	}
	.tab_card{
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		.card_item{
			flex: 1;
			text-align: center;
			.card_text{
				display: inline-block;
				padding: 28rpx 16rpx ;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #9195A5;
				box-sizing: border-box;
			}
			.selected{
				border-bottom: 4rpx solid #FD3133;
				color:#FD4D3B;
				box-sizing: border-box;
			}
		}
	}
	
	.waitDraw,.isend{
		padding: 25rpx;
		box-sizing: border-box;
		.goods_item_box{
			background: #FFFFFF;
			box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(24, 24, 24, 0.04);
			border-radius: 8rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			.goods_item{
				background: #F7F7F7;
				border-radius: 4rpx;
				display: flex;
				align-items: center;
				padding: 32rpx;
				.good_img{
					width:130rpx;
					height: 130rpx;
					margin-right: 28rpx;
					border-radius: 10rpx;
				}
				.good_info{
					.good_name{
						height: 68rpx;
						width: 380rpx;
						font-size: 30rpx;
						line-height: 36rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #000000;
						margin-bottom: 20rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					.time_info{
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #878D9D;
					}
				}
			}
		}
	}
	.isend{
		.goods_item_box{
			position: relative;
			.goods_item::after{
				position: absolute;
				display: block;
				content: '';
				background: url(../../static/freedraw/my/right2x.png) no-repeat;
				width: 19rpx;
				height: 34rpx;
				background-size: 100%;
				top: 50%;
				margin-top: -17rpx;
				right: 10%;
				margin-right: -9.5rpx;
			}
		}
	}
	
	.no_goods{
		width: 100%;
		text-align: center;
		padding: 173rpx 0 0 0;
		.no_goods_img{
			display: inline-block;
			width: 474rpx;
			height: 328rpx;
		}
		.no_good_text{
			text-align: center;
			font-size: 36rpx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #656565;
		}
	}
</style>
