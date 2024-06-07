<template>
	<view class="root flex flex-col">
		<view class="nav-wrap" :style="{
			    height: `${navHeight}px`,
			    background: isEdit ? '#FFFFFF' : `url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png')`,
			    backgroundSize: '100% ' + navHeight + 'px'
			  }">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" :src="`${isEdit?'/static/manage/left-arrow.svg':'/static/book/left-arrow.png'}`"
					@click="handleBack"></image>
				<view class="nav-title" :style="{'flex':1, 'text-align': 'center', color: isEdit?'#131415':''}">
					{{isEdit?'修改':'选择'}}餐桌位置
				</view>
			</view>
		</view>
		<view class="book-container fcc-start" :style="{backgroundColor: isEdit?'#FFFFFF':'#131415'}">
			<view class="container z-1 flex-1 mt-12">
				<view :class="`${isEdit?'restaurant isEdit':'restaurant'}`">
					<view class="left">
						<!-- 第 1 个桌子 -->
						<view class="table1-wrap">
							<view class="flex seat-row">
								<view v-for="seatIndex in [1,2]" :key="seatIndex" @click="toggleBookSeats(0,seatIndex)" :class="{ 
									'seat': true,
									'seat-top': true,
									'select-booked': myBookSeatsIds.includes(seatIndex),
									'booked': tableStatus[0] === 0,
									'not-booked':  tableStatus[0] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
							<view :class="{ 
								'table': true,
								'booked': tableStatus[0] === 0,
								'not-booked': tableStatus[0] !== 0 }">
								{{tableStatus[0] === 0?'不可预订':"点击预订"}}
							</view>
							<view class="flex seat-row">
								<view v-for="seatIndex in [3,4]" :key="seatIndex" @click="toggleBookSeats(0,seatIndex)" :class="{ 
										'seat': true,
										'seat-bottom': true,
										'select-booked': myBookSeatsIds.includes(seatIndex),
										'booked': tableStatus[0] === 0,
										'not-booked':   tableStatus[0] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
						</view>
						<!-- 第 2 个桌子 -->
						<view class="table2-wrap">
							<view class="fcc-between gap-12">
								<view v-for="seatIndex in [5,6,7]" :key="seatIndex" @click="toggleBookSeats(1,seatIndex)" :class="{ 
									'seat': true,
									'seat-left': true,
									'select-booked': myBookSeatsIds.includes(seatIndex),
									'booked':  tableStatus[1] === 0,
									'not-booked': tableStatus[1] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
							<view :class="{ 'table2': true,
								'booked':  tableStatus[1] === 0,
								'not-booked': tableStatus[1] !== 0 }">
								{{ tableStatus[1] === 0 ? '不可预订':"点击预订"}}
							</view>
							<view class="fcc-center gap-12">
								<view v-for="seatIndex in [8,9,10]" :key="seatIndex" @click="toggleBookSeats(1,seatIndex)" :class="{
									'seat': true,
									'seat-right': true,
									'select-booked': myBookSeatsIds.includes(seatIndex),
									'booked':  tableStatus[1] === 0,
									'not-booked':  tableStatus[1] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
						</view>
						<!-- 第 3 个桌子 -->
						<view class="table3-wrap">
							<view class="flex seat-row">
								<view v-for="seatIndex in [11,12]" :key="seatIndex" @click="toggleBookSeats(2,seatIndex)" :class="{
										'seat': true,
										'seat-top': true,
										'select-booked': myBookSeatsIds.includes(seatIndex),
										'booked':  tableStatus[2] === 0,
										'not-booked': tableStatus[2] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
							<view :class="{ 
									'table': true,
									'booked':  tableStatus[2] === 0,
									'not-booked':  tableStatus[2] !== 0 }">
								{{tableStatus[2] === 0?'不可预订':"点击预订"}}
							</view>
							<view class="flex seat-row">
								<view v-for="seatIndex in [13,14]" :key="seatIndex" @click="toggleBookSeats(2,seatIndex)" :class="{ 
										'seat': true,
										'seat-bottom': true,
										'select-booked': myBookSeatsIds.includes(seatIndex),
										'booked':  tableStatus[2] === 0,
										'not-booked':  tableStatus[2] !== 0 }">
									{{isEdit && myBookSeatsIds.includes(seatIndex) ?"✔":""}}
								</view>
							</view>
						</view>
					</view>
					<view class="right">
						<!-- 吧台 -->
						<view class="bar-wrap">
							<view class="fcc-between" :style="{padding:'20px 0px'}">
								<view @click="toggleBookSeats(tableIndex)" v-for="tableIndex in [3,4,5,6,7,8,9,10]" :key="tableIndex"
									:class="{ 'seat': true,
														'seat-left': true,
														'select-booked': myBookTableIds.includes(tableIndex),
														'booked':!myBookTableIds.includes(tableIndex) &&tableStatus[tableIndex]===0,
														'not-booked':!myBookTableIds.includes(tableIndex) && tableStatus[tableIndex]!== 0 }">
									{{isEdit && myBookTableIds.includes(tableIndex) ?"✔":""}}
								</view>
							</view>
							<view class="bar-back fcs-between relative">
								<view class="bar">
									<view style="width: 22px;border:none" :class="{ 
										'fcc-center': true, 
										'booked': leftBarSeats===0 && tableStatus.some(table=>table===0),
										'not-booked': leftBarSeats!==0 && tableStatus.some(table=>table===1) }">
										<text>开放式吧台 — 剩余座位</text>
										<text style="margin-left: -0.7em">{{leftBarSeats}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="bar-tip">* 请点击座位进行预订</view>
					</view>
					<view class="light-mask" :style="{display: isEdit ? 'none' : `block`}">
						<view class="light"></view>
					</view>
				</view>
			</view>
			<view class="frc-center gap-20" style="width: calc(100% - 24px); margin:'0px 12px';height: 172rpx" v-if="isEdit">
				<button class="flex-1 next-step" style="color:#000000" @click="clear">清空选择</button>
				<button class="flex-1 next-step next-step-black" @click="save">保存修改</button>
			</view>
			<view class="frc-center" style="height: 172rpx" v-else>
				<input :class="{'phone':true,'phone-empty':phoneNumberEmpty}" name="input" placeholder="请输入预约人手机号"
					@input="onKeyInput" />
				<button class="next-step" @click="confirm">立即预订</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		postOrderInfo,
		reqOneDaySeatsLeft
	} from "../../api/order.js"
	import {
		getStorage,
		setStorage
	} from "../../utils/storage.js"
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		systemInfo
	} from "../../store/mixin.js"
	import * as format from "../../utils/formatTime.js"
	export default {
		async onLoad(options) {
			if (options && options.edit === "1") {
				this.isEdit = true
				await this.initDayBookInfo()
				this.tableStatus = this.getTableBookArray()
			} else {
				this.tableStatus = this.getTableBookArray()
			}
			this.initBackground(this.isEdit ? "#FFFFFF" : "#000000")
		},
		mixins: [systemInfo],
		data() {
			return {
				tableStatus: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0代表已经被别人预订，1代表可以预订，吧台椅子视为桌子，后八个元素都是代表吧台座位
				myBookTableIds: [], // 选中的桌子
				myBookSeatsIds: [], // 选中的椅子
				phoneNumberEmpty: false,
				phoneNumber: null,
				isEdit: false
			}
		},
		computed: {
			...mapState({
				bookInfo: state => state.bookInfo,
				desksLeft: state => state.desksLeft,
			}),
			leftBarSeats() {
				// 吧台8个座位，减去被别人订的和自己选中的，剩余座位
				let availableBarSeats = 0;
				for (let tableIndex = 3; tableIndex <= 10; tableIndex++) {
					if (this.tableStatus[tableIndex] === 1) {
						const seatAvailable = this.tableStatus[tableIndex] === 1 && !this.myBookTableIds.includes(tableIndex);
						if (seatAvailable) {
							availableBarSeats++;
						}
					}
				}
				return availableBarSeats;
			}
		},
		methods: {
			clear() {
				this.myBookTableIds = []
				this.myBookSeatsIds = []
			},
			save() {
				const orderDetail = getStorage("orderDetail")
				const tempOrderDetail = {
					...orderDetail,
					"desk": this.myBookTableIds.map(id => id + 1),
					"people": this.myBookSeatsIds.length + this.myBookTableIds.filter(tableId => tableId > 2)
						.length, // 预订人数
				}
				setStorage("orderDetail", tempOrderDetail)
				uni.navigateBack()
			},
			async initDayBookInfo() {
				const orderDetail = getStorage("orderDetail")
				const reqTime = orderDetail.dateInfo
				const res = await reqOneDaySeatsLeft(reqTime)
				this.seatsLeft = res
			},
			onKeyInput: function(event) {
				this.phoneNumber = event.detail.value;
				this.phoneNumberEmpty = false
			},
			async confirm() {
				if (this.myBookTableIds.length === 0) {
					uni.showModal({
						title: "提交失败",
						content: "请至少预订一个座位"
					})
				} else if (!this.phoneNumber) {
					this.phoneNumberEmpty = true
				} else {
					const response = await postOrderInfo({
						"desk": this.myBookTableIds.map(id => id + 1),
						"people": this.myBookSeatsIds.length + this.myBookTableIds.filter(tableId => tableId > 2)
							.length, // 预订人数
						"phoneNumber": this.phoneNumber,
						...this.bookInfo,
					});
					if (response) {
						uni.showModal({
							title: "预订成功",
							content: "点击确认，进入订单页查看",
							showCancel: false,
							success: () => {
								uni.navigateTo({
									url: '/pages/myorders/myorders',
								})
							}
						})
					}
				}
			},
			handleBack() {
				uni.navigateBack()
			},
			getTableBookArray(val) {
				const tableBookArray = new Array(11).fill(0); // 0代表已经被预订，不可预订了，1代表可以预订
				if (this.isEdit) {
					const orderDetail = getStorage("orderDetail")
					let desksLeft = [] // 后台显示的剩余的桌子编号
					if (orderDetail.timeInfo === 0) {
						desksLeft = this.seatsLeft.desk0
					} else {
						desksLeft = this.seatsLeft.desk1
					}
					const deskEditing = Array.from(new Set(orderDetail.desk.concat(desksLeft))) // 订单中已经被选的desk，状态设置为可以重新选

					for (const deskNumber of deskEditing) {
						tableBookArray[deskNumber - 1] = 1;
					}
					this.myBookTableIds = orderDetail.desk.map(d => d - 1)
					this.myBookSeatsIds = this.initSeatsIds(orderDetail.desk)
					return tableBookArray
				} else {
					for (const deskNumber of this.desksLeft) {
						tableBookArray[deskNumber - 1] = 1;
					}
				}
				return tableBookArray;
			},
			// 吧台只传递桌子id, 吧台一个椅子视为一个桌子
			toggleBookSeats(tableIndex, seatIndex) {
				if (this.tableStatus?.[tableIndex] === 0) {
					return false
				}
				const tableIndexSet = new Set(this.myBookTableIds) // 桌子index从0开始
				const seatsIndexSet = new Set(this.myBookSeatsIds) // 椅子index从1开始
				// 当参数只有桌子，就是吧台的处理逻辑
				if (!seatIndex) {
					tableIndexSet.has(tableIndex) ? tableIndexSet.delete(tableIndex) : tableIndexSet.add(tableIndex)
					this.myBookTableIds = Array.from(tableIndexSet)
				}
				// 当参数有桌子和椅子
				else if (seatIndex) {
					// 已经点过这个椅子则取消椅子的选取，
					if (seatsIndexSet.has(seatIndex)) {
						seatsIndexSet.delete(seatIndex)
						// console.log("tableIndex", tableIndex)
						// console.log("seatsIndexSet", seatsIndexSet)
						switch (tableIndex) {
							case 0:
								// 0号桌子1，2，3，4座位都没有被订，才能取消桌子的选取
								if (!(seatsIndexSet.has(1) || seatsIndexSet.has(2) ||
										seatsIndexSet.has(3) || seatsIndexSet.has(4))) {
									tableIndexSet.delete(0)
									this.myBookTableIds = Array.from(tableIndexSet)
								}
							case 1:
								// 1号桌子5，6，7，8，9，10座位都没有被订，才能取消桌子的选取
								if (!(seatsIndexSet.has(5) || seatsIndexSet.has(6) || seatsIndexSet.has(7) ||
										seatsIndexSet.has(8) || seatsIndexSet.has(9) || seatsIndexSet.has(10))) {
									tableIndexSet.delete(1)
									this.myBookTableIds = Array.from(tableIndexSet)
								}
							case 2:
								// 2号桌子11，12，13，14座位都没有被订，才能取消桌子的选取
								if (!(seatsIndexSet.has(11) || seatsIndexSet.has(12) ||
										seatsIndexSet.has(13) || seatsIndexSet.has(14))) {
									tableIndexSet.delete(2)
									this.myBookTableIds = Array.from(tableIndexSet)
								}
							default:
								console.log("取消了选择")
						}
					} else {
						// 没有点过这个椅子则选择椅子, 桌子如果没选就选一下
						seatsIndexSet.add(seatIndex)
						if (!tableIndexSet.has(tableIndex)) {
							tableIndexSet.add(tableIndex)
							this.myBookTableIds = Array.from(tableIndexSet)
						}
					}
					this.myBookSeatsIds = Array.from(seatsIndexSet)
				}
			},
			initSeatsIds(desks) {
				let ids = []

				if (desks.includes(1)) {
					ids = ids.concat([1, 2, 3, 4])
				}
				if (desks.includes(2)) {
					ids = ids.concat([5, 6, 7, 8, 9, 10])
				}
				if (desks.includes(3)) {
					ids = ids.concat([11, 12, 13, 14])
				}
				return ids
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
	}

	.nav-wrap .nav-logo {
		width: 36rpx;
		height: 34rpx;
		margin-top: 8rpx;
		cursor: pointer;
	}

	.nav-title {
		color: #F06627;
	}

	.book-container {
		margin-top: 160rpx;
		height: calc(100% - 160rpx);
	}

	.book-container {
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 0rpx 10rpx 20rpx 10rpx;

		.back-image {
			position: absolute;
			z-index: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.phone {
			color: #C8CACE;
			height: 70rpx;
			border-right: none;
			border-left: 1px solid;
			border-top: 1px solid;
			border-bottom: 1px solid;
			border-color: #423A38;
			border-top-left-radius: 12rpx;
			border-bottom-left-radius: 12rpx;
			padding-left: 24rpx;
			font-size: 28rpx;
		}

		.phone-empty {
			border-color: #EE692C;
		}

		.next-step {
			width: 200rpx;
			height: 70rpx;
			color: white;
			background-color: #EE692C;
			font-size: 28rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.next-step-black {
			background-color: #000000;
			width: 100%;
		}

		.container {
			height: 100%;
			width: calc(100% - 60rpx);
			margin: 0 30rpx;
			overflow-y: auto;
			overflow-x: hidden;
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
			justify-content: center;
			z-index: 2;
		}

		.restaurant .left {
			gap: 40rpx;
		}

		.bar-wrap {
			display: flex;
			justify-content: flex-end;
			width: 320rpx;
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
			font-size: 24rpx;
			border: 4rpx solid;
			letter-spacing: 2px;
			width: 140rpx;
			height: 90rpx;
			margin: 6rpx auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.table2 {
			display: flex;
			justify-content: center;
			align-items: center;
			writing-mode: tb;
			letter-spacing: 4px;
			font-size: 24rpx;
			width: 88rpx;
			height: 300rpx;
			border: 4rpx solid;
			margin-left: 6rpx;
			margin-right: 6rpx;
		}

		.table2 text {
			display: flex;
			justify-content: center;
			align-items: center;
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
			border: 2rpx solid;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.bar-back {
			background-image: url(/static/book/bar.svg);
			background-repeat: no-repeat;
			width: 224rpx;
			height: 896rpx;
			margin-left: 6rpx;
			background-size: 100% 100%;
		}

		.bar-tip {
			position: absolute;
			right: 10px;
			bottom: 10px;
			color: #907f6c;
			font-size: 24rpx;
		}

		.light-mask {
			position: absolute;
			width: 100%;
			height: 100%;
			bottom: 0px;
			right: 0px;
			z-index: 1;
			background: linear-gradient(0deg, #131415 0.88%, rgba(19, 20, 21, 0.001) 100%);
			border-radius: 20rpx;
		}

		.light {
			position: absolute;
			width: 100%;
			height: 100%;
			bottom: 0px;
			right: 0px;
			z-index: -1;
			background-image: url(/static/book/light.png);
			background-repeat: no-repeat;
			background-size: cover;
			backdrop-filter: blur(70px);
			opacity: 0.6;
		}

		.bar {
			height: 840rpx;
			width: 126rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		.bar text {
			font-size: 24rpx;
		}

		.booked {
			color: #907f6c;
			border: 2px solid #423A38;
		}

		.not-booked {
			color: #d05f2e;
			border: 2px solid #4D2615;
		}

		.select-booked {
			color: #F06627;
			border: 2px solid #F06627;
		}

		.isEdit {
			.booked {
				color: #ACACAC;
				border: 2px solid #DFDFDF;
			}

			.not-booked {
				color: #4D2615;
				border: 2px solid #4D2615;
			}

			.select-booked {
				color: #4D2615;
				border: 2px solid #4D2615;
				background-color: #d8d8d8;
			}
		}

		.seat-left {
			border-top-left-radius: 50%;
			border-bottom-left-radius: 50%;
			border-right: 0px !important;
		}

		.seat-right {
			border-top-right-radius: 50%;
			border-bottom-right-radius: 50%;
			border-left: 0px !important;
		}

		.seat-top {
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			border-bottom: 0px !important;
		}

		.seat-bottom {
			border-bottom-left-radius: 50%;
			border-bottom-right-radius: 50%;
			border-top: 0px !important;
		}
	}
</style>