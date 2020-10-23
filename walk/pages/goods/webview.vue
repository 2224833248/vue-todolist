<template>
	<view>
		<web-view id="web-view-1" @message="onMessage" :src="url"></web-view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(option) {
			this.url=option.url;
		},
		mounted() {
			this.webViewContext = my.createWebViewContext('web-view-1');
		},
		methods: {
			onMessage(e){
				if(e.detail.name=='getaliuid'){
					this.postCall(e.detail.callId,this.aliuid);
				}else if(e.detail.name=='console'){
					console.info(e.detail.arg);
				}
			},
			postCall(cid,data){
				this.webViewContext.postMessage({callId:cid,data:data});
			}
		},
		computed:{
			aliuid(){
				return typeof(this.$store.state.user.alipay_uid) !== 'undefined'?this.$store.state.user.alipay_uid:0
			}
		}
	}
</script>

<style>

</style>
