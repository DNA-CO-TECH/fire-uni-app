<template>
	<view class="root">
		<view class="book-container">
			<image class="back-image" src="/static/book/bookback.png" />
			<view class="z-1 h-full">
				<ZuiCalendar rootClass="calender-container" :list="list" :extraData="extraData" @click-active="clickActive"
					@click-task="clickTask">
				</ZuiCalendar>
			</view>
			<button class="next-step" @click="bookSeat">下一步</button>
		</view>
	</view>
</template>

<script>
	import ZuiCalendar from './components/zui-calendar/zui-calendar.vue'
	/*  */
	export default {
		components: {
			ZuiCalendar,
		},
		data() {
			return {
				seatsWanted: [],
				list: [{
						time: '17:30 ~ 18:30',
						seatsLeft: 4,
						isChosen: true
					},
					{

						time: '19:00 ~ 20:00',
						seatsLeft: 24,
						isChosen: false
					}
				],
				upDatakey: '', //为重新渲染DOM值，入不需要则可取消
				extraData: [{
					date: '2024-5-7',
					value: '4',
					status: true,
					dot: false,
					active: false
				}, {
					date: '2024-5-8',
					value: '24',
					status: false,
					dot: false,
					active: true
				}]
			}
		},
		methods: {
			// 点击日数方法
			clickActive({
				year,
				month,
				date,
				index
			}) {
				console.log(year, month, date, index)
			},

			// 点击任务方法
			clickTask({
				row,
				index
			}) {
				console.log(row, index)
			},
			bookSeat() {
				uni.navigateTo({
					url: '/pages/seat-map/seat-map'
				})
			},
		}
	}
</script>

<style>
	.book-container {
		display: flex;
		flex-direction: column;
		position: relative;
		height: calc(100% - 20rpx);
		padding: 0px 10rpx 20rpx 10rpx;
	}

	.book-container .back-image {
		position: absolute;
		z-index: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.book-container .calender-container {
		z-index: 1;
		flex: 1;
		overflow: auto;
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
</style>