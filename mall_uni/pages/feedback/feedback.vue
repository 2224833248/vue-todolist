<template>
	<view class="tbody">
		<view class="cont">
			<view class="cont-lable">
				<view class="cont-lable-title">选择标签</view>
				<view class="cont-lable-list">
					<view class="listItem" :class="{tables:tableAct == index}" v-for="(item,index) in labble" @click="isTable(index)"
					 :key='index'>{{item.type_name}}</view>
				</view>
			</view>
			<!-- TO-DO 填写意见 -->
			<view class="opinion">
				<view class="opinion-title">填写意见</view>
				<view class="opinion-issue">
					<textarea v-model="postCont" value="" auto-height='true' placeholder="请在此描述问题" maxlength="200" />
				</view>
				<view class="opinion-uploading">
					<view class="opinion-uploading-item">
						<!-- <image :src="imgUrl" mode="aspectFill"></image> -->
						<view class="imgBox" v-for="(item,index) in imgUrl" :key='index'>
							<image :src="item" mode="aspectFill"></image>
							<view class="delet" @click="deletImg(index)"></view>
						</view>
						<view class="uploading" @click="uploadFile"></view>
					</view>
				</view>
			</view>
			<view class="opinBtn" @click="postBtn">确认提交</view>
		</view>
	</view>
</template>

<script>
	// import Header from '../../components/head/head.vue'
	import ajax from '../../utils/ajax.js'
	export default {
		// components: {
		// 	Header
		// },
		data() {
			return {
				tableAct:0,
				imgUrl:[],
				labble:[],
				postId:0,
				postCont:''
			}
		},
		methods:{
			isTable(index){
				this.tableAct = index
				this.postId = this.labble[index].type_id
			},
			uploadFile() {
					my.chooseImage({
					  chooseImage: 1,
					  success: res => {
						const path = res.apFilePaths[0]
						ajax.upload({
							url:'Base/upload',
							path:path,
						}).then((rest)=>{
							let obj = JSON.parse(rest.data);
							if(obj.code == 200){
								this.imgUrl.push(obj.data)
							}
						})
					},
				});
			},
			deletImg(index){
				this.imgUrl.splice(index,1)
			},
			// 意见列表请求
			getLabel(){
				ajax.get({
					url:'feedback/gettype'
				}).then((res) => {
					if(res.data.code == 200){
						this.labble = res.data.data
						this.postId = this.labble[0].type_id
					}
				}).catch((err) => {})
			},
			// 数据提交意见请求
			postBtn(){
				ajax.post({
					url:'feedback/addpost',
					data:{
						channel:1,
						type_id:this.postId,
						content:this.postCont,
						images:JSON.stringify(this.imgUrl)
					}
				}).then((res) => {
					uni.showToast({
					    title:res.data.msg
					})
					if(res.data.code == 200){
						this.postCont = ''
						this.imgUrl = []
					}
				}).catch((err) => {
					
				})
			}
		},
		created() {
			this.getLabel();			
		}
	}
</script>

<style lang="less">
	.tbody {
		.cont {
			&-lable {
				background: #fff;
				padding-bottom: 30rpx;
				&-title {
					font-size: 30rpx;
					color: #333;
					font-weight: bold;
					padding: 44rpx 0 16rpx 30rpx;
				}

				&-list {
					display: flex;
					flex-wrap: wrap;
					max-width: 420rpx;

					.listItem {
						margin: 0 30rpx;
						margin-top: 24rpx;
						width: 150rpx;
						height: 58rpx;
						background-color: #f7f7f7;
						border-radius: 29rpx;
						text-align: center;
						color: #333;
						font-size: 24rpx;
						line-height: 58rpx;
					}
					.tables{
						color: #fff;
						background: #ff5f5b;
					}
				}
			}
			.opinion{
				margin-top: 20rpx;
				background:#fff;
				padding-bottom: 200rpx;
				&-title{
					font-size: 30rpx;
					color: #333;
					font-weight: bold;
					padding: 44rpx 0 0 30rpx;
				}
				&-issue{
					padding:40rpx 30rpx;
					textarea{
						padding: 0;
						margin: 0;
						padding-bottom: 30rpx;
						font-size: 26rpx;
					}
					span{
						display: none;
					}
				}
				&-uploading{
					padding: 0 30rpx;
					&-item{
						// width:180rpx;
						// height:180rpx;
						// border-radius: 14rpx;
						// overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						.imgBox{
							position: relative;
							margin-right: 20rpx;
							image{
								width:180rpx;
								height:180rpx;
							}
							.delet{
								position: absolute;
								top: 7rpx;
								right: 6rpx;
								width: 34rpx;
								height: 34rpx;
								background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/feedback/delet.png)no-repeat;
								background-size: 100% 100%;
							}
						}
						.uploading{
							width:180rpx;
							height:180rpx;
							background: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/taoniupin/feedback/upload.png)no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
			.opinBtn{
				position: fixed;
				bottom: 0;
				width: 100%;
				height: 80rpx;
				background-image: linear-gradient(90deg, 
					#ff6662 0%, 
					#ff423e 100%);
				border-radius: 30rpx 30rpx 0rpx 0rpx;
				text-align: center;
				line-height: 80rpx;
				color: #fff;
				font-size: 32rpx;
			}
		}
	}
</style>
