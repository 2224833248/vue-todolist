<template>
	<view class="tBody">
		<view class="msg_box">
			<view class="msg_top">
				<view class="not_read_msg">
					<text class="not_read_msg_num">{{newsAll.count+newsAll.user_count+newsAll.draw_count}}</text>条未读消息
				</view>
				<view class="right_clear_msg" @click="clearnotread()">
					<image class="clear_btn_icon" src="/static/freedraw/msg/delete2x.png" mode="aspectFit"></image>
					<text class="clear_btn_text">清除未读</text>
				</view>
			</view>

			<view class="msg_list">
				<!-- 抽奖 -->
				<view class="list_item" @click="toseeMsg(newsAll.drawsum,-1,2)">
					<view class="left_icon_text">
						<image class="msg_icon" src="/static/icon/draw.png" mode="widthFix"></image>
						<view class="msg_text">
							<view class="msg_title_box">
								<view class="msg_title">
									抽奖活动开奖消息
								</view>
								<view class="right_time">
									{{newsDraw}}
								</view>
							</view>

							<view class="msg_info_box">
								<view class="msg_info">
									{{newsAll.drawsum.content}}
								</view>
								<view v-if="newsAll.draw_count>0?true:false" class="not_read_tishi">
									{{newsAll.draw_count}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 好友助力 -->
				<view class="list_item" @click="toseeMsg(newsAll.usersum,-1,1)">
					<view class="left_icon_text">
						<image class="msg_icon" src="/static/icon/help.png" mode="widthFix"></image>
						
						<view class="msg_text">
							<view class="msg_title_box">
								<view class="msg_title">
									任务宝助力消息
								</view>
								<view class="right_time">
									{{newsHelp}}
								</view>
							</view>
						
							<view class="msg_info_box">
								<view class="msg_info">
									{{newsAll.usersum.content}}
								</view>
								<view v-if="newsAll.user_count>0?true:false" class="not_read_tishi">
									{{newsAll.user_count}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 系统消息 -->


				<view class="list_item" v-for="(item,index) in msgs" :key="index" @click="toseeMsg(item,index)">
					<view class="left_icon_text">
						<image class="msg_icon" :src="(item.image == '' ? '../../static/freedraw/msg/order2x.png' : item.image)" mode="widthFix"></image>
						<view class="msg_text">
							<view class="msg_title_box">
								<view class="msg_title">
									{{item.title}}
								</view>
								<view class="right_time">
									{{item.addtime}}
								</view>
							</view>

							<view class="msg_info_box">
								<view class="msg_info">
									{{item.content}}
								</view>
								<view v-if="item.status == 0" class="not_read_tishi_system"></view>
							</view>
						</view>
					</view>



				</view>
				
			</view>
			<loading :loadingMore="loadingMore" :noMoreData='noMoreData' :noData='noData'></loading>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				not_read_num: '10',
				isnomsg: false,
				newsAll: {
					count: 0,
					user_count: 0,
					draw_count: 0,
					usersum: {
						addtime: '',
						title: '',
						content: ''
					},
					drawsum: {
						addtime: '',
						title: '',
						content: ''
					}
				},
				newsHelp: '',
				newsDraw: '',
				type: 0,
				
				loadingMore: false,
				noMoreData: false,
				noData: false,
				paging: 1,
				
				msgs: [],
			};
		},
		onShow() {
			this.getNews()
		},
		mounted() {
			// 判断是否登录
			if (!ajax.isLogin()) {
				uni.$on('login', (res) => {
					this.init()
				})
			} else {
				this.init()
			}
		},
		methods: {
			init(){
				this.msgs = []
				this.getNewsList()
			},
			// 获取所有未读消息
			getNews() {
				ajax.get({
					url: 'UserLuckyNews/getSum',
				}).then(res => {
					if (res.data.code == 200) {
						this.newsAll = res.data.data
						if (typeof res.data.data.usersum.addtime != 'undefined') {
							this.newsHelp = (this.happenTimeFun(res.data.data.usersum.addtime))
							this.newsDraw = (this.happenTimeFun(res.data.data.drawsum.addtime))
						}
						this.newsHelp = ''
						this.newsDraw = ''
					}
				}).catch(err => {})
			},

			// 清楚未读消息
			clearnotread() {
				this.msgs.forEach(item => {
					item.status = -1
				})
				ajax.post({
					url: 'UserLuckyNews/setStatusList',
				}).then(res => {
					this.getNews()
				}).catch(err => {})
			},

			happenTimeFun(num) { //时间戳数据处理
				let date = new Date(num * 1000);
				//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM; //月补0
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d; //天补0
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h; //小时补0
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m; //分钟补0
				let s = date.getSeconds()
				s = s < 10 ? ('0' + s) : s; //秒
				return y + '/' + MM + '/' + d + ' ' + h + ':' + m; //年月日

			},
			// 获取消息列表
			getNewsList() {
				// this.msgs = [];
				this.loadingMore = true;
				this.noMoreData = false;
				ajax.get({
					url: 'UserLuckyNews/getList',
					data: {
						types: 0,
						page:this.paging,
						size:10,
					}
				}).then(res => {
					if (res.data.code == 200) {
						console.log('消息列表',res);
						if(res.data.data.endPage == true){
							this.paging--;
							if(res.data.data.list.length == 0){
								this.noData = true;
							}else{
								if(this.msgs.length == 0){
									res.data.data.list.forEach(item => {
										item.addtime = this.happenTimeFun(item.addtime);
										this.msgs.push(item);
									})	
								}
								this.noData = false;
								this.noMoreData = true;
							}
						}else{
							res.data.data.list.forEach(item => {
								item.addtime = this.happenTimeFun(item.addtime);
								this.msgs.push(item);
							})
							this.noData = false;
						}
							// if (res.data.data.list.length > 0) {
							// 	res.data.data.list.forEach(item => {
							// 		item.addtime = this.happenTimeFun(item.addtime)
							// 		this.msgs.push(item)
							// 	})
							// 	this.isnomsg = true
							// }
							// if (res.data.data.list.length) {
							// 	this.paging++
							// } else {
							// 	if (this.paging == 1 && res.data.data.list.length == 0) {
							// 		this.noMoreData = true
							// 		this.noDataCont = true
							// 		this.noData = true
							// 	} else {
							// 		this.noMoreData = true
							// 	}
							// }
					}
					this.loadingMore = false;
				}).catch(err => {
					this.loadingMore = false;
				})
			},

			// 单个已读消息
			getOneNes(index) {
				if (index != -1) {

					ajax.post({
						url: 'UserLuckyNews/setStatusInfo',
						data: {
							id: this.msgs[index].id
						}
					}).then(res => {}).catch(err => {})
				}
			},
			// 点击消息
			toseeMsg(item, index,type) {
				utils.newJump(item)
				this.getOneNes(index)
				// 系统消息处理
				if (item.status == 0) {
					item.status = 1
					this.newsAll.count--
				}
				if(typeof type != 'undefined'){
						ajax.post({
							url: 'UserLuckyNews/setStatusList',
							data:{
								types:type
							}
						}).then(res => {
						}).catch(err => {})
				}
				
			},
		},
		onReachBottom() {
			this.paging++;
			this.getNewsList();
		},
		//获取用户信息
		computed: {}
	}
</script>

<style lang="less">

	.msg_box {
		padding: 0 30rpx 30rpx;

		.msg_top {
			padding: 30rpx 0;
			display: flex;
			justify-content: space-between;

			.not_read_msg {
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #666666;
				white-space: 4rpx;

				.not_read_msg_num {
					color: #FE312C;
					font-size: 34rpx;
				}
			}

			.right_clear_msg {
				display: flex;

				// align-items: center;
				.clear_btn_icon {
					width: 26rpx;
					height: 26rpx;
					margin-right: 4rpx;
				}

				.clear_btn_text {
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #999999;
				}
			}
		}

		.msg_list {
			background-color: #FFFFFF;
			border-radius: 24rpx;
			padding: 0rpx 20rpx;

			.list_item {

				padding: 30rpx 0;
				border-bottom: 2rpx solid #F4F4F4;

				.left_icon_text {
					display: flex;
					align-items: center;

					.msg_icon {
						width: 80rpx;
						border-radius: 50%;
						margin-right: 18rpx;
						flex-shrink: 0;
					}

					.msg_text {
						width: 100%;

						.msg_title_box {
							display: flex;
							justify-content: space-between;

							.msg_title {
								max-width: 55%;
								height: 30rpx;
								display: -webkit-box;
								overflow: hidden;
								text-overflow: ellipsis;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								font-size: 28rpx;
								font-weight: bold;
								color: #111111;
								margin-bottom: 10rpx;
							}

							.right_time {
								font-size: 20rpx;
								font-weight: 500;
								color: #888888;
							}
						}

						.msg_info_box {
							display: flex;
							justify-content: space-between;

							.msg_info {
								font-size: 20rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: #888888;
								max-width: 90%;
								display: -webkit-box;
								overflow: hidden;
								text-overflow: ellipsis;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								line-height:2;
							}

							.not_read_tishi_system {
								width: 12rpx;
								height: 12rpx;
								border-radius: 50%;
								background-color: #FE322C;
							}
						}

					}
				}

				.not_read_tishi {
					text-align: center;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background-color: #FE322C;
					font-size: 24rpx;
					line-height: 30rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}

			.list_item:last-child {
				border-bottom: 0rpx;
			}
		}

		.no_more_msg {
			text-align: center;
			margin-top: 30rpx;

			.no_more_msg_text {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #9A9A9A;
			}
		}
	}
</style>
