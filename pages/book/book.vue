<template>
	<view class="root flex flex-col">
		<view class="nav-wrap"
			:style="`height:${navBarHeight}px; background: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png'); background-size: 100% ${navBarHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${menuHeight}px; min-height:${menuHeight}px; line-height:${menuHeight}px; bottom:${menuBottom}px;`">
				<image class="nav-logo" src="/static/home/yan.png"></image>
				<view class="nav-title" style="flex:1; text-align: center">餐厅预订</view>
			</view>
			<text class="logo-slogan">燃烧另一种意义</text>
		</view>
		<view class="book-container" style="flex:1">
			<view class="z-1 h-full">
				<ZuiCalendar v-if="extraData" rootClass="calender-container" :list="list" :extraData="extraData"
					@click-period="clickPeriod" @click-active="clickActiveDay" @next-month="nextMonth" @last-month="lastMonth">
				</ZuiCalendar>
			</view>
			<button class="next-step" @click="nextStep">下一步</button>
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
	export default {
		components: {
			ZuiCalendar,
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			uni.setBackgroundColor({
				backgroundColor: "#000000"
			})
			// #endif
			const res = getStorage('menuInfo')
			this.navBarHeight = res?.navBarHeight + 60 || 120
			this.menuHeight = res?.menuHeight || 32
			this.menuBottom = res?.menuBottom || 7

			this.dateInfo = new Date().getTime()
			this.getOrdersByDate()
		},
		data() {
			return {
				navBarHeight: 120,
				menuHeight: 32,
				menuBottom: 7,
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
				extraData: null,
				time: 0
			}
		},
		computed: {
			...mapState({
				bookInfo: state => state.bookInfo,
			}),
		},
		methods: {
			...mapMutations(['setBookInfo', 'setDesksLeft']),
			// 点击日数方法
			clickActiveDay({
				year,
				month,
				date,
				desk0,
				desk1,
				index
			}) {
				this.dateInfo = new Date(date).getTime()
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
				this.getOrdersByDate(new Date(`${year}-${month}-${1}`).getTime())
			},
			lastMonth({
				year,
				month
			}) {
				const currentMonth = new Date().getMonth() + 1
				console.log("currentMonth", currentMonth);
				console.log("month", month);
				if (currentMonth === month) {
					this.getOrdersByDate(new Date(`${year}-${month}-${new Date().getDate()}`).getTime())
				} else if (currentMonth < month) {
					this.getOrdersByDate(new Date(`${year}-${month}-${1}`).getTime())
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
					url: `/pages/seat-map/seat-map`
				})
			},
			async getOrdersByDate(date) {
				const res = await reqOrderInfo(date || new Date().getTime());
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
			}
		}
	}
</script>

<style scoped>
	.capsule-box {
		display: flex;
		padding: 48rpx;
	}

	.nav-wrap .nav-logo {
		width: 40rpx;
		height: 48rpx;
		margin-top: 8rpx;
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