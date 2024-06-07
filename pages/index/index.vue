<template>
	<view class="root">
		<view class="home-content">
			<image class="back-image" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/superfire.webp" />
			<image class="logo" :fade-show="true" mode="widthFix" src="/static/home/yan.png" />
			<view :class="`book ${animate?'text-animation':''}`" @click="handleClick">
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
	import {
		getOrderList,
	} from "/api/order.js"
	import {
		systemInfo
	} from "../../store/mixin";
	export default {
		data() {
			return {
				animate: false
			}
		},
		mixins: [systemInfo],
		onLoad() {
			this.initBackground("#000000")
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
			this.animate = false
		},
		onShow() {
			this.innerAudioContext.play()
			this.animate = true
		},
		methods: {
			async handleClick() {
				const cache = getStorage("userInfo")
				// 登陆过，普通用户
				if (cache && cache.isAdmin === 0) {
					const data = await getOrderList({
						count: 6,
						page: 1,
						userId: cache?.userId
					})
					// 根据结果判断去往订单页还是预订页面
					if (data?.success) {
						uni.navigateTo({
							url: "/pages/myorders/myorders",
						})
					} else {
						uni.navigateTo({
							url: "/pages/book/book",
						})
					}
				} else {
					// 没登陆过，进入登陆页面 | 登陆过，管理员进登录页面选身份
					uni.navigateTo({
						url: "/pages/login/login",
						animationType: "slide-in-bottom",
						animationDuration: 300
					})
				}
			}
		}
	}
</script>

<style lang="scss">
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
		transform: rotate(-90deg);
	}

	.home-content .button-wrap {
		display: flex;
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
		margin-bottom: 130rpx;
		cursor: pointer;
	}

	@keyframes text-animation {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}

		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.text-animation {
		animation: text-animation 1.6s ease-in-out forwards;
	}
</style>