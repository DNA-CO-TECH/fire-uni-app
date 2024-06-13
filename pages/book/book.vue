<template>
	<view class="root flex flex-col">
		<view class="nav-wrap"
			:style="`height:${navHeight}px; background: url('https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background1.png'); background-size: 100% ${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/home/yan_red.png"
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
		async onLoad() {
			console.log("onLoad");
			this.initBackground("#000000")
			this.dateInfo = Date.now()
			console.log("onLoad-this.dateInfo", this.dateInfo);
			await this.getOrdersByDate()
		},
		onShow() {
			console.log("onShow");
			this.initBackground("#000000")
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
				let userInfo = getStorage("userInfo")
				// #ifdef MP-WEIXIN
				if (!userInfo.userId) {
					return
				}
				// #endif
				// #ifdef H5
				userInfo = JSON.parse(userInfo)
				if (!userInfo.userId) {
					return
				}
				// #endif
				if (userInfo.isAdmin) {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
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
				console.log("date", date);
				const time = new Date(date).getTime()
				this.dateInfo = time
				console.log("dateInfo", time);
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
				month,
				date,
				desk0,
				desk1,
			}) {
				this.dateInfo = new Date(date).getTime()
				this.desksleft = this.time === 0 ? desk0 : desk1
				this.activeDayDeskLeft = [desk0, desk1]
				this.getOrdersByDate(format.getDayZeroTimestamp(`${year}/${month}/01`))
				console.log("format.getDayZeroTimestamp(`${year}/${month}/01`)", format.getDayZeroTimestamp(
					`${year}/${month}/01`));
				console.log("month", month);
			},
			lastMonth({
				year,
				month,
				date,
				desk0,
				desk1,
			}) {
				const currentMonth = new Date().getMonth() + 1
				this.dateInfo = new Date(date).getTime()
				this.desksleft = this.time === 0 ? desk0 : desk1
				this.activeDayDeskLeft = [desk0, desk1]
				if (currentMonth === month) {
					this.getOrdersByDate(format.getDayZeroTimestamp(`${year}/${month}/${new Date().getDate()}`))
				} else if (currentMonth < month) {
					this.getOrdersByDate(format.getDayZeroTimestamp(`${year}/${month}/01`))
				}
			},
			nextStep() {
				// if(Date.parse(this.dateInfo))
				const that = this
				const matchDay = this.extraData.find(exdata => exdata.date === format.formatDate(that.dateInfo, 'yyyy-MM-dd'))
				console.log("matchDay", matchDay);
				console.log("this.extraData", this.extraData);
				console.log("that.dateInfo", that.dateInfo);
				if (matchDay) {
					const isNoSeatLeft = matchDay.value === 0
					if (isNoSeatLeft) {
						uni.showToast({
							title: "当天无空座"
						})
						return
					} else {
						const _time = this.time
						console.log("this.bookInfo", this.bookInfo);
						console.log("this.dateInfo", this.dateInfo);
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
					}
				} else {
					console.log("matchDay", matchDay);
				}
			},
			async getOrdersByDate(date) {
				console.log("getOrdersByDate", date);
				const currentTime = format.getDayZeroTimestamp()
				this.loading = true
				const res = await reqOrderInfo(date || currentTime);
				console.log("res", res);
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