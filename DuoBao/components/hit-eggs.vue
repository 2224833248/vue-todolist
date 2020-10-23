<template>
	<view class="eggs-container" :class="isSmashing ? 'smashing' : ''">
		<view class="eggs" :style="{width: eggWidth*eggCol + 'rpx'}">
			<view v-for="(item,index) in list">
				<view class="egg" :class="activeIndex === index ? 'jumping' : ''" :style="{'width':eggWidth+'rpx','height':eggWidth + 'rpx','margin-top': eggMarginTop + 'rpx'}"
				 :key="index">
					<view v-if="item===STATE_STILL" @click="onHiting" :data-index="index">
						<image :src="eggIcon" mode="widthFix" style="width:100%" />
					</view>
					<view v-else-if="item===STATE_BROKEN">
						<image :src="smashedIcon[index]" mode="widthFix" style="width:100%" />
					</view>
					<view v-else-if="item===STATE_JUMPING" @click="onHiting" :data-index="index">
						<image :src="jumpIcon" mode="widthFix" style="width:100%;margin-top:-10%" />
					</view>
					<view v-else>
						<image :src="redBagIcon" mode="widthFix" style="width:100%;" />
					</view>
				</view>
			</view>
		</view>
		<view class="hammer" :class="hammerMace ? 'mace' : ''" :style="{'top':(hammerPosY || hammerOriginY) + 'rpx','right':(hammerPosX || hammerOriginX) + 'rpx'}">
			<image :src="hammerIcon" mode="widthFix" :style="{'width':hammerWidth+'rpx'}" />
		</view>
	</view>
</template>

<script>
	export default  {
		data() {
			return {
				list: [],
				hammerMace: false,
				isSmashing: false,
				activeIndex: -1,
				hammerPosX: 0,
				hammerPosY: 0,
				// 以下数字标识金蛋状态
				STATE_BROKEN: 0, // 已经砸过
				STATE_STILL: 1, // 静止不动
				STATE_JUMPING: 2, // 正在跳动
				STATE_SMASHING: 3, // 正在被砸
				lock:false,
			}
		},
		props: {
			eggWidth: {default:150}, // 金蛋大小，单位 rpx
			eggCol: {default:3}, // 金蛋列数
			eggsCount: {default:9}, // 金蛋个数
			hammerWidth: {default:100}, // 锤子大小， 单位 rpx
			eggMarginTop: {default:20}, // 金蛋上边距
			hammerOriginX: {default:-20}, // 锤子原点距离组件右上顶点的偏移 X，左正右负，单位 rpx
			hammerOriginY: {default:0}, // 锤子原点距离组件右上顶点的偏移 Y，下正上负，单位 rpx
			jumpingInterval: {default:600}, // 金蛋跳动间隔，单位 ms
			smashingDuration: {default:1500}, // 砸金蛋持续时间，单位 ms
			className: {default:''}, // 自定义类名
			disabled: {
				type: Boolean,
				default: false
			}, // 是否进行游戏
			hammerIcon: {default:'https://gw.alipayobjects.com/zos/rmsportal/XgogyVJXSBVXPxbTOFDK.png'}, // 锤子图标
			eggIcon: {default:'https://gw.alipayobjects.com/zos/rmsportal/TaqyxvdUFYgIwFxMuaRL.png'}, // 金蛋图标
			jumpIcon: {default:'https://gw.alipayobjects.com/zos/rmsportal/mTqmImAsoDZNmkdvuooP.png'}, // 金蛋跳动的图标
			redBagIcon: {default:'https://gw.alipayobjects.com/zos/rmsportal/OgfiOSzclCukkGfwbaGw.png'}, // 金蛋被砸的图标
			smashedIcon: {default:[]} // 金蛋砸碎的图标
		},
		mounted() {
			var list = [];
			for (var i = 0; i < this.eggsCount; i++) {
				list.push(1);
			}
			this.list= list
			this.run(); 
		},
		didUpdate: function didUpdate(prevProps) {
			if (this.disabled) {
				this.stop();
			} else if (prevProps.disabled) {
				this.run();
			}
		},

		methods: {
			run: function run() {
				if (this.disabled) return;
				if (!this.hammerTimer) {
					this.eggsTimer = this.jumping(this.jumpingInterval); // 金蛋跳动
					this.hammerTimer = this.maceAnim(400);
				}
			},
			jumping: function jumping(ts) {
				var _this = this;

				// 金蛋跳动
				return setInterval(function() {
					var list = _this.list;
					var aIndex = _this.activeIndex; // 当前跳起的金蛋下标 activeIndex
					var cIndex = (aIndex + 1) % list.length; // 金蛋下标 currentIndex
					// 获取下一个没有被砸的金蛋的下标
					for (var i = 0; i < list.length; i++) {
						if (list[cIndex] === 1) {
							list[cIndex] = _this.STATE_JUMPING;
							list[aIndex] === _this.STATE_JUMPING && (list[aIndex] = _this.STATE_STILL);
							
							_this.list= list,
							_this.activeIndex= cIndex
							break;
						}
						cIndex = (cIndex + 1) % list.length;
					}
				}, ts);
			},
			onHiting(e) {
				if(this.disabled){
					uni.showToast({
						title: '今日次数已用完，明日再来',
					});
					return 
				}
				if(this.lock) return
				this.lock = true
				setTimeout(()=>{
					this.lock = false
				}, this.smashingDuration);
				
				for (var i = 0; i < this.list.length; i++) {
					if(this.list[i] === 2) this.list[i] = 1
				}
				this.activeIndex = e.currentTarget.dataset.index
				!this.disabled && this.start();
			},
			maceMoving: function maceMoving() {
				// 锤子移动到金蛋位置
				// 计算锤子移动的目标位置
				var index = this.activeIndex;
				var col = +this.eggCol;
				var eggWidth = +this.eggWidth;
				var hammerWidth = +this.hammerWidth;
				var marginTop = +this.eggMarginTop;

				var offsetX = 0.3 * (eggWidth - hammerWidth);
				var offsetY = 0.3 * (eggWidth - hammerWidth);
				var x = ((col - 1 - index % col) * eggWidth + offsetX) * 1;
				var y = (Math.floor(index / col) * (eggWidth + marginTop) + offsetY) * 1;
				this.hammerPosX= x
				this.hammerPosY= y
			},
			hammerHoming: function hammerHoming() {
				// 锤子归位
				this.hammerPosX= this.hammerOriginX,
				this.hammerPosY= this.hammerOriginY
			},
			maceAnim: function maceAnim(ts) {
				var _this2 = this;

				// 锤子动画
				return setInterval(function() {
					_this2.hammerMace= !_this2.hammerMace
				}, ts);
			},
			smashing: function smashing() {
				// 砸金蛋过程
				var list = this.list;
				var index = this.activeIndex;
				list[index] = this.STATE_SMASHING;
				// 设置红包金蛋背景
				this.list= list
			},
			brocken: function brocken() {
				// 金蛋砸碎
				var index = this.activeIndex;
				this.list[index] = this.STATE_BROKEN;
				this.list= this.list
			},
			clear: function clear() {
				clearInterval(this.eggsTimer);
				clearInterval(this.hammerTimer);
				this.hammerTimer = this.eggsTimer = null;
			},
			stop: function stop() {
				// 中止游戏
				this.clear();
			},
			start() {
				// 开始砸蛋
				this.clear();
				this.maceMoving();
				this.smashing();
				this.hammerTimer = this.maceAnim(80);
				this.isSmashing= true
				setTimeout(()=> {
					this.done();
				}, this.smashingDuration);
				this.$emit('start',[this.activeIndex])
			},
			done() {
				// 结束砸蛋
				this.brocken();
				this.clear();
				this.hammerHoming();
				this.isSmashing = false
				setTimeout(()=>{
					this.run();
				}, 500);
				this.$emit('finish')
			}
		},
		// watch: {
		//   disabled(val) {
		// 	if (val) {
		// 		this.stop();
		// 	}
		//   }
		// }
	}
</script>

<style>
	.eggs-container {
		position: relative;
		width: 100%;
	}

	.eggs-container .hammer {
		position: absolute;
		top: 0;
		right: 10%;
		z-index: 1;
		-webkit-transform-origin: right bottom;
		transform-origin: right bottom;
		-webkit-transform: rotate(15deg);
		transform: rotate(15deg);
	}

	.eggs-container .mace {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}

	.eggs-container .eggs {
		overflow: hidden;
		margin: 0 auto;
	}

	.eggs-container .eggs .egg {
		float: left;
	}

	.eggs-container .eggs,
	.eggs-container .eggs .egg {
		position: relative;
	}

	.eggs-container .hammer,
	.eggs-container .eggs .egg {
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>
