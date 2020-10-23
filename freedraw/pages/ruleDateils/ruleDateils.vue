<template>
	<view class="tbody">
		<image @load="load" :src="type=='motion'?'https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/sport.png':'https://coubei.oss-cn-hangzhou.aliyuncs.com/funcard/index/card.png'" mode="widthFix"></image>
	</view>
</template>
<script>
	import loading from '../../components/loading/loading.vue'
	export default {
		components:{loading},
		onLoad: function(option) {
			this.type = option.type
			my.showLoading()
		},
		data() {
			return {
				loading:true,
				type:''
			}
		},
		methods: {
			load(){
				my.hideLoading()
			}
		}
	}
</script>

<style lang="less">
.tbody{
	height: 100vh;
	image{
		width: 750rpx;
	}
	::-webkit-scrollbar {
	  display: none; /* Chrome Safari */
	}
}
</style>
