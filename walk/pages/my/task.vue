<template>
	<view class="bg">
		<view class="task">
			<task-list ref="task" tag="@all" :isFilter="false" :isFilters="true" @share="onShowSharePanelTap"></task-list>
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
			if (typeof(this.$refs.task) != 'undefined') {
				this.$refs.task.completeTask()
			}
		},
		onShareAppMessage() {
			if (ajax.isLogin()) {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk?invite_id=' + this.user.uid,
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			} else {
				return {
					title: '走路赚红包',
					desc: '走路赚红包',
					bgImgUrl: 'https://coubei.oss-cn-hangzhou.aliyuncs.com/new/2020/10/19/23/fcf7f8645ad8b0147d6146cb864819de.jpg',
					path: '/pages/walk/walk',
					success: () => {
						if (typeof(this.$refs.task) !== 'undefined') {
							this.$refs.task.completeTask();
						}
					}
				};
			}
		},
		mounted() {
			if (!this.isLogin) {
				ajax.login()
			}
		},
		methods: {
			onShowSharePanelTap() {
				my.showSharePanel();
			}
		},
		computed: {
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
	.bg {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.task {
		background-color: white;
		margin-top: 10rpx;
		padding: 0 20rpx;
	}
</style>
