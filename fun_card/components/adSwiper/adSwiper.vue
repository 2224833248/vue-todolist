<template>
	<view v-if="Object.keys(adList).length > 0">
		<view class="adSwiper">
			<swiper class="swiper" :indicator-dots='true' :autoplay='true' :duration='300' :mode="mode">
				<swiper-item v-for="(item ,index) in adList" :key="index">
					<image :src="item.image" mode="widthFix" @click="adClick(item)"></image>
				</swiper-item>
			</swiper>			
		</view>
	</view>
</template>

<script>
	import ajax from "../../utils/ajax.js"
	import utils from '../../utils/utils.js' //vuex
	export default {
		data() {
			return {

			};
		},
		props: {
			tag: ''
		},
		methods: {
			// 点击广告
			adClick(ad) {
				ajax.post({
					url: 'ad/complete',
					data: {
						ad_id: ad.id
					}
				})
				console.info(ad)
				utils.adJump(ad, this);
			},
		},
		computed: {
			adList() {
				let tmp = [];
				if (this.tag == '@all') {
					let allList = {};
					for (let item of this.$store.state.adList) {
						if (item.key.indexOf('ubble') !== -1) {
							continue;
						}
						for (let item1 of item.value) {
							allList[item1.id] = item1;
						}
					}
					for (let item of allList) {
						tmp.push(item.value);
					}
				} else if (this.tag == '' || typeof(this.$store.state.adList[this.tag]) == 'undefined') {
					tmp = [];
				} else {
					tmp = this.$store.state.adList[this.tag];
				}
				if (this.tag != '@all') {
					if (tmp.length > this.size) {
						tmp = tmp.slice(0, this.size)
					}
				}
				return tmp;
			}
		}
	}
</script>

<style lang="less">
	.adSwiper {
		width: 100%;
		height: 180rpx;
		margin: 10rpx 0;

		.swiper {
			width: 750rpx !important;
			height: 180rpx !important;
			

			swiper-item {
				width: 100%;

				image {
					width: 100%;
					height: 180rpx;
				}
			}
		}
	}
</style>
