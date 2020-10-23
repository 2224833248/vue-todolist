<template>
	<view>
		<task-list ref="task" tag="@all" :isFilters="true"></task-list>
	</view>
</template>

<script>
	import taskList from '@/components/task-list/task-list.vue'
	export default {
		components:{
			taskList
		},
		data() {
			return {
				
			};
		},
		onShow() {
			if(typeof(this.$refs.task)!='undefined'){
				this.$refs.task.completeTask()
			}
		},
		onShareAppMessage() {
			if (this.isLogin) {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index?invite_id=' + this.user.uid,
				};
			} else {
				return {
					title: '打卡赚现金',
					desc: '坚持早起,坚持运动,就能赢取红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/09/19/21/7ed58b0da11719af5eb6bda128d010a1.png',
					path: '/pages/index/index',
				};
			}
		},
		mounted() {
			if(!this.isLogin){
				ajax.login()
			}
		},
		methods:{
			onShowSharePanelTap(){
				my.showSharePanel();
			}
		},
		computed:{
			isLogin() {
				return typeof(this.$store.state.user.uid) !== 'undefined';
			},
			user() {
				return this.isLogin ? this.$store.state.user : {
					uid: 0
				};
			},
		}
	}
</script>

<style lang="less">
	.task-list {
			margin: 30rpx 30rpx 30rpx 30rpx;
			padding:0 25rpx;
			padding-bottom: 16rpx;
			border-radius: 14rpx;
			overflow: hidden;
			background-color: #fff;
			/deep/.task-list__item{
				padding-left:10rpx;
				padding-right:10rpx;
				border-radius: 10rpx;
				margin-bottom: 15rpx;
				.item__info{
					.item__info__hd__subtitle{
						view{
							font-size: 24rpx;
						}
					}
				}
			}
			/deep/.task-list__item ~ view {
				// border-top: 1px solid #ECECEC;
			}
			/deep/.task-list__item.complete{
				background-position:100% -50%!important;
				
			}
		}
		
</style>
