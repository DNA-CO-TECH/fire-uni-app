<template>
	<view class="root">
		<view class="home-content">
			<image class="back-image" src="/static/home/superfire.webp" />
			<image class="logo" :fade-show="true" mode="widthFix" src="/static/home/yan.png" />
			<navigator class="book" animation-type="slide-in-right" url="/pages/book/book">
				<view class="button-wrap">
					<view class="button" style="z-index: 1;">欢迎预订</view>
					<image class="image" :fade-show="true" mode="widthFix" src="/static/home/arrow-down.png" />
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {

	}
</script>

<style>
	.home-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		height: 100%;
	}

	.home-content .back-image {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.home-content .logo {
		position: absolute;
		top: 90px;
		right: 75px;
		width: 48px;
		height: auto;
	}

	.home-content .image {
		width: 16px;
	}

	.home-content .button-wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		position: relative;
	}

	.home-content .button-wrap .button {
		color: #141414;
		font-size: 18px;
	}

	.home-content .book {
		margin-bottom: 40px;
		background-color: #14141411;
		cursor: pointer;
	}
</style>