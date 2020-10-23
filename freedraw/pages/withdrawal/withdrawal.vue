<template>
	<view class="tbody">
		<view class="top_fenge">
			
		</view>
		<view class="question_box">
			<view @click="showMore(index)" :class="'question_item_box '+(item.isshowMore == false ? '' : 'question_item_box_showmore')" v-for="(item,index) in questions" :key="index">
				<view class="ques_icon">
					{{item.index}}
				</view>
				<view class="ques_text">
					<view class="ques_title">
						{{item.title}}
					</view>
					<view class="ques_info">
						{{item.info}}
					</view>
				</view>
				<view class="show_more">
					<image :class="'show_more_icon '+(item.isshowMore == false ? '' : 'showmore')" src="../../static/freedraw/my/right2x.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	import utils from '../../utils/utils.js'
	export default {
		data() {
			return {
				questions:[]
			};
		},
		//获取用户信息
		computed: {},
		created() {
			this.getdata();
		},
		methods:{
			showMore(index){
				this.questions[index].isshowMore == false ? this.questions[index].isshowMore = true : this.questions[index].isshowMore = false;
			},
			getdata(){
				ajax.get({
					url: 'Base/problem',
				}).then(res => {
					if (res.data.code == 200) {
						this.dataDeal(res.data.data);
					}
				}).catch(err => {})
			},
			dataDeal(data){
				this.questions = [],
				data.forEach((ele,index)=>{
					let msg = {
						title:ele.title,
						info:ele.count[0],
						index:`Q${index+1}`,
						isshowMore:false,
					}
					this.questions.push(msg)
				})
			},
		}
	}
</script>

<style lang="less">
	.tbody{
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	.top_fenge{
		height: 23rpx;
		width: 100%;
	}
	.question_box{
		flex: 1;
		background-color: #FFFFFF;
		.question_item_box{
			display: flex;
			padding: 30rpx 0 20rpx 30rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #EFEFEF;
			overflow: hidden;
			height: 110rpx;
			transition: all .3s;
			.ques_icon{
				// flex: 1;
				width: 70rpx;
				height: 64rpx;
				background: url(../../static/freedraw/my/ques_icon2x.png) no-repeat;
				background-size: 100%;
				text-align: center;
				
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				
				box-sizing: border-box;
				padding: 14rpx 0 0 0;
				
				margin-right: 29rpx;
			}
			.ques_text{
				flex: 5;
				.ques_title{
					font-size: 32rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #141414;
					margin-bottom: 49rpx;
				}
				.ques_info{
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #333333;
				}
			}
			.show_more{
				flex: 1;
				text-align: center;
				.show_more_icon{
					display: inline-block;
					width: 14rpx;
					height: 28rpx;
					transform: rotate(90deg);
					transition: all .3s;
				}
				.showmore{
					transform: rotate(270deg);
				}
			}
		}
		.question_item_box_showmore{
			height: auto;
		}
	}
</style>
