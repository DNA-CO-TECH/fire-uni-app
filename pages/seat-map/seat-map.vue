<template>
	<view class="root">
		<view class="seat-container">
			<image class="back-image" src="/static/book/seatBack.png" />
			<view class="container">
				<view class="restaurant">
					<view class="left">
						<!-- 第 1 个桌子 -->
						<view class="table1-wrap">
							<view class="flex seat-row">
								<view :class="{ 'seat': true,
					 			                'seat-top': true,
					 											'seat-topleft': true,
					 			                'booked': isBooked[0][0] === 1,
					 			                'not-booked': isBooked[0][0] !== 1 }">
									<icon v-if="isBooked[0][0]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
								<view :class="{ 'seat': true,
					 			                'seat-top': true,
					 											'seat-topright': true,
					 			                'booked': isBooked[0][1] === 1,
					 			                'not-booked': isBooked[0][1] !== 1 }">
									<icon v-if="isBooked[0][1]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
							</view>
							<view class="table" />
							<view class="flex seat-row">
								<view :class="{ 'seat': true,
					 			                'seat-bottom': true,
					 											'seat-bottomleft': true,
					 			                'booked': isBooked[0][2] === 1,
					 			                'not-booked': isBooked[0][2] !== 1 }">
									<icon v-if="isBooked[0][2]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
								<view :class="{ 'seat': true,
					 			                'seat-bottom': true,
					 											'seat-bottomright': true,
					 			                'booked': isBooked[0][3] === 1,
					 			                'not-booked': isBooked[0][3] !== 1 }">
									<icon v-if="isBooked[0][3]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
							</view>
						</view>
						<!-- 第 2 个桌子 -->
						<view class="table2-wrap">
							<view class="fcc-between gap-12">
								<view v-for="item in isBooked[1]" :key="item" :class="{ 'seat': true,
							                'seat-left': true,
							                'booked': item === 1,
							                'not-booked': item !== 1 }">
									<icon v-if="item===1" class="icon-small" type="success_no_circle" size="18" color="black"></icon>
								</view>
							</view>
							<view class="table2" />
							<view class="fcc-center gap-12">
								<view v-for="item in isBooked[2]" :key="item" :class="{ 'seat': true,
							                'seat-right': true,
							                'booked': item === 1,
							                'not-booked': item !== 1 }">
									<icon v-if="item===1" class="icon-small" type="success_no_circle" size="18" color="black"></icon>
								</view>
							</view>
						</view>
						<!-- 第 3 个桌子 -->
						<view class="table3-wrap">
							<view class="flex seat-row">
								<view :class="{ 'seat': true,
							                'seat-top': true,
															'seat-topleft': true,
							                'booked': isBooked[2][0] === 1,
							                'not-booked': isBooked[2][0] !== 1 }">
									<icon v-if="isBooked[2][0]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
								<view :class="{ 'seat': true,
							                'seat-top': true,
															'seat-topright': true,
							                'booked': isBooked[2][0] === 1,
							                'not-booked': isBooked[2][0] !== 1 }">
									<icon v-if="isBooked[2][1]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
							</view>
							<view class="table" />
							<view class="flex seat-row">
								<view :class="{ 'seat': true,
							                'seat-bottom': true,
															'seat-bottomleft': true,
							                'booked': isBooked[2][2] === 1,
							                'not-booked': isBooked[2][2] !== 1 }">
									<icon v-if="isBooked[2][2]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
								<view :class="{ 'seat': true,
							                'seat-bottom': true,
															'seat-bottomright': true,
							                'booked': isBooked[2][3] === 1,
							                'not-booked': isBooked[2][3] !== 1 }">
									<icon v-if="isBooked[2][3]===1" class="icon-small" type="success_no_circle" size="18" color="black">
									</icon>
								</view>
							</view>
						</view>
					</view>
					<view class="right">
						<!-- 吧台 -->
						<view class="bar-wrap">
							<view class="fcc-between" :style="{padding:'20px 0px'}">
								<view class="fcc-between flex-1">
									<view v-for="item in isBooked[3]" :key="item" :class="{ 'seat': true,
								                'seat-left': true,
								                'booked': item === 1,
								                'not-booked': item !== 1 }">
										<icon v-if="item===1" class="icon-small" type="success_no_circle" size="18" color="black">
										</icon>
									</view>
								</view>
								<view class="fcc-center" style="color:#515452;height: 80px;">——</view>
								<view class="fcc-between flex-1">
									<view v-for="item in isBooked[4]" :key="item" :class="{ 'seat': true,
								                'seat-left': true,
								                'booked': item === 1,
								                'not-booked': item !== 1 }">
										<icon v-if="item===1" class="icon-small" type="success_no_circle" size="18" color="black">
										</icon>
									</view>
								</view>
							</view>
							<view class="bar fcc-center">
								<text style="width: 22px;" class="fcc-center">明厨餐吧</text>
							</view>
						</view>
						<!-- 大门 -->
						<view class="door-wrap">
							<view class="quadrant quadrant-top-left"></view>
						</view>
					</view>
				</view>
			</view>
			<button class="next-step" @click="showConfirmPanel">立即预定</button>
			<view class="modal" v-if="isShowConfirmPanel">
				<view class="mask" />
				<view class="z-content">
					<view class="modal-content">
						<view class="z-modal">
							<view class="modal-title">
								<slot name="title">
									<image src="/static/book/yan-black.png" alt="logo" class="w-32 h-32" />
									<view class="title-description mt-20">
										<text>感谢您预定炎·薪火</text>
									</view>
									<view class="title-description">
										<text>非常荣幸与您确认以下信息</text>
									</view>
								</slot>
							</view>
							<view class="fcc-center mt-10">————————</view>
							<view class="z-modal-content">
								<slot name="content">
									<view>
										<text class="content-title"> 预约信息</text>
									</view>
									<view class="mb-20">
										<text> 4月17日 17:30~18:30，两位就餐</text>
									</view>
									<view>
										<text class="content-title">取消政策</text>
									</view>
									<view class="mb-20">
										<text>超过预订时间段30分钟未到场，将自动取消</text>
									</view>
									<view>
										<text class="content-title">餐厅地址</text>
									</view>
									<view>
										<text> 浙江省安吉县溪龙乡树下小白屋</text>
									</view>
									<view class="confirm mt-32" @click="confirm">
										<text>确认预订</text>
									</view>
								</slot>
							</view>
						</view>
					</view>
					<view class="modal-foot">
						<slot name="footer">
							<view class="cancel cursor-pointer" @click="closeConfirmPanel">
								<image src="/static/book/cancel.png" class="w-20 h-20 mt-20" />
							</view>
						</slot>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBooked: [
					[1, 0, 0, 0], // 第一个桌子
					[0, 1, 0, 0], // 第二个桌子左边
					[0, 0, 1, 0], // 第二个桌子右边
					[0, 0, 0, 0], // 第三个桌子
					[0, 1, 0, 0], // 吧台上面
					[0, 0, 0, 0] // 吧台下面
				],
				isDeskOneBooked: false,
				isDeskTwoBooked: false,
				isDeskThreeBooked: false,
				isDeskFourBooked: false,
				isShowConfirmPanel: false
			}
		},
		methods: {
			confirm() {
				console.log('发送确认订单，成功后跳转到我的订单页面')
				this.closeConfirmPanel()
				uni.navigateTo({
					url: '/pages/myorders/myorders'
				})
			},
			showConfirmPanel() {
				this.isShowConfirmPanel = true
			},
			closeConfirmPanel() {
				this.isShowConfirmPanel = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.seat-container {
		display: flex;
		flex-direction: column;
		position: relative;
		height: calc(100% - 20rpx);
		padding: 0rpx 10rpx 20rpx 10rpx;
	}

	.seat-container .back-image {
		position: absolute;
		z-index: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.next-step {
		width: calc(100% - 1.25rem);
		height: 100rpx;
		padding: 0.625rem;
		background-color: #907F69;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: rgb(0, 0, 0);
	}

	.restaurant {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
	}

	.restaurant .left,
	.restaurant .right {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.restaurant .left {
		gap: 40rpx;
	}

	.bar-wrap {
		display: flex;
		justify-content: flex-end;
		margin-right: 80rpx;
	}

	.seat-row {
		width: 150rpx;
		justify-content: space-between;
	}

	.table1-wrap,
	.table3-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.table {
		border: 4rpx solid #3a3432;
		width: 140rpx;
		height: 90rpx;
		margin: 6rpx auto;
	}

	.table2 {
		width: 88rpx;
		height: 300rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border: 4rpx solid #3a3432;
		margin-left: 6rpx;
		margin-right: 6rpx;
	}

	.table2-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.seat {
		width: 56rpx;
		height: 56rpx;
		border: 2rpx solid #3a3432;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.bar {
		border: 2rpx solid #3a3432;
		height: 840rpx;
		width: 88rpx;
		margin-left: 6rpx;
	}

	.bar text {
		color: #907f6c;
	}

	.booked {
		background-color: #ddc2a5;
		color: #181818;
	}

	.not-booked {
		background-color: #907f6c44;
		color: #907f6c;
	}

	.seat-left {
		border-top-left-radius: 50%;
		border-bottom-left-radius: 50%;
	}

	.seat-right {
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
	}

	.seat-top {
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
	}

	.seat-bottom {
		border-bottom-left-radius: 50%;
		border-bottom-right-radius: 50%;
	}

	.door-wrap {
		position: absolute;
		bottom: 20rpx;
		right: 0px;
		width: 160rpx;
		height: 160rpx;
		overflow: hidden;
		border-right: 2rpx solid #3a3432;
		border-bottom: 2rpx solid #3a3432;
	}

	.quadrant {
		width: 300rpx;
		height: 300rpx;
		border: 4rpx solid #3a3432;
	}

	.quadrant-top-left {
		border-radius: 50% 0 0 50%;
	}

	.quadrant-top-left {
		top: 0;
		left: 0;
	}

	.modal {
		display: flex;
		flex-direction: column;
		flex: 1;

		.mask {
			transition-duration: 450ms;
			transition-timing-function: ease-out;
			position: fixed;
			inset: 0px;
			z-index: 10070;
			background-color: rgba(0, 0, 0, 0.8);
		}

		.z-content {
			z-index: 10075;
			position: fixed;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			inset: 0px;

			.modal-content {
				border-radius: 12rpx;
				overflow: hidden;
				margin-top: 0px;
				background-color: #907F69;
				position: relative;

				.z-modal {
					width: 560rpx;
					border-radius: 12rpx;
					overflow: hidden;

					.modal-title {
						font-size: 32rpx;
						font-weight: 700;
						color: #131415;
						text-align: center;
						padding-top: 50rpx;
					}

					.title-description {
						color: #3C3830;
						font-weight: 400;
					}

					.content-title {
						font-size: 32rpx;
						font-weight: 700;
						color: #131415;
						text-align: center;
						margin-bottom: 12rpx;
						display: block;
					}

					.z-modal-content {
						padding: 24rpx 50rpx 50rpx 50rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						font-size: 14px;
						color: #3C3830;
					}

					.confirm {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 96rpx;
						width: 100%;
						cursor: pointer;

						text {
							color: #131415;
							border: 2rpx solid #131415;
							padding: 20rpx;
							text-align: center;
							width: 100%;
						}
					}
				}

				.modal-foot {
					display: flex;
					flex-direction: row;
					font-size: 16px;
					text-align: center;
					color: rgb(96, 98, 102);

					.cancel {
						flex: 1;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						height: 48px;
					}
				}

			}
		}
	}
</style>