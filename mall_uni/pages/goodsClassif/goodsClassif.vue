<template>
	<view class="tbody">
		<!-- <Header></Header> -->
		<view class="cont">
			<view class="cont-tab">
				<view class="listItem" :class="{classif:classifAct == index}" v-for="(item,index) in goodsTab" @click="goodsClassif(index)"
				 :key='index'>{{item.title}}</view>
			</view>
			<view class="cont-right">
				<view class="cont-right-major" v-for="(items,indexs) in goodsTab[index].list" :key='indexs'>
					<view class="majorTitle">{{indexs}}</view>
					<view class="majorCont">
						<view class="majorCont-item" v-for="(itemss,indexss) in items" :key='indexss' @click="lickFn(itemss)">
							<view class="imgBox">
								<image :src="itemss.img" mode="aspectFill"></image>
							</view>
							<text class="">{{itemss.data}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import Header from '../../components/head/head.vue'
	import $axios from '../../utils/ajax.js'
	export default {
		components: {
			// Header
		},
		data() {
			return {
				classifAct: 0,
				goodsTab: [],
				index: 0,
				STATUS_BAR_HEIGTH: 24,
				TITLE_BAR_HEIGTH: 48,
				showAd:false
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.STATUS_BAR_HEIGTH = res.statusBarHeight
					this.TITLE_BAR_HEIGTH = res.titleBarHeight
				},
			})
		},
		mounted() {
			this.getGoodsClassif()
		},
		methods: {
			// 跳转搜索页面
			lickFn(items){
				uni.navigateTo({
					url:'/pages/index/searchResult?search='+items.data+'&hideAd='+this.showAd
				})
			},
			// 数据列表
			getGoodsClassif() {
				if (this.loadingMore || this.noMoreData) return;
					this.loadingMore = true;
				$axios.get({
					url: 'Base/getCatKeyword'
				}).then(res => {
					if (res.data.code == 200) {
						this.goodsTab = res.data.data
					}

				})
			},
			goodsClassif(index) {
				this.classifAct = index
				this.index = index
			}
		}
	}
</script>

<style lang="less">
	.tbody {
		.cont {
			display: flex;
			justify-content: space-between;

			&-tab {
				top: 0;
				width: 168rpx;
				height: 100%;
				background: #fff;
				position: fixed;
				overflow-y: auto;
				&::-webkit-scrollbar{
					display: none;
				}
				.listItem {
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 28rpx;
					font-weight: bold;
					font-size: #333;
				}

				.classif {
					background: #f7f7f7;
					color: #f74f4d;
					position: relative;

					&::after {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 5rpx;
						height: 36rpx;
						background-color: #f74f4d;
						border-radius: 3rpx;
					}
				}
			}

			&-right {
				padding-right: 27rpx;
				margin-left:188rpx ;
				&-major {
					padding-top: 30rpx;
					padding-bottom: 15rpx;
					width: 535rpx;

					.majorTitle {
						font-size: 28rpx;
						color: #333;
						padding-bottom: 20rpx;
					}

					.majorCont {
						background-color: #ffffff;
						border-radius: 14rpx;
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;
						padding: 46rpx 37rpx 0 37rpx;

						&:after {
							// 使用伪类元素占据单位，不影响页面
							content: " ";
							// display: inl;
							height: 0;
							width: 33%;
						}

						&-item {
							text-align: center;
							margin: 0 0 40rpx 0;

							// &:nth-of-type(3n){
							// 	margin-right: 0;
							// }
							.imgBox {
								width: 118rpx;
								height: 118rpx;

								image {
									width: 100%;
									height: 100%;
								}
							}

							text {
								text-align: center;
								font-size: 24rpx;
								color: #333;
							}
						}
					}
				}
			}
		}
	}
</style>
