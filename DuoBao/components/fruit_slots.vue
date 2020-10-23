<template>
	<view :class="'fruit-slots '+className">
		<view class="lt-item-list" :style="'width:'+width+'rpx;height:'+width+'rpx'">
			<block v-for="(item,index) in prizeList" :key="index">
				<view :class="'lt-item '+(index === activeIndex ? 'lt-active' : '')" :style="'width:'+itemWidth+'rpx;'+'height:'+itemWidth+'rpx;'+'margin:'+margin+'rpx 0 0 '+margin+'rpx'">
					<image :src="item.icon" mode="widthFix" style="width:100%" />
					<!-- <text style="display: block;font-size: 24rpx;color: #333;text-align: center;">{{item.name}}</text> -->
				</view>
				<view key="btn" v-if="index==3" :class="'lt-item lt-button '+(disabled ? 'disabled' : (isRolling ? 'pause' : ''))"
				 :style="'width:'+itemWidth+'rpx;'+'height:'+itemWidth+'rpx;margin:'+margin+'rpx 0 0 '+margin+'rpx'" @click="start" />
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			width: {
				default: 700
			}, // 组件宽度，单位 rpx
			margin: {
				default: 20
			}, // 奖项之间的外边距，单位 rpx
			prizeList: {
				default: []
			}, // 奖项列表，个数限定为8
			prizeName: {
				default: ''
			}, // 获奖项名称
			rollTimes: {
				default: 3
			}, // 转动圈数
			currentIndex: {
				default: 0
			}, // 转动开始的下标
			speed: {
				default: 100
			}, // 转动速度, 单位 ms
			'className': {
				default: ''
			}, // 自定义类名
			disabled: {
				default: false
			}, // 按钮是否可点击
		},
		data() {
			return {
				activeOrder: [0, 1, 2, 4, 7, 6, 5, 3], // 九宫格除按钮外的8个格子自左上角顺时针的下标顺序
				activeIndex: NaN,
				itemWidth: 0,
				isRolling: false
			};
		},
		mounted() {
			this.prizeLength = 8;
			// 必须要取整，否则部分机型下有适配问题
			this.itemWidth = parseInt((this.width - 4 * this.margin) / 3)
		},
		methods: {
			next(activeIndex) {

				activeIndex = activeIndex % this.prizeLength;
				this.activeIndex = this.activeOrder[activeIndex]
				if (this.currentStep === this.totalSteps) {
					this.done(activeIndex);
					return;
				}
				this.currentStep += 1;
				setTimeout(() => {
					this.next(++activeIndex);
				}, this.speedCtl());
			},

			/**
			  模拟速度变化，分为四档
			  当走过格子数 < 总步数 - 2圈格子数时，速度为speed
			  以此线性递增
			*/
			speedCtl() {
				var steps = this.totalSteps;
				var size = this.prizeLength;
				var currentStep = this.currentStep;
				if (currentStep < steps - size * 2) {
					return this.speed;
				} else if (steps - size * 2 <= currentStep && currentStep <= steps - size) {
					return this.speed * 2;
				} else if (steps - currentStep > 3) {
					return this.speed * 3;
				} else {
					return this.speed * 4;
				}
			},

			/**
			  通过名称获取奖品项在顺时针格子中对应的下标
			  未找到返回-1
			*/
			findPrizeIndex(name) {
				var prizeList = this.prizeList;
				var order = this.activeOrder;
				for (var i = 0; i < this.prizeLength; i++) {
					if (prizeList[order[i]].name === name) {
						return i;
					}
				}
				return -1;
			},
			start() {
				if (this.disabled || this.isRolling) return;
				if (this.prizeList.length !== 8) {
					throw new Error('奖品项列表 prizeList 长度不为8');
				}
				var activeIndex = +this.currentIndex || 0;
				// 奖品项下标
				var prizeIndex = this.findPrizeIndex(this.prizeName);
				if (prizeIndex === -1) {
					throw new Error('请传入正确的获奖项name，其值必须存在于 prizeList name 字段中');
				}
				// 总转动步数 = 默认圈数 x 奖品个数 + 结束位置索引 + 当前位置到一圈结束还剩下的步数
				this.totalSteps = this.rollTimes * this.prizeLength + prizeIndex + (this.prizeLength - activeIndex);
				this.currentStep = 0;
				this.isRolling = true
				this.next(activeIndex);
				this.$emit("start")
			},
			done(activeIndex) {
				// setTimeout防止抽奖结束后父组件设置disabled=true的过程中用户马上再次点击抽奖 此时 disabled 和 isRolling
				// 状态还没来得及更新，start 函数可能被执行
				setTimeout(()=> {
					this.isRolling = false
				}, 50);
				this.$emit("finish", {
					activeIndex,
					prizeName: this.prizeName
				})
			}
		}
	}
</script>

<style lang="scss">
	.lottery-desk {}

	.lt-item-list {
		background: rgb(220,52,36);
		padding: 20rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.lt-item {
		padding: 13rpx;
		float: left;
		display: inline-block;
		background-repeat: no-repeat;
		background-position: left top;
		box-sizing: border-box;
		border-radius: 33rpx;
	}

	// .lt-item:nth-child(1) {
	// 	background-color: #c3ebfa;
	// }

	// .lt-item:nth-child(2) {
	// 	background-color: #eff1dd;
	// }

	// .lt-item:nth-child(3) {
	// 	background-color: #f1d6dc;
	// }

	// .lt-item:nth-child(4) {
	// 	background-color: #f1d6dc;
	// }

	// .lt-item:nth-child(5) {
	// 	background-color: #2683fc;
	// 	border: none;
	// }

	// .lt-item:nth-child(6) {
	// 	background-color: #c3ebfa;
	// }

	// .lt-item:nth-child(7) {
	// 	background-color: #eff1dd;
	// }

	// .lt-item:nth-child(8) {
	// 	background-color: #c3ebfa;
	// }

	// .lt-item:nth-child(9) {
	// 	background-color: #f1d6dc;
	// }

	.lt-item:nth-child(1),
	.lt-item:nth-child(4),
	.lt-item:nth-child(7) {
		margin-left: 0 !important;
	}

	.lt-item:nth-child(1),
	.lt-item:nth-child(2),
	.lt-item:nth-child(3) {
		margin-top: 0 !important;
	}

	.lt-active {
		background-repeat: no-repeat;
		background-position: left top;
		box-sizing: border-box;
		background-color: rgb(245,230,70) !important;
		border-color: rgb(245,230,70);
	}

	.lt-button {
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
		animation: dong .8s infinite;
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/12ffe03ae88180c34247a6f1bb91b388.png);
	}

	.lt-button.disabled {
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/01a7ab96980ec401e78c35e2b30066f0.png);
		animation:none;
	}

	.lt-button.pause {
		background-image: url(https://coubei.oss-cn-hangzhou.aliyuncs.com/upload/6e1c106d4439e58effd9e1e78e7b2730.png);
		animation:none;
	}
	
	// 动画
	@keyframes dong {
		0% {
			background-size: 80%;
		}
		50% {
			background-size: 100%;
		}
		100% {
			background-size: 80%;
		}
	}
</style>
