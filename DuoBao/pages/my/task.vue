<template>
	<view class="bg">
		<view class="task">
			<task-list ref="task" tag="@all" :isFilter="false" @share="onShowSharePanelTap"></task-list>
		</view>
	</view>
</template>

<script>
	import taskList from '@/components/task-list/task-list.vue'
	import ajax from "@/utils/ajax.js"
	export default {
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
			if (ajax.isLogin()) {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '天天夺宝',
					desc: '天天夺宝',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/08/01/18/ec8fe35058d77e821c7b3c86e70f5822.jpg',
					path: '/pages/index/index',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
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
		},
		components: {
			taskList
		},
	}
</script>

<style lang="scss" scoped>
	.bg{
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	.task{
		background-color: white;
		margin-top:10rpx;
		padding: 0 20rpx;
	}
</style>
