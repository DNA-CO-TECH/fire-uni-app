<template>
	<view class="container">
		<view class="nav-wrap" :style="`height:${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" src="/static/manage/left-arrow.svg" @click="handleBack"></image>
				<view class="nav-title" style="flex:1; text-align: center">修改预订</view>
			</view>
		</view>
		<view :style="`padding: ${navHeight+20}px 48rpx 0px 48rpx; height: calc(100vh - 200rpx)`">
			<form @submit="formSubmit">
				<view class="form-item">
					<view class="w-full frc-start gap-8">
						<view>
							<image class="avatar" src="/static/manage/fire.svg" />
						</view>
						<view class="order-info">
							<view class="desk-info">
								<text>{{ `订单号:` }} {{ formData.orderId}}</text>
							</view>
							<!-- 手机号 + 复制按钮 -->
							<view class="phone-info frc-start">
								<text>{{ `手机号:` }}</text>
								<input name="phoneNumber" :value="formData.phone" @input="handlePhoneChange" />
								<button class="copy" @click.stop="copyPhone(order.phone)">复制</button>
							</view>
						</view>
					</view>
				</view>
				<view class="form-item">
					<view class="form-title">日期</view>
					<picker @change="handleDateChange" class="time-slot-picker" mode="date" name="dateInfo">
						{{new Date(formData.dateInfo).getMonth()+1}}月{{new Date(formData.dateInfo).getDate()}}日
					</picker>
					<image class="icon" src="/static/manage/calendar.svg"></image>
				</view>
				<view class="form-item">
					<view class="form-title">时间段</view>
					<picker @change="handleTimeChange" class="time-slot-picker" mode="selector" name="timeInfo"
						:range="[{value:'17:30 ~ 18:30'},{value:'19:00 ~ 20:00'}]" range-key="value">
						{{formData.timeInfo===0?'17:30 ~ 18:30':'19:00 ~ 20:00'}}
					</picker>
					<image class="icon" src="/static/manage/arrow-down.svg"></image>
				</view>
				<view class="form-item">
					<view class="form-title">就餐人数</view>
					<picker @change="handlePeopleChange" class="time-slot-picker" mode="selector" name="timeInfo" :range="range"
						range-key="value">
						{{formData.people}}
					</picker>
				</view>

				<view class="form-item">
					<view class="form-title">桌号</view>
					<view class="relative flex-1" @click="handleEditSeat">
						<view class="selected-desks relative">
							{{selectedDesks ? selectedDesks : '请选择桌号'}}
							<input disabled class="form-desk absolute top-0 left-0" name="desk"
								:value="JSON.stringify(formData.desk)">
						</view>
						<image class="icon desk-icon" src="/static/manage/arrow-down.svg"></image>
					</view>
				</view>
				<view class="form-btn">
					<button form-type="submit">保存修改</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {
		getStorage,
		setStorage
	} from '../../utils/storage';
	import {
		systemInfo
	} from "../../store/mixin.js"
	import {
		calculateSelectedDesks
	} from "./transform.js"
	import {
		formatDate
	} from '../../utils/formatTime';
	import {
		postOrderInfo
	} from '../../api/order';
	export default {
		onLoad(options) {
			this.initLayout
			this.initBackground("#FFFFFF")
			this.getSystemInfo()

			this.orderId = options.orderId
			this.initForm()
			console.log("onLoad");
		},
		onShow() {
			console.log("onShow");
			this.initBackground("#FFFFFF")
			this.getSystemInfo()
			this.initForm()
		},
		mixins: [systemInfo],
		data() {
			return {
				formData: {
					dateInfo: new Date().getTime(),
					timeInfo: 1,
				},
				range: Array.from({
					length: 22
				}, (_, i) => ({
					value: i + 1
				})),
				selectedDesks: ""
			}
		},
		methods: {
			handlePhoneChange(event) {
				const updatedValue = event.detail.value;
				this.$set(this.formData, 'phoneNumber', updatedValue);
			},
			handlePeopleChange(event) {
				const updatedValue = event.detail.value + 1;
				this.$set(this.formData, 'people', updatedValue);
			},
			handleDateChange(event) {
				const updatedValue = event.detail.value;
				const n = new Date(updatedValue).getTime()
				this.$set(this.formData, 'dateInfo', n);
			},
			handleTimeChange(event) {
				const updatedValue = event.detail.value;
				this.$set(this.formData, 'timeInfo', updatedValue);
			},
			async initForm() {
				const orderDetail = getStorage("orderDetail")
				console.log("orderDetail", orderDetail);
				this.formData = {
					...orderDetail
				}

				this.selectedDesks = calculateSelectedDesks(orderDetail.desk)
				console.log("selectedDesks", this.selectedDesks);
			},
			async formSubmit(e) {
				await postOrderInfo(this.formData)
				uni.showModal({
					content: '提交成功',
					showCancel: false,
					success: () => {
						uni.navigateBack()
					}
				});
			},
			handleBack() {
				uni.navigateBack()
			},
			handleEditSeat() {
				setStorage("orderDetail", this.formData)
				// console.log("handleEditSeat-orderDetail", this.formData);
				uni.navigateTo({
					url: "/pages/seat-map/seat-map?edit=1"
				})
			}
		}
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
		color: #000000;
		background-color: #fff;
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
				width: 48rpx;
				height: 48rpx;
				cursor: pointer;
			}

			.nav-title {
				color: #000000;
			}
		}
	}

	.container {
		background-color: #FFFFFF;
		height: 100%;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 20px;

		.logo {
			width: 48rpx;
			height: 48rpx;
			font-size: 24px;
			font-weight: bold;
		}

		.title {
			font-size: 18px;
			margin-left: 10px;
		}
	}

	.slide-left {
		width: 100%;
		height: 120rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.phone-info,
	.copy {
		color: #858A87;
		font-size: 24rpx;
	}

	.phone-info {
		gap: 32rpx;
		margin-top: 12rpx;

		.copy {
			border: 1px solid #E7E7E7;
			padding: 6rpx 10rpx;
			border-radius: 16rpx;
			width: 100rpx;
		}

		text {
			white-space: nowrap;
		}
	}

	.form-item {
		border-bottom: 1px solid #EDEDEB;
		height: 24px;
		padding: 24px 0px;
		display: flex;

		.form-title {
			color: #AEAEAE;
			width: 120px;
		}
	}

	.form-btn {
		margin-top: 32px;

		button {
			background-color: #131415;
			color: #ffffff;
			font-size: 16px;
			height: 48px;
			line-height: 48px;
		}
	}

	.selected-desks {
		flex: 1;
	}

	.form-desk {
		opacity: 0.01;

		input {
			cursor: pointer;
		}
	}

	.desk-icon {
		transform: rotate(-90deg);
		right: 0px !important;
		top: 4px;
	}

	.time-slot-picker {
		flex: 1;
		/* Adjust styles as needed to ensure visibility */
		display: block !important;
		z-index: 2;
	}

	.form-item {
		.icon {
			width: 15px;
			height: 16px;
			cursor: pointer;
			position: absolute;
			z-index: 1;
			right: 24px;
		}
	}
</style>