<template>
	<view class="root flex flex-col">
		<view class="nav-wrap"
			:style="`height:${navBarHeight}px; background: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png'); background-size: 100% ${navBarHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${menuHeight}px; min-height:${menuHeight}px; line-height:${menuHeight}px; bottom:${menuBottom}px;`">
				<image class="nav-logo" src="/static/home/yan.png" @click="handleHome"></image>
				<view class="nav-title" style="flex:1; text-align: center">我的预订</view>
			</view>
			<text class="logo-slogan">燃烧另一种意义</text>
		</view>
		<view class="myorders-container fcc-start gap-20">
			<view class="list-item-wrap mt-12" v-for="item in orderList" :key="item.id">
				<view class="list-item-title">
					<image class="logo" src="/static/home/yan.png" alt="logo" />
				</view>
				<view class="fcc-center mt-10">————————</view>
				<view class="list-item-content">
					<view>
						<text class="content-title">预约信息</text>
					</view>
					<view class="mb-20">
						<text>{{new Date(item.dateInfo).getMonth()+1}}月{{new Date(item.dateInfo).getDate()}}日
							{{item.timeInfo===0?'17:30~18:30':'19:00 ~20:00'}}</text>
					</view>
					<view>
						<text class="content-title">取消政策</text>
					</view>
					<view class="mb-20">
						<text>30分钟内未到场，预订将自动取消</text>
					</view>
					<view>
						<text class="content-title">餐厅地址</text>
					</view>
					<view>
						<text>浙江省安吉县溪龙乡树下小白屋</text>
					</view>
				</view>
				<view class="list-item-operations w-full frc-between mt-32">
					<view class="flex-1 text-left" @click="handleCancelOrder(item)">
						<image src="/static/book/x.png" class="close-icon" />
						<text>取消预订</text>
					</view>
					<view class="flex-1 text-right" @click="handleShare">
						<image src="/static/book/arrow-up-right.png" class="arrow-tr-icon" />
						<text>分享给朋友</text>
					</view>
				</view>
			</view>
			<view class="add-neworder mt-32" @click="addNewOrder">
				<text class="item-operate">+ 新增预订</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getStorage
	} from "../../utils/storage.js"
	import {
		formatDate
	} from "../../utils/formatTime.js"
	import {
		getOrderList,
		deleteOrder
	} from "/api/order.js"
	export default {
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.setBackgroundColor({
				backgroundColor: "#000000"
			})
			// #endif
			const res = getStorage('menuInfo')
			console.log("menuInfo-res", res);
			this.navBarHeight = res?.navBarHeight + 60 || 120
			this.menuHeight = res?.menuHeight || 32
			this.menuBottom = res?.menuBottom || 7

			this.initMyOrders()
		},
		data() {
			return {
				navBarHeight: 120,
				menuHeight: 32,
				menuBottom: 7,
				orderList: []
			}
		},
		methods: {
			handleHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			async initMyOrders() {
				const userInfo = getStorage("userInfo")
				const params = {
					count: 6,
					page: 1,
					userId: userInfo?.userId
					// dateStartInfo: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000).getTime(),
					// dateEndInfo: new Date().getTime(),
					// order:,
					// phoneNumber,
					// timeInfo: ,
				}
				const data = await getOrderList(params)
				this.orderList = data.data
			},
			addNewOrder() {
				uni.navigateTo({
					url: '/pages/book/book'
				})
			},
			// handleEditOrder() {
			// 	console.log("缓存此数据，打开book页面初始化")
			// 	uni.navigateTo({
			// 		url: '/pages/book/book'
			// 	})
			// },
			async handleCancelOrder(item) {
				console.log("发送取消的请求，然后刷新当前页面")
				await deleteOrder(item.orderId)
				this.orderList = this.orderList.filter(order => order.orderId !== item.orderId)
			},
			handleShare(item) {
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 1,
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					success: function(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 160rpx;
		z-index: 1;

		.capsule-box {
			display: flex;
			padding: 48rpx;

			.nav-logo {
				width: 40rpx;
				height: 48rpx;
				margin-top: 8rpx;
				cursor: pointer;
			}

			.nav-title {
				color: #F06627;
			}
		}

		.logo-slogan {
			padding: 24rpx 48rpx 24rpx 48rpx;
			font-size: 16px;
			color: #F06627;
		}
	}

	.myorders-container {
		display: flex;
		flex-direction: column;
		position: relative;
		margin-top: 200rpx;
		height: calc(100% - 200rpx);
		padding: 0px 36px 20px 36px;
		overflow: auto;

		.list-item-wrap {
			z-index: 1;
			width: calc(100% - 140rpx);
			height: 376px;
			padding: 70rpx;
			border-radius: 12rpx;
			background-image: url(/static/book/order.png);
			background-size: cover;
			background-repeat: no-repeat;

			.content-title {
				font-size: 32rpx;
				font-weight: 700;
				color: #C4C6CA;
				text-align: center;
				margin-bottom: 12rpx;
				display: block;
			}

			.list-item-title {
				font-size: 32rpx;
				font-weight: 700;
				color: #C4C6CA;
				text-align: center;
				padding-top: 50rpx;

				.logo {
					width: 28px;
					height: 32px;
				}
			}

			.list-item-content {
				width: 100%;
				font-size: 28rpx;
				color: #C4C6CA;
				text-align: center;
			}

			.list-item-operations {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 96rpx;
				width: 100%;
				cursor: pointer;

				text {
					color: #F06627;
					padding: 20rpx;
					text-align: center;
					width: 100%;
					font-size: 14px;
				}

				.arrow-tr-icon,
				.close-icon {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}

		.add-neworder {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 48px;
			width: 100%;
			border: 1px solid #ED682B;
			cursor: pointer;
			z-index: 1;

			text {
				padding: 10px;
				text-align: center;
				color: #ED682B;
			}
		}
	}
</style>