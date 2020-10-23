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
			if(typeof option.type != 'undefined' && option.type == 'url'){
				my.ap.navigateToAlipayPage({
					path:encodeURIComponent('https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FsaId%3D20000067%26url%3D' + 
					encodeURIComponent(option.url))
				});
				if (typeof option.back != 'undefined' && option.back == '1') {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			}else{
				this.url = option.url
			}
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