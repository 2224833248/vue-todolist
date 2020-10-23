<template>
	<view>
		<view class="ui-loadmore" v-show="loadingMore">
			<view class="ui-loading"></view>
			<view class="ui-loadmore__tips">正在加载</view>
		</view>
		<view class="ui-loadmore ui-loadmore_line" v-show="(!loadingMore && !noMoreData)">
			<view class="ui-loadmore__tips ui-loadmore__tips_in-line">上拉加载</view>
		</view>
		<view class="ui-loadmore ui-loadmore_line" v-show="(noMoreData && !noData)">
			<view class="ui-loadmore__tips ui-loadmore__tips_in-line">就这些儿了</view>
		</view>
		<view class="ui-loadmore ui-loadmore_line" v-show="noData">
			<view class="ui-loadmore__tips ui-loadmore__tips_in-line">啥都没有啊~~</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading:false
			}
		},
		props:{
			loadingMore: {
				type: Boolean,
				default: false
			},
			noMoreData: {
				type: Boolean,
				default: false
			},
			noData: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
