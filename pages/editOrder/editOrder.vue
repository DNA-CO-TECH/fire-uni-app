<template>
	<view class="container">
		<view class="nav-wrap" :style="`height:${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo"
					src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/left-arrow.svg"
					@click="handleBack"></image>
				<view class="nav-title" style="flex:1; text-align: center">{{ isAdd ? '新增预订' : '修改预订' }}</view>
			</view>
		</view>
		<view :style="`padding: ${navHeight + 20}px 48rpx 0px 48rpx; height: calc(100vh - ${navHeight}*2rpx - 40rpx)`">
			<form @submit="formSubmit">
				<view class="form-item">
					<view class="w-full frc-start gap-8">
						<view>
							<image class="avatar"
								src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/order_avatar.png" />
						</view>
						<view class="order-info">
							<view class="desk-info" v-if="!isAdd">
								<text>{{ `订单号:` }} {{ formData.orderId }}</text>
							</view>
							<!-- 手机号 + 复制按钮 -->
							<view class="phone-info frc-start" :style="`${!isAdd && 'margin-top: 12rpx'}`">
								<text v-show="!isAdd">{{ `手机号:` }}</text>
								<input
									:style="`${isPhoneError ? 'border:1px solid #F06627;border-radius:6rpx;padding:3px' : ''};font-size: 12px`"
									name="phoneNumber" :value="formData.phoneNumber" @input="handlePhoneChange" placeholder="请填写手机号" />
								<button v-show="!isAdd" class="copy" @click.stop="copyPhone(order.phoneNumber)">复制</button>
							</view>
						</view>
					</view>
				</view>
				<view class="form-item">
					<view class="form-title">日期</view>
					<picker @change="handleDateChange" class="time-slot-picker" mode="date" name="dateInfo">
						{{ new Date(formData.dateInfo).getMonth() + 1 }}月{{ new Date(formData.dateInfo).getDate() }}日
					</picker>
					<image class="icon"
						src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/calendar.svg">
					</image>
				</view>
				<view class="form-item">
					<view class="form-title">时间段</view>
					<picker @change="handleTimeChange" class="time-slot-picker" mode="selector" name="timeInfo"
						:range="[{ value: '17:30 ~ 18:30' }, { value: '19:00 ~ 20:00' }]" range-key="value">
						{{ formData.timeInfo === 0 ? '17:30 ~ 18:30' : '19:00 ~ 20:00' }}
					</picker>
					<image class="icon"
						src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/arrow-down.svg">
					</image>
				</view>
				<view class="form-item">
					<view class="form-title">桌号</view>
					<view class="relative flex-1" @click="handleEditSeat">
						<view class="selected-desks relative"
							:style="`${isDeskError ? 'border:1px solid #F06627;border-radius:6rpx;padding:3px' : ''}`">
							{{ selectedDesks ? selectedDesks : '请选择桌号' }}
							<input disabled class="form-desk absolute top-0 left-0" name="desk"
								:value="JSON.stringify(formData.desk)">
						</view>
						<image class="icon desk-icon"
							src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/arrow-down.svg">
						</image>
					</view>
				</view>
				<view class="form-item">
					<view class="form-title">就餐人数</view>
					<picker :style="`${isPeopleError ? 'border:1px solid #F06627;border-radius:6rpx;padding:3px' : ''}`"
						@change="handlePeopleChange" class="time-slot-picker" mode="selector" name="timeInfo" :range="range"
						range-key="value">
						{{ formData.people }}
					</picker>
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
		setStorage,
		removeStorage
	} from '../../utils/storage';
	import {
		systemInfo
	} from "../../store/mixin.js"
	import {
		calculateSelectedDesks
	} from "./transform.js"
	import {
		postOrderInfo
	} from '../../api/order';
	export default {
		onLoad(options) {
			if (!this.hasInit) {
				console.log("onLoad");
				this.initByOptions(options);
				this.hasInit = true;
			}
		},
		onShow(options) {
			console.log("onShow-hasInit", toString(this.hasInit));
			if (!this.hasInit) {
				this.initByOptions(options);
				this.hasInit = true;
			}
		},
		onHide() {
			this.hasInit = false
			console.log("onHide-hasInit-false");
		},
		mixins: [systemInfo],
		data() {
			return {
				formData: {
					dateInfo: new Date().getTime(),
					timeInfo: 0,
				},
				range: Array.from({
					length: 22
				}, (_, i) => ({
					value: i + 1
				})),
				selectedDesks: "",
				isAdd: false,
				isPhoneError: false,
				isPeopleError: false,
				isDeskError: false,
			}
		},
		methods: {
			validatePhoneNumber(phoneNumber) {
				const phoneRegEx = /^1[3456789]\d{9}$/;
				return phoneRegEx.test(phoneNumber);
			},
			async initByOptions(options) {
				this.initBackground("#FFFFFF")
				this.getSystemInfo()

				if (options) {
					this.orderId = options.orderId
					this.isAdd = options.isAdd
				}

				console.log("options.isAdd", this.isAdd);
				await this.initForm()
			},
			handlePhoneChange(event) {
				const updatedValue = event.detail.value;
				this.$set(this.formData, 'phoneNumber', updatedValue);
				if (event.detail.value) {
					this.isPhoneError = false
				} else {
					this.isPhoneError = true
				}
			},
			handlePeopleChange(event) {
				const updatedValue = parseInt(event.detail.value) + 1;
				console.log("updatedValue", updatedValue);
				this.$set(this.formData, 'people', `${updatedValue}`);
				this.isPeopleError = false
			},
			handleDateChange(event) {
				const updatedValue = event.detail.value;
				console.log("event.detail.value", event.detail.value);
				const n = new Date(updatedValue).getTime()
				this.$set(this.formData, 'dateInfo', n);
			},
			handleTimeChange(event) {
				const updatedValue = event.detail.value;
				this.$set(this.formData, 'timeInfo', updatedValue);
			},
			async initForm() {
				this.isDeskError = false
				const orderDetail = getStorage("orderDetail")

				if (orderDetail) {
					console.log("initForm-orderDetail", orderDetail)
					this.formData = {
						...orderDetail
					}
					const desks = orderDetail.desk
					this.selectedDesks = calculateSelectedDesks(desks)
				} else {
					this.formData = {
						dateInfo: new Date().getTime(),
						timeInfo: 0,
					}
					const desks = []
					this.selectedDesks = calculateSelectedDesks([])
				}
			},
			async formSubmit(e) {
				if (!this.formData.phoneNumber || !this.validatePhoneNumber(this.formData.phoneNumber)) {
					this.isPhoneError = true
					return
				}
				if (!this.formData.people) {
					this.isPeopleError = true
					return
				}
				if (!this.formData.desk) {
					this.isDeskError = true
					return
				}
				await postOrderInfo(this.formData)
				uni.showModal({
					content: '提交成功',
					showCancel: false,
					success: () => {
						removeStorage("orderDetail")
						uni.redirectTo({
							url: '/pages/manage/manage'
						})
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