<template>
	<view class="root">
		<view class="home-content">
			<image class="back-image" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/superfire.webp" />
			<image class="logo" :fade-show="true" mode="widthFix" src="/static/home/yan.png" />
			<view class="book" @click="handleClick">
				<view class="button-wrap">
					<view class="button" style="z-index: 1;">欢迎预订</view>
					<image class="image" :fade-show="true" mode="widthFix" src="/static/home/arrow-down.png" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStorage
	} from "/utils/storage.js"
	export default {
		onLoad() {
			console.log('开始加载音频');
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.autoplay = true;
			this.innerAudioContext.loop = true;
			this.innerAudioContext.src = 'https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/fire.mp3';
			this.innerAudioContext.volume = 1;
			this.innerAudioContext.onPlay(() => {
				console.log('开始播放');
			});
			if (this.innerAudioContext) {
				this.innerAudioContext.play()
			}
		},
		onHide() {
			this.innerAudioContext.pause()
		},
		onShow() {
			this.innerAudioContext.play()
		},
		methods: {
			handleClick() {
				const cache = getStorage("userInfo")
				console.log("cache", cache);
				// 没登陆过，弹出登录组件 | 管理员进登录页面选身份
				if (!cache || cache.isAdmin === true) {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
				// 登陆过根据缓存的信息判断是否是管理员，不是则直接进入book, 是的话进入login页面选身份
				else {
					uni.navigateTo({
						url: "/pages/book/book"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page-head,
	page-body {
		height: 100%;
		background-color: transparent;
	}

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