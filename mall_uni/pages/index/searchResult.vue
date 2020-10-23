<template>
	<view class="tbody">

		<view class="reds"></view>

		<view class="searchBody">
			<!-- 输入框tab头部 -->
			<view class="searchInptBox">
				<view class="searchBox">
					<view class="inputBox">
						<image class="iconSearch" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/search.png" mode="aspectFit"></image>
						<input type="text" v-model="search" @input='onInput' value="" placeholder="输入商品名称或粘贴淘宝标题" />
						<image class="delet" v-if="deletBtn" @click="searchBtn" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/delet.png"
						 mode="aspectFit"></image>
					</view>
					<view class="right">
						<view class="text" @click="serachBtn">搜索</view>
					</view>
				</view>
				<!-- tab栏 -->
				<view class="searchTab" v-if="keyWord">
					<view class="searchTabList" :class="{synthesize:isSynthesize}" @click="synthesize">
						<text>综合</text>
						<view class="icon"></view>
					</view>
					<view class="searchTabList" :class="{sales:isSales,icon1:icona}" @click="sales">
						<text>销量</text>
						<view class="icon"></view>
					</view>
					<view class="searchTabList" :class="{price:isPrice,icon2:iconb}" @click="price">
						<text>价格</text>
						<view class="icon"></view>
					</view>
					<view class="searchTabList" :class="{list:isList}" @click="list">
						<view class="icon"></view>
					</view>
					<view class="searchTabList" :class="{screen:isScreen}" @click="screen">
						<text>筛选</text>
						<view class="icon"></view>
					</view>
				</view>
			</view>

			<!-- 搜索结果 -->
			<view class="contBox">
				<view class="searchResult" v-if="keyWord">

					<view v-if="isList" class="resultListBox">
						<view class="lisDetails" @click="datails(item)" v-for="(item,index) in result" :key="index">
							<view class="lisImgBox">
								<image :src="item.pic" mode="aspectFit"></image>
							</view>
							<view class="listRight">
								<view class="listText">
									{{item.title}}
								</view>
								<view class="listIcon">
									<view class="listIconL" v-if="item.coupon_money">
										<text class="juan">券</text>
										<text>{{item.coupon_money}}元</text>
									</view>
									<view class="integral">
										<text>返{{user.is_team==1?Number(item.up_money_fraction):Number(item.user_money_fraction)}}集分宝</text>
									</view>

								</view>
								<view class="originalBox">
									<view class="originalL">
										<text>原价</text>
										<text class="ListDelet">￥{{item.promotion_price}}</text>
									</view>
									<view class="listIconR">
										<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
										<view>热卖<text>{{item.format_volume}}</text>件</view>
									</view>
								</view>
								<view class="listDetailsB">
									<view class="DetailsBottomText">
										<text>到手价￥</text>
										<text class="listBig">{{item.endprice}}</text>
									</view>
									<view class="DetailsBottomBtn">
										<text>马上抢</text>
										<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/right.png" mode="aspectFit"></image>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view v-else="isList" class="resSortSquare resultListBox">
						<!-- 第二种排序方式 -->
						<view class="sortSquare lisDetails" @click="datails(item)" v-for="(item,index) in result" :key="index">
							<view class="lisImgBox">
								<image :src="item.pic" mode="aspectFit"></image>
							</view>
							<view class="listBottom listRight">
								<view class="listText">
									{{item.title}}
								</view>
								<view class="listDetailsB">
									<view class="DetailsBottomText">
										<text>到手价￥</text>
										<text class="listBig">{{item.endprice}}</text>
										<!-- <text class="ListDelet">￥{{item.endprice}}</text> -->
									</view>

									<view class="listIconR">
										<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icont.png" mode="aspectFit"></image>
										<view>热卖<text>{{item.format_volume}}</text>件</view>
									</view>
								</view>
								<view class="listIcon">
									<view class="listIconL" v-if="item.coupon_money">
										<text class="juan">券</text>
										<text>{{item.coupon_money}}元</text>
									</view>
									<view class="integral">
										<text>返{{user.is_team==1?Number(item.up_money_fraction):Number(item.user_money_fraction)}}集分宝</text>
									</view>
								</view>
							</view>
						</view>

					</view>
					<loading v-if="!noData && load" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
				</view>
				<!-- TO DO 关键字 -->
				<view class="keyWord" v-else="keyWord">
					<view class="keyWordList" v-for="(item,index) in keyWordList" :key='index' @click="isSearch(item.keyword)">
						<text>{{item.keyword}}</text>
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/iconJT.png" mode="aspectFit" @click="isKeyword(item.keyword)"></image>
					</view>
				</view>
			</view>
		</view>

		<!-- TO DO 筛选 -->
		<view class="pop-up" v-show="proUP" @touchmove.stop.prevent="moveHandle">
			<view class="pop-upCont" @click.stop="">
				<view class="discounts" v-for="(item,index) in listSort.screen" :key="index">
					<text>{{item.title}}</text>
					<view class="discoListTab">
						<view class="discoList" :class="{special:items.active}" v-for="(items,indexs) in item.list" @click="discoList(index,indexs)"
						 :key="indexs">{{items.title}}</view>
					</view>
				</view>
				<view class="popUpBtn">
					<view class="reset" @click="reset">重置</view>
					<view class="confirm" @click="popUp">确定</view>
				</view>
			</view>
		</view>

		<!-- TO DO 综合下拉菜单 -->
		<view class="menuHide" v-show="menu">
			<view class="menu">
				<view class="" v-for="(item,index) in listSort.searchOrder" :class="{menuLis:item.active}" @click="menulis(index)">{{item.title}}</view>
			</view>
		</view>

		<!-- 没数据 -->
		<view class="cont2" v-if='noData'>
			<view class="cont2-img">
				<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/icon/noSearch.png" mode="aspectFit"></image>
			</view>
			<text>没有找到相关的宝贝哦~</text>
		</view>
	</view>
</template>

<script>
	import $axios from '../../utils/ajax.js'
	export default {
		onLoad: function(option) {
			if (typeof option.search != 'undefined') {
				this.search = option.search
				this.orderData = ''
				this.priceData = ''
				this.discountData = ''
				this.getList()
			}
		},
		mounted() {
			this.load = true
		},
		data() {
			return {
				search: '',
				isSynthesize: true,
				deletBtn: false,
				isSales: false,
				isPrice: false,
				isList: false,
				isScreen: false,
				icona: false,
				iconb: false,
				result: [],
				paging: 1,
				loadingMore: false,
				noMoreData: false,
				noData: false,
				load: false,
				listSort: [],
				proUP: false,
				menu: false,
				noIncome: false,
				keyWord: true,
				keyWordList: [],
				keyWordTitle:'' //标题 
			}
		},
		created() {
			this.getListSort()
		},
		methods: {
			// 监听输入框
			onInput(e) {
				this.search = e.detail.value;
				if (e.detail.value == '') {
					this.searchBtn()
				} else {
					this.getSearch();
					this.deletBtn = true;
				}
			},
			// TO DO 设置历史记录
			postSetKeyword() {
				$axios.post({
					url: 'User/setKeyword',
					data: {
						keyword: this.search
					}
				}).then((res) => {

				}).catch(() => {

				})
			},
			// TO DO 请求关词数据
			getSearch() {
				$axios.get({
					url: 'Base/getRecKeyword',
					data: {
						keyword: this.search
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.keyWordList = res.data.data;
						if (res.data.data.length == 0) {
							this.keyWord = true;
							this.noIncome = true
						} else {
							this.keyWord = false;
							this.noIncome = false
						}
					}
				}).catch((err) => {

				})
			},
			// 关键词被点击时候
			isSearch(index) {
				this.search = index
				this.orderData = ''
				this.priceData = ''
				this.discountData = ''
				this.getList()
			},
			// TO DO 清除搜索框内容
			searchBtn() {
				uni.navigateTo({
					url: './copySearch'
				})
			},
			//返回上一级
			cancel() {
				uni.navigateTo({
					url: './index'
				})
			},
			// 搜索点击时候
			serachBtn() {
				this.orderData = ''
				this.priceData = ''
				this.discountData = ''
				this.getList();
			},
			// 右边筛选框
			synthesize() {
				this.isSynthesize = true;
				this.isSales = false;
				this.isPrice = false;
				this.isScreen = false;
				this.icona = false
				this.iconb = false
				this.menu = !this.menu
				this.paging = 1
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
			},

			// TO DO 点击销量排序
			sales() {
				if (this.isSales == true) {
					this.isSales = false
					this.icona = true

					this.orderData = '4'
					this.priceData = ''
					this.discountData = ''
					this.getList()
				} else {
					this.isSales = true
					this.icona = false

					this.orderData = '5'
					this.priceData = ''
					this.discountData = ''
					this.getList()
				}
				this.iconb = false
				this.isSynthesize = false;
				this.isPrice = false;
				this.isScreen = false;
				this.menu = false;
				this.paging = 1
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
			},
			// TO DO 搜索结果价格排序
			price() {
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
				if (this.isPrice == false) {
					this.isPrice = true

					this.orderData = '3'
					this.priceData = ''
					this.discountData = ''
					this.getList()
				} else {
					this.isPrice = false
					this.iconb = true


					this.orderData = '2'
					this.priceData = ''
					this.discountData = ''
					this.getList()
				}
				this.icona = false
				this.isSynthesize = false;
				this.isSales = false;
				this.isScreen = false;
				this.menu = false
				this.paging = 1
			},
			// TO DO 搜索结果列表排序
			list() {
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
				if (this.isList == false) {
					this.isList = true
				} else {
					this.isList = false
				}
				this.menu = false
				this.paging = 1
			},
			// TO DO 搜索结果筛选排序
			screen() {
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
				this.isSynthesize = false;
				this.isSales = false;
				this.isPrice = false;
				this.isScreen = true;
				this.icona = false
				this.iconb = false
				this.proUP = true
				this.menu = false
				this.paging = 1
			},
			// TO DO点击筛选弹框
			popUp() {
				this.proUP = false;
				this.orderData = ''
				this.getList()
			},
			// TO DO筛选弹框list点击事件
			discoList(index, indexs) {
				this.paging = 1
				this.listSort.screen[index].list.forEach((e) => {
					e.active = false
				})
				this.listSort.screen[index].list[indexs].active = true
				if (index == 0) {
					this.discountData = this.listSort.screen[0].list[indexs].data
				} else {
					this.priceData = this.listSort.screen[1].list[indexs].data
				}
			},
			// 重置按钮
			reset() {
				this.getListSort()
			},
			// TP-DO 列表点击跳转详情
			datails(item) {
				uni.navigateTo({
					url: '../listDatails/listDatails?iid=' + item.num_iid + '&type=' + item.goods_type
				})
			},
			// 查询数据
			getList() {
				this.result = []
				this.keyWord = true
				this.loadingMore = false
				this.noMoreData = false
				this.noData = false
				this.paging = 1
				this.getResult()
			},
			// TO DO 请求搜索结果
			getResult() {
				this.postSetKeyword()
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				$axios.get({
					url: 'Goods/search',
					data: {
						p: this.paging,
						keyword: this.search,
						order: this.orderData,
						price: this.priceData,
						discount: this.discountData,
					}
				}).then((res) => {
					if (res.data.code == 200) {
						this.keyWordTitle = res.data.data.keyword  //搜索标题
						uni.setNavigationBarTitle({
							title:this.keyWordTitle
						})
						res.data.data.list.forEach((item, index, array) => {
							this.result.push(item)
						})
						if (res.data.data.list.length > 0) {
							this.paging++
							if (res.data.data.endPage) {
								this.noMoreData = true
							}
						} else {
							this.noIncome = true
							if (this.paging == 1 && res.data.data.list.length == 0) {
								this.noMoreData = true
								this.noData = true
							} else {
								this.noMoreData = true
							}
						}
					}
					this.loadingMore = false;

				}).catch((error) => {
					this.loadingMore = false;
				})
			},

			// TO DO 综合排序下拉列表点击筛选事件
			menulis(index) {
				my.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				});
				this.listSort.searchOrder.forEach((e) => {
					e.active = false
				})
				this.listSort.searchOrder[index].active = true;
				this.orderData = this.listSort.searchOrder[index].data
				this.menu = false;
				
				this.orderData = ''
				this.priceData = ''
				this.discountData = ''
				this.getList();
			},

			// TO DO 列表排序
			getListSort() {
				$axios.get({
					url: 'Base/getOption',
				}).then((res) => {
					if (res.data.code == 200) {
						this.listSort = res.data.data

						this.listSort.screen[0].list.forEach((event, indexs) => {
							if (event.active) {
								this.discountData = this.listSort.screen[0].list[indexs].data
							}
						})
						this.listSort.screen[1].list.forEach((event, indexs) => {
							if (event.active) {
								this.priceData = this.listSort.screen[1].list[indexs].data
							}
						})
					}
				}).catch((err) => {})
			},

		},
		computed: {
			user() {
				return this.isLogin ? this.$store.state.user : {
					headimg: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/headimg.jpg',
					uid: 0,
					nickname: ''
				};
			},
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			adList() {
				return this.$store.state.adList
			},
		},
		watch: {
			// 监听输入框的val
			'search': function(newVal, oldVal) {
				if (newVal == '') {
					this.deletBtn = false;
					this.keyWord = false;
				} else {
					this.deletBtn = true;
				}
			}
		},
		onReachBottom() {
			this.getResult()
		}
	}
</script>

<style lang="less">
	.reds {
		width: 100%;
		height: 35rpx;
		background: #ff0000;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 90;
	}

	// 输入框tab栏
	.searchInptBox {
		position: fixed;
		background: #fff;
		width: 100%;
		z-index: 99;
		border-radius: 35rpx 35rpx 0rpx 0rpx;
		overflow: hidden;

		.searchBox {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 30rpx 24rpx 28rpx;

			.inputBox {
				width: 620rpx;
				height: 66rpx;
				box-sizing: border-box;
				padding: 0 17rpx 0 22rpx;
				background-color: #f0f1f3;
				display: flex;
				align-items: center;
				border-radius: 33rpx;

				.iconSearch {
					width: 25rpx;
					height: 25rpx;
				}

				input {
					flex: 1;
					color: #333;
					font-size: 26rpx;
					background-color: #f0f1f3;
				}

				.delet {
					width: 32rpx;
					height: 32rpx;
				}
			}

			.text {
				font-size: 28rpx;
				color: #111;
				line-height: 66rpx;
			}
		}

		.searchTab {
			width: 100%;
			background-color: #fff;
			box-sizing: border-box;
			padding: 33rpx 30rpx 23rpx 30rpx;
			display: flex;
			justify-content: space-between;

			.searchTabList {
				display: flex;
				align-items: center;

				text {
					font-size: 28rpx;
					color: #111;
				}

				.icon {
					width: 15rpx;
					height: 12rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/synthesize1.png)no-repeat;
					background-size: 100% 100%;
					margin-left: 4rpx;
				}
			}

			.searchTabList:nth-of-type(2) {
				.icon {
					width: 10rpx;
					height: 17rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.searchTabList:nth-of-type(3) {
				.icon {
					width: 10rpx;
					height: 17rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.searchTabList:nth-of-type(4) {
				.icon {
					width: 30rpx;
					height: 28rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/list.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.searchTabList:nth-of-type(5) {
				.icon {
					width: 16rpx;
					height: 20rpx;
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/screen.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.synthesize {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/synthesize.png)no-repeat;
					background-size: 100% 100%;
				}
			}

			.sales {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort2.png)no-repeat !important;
					background-size: 100% 100% !important;
				}
			}

			.icon1 {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort1.png)no-repeat !important;
					background-size: 100% 100% !important;
				}
			}

			.icon2 {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort1.png)no-repeat !important;
					background-size: 100% 100% !important;
				}
			}

			.price {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/sort2.png)no-repeat !important;
					background-size: 100% 100% !important;
				}

			}

			.list {
				text {
					color: #ff4844;
				}

				.icon {
					background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/list2.png)no-repeat !important;
					background-size: 100% 100% !important;
				}
			}

			.screen {
				text {
					color: #ff4844;
				}
			}
		}



	}

	.contBox {
		padding-top: 120rpx;

		//TO DO 关键字
		.keyWord {
			padding: 10rpx 20rpx 0 20rpx;
			background: #fff;

			.keyWordList {
				height: 79rpx;
				box-sizing: border-box;
				line-height: 79rpx;
				border-bottom: solid 1px #f5f5f5;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-size: 26rpx;
					color: #111;
				}

				image {
					width: 23rpx;
					height: 23rpx;
				}
			}
		}

	}

	// TO DO 搜索结果
	.searchResult {
		padding-top: 90rpx;
		background: rgba(242, 242, 242, 1);



		.resultListBox {
			padding-top: 20rpx;

			.lisDetails {
				box-sizing: border-box;
				background-color: #fff;
				padding: 20rpx 0 20rpx 20rpx;
				border-radius: 16rpx;
				display: flex;
				margin: 0 20rpx 20rpx 20rpx;
				overflow: hidden;

				.lisImgBox {
					width: 220rpx;
					height: 220rpx;

					image {
						width: 220rpx;
						height: 220rpx;
						border-radius: 10rpx;
						overflow: hidden;
					}
				}

				.listRight {
					width: 100%;
					margin-left: 20rpx;
					padding-top: 10rpx;

					.listText {
						// width: 424rpx;
						color: #111;
						font-size: 26rpx;
						line-height: 40rpx;
						// padding-right: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box; //作为弹性伸缩盒子模型显示。
						-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
						-webkit-line-clamp: 1;
					}

					.listIcon {
						margin-top: 10rpx;
						display: flex;

						.listIconL {
							width: 140rpx;
							height: 40rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/jbg.png)no-repeat;
							background-size: 100% 100%;
							display: flex;

							text {
								color: #ff4844;
								font-size: 22rpx;
								display: inline-block;
								flex: 1;
								text-align: center;
								line-height: 40rpx;
							}

							.juan {
								width: 40rpx;
								text-align: center;
								font-size: 22rpx;
								color: #fff;
								// margin: 0 18rpx 0 10rpx;
								flex: none;
							}
						}

						.integral {
							display: flex;
							align-items: center;
							background: rgba(255, 200, 68, 0.12);
							border-radius: 8rpx;
							padding: 0 10rpx;
							margin-left: 14rpx;

							text {
								color: #ff3a00;
								font-size: 22rpx;
							}
						}
					}

					.originalBox {
						display: flex;
						justify-content: space-between;
						margin-top: 27rpx;

						.originalL {
							text {
								color: #999;
								font-size: 22rpx;
							}

							.ListDelet {
								font-size: 20rpx;
								color: #999;
								text-decoration: line-through;
							}
						}

						.listIconR {
							image {
								width: 16rpx;
								height: 18rpx;
							}

							view {
								display: inline-block;
								color: #888;
								font-size: 18rpx;
								margin-left: 5rpx;

								text {
									color: #ff4844;
								}
							}
						}
					}

					.listDetailsB {
						display: flex;
						justify-content: space-between;
						margin-top: 10rpx;


						.DetailsBottomText {
							text {
								color: #ff4844;
								font-size: 20rpx;
								line-height: 55rpx;
							}

							.listBig {
								font-size: 32rpx;
								font-weight: bold;
							}

							.textBig {
								font-size: 28rpx;
								font-weight: bold;
							}
						}

						.DetailsBottomBtn {
							width: 135rpx;
							height: 55rpx;
							background-image: linear-gradient(90deg,
								#ff6662 0%,
								#ff423e 100%),
								linear-gradient(#f84a23,
								#f84a23);
							background-blend-mode: normal,
								normal;
							border-radius: 27rpx 0rpx 0rpx 27rpx;
							line-height: 55rpx;
							text-align: right;

							text {
								font-size: 26rpx;
								color: #fff;
							}

							image {
								width: 18rpx;
								height: 20rpx;
								margin: 0 5rpx;
							}
						}
					}
				}
			}
		}

		.resSortSquare {
			display: flex;
			flex-wrap: wrap;
			margin: 0 20rpx;

			.sortSquare {
				width: 346rpx;
				padding: 0;
				display: block;
				margin: 0 0 18rpx 0;

				.lisImgBox {
					width: 346rpx;
					height: 346rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.listBottom {
					width: auto;
					padding: 20rpx 0 28rpx 18rpx;
					margin: 0;

					.listText {
						// width: 424rpx;
						// padding-right: 26rpx;

					}

					.listDetailsB {
						margin-top: 10rpx;
						padding-right: 18rpx;

						.listIconR {
							image {
								width: 16rpx;
								height: 18rpx;
							}

							view {
								display: inline-block;
								color: #888;
								font-size: 18rpx;
								margin-left: 5rpx;

								text {
									color: #ff4844;
								}
							}
						}

						.DetailsBottomText {
							text {
								line-height: 1;
							}
						}
					}

					.listIcon {
						margin-top: 20rpx;
						padding-right: 18rpx;
						justify-content: space-between;

						.listIconR {
							width: 155rpx;
							margin-right: 0;
						}

						.integral {
							margin-left: 0;
						}
					}
				}
			}

			.sortSquare:nth-of-type(2n) {
				margin-left: 18rpx;
			}
		}
	}

	// 弹窗
	.pop-up {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 99;

		.pop-upCont {
			width: 550rpx;
			height: 100%;
			box-sizing: border-box;
			padding: 50rpx 50rpx 0;
			position: absolute;
			right: 0;
			top: 0;
			background: #fff;
			border-radius: 30rpx 0rpx 0rpx 30rpx;

			.discounts {
				text {
					font-size: 30rpx;
					color: #111;
				}

				.discoListTab {
					padding: 40rpx 0 40rpx 0;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.discoList {
						width: 190rpx;
						height: 60rpx;
						text-align: center;
						line-height: 60rpx;
						background-color: #f5f5f5;
						border-radius: 30rpx;
						color: #333;
						font-size: 26rpx;
						margin: 0 0rpx 15rpx 0;
					}

					.special {
						background-image: linear-gradient(90deg,
							#ff6662 0%,
							#ff423e 100%),
							linear-gradient(#f5f5f5,
							#f5f5f5);
						color: #fff;

					}

					.discoList:nth-of-type(2n) {
						margin-right: 0;
					}
				}
			}

			.popUpBtn {
				display: flex;
				justify-content: space-between;
				position: fixed;
				bottom: 80rpx;

				.reset {
					width: 230rpx;
					height: 70rpx;
					box-sizing: border-box;
					border: 1px solid #B1B1B1;
					font-size: 28rpx;
					color: #333333;
					text-align: center;
					line-height: 70rpx;
					border-radius: 35rpx;
				}

				.confirm {
					width: 230rpx;
					height: 70rpx;
					background: linear-gradient(90deg, #FF6662, #FF433E);
					font-size: 28rpx;
					color: #fff;
					text-align: center;
					line-height: 70rpx;
					border-radius: 35rpx;
					margin-left: 28rpx;
				}
			}
		}
	}

	// 综合下拉菜单
	.menuHide {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.3);

		.menu {
			width: 100%;
			background: #fff;
			padding: 40rpx 0 40rpx 30rpx;
			margin-top: 200rpx;

			view {
				color: #111;
				font-size: 26rpx;
				padding-bottom: 57rpx;
			}

			.menuLis {
				color: #ff4844;
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
				width: 212rpx;
				height: 200rpx;
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
</style>
