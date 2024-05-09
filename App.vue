<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			loading: false
		}
	}
</script>

<style lang="scss">
	.root {
		position: absolute;
		width: 100%;
		height: 100%;
		background: black;
	}

	.cursor-pointer {
		cursor: pointer
	}

	.flex {
		display: inline-flex;
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

	.gap-12 {
		gap: 24rpx;
	}

	.gap-20 {
		gap: 40rpx;
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
</style>