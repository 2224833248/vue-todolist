<template>
	<view class="bodys">
		<view class="prizeList">
			<view class="list" v-for="(item,index) in list" :key="index" @click="jump" :data-url="item.hiteggs.url" :data-id="item.hiteggs.id" :data-type="popup.jump_type">
				<view class="imgBox">
					<image :src="item.hiteggs.image" mode="aspectFit"></image>
				</view>
				<view class="texts">
					<view class="prizeTitle">{{item.hiteggs.title}}</view>
					<view class="prizeTime">{{item.hiteggs.description}}</view>
				</view>
			</view>
			<loading v-if="!noData" :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
	</view>
</template>

<script>
	import ajax from "../../utils/ajax.js";
	import utils from "../../utils/utils.js";
	
	export default {
		data() {
			return {
				loadingMore: false,
				noMoreData: false,
				noData: false,
				currentPageNumber: 1,

				list: [],
			}
		},
		onReachBottom() {
			this.getList()
		},
		mounted() {
			this.getList()
		},
		methods: {
			// 获取数据
			getList() {
				if (this.loadingMore || this.noMoreData) return;
				this.loadingMore = true;
				ajax.get({
					url: 'hiteggs/record',
					data: {
						page: this.currentPageNumber,
					},
					login: false,
					loading: false,
				}).then((res) => {
					if (res.data.code == 200) {
						res.data.data.forEach((item, index, array) => {
							this.list.push(item)
						})
						if (res.data.data.length > 0) {
							this.currentPageNumber++
						} else {
							if (this.currentPageNumber == 1 && res.data.data.length == 0) {
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
			jump(e){
				if (typeof e.currentTarget.dataset.id == 'undefined') {
					return
				}
				let url = e.currentTarget.dataset.url
				let id = e.currentTarget.dataset.id
				let type = e.currentTarget.dataset.type
				
				// 统计点击
				ajax.post({
					url:"hiteggs/statis",
					data:{
						id : id
					}
				})
				
				utils.adJump2(url, type)
			},
			parseQuery(query) {
				let params = {}
				if (query.indexOf('?') !== false) {
					let tmp = query.substr(query.indexOf('?'))
					let tmp1 = '';
					if (tmp.indexOf('&query') !== -1) {
						tmp1 = tmp.substring(0, tmp.indexOf('&query'));
					} else {
						tmp1 = tmp;
					}
					query = query.replace(tmp1, encodeURIComponent(tmp1))
				}
				for (let item of query.split('&')) {
					var tmp = item.split('=')
					params[tmp[0]] = decodeURIComponent(tmp[1])
				}
				return params
			},
		},
		filters: {
			dateFtt(val) {
				return utils.dateFtt('yyyy-MM-dd hh:mm:ss', val);
			},
		},
	}
</script>

<style lang="less">
	.bodys {
		padding: 34rpx 32rpx 0 32rpx;

		.prizeList {
			.list {
				width: 645rpx;
				height: 115rpx;
				background-color: #fff;
				padding: 30rpx 20rpx;
				border-radius: 16rpx;
				margin-bottom: 20rpx;
				display: flex;

				.imgBox {
					width: 238rpx;
					height: 116rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.texts {
					padding: 17rpx 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.prizeTitle {
						font-family: PingFang-SC-Medium;
						font-size: 32rpx;
						color: #111;
					}

					.prizeTime {
						font-family: PingFang-SC-Medium;
						font-size: 24rpx;
						color: #888;
					}
				}
			}
		}
	}
</style>
