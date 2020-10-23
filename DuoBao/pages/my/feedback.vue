<template>
	<view class="tbody">
		<view class="cont" v-if="succeed">
			<view class="cont-lable">
				<view class="cont-lable-title">选择标签</view>
				<view class="cont-lable-list">
					<view class="listItem" :class="{tables:tableAct == index}" v-for="(item,index) in labble" @click="isTable(index)"
					 :key='index'>{{item.type_name}}</view>
				</view>
			</view>
			<!-- TO-DO 填写建议 -->
			<view class="opinion">
				<view class="opinion-title">填写建议</view>
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
		<view class="over" v-else>
			<image src="/static/icon/succeed.png" mode="widthFix"></image>
			<view class="text">反馈成功</view>
			<view class="text">客服将在24小时给您答复！请您耐心等待～</view>
			<view class="btn" @click="overBtn">确定</view>
		</view>
	</view>
</template>

<script>
	import ajax from '../../utils/ajax.js'
	let lock = false;
	export default {
		data() {
			return {
				tableAct:0,
				imgUrl:[],
				labble:[],
				postId:0,
				postCont:'',
				succeed:true
			}
		},
		methods:{
			overBtn(){
				uni.navigateBack()
				this.succeed = true
			},
			isTable(index){
				this.tableAct = index
				this.postId = this.labble[index].type_id
			},
			uploadFile() {
				if(this.imgUrl.length >= 6){
					uni.showToast({
						title:'最多上传6张图片!'
					})
				}else{
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
				}

			},
			deletImg(index){
				this.imgUrl.splice(index,1)
			},
			// 建议列表请求
			getLabel(){
				ajax.get({
					url:'News/getType'
				}).then((res) => {
					if(res.data.code == 200){
						this.labble = res.data.data
						this.postId = this.labble[0].type_id
					}
				}).catch((err) => {})
			},
			// 数据提交建议请求
			postBtn(){
				if(lock) return;
				lock = true
				setTimeout(res=>{
					lock = false
				},3000)
				ajax.post({
					url:'News/addPost',
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
						this.succeed = false
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
		padding-bottom: 158rpx;
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
						background: #2892F3;
					}
				}
			}
			.opinion{
				margin-top: 20rpx;
				background:#fff;
				padding-bottom: 30rpx;
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
				width: 690rpx;
				height: 80rpx;
				background:#2892F3;
				border-radius: 40rpx;
				text-align: center;
				line-height: 80rpx;
				color: #fff;
				font-size: 32rpx;
				margin: 140rpx auto 0;
			}
		}
		.over{
			padding-top: 127rpx;
			text-align: center;
			image{
				width: 136rpx;
				margin-bottom: 50rpx;
			}
			.text{
				font-size: 32rpx;
				color: #343434;
				line-height: 85rpx;
				text-align: center;
			}
			.btn{
				width: 640rpx;
				height: 78rpx;
				background: #349EF9;
				border-radius: 39rpx;
				font-size: 32rpx;
				color: #FFFFFF;
				line-height: 78rpx;
				margin: 85rpx auto 0;
			}
		}
	}
</style>
