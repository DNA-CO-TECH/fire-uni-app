<template>
	<view class="root flex flex-col">
		<view class="nav-wrap"
			:style="`height:${navHeight}px; background: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png'); background-size: 100% ${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/home/yan-red.png"
					@click="handleHome"></image>
				<view class="nav-title" style="flex:1; text-align: center">餐厅预订</view>
			</view>
		</view>
		<view class="book-container" style="flex:1">
			<view class="z-1">
				<ZuiCalendar :loading="loading" rootClass="calender-container" :list="list" :extraData="extraData"
					@click-period="clickPeriod" @click-active="clickActiveDay" @next-month="nextMonth" @last-month="lastMonth">
				</ZuiCalendar>
			</view>
			<button class="next-step mt-12" @click="nextStep">下一步</button>
		</view>
	</view>
</template>

<script>
	import ZuiCalendar from './components/zui-calendar/zui-calendar.vue'
	import {
		getStorage,
		setStorage
	} from "../../utils/storage.js"
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		reqOrderInfo
	} from "/api/order.js"
	import * as format from "../../utils/formatTime.js"
	import {
		systemInfo
	} from "../../store/mixin.js"
	export default {
		components: {
			ZuiCalendar,
		},
		onLoad() {
			this.initBackground("#000000")
			this.dateInfo = format.getDayZeroTimestamp()
			this.getOrdersByDate()
		},
		onShow() {
			this.initBackground("#000000")
			this.dateInfo = format.getDayZeroTimestamp()
			this.getOrdersByDate()
		},
		mixins: [systemInfo],
		data() {
			return {
				list: [{
						time: 0,
						isChosen: true
					},
					{
						time: 1,
						isChosen: false
					}
				],
				upDatakey: '', //为重新渲染DOM值，入不需要则可取消
				extraData: [],
				time: 0,
				loading: false // 日历剩余座位请求loading
			}
		},
		computed: {
			...mapState({
				bookInfo: state => state.bookInfo,
			}),
		},
		methods: {
			...mapMutations(['setBookInfo', 'setDesksLeft']),
			handleHome() {
				uni.navigateBack()
			},
			// 点击日数方法
			clickActiveDay({
				year,
				month,
				date,
				desk0,
				desk1,
				index
			}) {
				this.dateInfo = format.getDayZeroTimestamp(date)
				this.desksleft = this.time === 0 ? desk0 : desk1
				this.activeDayDeskLeft = [desk0, desk1]
			},
			// 点击时间段
			clickPeriod({
				row,
				index
			}) {
				this.list = this.list.map((listItem, listIndex) => {
					return {
						time: listItem.time,
						isChosen: index == listIndex
					}
				})
				this.time = row.time
				this.desksleft = this.activeDayDeskLeft[row.time]
			},
			nextMonth({
				year,
				month
			}) {
				this.getOrdersByDate(format.getDayZeroTimestamp(`${year}-${month}-${1}`))
			},
			lastMonth({
				year,
				month
			}) {
				const currentMonth = new Date().getMonth() + 1
				if (currentMonth === month) {
					this.getOrdersByDate(format.getDayZeroTimestamp(`${year}-${month}-${new Date().getDate()}`))
				} else if (currentMonth < month) {
					this.getOrdersByDate(format.getDayZeroTimestamp(`${year}-${month}-${1}`))
				}
			},
			nextStep() {
				const _time = this.time
				let newBookInfo = this.bookInfo ? {
					...this.bookInfo,
					"dateInfo": this.dateInfo,
					"timeInfo": _time
				} : {
					"dateInfo": this.dateInfo,
					"timeInfo": _time
				};
				this.setBookInfo(newBookInfo)
				this.setDesksLeft(this.desksleft)
				uni.navigateTo({
					url: `/pages/seat-map/seat-map`,
				})
			},
			async getOrdersByDate(date) {
				const currentTime = format.getDayZeroTimestamp()
				this.loading = true
				const res = await reqOrderInfo(date || currentTime);
				if (res) {
					const deskCanbeBooked = res.map((dayInfo) => ({
						date: format.formatDate(dayInfo.date, 'yyyy-MM-dd'),
						value: dayInfo.valueInfo0 + dayInfo.valueInfo1,
						desk0: dayInfo.desk0,
						desk1: dayInfo.desk1,
					}))
					this.extraData = deskCanbeBooked;
					const matchDay = deskCanbeBooked.find(item => item.date === format.formatDate(date, 'yyyy-MM-dd'))
					this.activeDayDeskLeft = [matchDay?.desk0, matchDay?.desk1]
					this.desksleft = this.time === 0 ? matchDay?.desk0 : matchDay?.desk1
				}
				this.loading = false
			}
		}
	}
</script>

<style scoped>
	.nav-wrap .nav-logo {
		width: 40rpx;
		height: 48rpx;
		margin-top: 8rpx;
		position: absolute;
	}

	.nav-title {
		color: #F06627;
	}

	.book-container {
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 0rpx 10rpx 20rpx 10rpx;
	}

	.logo-slogan {
		padding: 0rpx 48rpx 24rpx 48rpx;
		font-size: 16px;
		color: #F06627;
	}

	.book-container .calender-container {
		z-index: 1;
		flex: 1;
		overflow: auto;
	}

	.next-step {
		width: calc(100% - 1.25rem);
		height: 80rpx;
		padding: 0.425rem;
		color: #F06627;
		border: 1px solid #F06627;
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>