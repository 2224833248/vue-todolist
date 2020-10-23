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
