<template>
	<view class="tab-box flex-1 text-right">
		<view @click="open">
			<image src="/static/book/arrow-up-right.png" class="arrow-tr-icon" />
			<text>分享给朋友</text>
		</view>
		<!-- <view @click="handlePreview">预览</view> -->
		<LiuPoster ref="liuPoster" :width="560" :height="768" @change="change"></LiuPoster>
	</view>
</template>

<script>
	import LiuPoster from "./components/liu-poster/liu-poster"
	export default {
		onLoad() {
			console.log("poster-onLoad");
		},
		components: {
			LiuPoster
		},
		props: {
			order: {
				type: [Object],
				default () {
					return {}
				}
			},
		},
		data() {
			return {
				canvasList: [],
				url: ''
			};
		},
		methods: {
			//开始绘制
			open() {
				const list = [{
					type: 'color', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 560, //宽度(rpx)
					height: 768, //高度(rpx)
					x: 0, //x轴位置(离左边的距离rpx)
					y: 0, //y轴位置(离上边的距离rpx)
					radius: 0, //圆角(rpx)
					lineWidth: 0, //边框宽度(rpx)
					lineColor: 'transparent', //边框颜色
					colorObj: {
						colorList: ['#151815'], //传入1个值为纯色，2个值为渐变色
						direction: 1 //渐变色绘制方向(1:从左到右;2:从上到下;3:左上角到右下角;4:右上角到左下角)
					}, //type为color时必填
				}, {
					type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
					width: 560, //宽度(rpx)
					height: 768, //高度(rpx)
					x: 0, //x轴位置(离左边的距离rpx)
					y: 0, //y轴位置(离上边的距离rpx)
					radius: 16, //圆角(rpx)
					lineWidth: 0, //边框宽度(rpx)
					lineColor: 'transparent', //边框颜色
					path: 'https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/shareback.png', //图片地址(type为image时必填)
					childs: [{
						type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 58, //宽度(rpx)
						height: 64, //高度(rpx)
						x: 240, //x轴位置(离左边的距离rpx)
						y: 60, //y轴位置(离上边的距离rpx)
						radius: 0, //圆角(rpx)
						lineWidth: 0, //边框宽度(rpx)
						lineColor: 'transparent', //边框颜色
						path: '/static/home/yan.png', //图片地址(type为image时必填)
					}, {
						type: 'line', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 4, //线条宽度(rpx)
						color: '#F06627', //线条颜色
						startX: 240, //起点x轴位置(离左边的距离rpx)
						startY: 200, //起点y轴位置(离上边的距离rpx)
						endX: 300, //终点x轴位置(离左边的距离rpx)
						endY: 200, //终点y轴位置(离上边的距离rpx)
						lineType: 'solid', //线条类型(solid:实线;dash:虚线)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 200, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 210, //x轴位置(离左边的距离rpx)
						y: 260, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 32, //文字大小(rpx)
						lineHeight: 36, //文字行高(rpx)
						bold: true, //文字是否加粗
						content: '预约信息', //文本内容(type为text时必填)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 400, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 140, //x轴位置(离左边的距离rpx)
						y: 310, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 28, //文字大小(rpx)
						lineHeight: 28, //文字行高(rpx)
						bold: false, //文字是否加粗
						content: `${new Date(this.order.dateInfo).getMonth()+1}月${new Date(this.order.dateInfo).getDate()}日 ${this.order.timeInfo===0?'17:30~18:30':'19:00 ~20:00'}`, //文本内容(type为text时必填)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 400, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 210, //x轴位置(离左边的距离rpx)
						y: 360, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 28, //文字大小(rpx)
						lineHeight: 28, //文字行高(rpx)
						bold: false, //文字是否加粗
						content: `${ this.order.people }位就餐`,
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 310, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 210, //x轴位置(离左边的距离rpx)
						y: 460, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 32, //文字大小(rpx)
						lineHeight: 36, //文字行高(rpx)
						bold: true, //文字是否加粗
						content: '餐厅地址', //文本内容(type为text时必填)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 500, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 80, //x轴位置(离左边的距离rpx)
						y: 510, //y轴位置(离上边的距离rpx)
						color: '#FFFFFF', //文本颜色
						fontSize: 28, //文字大小(rpx)
						lineHeight: 28, //文字行高(rpx)
						bold: false, //文字是否加粗
						content: '浙江省安吉县溪龙乡树下小白屋', //文本内容(type为text时必填)
					}, {
						type: 'image', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 112, //宽度(rpx)
						height: 112, //高度(rpx)
						x: 48, //x轴位置(离左边的距离rpx)
						y: 620, //y轴位置(离上边的距离rpx)
						radius: 56, //圆角(rpx)
						lineWidth: 0, //边框宽度(rpx)
						lineColor: '#FFFFFF', //边框颜色
						path: 'https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/code.jpg', //图片地址(type为image时必填)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 500, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 180, //x轴位置(离左边的距离rpx)
						y: 620, //y轴位置(离上边的距离rpx)
						color: '#ffffff', //文本颜色
						fontSize: 28, //文字大小(rpx)
						lineHeight: 45, //文字行高(rpx)
						bold: false, //文字是否加粗
						content: '炎·薪火餐厅', //文本内容(type为text时必填)
					}, {
						type: 'text', //绘制类型(color:背景色;image:图片;text:文字;line:线条),
						width: 500, //文本宽度(rpx)
						height: 56, //文本高度(rpx)
						x: 180, //x轴位置(离左边的距离rpx)
						y: 670, //y轴位置(离上边的距离rpx)
						color: '#ffffff', //文本颜色
						fontSize: 28, //文字大小(rpx)
						lineHeight: 45, //文字行高(rpx)
						bold: false, //文字是否加粗
						content: '湖州日式融合料理第一名', //文本内容(type为text时必填)
					}]
				}]
				console.log("list", list)
				this.$nextTick(() => {
					this.$refs.liuPoster.init(list)
				})
			},
			//绘制成功返回生成的海报图片地址
			async change(e) {
				this.url = e
				this.$emit("onUrlReady", {
					url: e
				})
				console.log("change-onUrlReady-e", e);
			},
			//预览生成的海报图片
			handlePreview() {
				console.log("预览", this.url)
				if (!this.url) return
				uni.previewImage({
					urls: [this.url]
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.arrow-tr-icon {
		width: 24rpx;
		height: 24rpx;
	}

	.tab-box {
		box-sizing: border-box;

		text {
			color: #F06627;
			padding: 20rpx;
			text-align: center;
			width: 100%;
			font-size: 14px;
		}

		.btn-reset {
			width: 100%;
			height: 72rpx;
			background: #FFFFFF;
			border-radius: 40rpx;
			border: 2rpx solid #FD430E;
			font-size: 30rpx;
			color: #3E3E3E;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.btn-complete {
			width: 98%;
			height: 76rpx;
			border-radius: 40rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			background-color: #FD430E;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
		}

		.success-img {
			width: 100%;
			height: 1300rpx;
			margin-top: 20rpx;
		}
	}
</style>