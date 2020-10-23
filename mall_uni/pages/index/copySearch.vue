<template>
	<view class="tBody">
		<view class="reds"></view>
		<view class="searchBody">
			<!-- TO DO 搜索输入框 -->
			<view class="searchInptBox">
				<view class="searchBox">
					<view class="inputBox">
						<image class="iconSearch" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/search.png" mode="aspectFit"></image>
						<input type="text" v-model="search" @input="onInput" @focus='onFocus' value="" placeholder="输入商品名称或粘贴淘宝标题" />
						<image class="delet" v-if="deletBtn" @click="searchBtn" src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/delet.png" mode="aspectFit"></image>
					</view>
					<view class="right">
						<view class="text" v-if="intRbtn" @click="cancel">取消</view>
						<view class="text" v-else='intRbtn' @click="serachBtn">搜索</view>
					</view>
				</view>
			
			</view>

			<view class="contBox">

				<!-- TO DO 广告轮播 -->
				<view class="advertisingImg" v-show="advertising">
					<swiper class="swiper" @change="change" :autoplay='true' :interval='3000' :duration='300' :mode="mode">
						<swiper-item v-for="(item ,index) in adList.searchTopAd" :key="index">
							<view class="swiper-item" @click="adClick(item)">
								<image :src="item.image" mode="aspectFit"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<view class="cont" v-if="discover">
					<!-- TO DO  搜索历史 -->
					<view class="searchHistory" v-show="isSearchHistory">
						<view class="historyTitle">
							<text>搜索历史</text>
							<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/delet2.png" @click="postDeletKeyword" mode="aspectFit"></image>
						</view>
						<view class="historyLisBox" id="editor" :class="{isHistory:searHistory}">
							<view class="historyList" @click="historyClick(items.keyword)" v-for="(items,indexs) in searchKeyWord">
								{{items.keyword}}
							</view>
						</view>
						<view class="historyIcon" v-show="searchBtns" @click="history">
							<text>{{open}}搜索历史</text>
							<image :src="showHide" mode="aspectFit"></image>
						</view>
					</view>

					<!-- TO DO 搜索发现 -->
					<view class="searchDiscover">
						<view class="discoverTitle">
							<text>搜索发现</text>
							<image :src="discoverIcon" mode="aspectFit" @click="searchDiscover"></image>
						</view>
						<view class="discoverLisBox" v-if="hideDiscover">
							<view class="discoverLis" @click="adClick(item)" v-for="(item,index) in adList.searchKeyAd">
								{{item.title}}
							</view>
						</view>
						<view class="hideDiscover" v-else="hideDiscover">
							已隐藏搜索发现
						</view>
					</view>
				</view>

				<!-- TO DO 关键字 -->
				<view class="keyWord" v-show="keyWord">
					<view class="keyWordList" v-for="(item,index) in keyWordList" :key='index' @click="isSearch(item.keyword)">
						<text>{{item.keyword}}</text>
						<image src="https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/iconJT.png" mode="aspectFit" @click="isKeyword(item.keyword)"></image>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	// import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import $axios from "../../utils/ajax.js"
	import $utils from '../../utils/utils.js' //vuex
	import auiLoading from '@/components/aui-loading/aui-loading.vue';
	export default {
		components: {
			auiLoading
		},
		onLoad: function(option) {
			this.load = false

			if (typeof option.title != 'undefined') {
				this.search = option.title
				this.historyClick(option.title)
			}
			if (typeof option.searcText != 'undefined') {
				this.search = option.searcText
				this.historyClick(option.searcText)
			}

			if (typeof option.hideAd != 'undefined') {
				this.advertising = option.hideAd
			} else {
				this.advertising = true
			}

		},
		data() {
			return {
				search: '',	
				keyWord: false,
				open: '开启',
				showHide: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/kaiqi.png',
				searHistory: true,
				hideDiscover: true,
				discoverIcon: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/show.png',
				discover: true,
				keyWordList: [],
				deletBtn: false,
				searchKeyWord: [],
				advertising: false,
				priceActive: false,
				isSearchHistory: false,
				intRbtn:true,
				searchBtns: false,
			};
		},
		methods: {
			// 取消点击返回首页
			cancel() {
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			// 跳转搜索内容事件
			SearchNavigateTo(){
				if(this.search != ''){
					uni.navigateTo({
						url:'./searchResult?search='+this.search
					})
				}
				this.search = ''
				this.keyWord = false
				this.discover = true;
				this.advertising = true
			},
			// 搜索点击时候
			serachBtn() {
				this.SearchNavigateTo()
			},

			// TO DO 清除搜索框内容
			searchBtn() {
				this.search = ''
				this.discover = true //搜索历史
				this.advertising = true
			},
			// TO DO 请求关键词数据
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
							this.discover = true;
							this.keyWord = false;
							this.advertising = false
						} else {
							this.discover = false;
							this.keyWord = true;
						}
					}
				}).catch((err) => {

				})
			},

		
			// TO DO 搜索历史
			getSearchKeyWord() {
				$axios.get({
					url: 'User/getKeyword',
				}).then((res) => {
					if (res.data.code == 200) {
						this.searchKeyWord = res.data.data;
						// console.log(res.data.data)
						if (res.data.data.length >= 6) {
							this.searchBtns = true
						}else{
							this.searchBtns = false
						}
						if (res.data.data.length == 0) {
							this.isSearchHistory = false
						} else {
							this.isSearchHistory = true
						}
					}
				}).catch((err) => {

				})
			},
			// TO DO 删除用户搜索关键词
			postDeletKeyword() {
				$axios.post({
					url: 'User/delKeyword'
				}).then((res) => {
					this.searchKeyWord = []
					this.isSearchHistory = false
				}).catch((err) => {})
			},
		
			priceList(index) {
				this.priceActive = index
				this.paging = 1
			},
			isSearch(key) {
				this.search = key
				this.SearchNavigateTo()
			},
			// TO DO 关键字被点击时候
			isKeyword(index) {
				this.keyWord = false;
				this.keyWord = false;
				this.search = index;
				this.advertising = false
				this.deletBtn = false;
				this.paging = 1
			},
			// TO DO 搜索历史
			history() {
				if (this.open == '开启') {
					this.open = '收起'
					this.showHide = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/shouqi.png'
					this.searHistory = false
				} else {
					this.open = '开启'
					this.showHide = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/kaiqi.png'
					this.searHistory = true
				}
			},
			// TO DO 历史记录点击事件
			historyClick(index) {
				this.search = index;
				this.SearchNavigateTo()
			},

			// TO DO 搜索发现
			searchDiscover() {
				if (this.hideDiscover) {
					this.hideDiscover = false
					this.discoverIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/hide.png'
				} else {
					this.hideDiscover = true
					this.discoverIcon = 'https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/home/show.png'
					this.paging = 1
				}
				this.keyWord = false
			},
			// TO DO 输入框输入触发事件
			onInput(e) {
				this.search = e.detail.value;
				if (e.detail.value == '') {
					this.discover = true;
					this.keyWord = false;
					this.deletBtn = false;
				} else {
					this.getSearch();
				}
				this.twoTab = false
				// this.deletBtn = true;
			},
			// 获取焦点时候
			onFocus() {
				if (this.search == '') {
					this.discover = true;
				} else {
					// this.keyWord = true;
					this.discover = false;
					this.deletBtn = true;
					this.getSearch();
				}
				this.twoTab = false
				this.advertising = true
			},

			// 点击广告
			adClick(ad) {
				$axios.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				$utils.adJump(ad, this);
				this.advertising = true
			},
		},
		// TO DO 搜索发现
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
				// console.log(this.$store.state.user)
			},
			adList() {
				let tmp = this.$store.state.adList;
				let adList = [];
				if(tmp.searchTopAd && tmp.searchTopAd.length>0){
					adList = adList.concat(tmp.searchTopAd);
				}
				if(tmp.searchKeyAd && tmp.searchKeyAd.length>0){
					adList = adList.concat(tmp.searchKeyAd);
				}
				adList.forEach(item=>{
					$utils.addAdShowLog(item);
				});
				return tmp;
			},
		},
		watch: {
			// 监听输入框的val
			'search': function(newVal, oldVal) {
				if (newVal == '') {
					this.deletBtn = false;
					this.keyWord = false;
					this.intRbtn = true //搜索和取消按钮
				} else {
					this.deletBtn = true;
					this.intRbtn = false //搜索和取消按钮
					// console.log('搜索内容是：', newVal)
					this.advertising = false
				}
			}
		},
		mounted() {
			this.getSearchKeyWord()
			this.load = true
			
		},
		
		onReachBottom() {
			this.getResult()
		},
		onShow() {
			this.getSearchKeyWord()
		}
	}
</script>

<style lang="less">
	.tBody {
		.reds {
			width: 100%;
			height: 35rpx;
			background: #ff0000;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 90;
		}
		
		.searchBody {
			background: #fff;


			// TO DO 搜索输入框

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
			}
			//TO DO 关键字
			.keyWord {
				padding: 10rpx 20rpx 0 20rpx;

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

			// 广告轮播
			.advertisingImg {
				padding-top: 25rpx;
				width: 710rpx;
				height: 140rpx;
				margin: 0 auto;
				border-radius: 20rpx;

				.swiper {
					.swiper-item {
						image {
							width: 100%;
							height: 140rpx;
						}
					}
				}
			}

			.cont {
				background: #fff;
				padding: 48rpx 25rpx 0 25rpx;

				// TO DO 搜索历史
				.searchHistory {
					padding-bottom: 55rpx;
					border-bottom: 1px solid #f0f0f0;

					.historyTitle {
						display: flex;
						justify-content: space-between;

						text {
							font-size: 28rpx;
							color: #010101;
						}

						image {
							width: 26rpx;
							height: 26rpx;
						}
					}

					.historyLisBox {
						padding-top: 29rpx;
						display: flex;
						flex-wrap: wrap;

						.historyList {
							font-size: 24rpx;
							color: #262525;
							padding: 16rpx 28rpx;
							background-color: #f7f7f7;
							border-radius: 27rpx;
							margin: 0 15rpx 18rpx 0;
						}
					}

					.isHistory {
						max-height: 150rpx;
						overflow: hidden;
					}

					.historyIcon {
						margin-top: 15rpx;
						padding-top: 15rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						text {
							color: #333;
							font-size: 24rpx;
						}

						image {
							width: 16rpx;
							height: 8rpx;
							margin-left: 10rpx;
						}
					}
				}

				// TO DO 搜索发现
				.searchDiscover {
					padding-top: 30rpx;

					.discoverTitle {
						display: flex;
						justify-content: space-between;
						align-items: center;

						text {
							font-size: 28rpx;
							color: #010101;
						}

						image {
							width: 32rpx;
							height: 22rpx;
						}
					}

					.discoverLisBox {
						padding-top: 30rpx;
						display: flex;
						flex-wrap: wrap;

						.discoverLis {
							font-size: 24rpx;
							color: #262525;
							padding: 16rpx 28rpx;
							background-color: #f7f7f7;
							border-radius: 27rpx;
							margin: 0 15rpx 18rpx 0;
						}
					}

					.hideDiscover {
						color: #999;
						font-size: 24rpx;
						text-align: center;
						padding: 70rpx 0;
					}
				}
			}
		}
	}
</style>
