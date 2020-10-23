<template>
	<view class="tbody">
		<!-- <Header></Header> -->
		<view class="cont" v-if="history">

			<view class="cont-list">
				<view class="cont-list-time">
					<view class="left">今天</view>
					<view class="right"><text @click="postAddDelet">清空</text><text @click="chekhide">编辑</text></view>
				</view>
				<view class="cont-list-box">
					<uni-swipe-action class="topList">
						<!-- 基础用法 -->

						<uni-swipe-action-item v-for="(item,items) in browsingList" :key='items' :right-options="options" @click="onClick(items,browsingList[items].lid,browsingList[items].type)">
							<checkbox-group v-show="cheakAct">
								<!-- <label style="line-height: 260rpx;"> -->
								<view class="chekbox" :class="{cheak:item.slict}" @click="cheack(item)"></view>

								<!-- </label> -->
							</checkbox-group>
							<view class="cont-list-item">
								<view class="imagBox">
									<image :src="item.pic" mode="aspectFill"></image>
								</view>
								<view class="rightCont">
									<view class="title">{{item.title}}</view>
									<view class="rightCenter">
										<view class="yhj"><text class="juan">券</text><text>{{item.coupon_money}}元</text></view>
										<view class="jfb">返回2000集分宝</view>
									</view>
									<view class="rightFooter">
										<view class="text">券后￥<text>{{item.endprice.split(".")[0]}}</text>.{{item.endprice.split('.')[1]}}</view>
										<view class="btn">看相识</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>

					</uni-swipe-action>
				</view>
			</view>

			<!-- 全选 -->
			<view class="add" v-show="cheakAct">
				<checkbox-group class="addCheak" @click="addCheakFn">
					<view class="chekbox" :class="{cheak:addBtn}"></view>
					<view class="addText">全选</view>
				</checkbox-group>
				<view class="delet" @click="deletChe">删除</view>
			</view>
		</view>

		<view class="cont2" v-else='history'>
			<view class="cont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/browsing/browsing.png" mode="aspectFit"></image>
			</view>
			<text>还没有浏览记录~</text>
			<view class="cont2-btn" @click="noBrowsing">去逛逛</view>
		</view>
	</view>
</template>

<script>
	import {
		uniSwipeAction,
		uniSwipeActionItem
	} from '@dcloudio/uni-ui'
	// import Header from '../../components/head/head.vue'
	import $axios from '../../utils/ajax.js'
	export default {
		components: {
			// Header,
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				deletAct: false,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ff3632',
						borderRadius: '16rpx',
						height: '260rpx'
					}
				}],
				cheakAct: 0,
				addBtn: false,
				listchekBtn: false,
				history: true,
				browsingList: []
			}
		},
		mounted() {
			this.getBrowse()
		},
		methods: {
			// 去逛逛
			noBrowsing() {
				uni.navigateTo({
					url: '../index/index'
				})
			},
			// add全选
			addCheakFn() {
				this.addBtn = !this.addBtn
				this.browsingList.forEach(item => {
					if (this.addBtn) {
						item.slict = true
					} else {
						item.slict = false
					}
				})
			},
			// 获取浏览记录
			getBrowse() {
				$axios.get({
					url: 'User/getGoods',
					data: {
						type: 1,
						p: 1
					}
				}).then((res) => {
					if(res.data.data.list.length == 0){
						this.history = false
					} else {
						this.history = true
						res.data.data.list.forEach(item => {
							item.slict = false
						})
						this.browsingList = res.data.data.list
						console.log(this.browsingList)
					}
				}).catch(err => {})
			},
			// 多选删除
			deletChe() {
				this.browsingList.forEach(item =>{
					if(item.slict == true){
						console.log(item.lid)
						$axios.post({
							url: 'User/delGoods',
							data: {
								type: this.browsingList[0].type,
								lid:item.lid
							}
						}).then(res => {
							if (res.data.code == 200) {
								this.getBrowse()
								uni.showToast({
									title: '删除成功',
									type: 'success'
								});
							}
						}).catch(err => {})
					}
				})
				
			},

			cheack(indexs) {
				indexs.slict = !indexs.slict
			},
			chekhide() {
				this.cheakAct = !this.cheakAct
			},
			// 右滑删除
			onClick(index, lid, type) {
				$axios.post({
					url: 'User/delGoods',
					data: {
						type: type,
						lid: lid
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.getBrowse()
						uni.showToast({
							title: '删除成功',
							type: 'success'
						});
					}
				}).catch(err => {})

			},
			// 清空浏览记录
			postAddDelet() {
				$axios.post({
					url: 'User/delGoods',
					data: {
						type: this.browsingList[0].type
						// lid:
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.getBrowse()
						uni.showToast({
							title: '删除成功',
							type: 'success'
						});
					}
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		.cont {
			padding-bottom: 50rpx;

			&-list {
				padding: 26rpx 20rpx 120rpx 20rpx;

				&-time {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						font-size: 30rpx;
						color: #111;
					}

					.right {
						display: none;

						text {
							font-size: 24rpx;
							color: #ff3632;

							&:nth-last-child(1) {
								margin-left: 15rpx;
							}
						}

					}
				}

				&-box {
					.chekbox {
						width: 32rpx;
						height: 32rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/browsing/chek.png)no-repeat;
						background-size: 100% 100%;
						margin: 110rpx 20rpx 0 0;
					}

					.cheak {
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/browsing/chekd.png)no-repeat;
						background-size: 100% 100%;
					}

					margin-top: 26rpx;

					.uni-swipe_button {
						width: 140rpx;
						height: 260rpx;
						padding: 0;
						border-radius: 16rpx;
					}

					.cont-list-item {
						display: flex;
						margin-bottom: 18rpx;
						background-color: #ffffff;
						border-radius: 16rpx;
						padding: 20rpx 20rpx 20rpx 18rpx;

						&:nth-last-child(1) {
							margin: 0;
						}

						.imagBox {
							width: 220rpx;
							height: 220rpx;
							border-radius: 10rpx;

							image {
								width: 220rpx;
								height: 220rpx;
							}
						}

						.rightCont {
							padding-top: 7rpx;
							margin-left: 20rpx;
							width: 430rpx;

							.title {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box; //作为弹性伸缩盒子模型显示。
								-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
								-webkit-line-clamp: 2;
								font-size: 26rpx;
								color: #111;
								padding-right: 8rpx;
							}

							.rightCenter {
								display: flex;
								padding-top: 25rpx;

								.yhj {
									width: 139rpx;
									height: 40rpx;
									background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
									background-size: 100% 100%;
									display: flex;
									align-items: center;
									margin-right: 15rpx;

									text {
										font-size: 22rpx;
										color: #ff4844;
									}

									.juan {
										color: #fff;
										margin: 0 20rpx 0 10rpx;
									}
								}

								.jfb {
									idth: 153rpx;
									height: 40rpx;
									background-color: rgba(255, 200, 68, 0.12);
									border-radius: 8rpx;
									font-size: 22rpx;
									color: #ff3a00;
									line-height: 40rpx;
									text-align: center;
								}
							}

						}

						.rightFooter {
							display: flex;
							justify-content: space-between;
							padding-top: 34rpx;

							.text {
								font-size: 24rpx;
								color: #ff4844;

								text {
									font-size: 38rpx;
								}
							}

							.btn {
								width: 96rpx;
								height: 36rpx;
								box-sizing: border-box;
								border-radius: 18rpx;
								border: solid 1px #666666;
								color: #333;
								font-size: 22rpx;
								text-align: center;
								line-height: 36rpx;
							}
						}
					}


				}


				&:nth-of-type(1) {

					.cont-list-time {
						.right {
							display: block;
						}

					}
				}
			}

			.add {
				position: fixed;
				bottom: 0;
				height: 120rpx;
				background: #fff;
				width: 100%;
				display: flex;
				justify-content: space-between;

				.addCheak {
					display: flex;
					align-items: center;

					.chekbox {
						width: 32rpx;
						height: 32rpx;
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/browsing/chek.png)no-repeat;
						background-size: 100% 100%;
						margin: 0 0 0 20rpx;
					}

					.cheak {
						background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/browsing/chekd.png)no-repeat;
						background-size: 100% 100%;
					}

					.addText {
						font-size: 30rpx;
						color: #121212;
						margin-left: 15rpx;
					}
				}

				.delet {
					width: 256rpx;
					background: linear-gradient(90deg, #FF6662, #FF433E);
					line-height: 120rpx;
					text-align: center;
					color: #fff;
					font-size: 34rpx;
				}
			}
		}

		.cont2 {
			position: absolute;
			top: 429rpx;
			left: 50%;
			transform: translateX(-50%);
			text-align: center;

			&-img {
				width: 212rpx;
				height: 200rpx;
				margin-bottom: 25rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			text {

				font-size: 24rpx;
				color: #999;
			}

			&-btn {
				width: 240rpx;
				height: 64rpx;
				margin-top: 40rpx;
				background-image: linear-gradient(90deg,
					#ff6662 0%,
					#ff423e 100%),
					linear-gradient(#fde5c3,
					#fde5c3);
				border-radius: 32rpx;
				color: #fff;
				font-size: 28rpx;
				text-align: center;
				line-height: 64rpx;
			}
		}
	}
</style>
