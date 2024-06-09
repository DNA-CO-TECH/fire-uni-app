<template>
	<view class="root flex flex-col">
		<view class="nav-wrap"
			:style="`height:${navHeight}px; background: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png'); background-size: 100% ${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/home/yan-red.png" @click="handleHome"></image>
				<view class="nav-title" style="flex:1; text-align: center">我的预订</view>
			</view>
		</view>
		<data-list :page="page" :size="size" emptyText="~ 我是有底线的 ~" @load="handleLoad" @refresh="handleRefresh"
			@scrollTolower="handleScrolltolower">
			<view class="myorders-container fcc-start gap-20">
				<view class="list-item-wrap mt-12" v-for="item in orderList" :key="item.id">
					<view class="list-item-title">
						<image class="logo" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/home/yan-red.png" alt="logo" />
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
							<text class="content-title">取消规则</text>
						</view>
						<view class="mb-20">
							<text>30分钟内未到场，预订将自动取消</text>
						</view>
						<view>
							<text class="content-title">餐厅地址</text>
						</view>
						<view class="mb-20">
							<text>浙江省安吉县溪龙乡树下小白屋</text>
						</view>
						<view>
							<text class="content-title">餐厅联系方式</text>
						</view>
						<view class="frc-center">
							<text>17606988669</text>
							<button class="copy" @click.stop="copyPhone(17606988669)">复制</button>
						</view>
					</view>
					<view class="list-item-operations w-full frc-between mt-32">
						<view class="flex-1 text-left" @click="handleCancelOrder(item)">
							<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/book/x.png" class="close-icon" />
							<text>取消预订</text>
						</view>
						<ShareOrder :order="item" @onUrlReady="handleShareReady" />
					</view>
				</view>
			</view>
		</data-list>
		<view class="footer-container">
			<view class="add-neworder" @click="addNewOrder">
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
	import {
		systemInfo
	} from "../../store/mixin.js"
	import ShareOrder from "./shareOrder.vue"
	export default {
		components: {
			ShareOrder
		},
		onLoad() {
			this.initBackground("#000000")
		},
		mixins: [systemInfo],
		data() {
			return {
				page: 1,
				size: 6,
				orderList: [],
				canvasImagePath: ''
			}
		},
		methods: {
			async handleRefresh(params, callback) {
				this.orderList = [];
				this.data = [];
				this.total = 0;
				this.page = 1;
				this.size = 6;
				const data = await this.initMyOrders()
				this.data = data.data;
				this.total = data.last_page;
				callback({
					list: this.data,
					total: this.total,
				});
			},
			async handleScrolltolower(event) {
				if (this.data.length < this.total) {
					await this.loadNextPage();
				}
			},
			async loadNextPage() {
				const currentPage = this.page + 1;
				const pageSize = this.size;
				this.page = currentPage;
				this.size = pageSize;
				const data = await this.initMyOrders()
				this.data = this.data.concat(data.data);
				this.total = data.last_page;
				this.total = this.total;
			},
			async handleLoad(params, callback) {
				if (this.orderList.length >= this.total) {
					console.log("handleLoad");
					return false
				}
				this.page = params.page;
				this.size = params.size;
				const data = await this.initMyOrders()
				this.data = data.data;
				this.total = data.last_page;
				callback({
					list: this.data,
					total: this.total,
				});
			},
			// 复制手机号
			copyPhone(phone) {
				uni.setClipboardData({
					data: phone.toString(),
					success: () => {
						uni.showToast({
							title: '手机号已复制',
							icon: 'none'
						});
					}
				});
			},
			handleHome() {
				uni.navigateBack({
					delta: 10
				})
			},
			async initMyOrders() {
				const userInfo = getStorage("userInfo")
				const params = {
					count: this.size,
					page: this.page,
					userId: userInfo?.userId
				}
				const data = await getOrderList(params)
				this.orderList = this.orderList.concat(data.data)
				return data
			},
			addNewOrder() {
				uni.redirectTo({
					url: '/pages/book/book',
				})
			},
			async handleCancelOrder(item) {
				await deleteOrder(item.orderId)
				uni.showToast({
					title: "取消成功",
					success: () => {
						this.orderList = this.orderList.filter(order => order.orderId !== item.orderId)
					}
				})
			},
			// 生成canvas图像
			createCanvasImage() {
				const ctx = uni.createCanvasContext('myCanvas');
				// 在canvas上绘制一些内容
				ctx.setFillStyle('red');
				ctx.fillRect(10, 10, 150, 100);

				// 加载图片资源
				const image = 'https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/shareback.png'; // 确保图像路径正确
				uni.getImageInfo({
					src: image,
					success: (res) => {
						ctx.drawImage(res.path, 0, 0, 100, 100);
						ctx.draw(false, () => {
							uni.canvasToTempFilePath({
								canvasId: 'myCanvas',
								success: (res) => {
									this.canvasImagePath = res.tempFilePath;
								},
								fail: (err) => {
									console.log(err);
								}
							});
						});
					},
					fail: (err) => {
						console.log('图像加载失败:', err);
					}
				});
			},
			// 检查和请求权限
			checkAndRequestPermission() {
				uni.getSetting({
					success: (res) => {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success: () => {
									console.log('权限授予成功');
								},
								fail: () => {
									console.log('用户拒绝了权限请求');
									// 用户拒绝权限请求后，进行相应处理，例如提示用户
									uni.showModal({
										title: '提示',
										content: '需要授予保存到相册的权限，否则无法分享图片',
										showCancel: false,
										success: (modalRes) => {
											if (modalRes.confirm) {
												uni.openSetting({
													success: (settingRes) => {
														console.log(settingRes.authSetting);
													}
												});
											}
										}
									});
								}
							});
						}
					}
				});
			},
			handleShareReady(data) {
				if (data) {
					wx.showShareImageMenu({
						path: data.url
					})
					console.log("data", data);
				} else {
					uni.showToast({
						title: '请先生成图片',
						icon: 'none'
					});
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	button::after {
		border: none;
	}

	button {
		position: relative;
		display: block;
		margin-left: auto;
		margin-right: auto;
		padding-left: 0px;
		padding-right: 0px;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
		line-height: 1.35;
		-webkit-tap-highlight-color: transparent;
		overflow: hidden;
		color: #ffffff;
		background-color: transparent;
		width: 100%;
		height: 100%;
	}

	.nav-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1;

		.capsule-box {

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
		margin-top: 128rpx;
		height: calc(100% - 128rpx);
		padding: 0px 36px 20px 36px;
		overflow: auto;

		.list-item-wrap {
			z-index: 1;
			width: calc(100% - 140rpx);
			height: 400px;
			padding: 70rpx;
			border-radius: 12rpx;
			background-image: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/book/order.png');
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
				padding-top: 20rpx;

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

				.copy {
					width: 100rpx;
					font-size: 24rpx;
					border: 1px solid #E7E7E7;
					padding: 6rpx 10rpx;
					margin: 0px;
					margin-left: 20rpx;
					border-radius: 16rpx;
				}
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

				.close-icon {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}
	}

	.footer-container {
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		width: 100vw;
		height: 200rpx;
		z-index: 1111;
		background: #131415;
		display: flex;
		align-items: center;
		justify-content: center;

		.add-neworder {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			border: 1px solid #F06627;
			box-sizing: border-box;
			width: 90%;
			margin-top: 10px;
			margin-bottom: 20px;

			text {
				padding: 10px;
				text-align: center;
				color: #F06627;
			}
		}
	}
</style>