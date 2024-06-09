<script>
	import {
		setStorage
	} from '/utils/storage.js'
	export default {
		globalData: {
			statusBarHeight: 0, // 状态导航栏高度
			navHeight: 0, // 总体高度
			navigationBarHeight: 0, // 导航栏高度(标题栏高度)
		},
		onLaunch() {
			this.calcNavBarInfo()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * @description 计算导航栏信息
			 */
			calcNavBarInfo() {
				console.log("App Launch")

				// 状态栏高度
				this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight

				// #ifdef MP-WEIXIN
				// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
				const custom = wx.getMenuButtonBoundingClientRect()

				// 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
				this.globalData.navigationBarHeight = custom.height + (custom.top - this.globalData.statusBarHeight) * 2
				// console.log("导航栏高度："+this.globalData.navigationBarHeight)

				// 总体高度 = 状态栏高度 + 导航栏高度
				this.globalData.navHeight = this.globalData.navigationBarHeight + this.globalData.statusBarHeight
				// #endif

				// #ifdef H5
				this.globalData.statusBarHeight = 0
				this.globalData.navigationBarHeight = 64
				this.globalData.navHeight = 64
				// #endif

				console.log("this.globalData", this.globalData)
			}
		},
	}
</script>

<style lang="scss">
	page-head,
	page-body,
	uni-page-head,
	uni-page-body {
		background-color: transparent !important;
	}

	page {
		background-color: black;
	}

	.uni-page-head {
		background-color: transparent !important;
	}

	.capsule-box {
		display: flex;
		align-items: center;
		padding: 0px 48rpx;
	}

	.root {
		position: absolute;
		width: 100%;
		height: 100%;
		background: transparent;
	}

	.text-left {
		text-align: left;
	}

	.text-right {
		text-align: right;
	}

	.cursor-pointer {
		cursor: pointer
	}

	.flex {
		display: inline-flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.flex-1 {
		flex: 1;
	}

	.z-1 {
		z-index: 10;
	}

	.w-full {
		width: 100%;
	}

	.h-full {
		height: 100%;
	}

	.relative {
		position: relative;
	}

	.hidden {
		visibility: hidden;
	}

	.absolute {
		position: absolute;
	}

	.top-0 {
		top: 0
	}

	.left-0 {
		left: 0
	}

	.fcc-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.fcc-start {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

	.fcc-between {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.fcs-between {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: space-between;
	}

	.frc-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.frc-start {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.frc-center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.frc-end {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.frc-start {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.bg-white {
		background-color: white;
	}

	.p-20 {
		padding: 24rpx;
	}

	.gap-8 {
		gap: 16rpx;
	}

	.gap-12 {
		gap: 24rpx;
	}

	.gap-20 {
		gap: 40rpx;
	}

	.mb-10 {
		margin-bottom: 20rpx;
	}

	.mb-20 {
		margin-bottom: 40rpx;
	}

	.mt-32 {
		margin-top: 64rpx;
	}

	.mt-20 {
		margin-top: 40rpx;
	}

	.mt-12 {
		margin-top: 24rpx;
	}

	.mt-10 {
		margin-top: 20rpx;
	}

	.w-14 {
		width: 28rpx;
	}

	.h-14 {
		height: 28rpx;
	}

	.w-20 {
		width: 40rpx;
	}

	.h-20 {
		height: 40rpx;
	}

	.w-32 {
		width: 64rpx;
	}

	.h-32 {
		height: 64rpx;
	}

	.w-64 {
		width: 128rpx;
	}

	.h-64 {
		height: 128rpx;
	}
</style>