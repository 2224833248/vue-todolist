<template>
	<view class="tbody">
		<view class="banner">
			<view class="titleList">
				<view class="titleItem">
					<view class="title">参赛次数</view>
					<view class="number">{{base.num}}</view>
				</view>
				<view class="titleItem">
					<view class="title">完成次数</view>
					<view class="number">{{base.success_num}}</view>
				</view>
				<view class="titleItem">
					<view class="title">达标率</view>
					<view class="number">{{base.ratio}}%</view>
				</view>
				<view class="titleItem">
					<view class="title">总金额(元)</view>
					<view class="number">{{base.income_money}}</view>
				</view>
			</view>
		</view>

		<view class="cont">
			<view class="cont-pating">
				<view class="dateTitle">
					<view class="date">报名日期</view>
					<view class="theyCount">{{type=='card'?'打卡时间':'步数'}}</view>
					<view class="bonus">奖金</view>
				</view>
				<view class="cont-pating-item" v-for="(item,index) in list">
					<view class="submit">
						<view class="date">{{item.addTime}}</view>
						<view class="submitText">
							<template v-if="type=='card'">
								{{item.cardTime}}
							</template>
							<template v-if="type=='motion'">
								{{item.punchcard_step}}/{{item.step}}
							</template>
						</view>
						<view class="price">
							<template v-if="item.status==1">
								<template v-if="item.income_money=='等待分钱'">
									{{item.income_money}}
								</template>
								<template v-else>
									{{item.income_money}}元
								</template>
							</template>
							<template v-else>
								--
							</template>
						</view>
					</view>
				</view>
				<loading v-if="!noData && isInit" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				<view class="nodata" v-if="shouHide">
					<image src="/static/icon/nodata.png" mode="widthFix"></image>
					<view class="text">暂无内容</view>
				</view>
			</view>

		</view>
		<load v-if="loading"></load>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import load from '../../components/load/load.vue'
	export default {
		onLoad(option) {
			this.type = option.type
			
		},
		data() {
			return {
				loadingMore: false,
				noMoreData: false,
				noData: false,
				isInit: false,
				page: 1,
				type: '',
				base: [],
				list: [],
				shouHide: false,
				loading: true,
				loadingNum:0
			};
		},
		onShow() {
			this.getList()
			this.getBase()
		},
		mounted() {
			setTimeout(() =>{
				this.loading = false
			},3000)
		},
		methods: {
			titleName(){
				if(this.type == 'card'){
					uni.setNavigationBarTitle({
						title: '早起打卡记录'
					})
				}else{
					uni.setNavigationBarTitle({
						title: '运动打卡记录'
					})
				}
				
			},
			getBase() {
				ajax.get({
					url: 'FunCard/getBase'
				}).then((res) => {
					if(this.type == 'card'){
						this.base = res.data.data.card;
					}else{
						this.base = res.data.data.motion;
					}
					this.titleName()
					this.loadingNum++
					
				})
			},
			getList() {
				ajax.get({
					url: 'FunCard/getList',
					data: {
						type: this.type,
						page: this.page
					}
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.list.forEach((item, index, array) => {
							this.list.push(item)
						})
						if (this.list.length == 0) {
							this.shouHide = true
						} else {
							this.shouHide = false
						}
						if (res.data.data.list.length > 0) {
							this.page++
						} else {
							if (this.page == 1 && res.data.data.list.length == 0) {
								this.noMoreData = true
								this.noData = true
							} else {
								this.noMoreData = true
							}
						}
					}
					this.loadingNum++
				})
			}
		},
		watch:{
			loadingNum(){
				if(this.loadingNum >= 2){
					this.loading = false
				}
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		height: 100vh;
	}

	.banner {
		width: 100%;
		height: 443rpx;
		box-sizing: border-box;
		padding-top: 170rpx;
		background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/banner/banner3.png)no-repeat;
		background-size: 100% 100%;

		.titleList {
			display: flex;
			justify-content: space-between;
			padding: 0 11rpx;
			margin: 0 auto;

			.titleItem {
				width: 180rpx;
				box-sizing: border-box;

				.title {
					font-size: 22rpx;
					color: #fff;
					text-align: center;
					border-right: 2rpx solid #DDDDDD;
				}

				.number {
					color: #fff;
					font-size: 36rpx;
					text-align: center;
					padding-top: 20rpx;
					font-weight: bold;
				}

				&:nth-last-child(1) .title {
					border-right: none;
				}
			}
		}
	}


	.cont {
		width: 690rpx;
		margin: -160rpx auto 0;
		border-radius: 24rpx;
		overflow: hidden;
		&-pating {
			background: #fff;
			padding: 40rpx 30rpx 0rpx 30rpx;

			.dateTitle {
				display: flex;
				justify-content: space-between;
				padding-bottom: 28rpx;

				.date,
				.theyCount,
				.bonus {
					font-size: 28rpx;
					color: #343434;
					font-weight: bold;
					width: 30%;
					text-align: center;
				}
				.date{
					text-align: left;
				}
				.bonus{
					text-align: right;
				}
			}

			&-item {
				// height: 130rpx;
				box-sizing: border-box;
				padding: 28rpx 0;
				border-bottom: 1px solid #ECECEC;

				&:nth-last-child(1) {
					border: none;
					// padding-bottom: 0;
				}

				.submit {
					width: 100%;
					display: flex;
					justify-content: space-between;

					view {
						width: 30%;
					}

					.submitText {
						font-size: 28rpx;
						color: #343434;
						text-align: center;
					}

					.price {
						color: #228CF5;
						font-size: 28rpx;
						text-align: right;
					}
				}

				.challenge {
					padding-top: 25rpx;
					display: flex;
					justify-content: space-between;

					.challengeText {
						font-size: 22rpx;
						color: #9A9A9A;
					}

					.date {
						font-size: 22rpx;
						color: #9A9A9A;
					}
				}
			}

			.nodata {
				// position: absolute;
				// left: 50%;
				// transform: translateX(-50%);
				margin: 100rpx auto 0;
				text-align: center;
				padding-bottom: 40rpx;

				image {
					width: 330rpx;
					height: 255rpx;
				}

				.text {
					color: #666666;
					font-size: 28rpx;
				}
			}
		}

	}
</style>
