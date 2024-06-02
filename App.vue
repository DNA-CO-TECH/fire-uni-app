<script>
	import {
		setStorage
	} from '/utils/storage.js'
	export default {
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
				uni.getSystemInfo({
					success: res => {
						console.log("res", res);
						let menuButtonInfo = {}
						if (res.platform === 'ios' || res.osName === 'ios') {
							// ios设备的胶囊按钮都是固定的
							menuButtonInfo = {
								width: 87,
								height: 32,
								left: res.screenWidth - 7 - 87,
								right: res.screenWidth - 7,
								top: res.statusBarHeight + 4,
								bottom: res.statusBarHeight + 4 + 32
							}
						} else {
							// 安卓通过api获取
							menuButtonInfo = wx.getMenuButtonBoundingClientRect()
						}
						console.log('获取胶囊信息：', menuButtonInfo);
						// 导航栏高度 = 状态栏到胶囊的间距（胶囊距上未知-状态栏高度）* 2 + 胶囊高度 + 状态栏高度
						const navHeight = (menuButtonInfo.top - res.statusBarHeight) * 2 + menuButtonInfo.height + res
							.statusBarHeight;
						// 按钮上下边距高度
						const menuBottom = menuButtonInfo.top - res.statusBarHeight;
						// 导航栏右边到屏幕边缘的距离
						const menuRight = res.screenWidth - menuButtonInfo.right;
						// 导航栏高度
						const menuHeight = menuButtonInfo.height;

						setStorage("menuInfo", {
							navHeight,
							menuBottom,
							menuRight,
							menuHeight
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: black;
	}

	.root {
		position: absolute;
		width: 100%;
		height: 100%;
		background: black;
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