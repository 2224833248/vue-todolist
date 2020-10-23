<template>
	<view>
		<view class="isend" v-if="from != ''">
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
	export default {
		data() {
			return {
				endDraw:[],
				isnogoods:true,//没有数据
				loadingMore: true,//正在加载
				noMoreData: false,//没有更多数据
				noData: false,//没有数据(弃用)
				endPage:'1',
				waitPage:'1',
			};
		},
		onLoad() {
			this.getwinData();
		},
		//触底
		onReachBottom(e){
			let num = this.waitPage;
			num = Number(num) + 1;
			this.waitPage = num;
			this.getwinData();
		},
		methods:{
			//去往中奖记录
			toendDetail(id){
				uni.navigateTo({
					url:`../pricedetail/pricedetail?goodsId=${id}`,
				})
			},
			//获取中奖数据
			getwinData(){
				this.loadingMore = true;
				this.noMoreData = false;
				ajax.get({
					url: 'UserLuckyDraw/getLuckyLog',
					data:{
						status:1,
						page:this.waitPage,
						size:'7',
						type:1,
					}
				}).then(res => {
					if (res.data.code == 200) {
						console.log(res);
						if(res.data.data.endPage == true){
							if(res.data.data.data.length != 0){
								this.noMoreData = true;
								this.dataDeal2(res.data.data);
							}else{
								this.loadingMore = false;//正在加载
								this.noMoreData = true;//没有更多数据
								this.waitPage -= 1;
							}
						}else{
							this.dataDeal2(res.data.data);
						}
					}
				}).catch(err => {})
			},
			//数据处理
			dataDeal2(datarr){
				if(datarr.data.length == 0){
					this.isnogoods = true;
				}else{
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
		}
	}
</script>

<style lang="less">
.isend{
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
						width: 380rpx;
						height: 68rpx;
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
