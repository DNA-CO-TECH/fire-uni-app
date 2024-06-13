	<template>
		<view :class="rootClass">
			<view class="date-box">
				<view class="box-list" :style="{ 'margin-bottom': list.length > 0 ? '20rpx' : '0' }">
					<view class="date-top frs-center">
						<view>请预约就餐日期</view>
						<view class="">
							<!-- <view class="icon left-icon" @click="LastYear">
							<view class="iconfont icon-jiantou_xiangzuoliangci"></view>
						</view> -->
							<view class="conter-text">
								<view class="icon left-icon" @click="LastMonth">
									<view class="iconfont icon-xiangzuo1">
										<image
											src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/book/left-arrow.svg" />
									</view>
								</view>
								<text class="month">{{ month }}月</text>
								<view class="icon rigth-icon" @click="NextMonth">
									<view class="iconfont icon-xiangyou1">
										<image
											src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/book/right-arrow.svg" />
									</view>
								</view>
							</view>
							<!-- <view class="icon rigth-icon" @click="NextYear">
							<view class="iconfont icon-jiantou_xiangyouliangci"></view>
						</view> -->
						</view>
					</view>
					<view class="date-center">
						<view class="day-item day-month">
							<image class="back-image"
								src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yan_background2.png" />
						</view>
						<view class="date-week">
							<view class="week-item" v-for="item in weekList" :key="item"><text>周{{ item }}</text></view>
						</view>
						<view v-show="loading" class="fcc-center relative" style="height:712rpx;color:#F06627">
							<text>正在请求...</text>
						</view>
						<view class="day-content"
							:style="{ height: isOpen ? '100rpx' : 'auto', display: loading ? 'none' : 'flex' }">
							<view class="day-item" v-for="(item, index) in dayList" :key="index" :data-index="index"
								@click="toActive(item, index)">
								<text class="day-text" v-if="item.day"
									:class="{ 'current': item.day === new Date().getDate() && month === (new Date().getMonth() + 1), 'actives': item.day === day }">{{ item.day
										? item.day : ''}}</text>
								<text
									:class="{ 'value-text': true, 'text-gold': item.data.value, 'text-gray': item.data.value }">{{ item.data.value }}</text>
							</view>
						</view>
					</view>
				</view>
				<slot name="period">
					<view class="period-box-wrap" v-if="list.length > 0">
						<view class="period-description">请选择就餐时间段</view>
						<view class="period-box">
							<view v-for="(item, index) in list" :key="index" class="period-item"
								@click="toPeriod(item, index)">
								<view :class="`${item.isChosen ? 'time time-chosed' : 'time'}`">
									<text>
										{{ item.time === 0 ? '17:30~18:30' : '19:00 ~20:00' }}
									</text>
								</view>
								<view v-if="item.isChosen" class="time-chosen frc-center">
									<image style="width: 24rpx;height: 16rpx;"
										src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/book/right.svg">
									</image>
								</view>
							</view>
						</view>
					</view>
				</slot>
			</view>
		</view>
	</template>

<script>
export default {
	name: 'zui-calender',
	props: {
		loading: {
			type: Boolean,
			default: false
		},
		rootClass: "",
		list: {
			type: Array,
			default: () => {
				return []
			}
		},
		weekList: {
			type: Array,
			default: () => ['日', '一', '二', '三', '四', '五', '六']
		},
		date: {
			type: Object,
			default: () => {
				return {
					year: new Date().getFullYear(),
					month: parseInt(new Date().getMonth() + 1),
					day: parseInt(new Date().getDate())
				}
			}
		},
		extraData: {
			type: Array,
			default: () => {
				return [{
					date: '2024-5-7',
					value: '4',
					desk0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					desk1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}, {
					date: '2024-5-8',
					value: '24',
					desk0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
					desk1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				}]
			}
		},

		show: {
			type: Boolean,
			default: false
		},

		title: {
			type: String,
			default: ''
		},

		content: {
			type: String,
			default: '--'
		},

		confirmText: {
			type: String,
			default: '确认'
		},

		cancelText: {
			type: String,
			default: '取消'
		},

		showConfirmButton: {
			type: Boolean,
			default: true
		},

		showCancelButton: {
			type: Boolean,
			default: false
		},

		confirmColor: {
			type: String,
			default: '#2979ff'
		},

		cancelColor: {
			type: String,
			default: '#606266'
		},

		closeOnClickOverlay: {
			type: Boolean,
			default: true
		},

		width: {
			type: [Number, String],
			default: '650rpx'
		},
		isShrink: {
			type: Boolean,
			default: false
		},
		isUnfold: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dayList: [],
			year: 2022,
			month: 10,
			day: 10,
			isOpen: false,
		}
	},
	onShow() {
		console.log("extraData", this.extraData)
	},
	watch: {
		extraData: function (val, oldVal) {
			this.initApi(this.year, this.month)
		},
	},
	created() {
		this.isOpen = this.isUnfold
		const {
			year,
			month,
			day
		} = this.date
		this.year = year
		this.month = month
		this.day = day
		this.initTime()
		this.initApi(this.year, this.month)
	},
	methods: {
		formatDateString(dateString) {
			const parts = dateString.split('-');
			const year = parts[0];
			const month = parseInt(parts[1]) < 10 ? '0' + parts[1] : parts[1];
			const day = parseInt(parts[2]) < 10 ? '0' + parts[2] : parts[2];
			return `${year}-${month}-${day}`;
		},

		initTime() {
			const {
				year,
				month,
				day
			} = this.getTiemNowDate()
			this.year = year
			this.month = month
			this.day = day
			//console.log('今日时间为：' + this.year + '-' + this.month + '-' +this.day )
		},
		toShrink() {
			let falg = null
			// console.log(this.year)
			// console.log(this.month)
			// console.log(this.day)
			const dateArr = this.getTime(this.year, this.month);
			// console.log(dateArr)
			const line = dateArr.map((item, index) => {

				// console.log(item.day)
				if (this.day == item.day) {
					console.log(index)
					falg = Math.floor(index / 7)
					return Math.floor(index / 7)
				}
			})
			// console.log(line)
			console.log(falg)
			this.dayList = dateArr.slice(falg * 7, (falg + 1) * 7)
			this.isOpen = true
		},
		toShrinkClose() {
			this.dayList = this.getTime(this.year, this.month)
			this.isOpen = false
		},
		getTiemNowDate() {
			var date = new Date()
			var year = date.getFullYear()
			var month = parseInt(date.getMonth() + 1)
			var day = date.getDate()
			if (month < 10) {
				month = '0' + month
			}

			if (day < 10) {
				day = '0' + day
			}

			const resultDate = {
				year: year,
				month: parseInt(month),
				day: parseInt(day)
			}

			return resultDate
		},

		initApi(year, month) {
			if (this.isShrink && this.isOpen) {
				this.toShrink()
			} else {

				this.dayList = this.getTime(year, month)
			}
		},
		getTime(year, month) {

			return this.creatDayList(year, month)
		},
		creatDayList(year, month) {
			const count = this.getDayNum(year, month)
			const week = new Date(year + '/' + month + '/1').getDay()
			let list = []
			for (let i = 1; i <= count; i++) {
				let data = {};
				for (let item of this.extraData) {
					let dateString = item.date;
					let dateArr = dateString.indexOf('-') !== -1 ? dateString.split('-') : dateString.indexOf('/') !==
						-1 ? dateString.split('/') : [];
					if (dateArr.length === 3 && Number(dateArr[0]) === Number(this.year) && Number(dateArr[1]) ===
						Number(this.month) && Number(dateArr[2]) === Number(i)) {
						data = item
					}
				}

				let obj = {
					day: i,
					data
				}
				list.push(obj)
			}
			for (let i = 0; i < week; i++) {
				// list.unshift(this.getDayNum(year, month - 1) -i)
				list.unshift({
					day: null,
					data: {}
				})
			}
			return list
		},

		getDayNum(year, month) {
			let dayNum = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			if ((year % 4 !== 0) && (year % 100 === 0) || (year % 400 !== 0)) {
				dayNum[1] = 28
			}
			return dayNum[month - 1]
		},

		toActive(item, index) {
			// 当日已经订满
			if (!item.data.value || item.data.value === 0) {
				console.log("当日已经订满或不可预订");
				return
			}
			this.day = item.day
			this.$emit('click-active', {
				year: this.year,
				month: this.month,
				day: item.day,
				date: this.formatDateString(this.year + '-' + this.month + '-' + this.day),
				desk0: item.data.desk0,
				desk1: item.data.desk1,
				index: index
			})
		},

		toPeriod(item, index) {
			this.$emit('click-period', {
				row: item,
				index: index
			})
		},

		LastMonth() {
			// 不可点击本月之前的月份
			const currentMonth = new Date().getMonth() + 1
			if (currentMonth === this.month) {
				return
			}
			if (this.month > 1) {
				this.month = this.month - 1
				this.initApi(this.year, this.month)
			} else {
				this.LastYear(false)
				this.month = 12
				this.initApi(this.year, this.month)
			}

			let desk0 = []
			let desk1 = []

			// 判断是否本月，是的话默认当天
			if (new Date().getMonth() + 1 === this.month) {
				this.day = new Date().getDate()
				desk0 = this.dayList.find(d => d.day === this.day).desk0
				desk1 = this.dayList.find(d => d.day === this.day).desk1
			} else {
				// 否则默认为1
				this.day = 1
				desk0 = this.dayList.find(d => d.day === 1).desk0
				desk1 = this.dayList.find(d => d.day === 1).desk1
			}

			this.$emit('last-month', {
				year: this.year,
				month: this.month,
				day: 1,
				date: this.formatDateString(this.year + '-' + this.month + '-' + this.day),
				desk0: desk0,
				desk1: desk1,
			})
		},

		NextMonth() {
			if (this.month < 12) {
				this.month = this.month + 1
			} else {
				this.NextYear(false)
				this.month = 1
			}
			this.initApi(this.year, this.month)
			this.day = 1
			const desk0 = this.dayList.find(d => d.day === 1).desk0
			const desk1 = this.dayList.find(d => d.day === 1).desk1
			console.log("NextMonth-this.month", this.month);
			console.log("NextMonth-this.date", this.formatDateString(this.year + '-' + this.month + '-' + 1));
			this.$emit('next-month', {
				year: this.year,
				month: this.month,
				day: 1,
				date: this.formatDateString(this.year + '-' + this.month + '-' + 1),
				desk0: desk0,
				desk1: desk1,
			})
		},

		LastYear(flag = true) {
			if (this.year > 2000) {
				this.year = this.year - 1
				if (flag) {
					this.initApi(this.year, this.month)
				}
				this.$emit('last-year', {
					year: this.year,
					month: this.month,
					day: this.day
				})
			}
		},

		NextYear(flag = true) {
			this.year = this.year + 1
			this.initApi(this.year, this.month)
			this.$emit('next-year', {
				year: this.year,
				month: this.month,
				day: this.day
			})
		},

		confirm() {
			this.$emit('confirm')
		},

		cancel() {
			this.$emit('cancel')
		},

		close() {
			this.$emit('close')
		}
	}
}
</script>

<style lang="scss" scoped>
.iconfont {
	height: 40rpx;
}

.date-box {
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 40rpx 20rpx;

	.box-list {
		background-color: transparent;
		color: #8e8e8e;
		border-radius: 20rpx;

		.date-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 32rpx;
			background-color: #22262D6D;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
			font-size: 28rpx;

			.icon {
				color: #8e8e8e;
				width: 40rpx;
				height: 40rpx;
				line-height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}

			.conter-text {
				font-size: 32rpx;
				font-weight: bold;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.month {
					padding: 0 40rpx;
					font-size: 28rpx;
				}
			}
		}

		.date-center {
			position: relative;

			.date-week {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
				padding: 20rpx;
				z-index: 2;

				.week-item {
					z-index: 2;
					display: flex;
					justify-content: center;
					align-items: center;
					width: calc(100%/7);
					height: 52rpx;
					text-align: center;
					font-size: 28rpx;
					color: #8e8e8e;
				}
			}

			.day-month {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				// color: rgba(231,232,234,.83);
				font-size: 200px;
				font-weight: 700;
				color: #8e8e8e;
				text-align: center;
				line-height: 1;
			}

			.back-image {
				position: absolute;
				z-index: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}

		.day-content {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			padding: 10rpx 20rpx;
			position: relative;

			.day-item {
				display: flex;
				flex-direction: column;
				// justify-content: center;
				align-items: center;
				width: calc(100%/7);
				height: 120rpx;
				text-align: center;
				font-size: 28rpx;
				z-index: 2;
				position: relative;

				.day-text {
					width: 56rpx;
					height: 56rpx;
					line-height: 56rpx;

					&.current {
						box-sizing: border-box;
						border: 1px solid #F06627;
						border-radius: 6rpx;
						border-radius: 50%;
					}

					// margin-bottom: 5rpx;
					&.actives {
						color: black;
						box-sizing: border-box;
						background-color: #F06627;
						border-radius: 6rpx;
						border-radius: 50%;
					}
				}

				.value-text {
					font-size: 22rpx;
					color: #8e8e8e;

					&.text-gold {
						color: #F06627;
						font-size: 22rpx;
					}

					.text-gray {
						color: #ccc;
						font-size: 22rpx;
					}
				}
			}
		}

		.toggle {
			position: relative;
			padding: 10rpx 0;
			margin: 10rpx 20rpx 0;
			display: flex;
			justify-content: center;

			&:before {
				width: calc(50% - 30rpx);
				border-top: solid 1px #EAEAEA;
				content: '';
				display: block;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}

			&:after {
				width: calc(50% - 30rpx);
				border-top: solid 1px #EAEAEA;
				content: '';
				display: block;
				position: absolute;
				top: 50%;
				right: 0;
				transform: translateY(-50%);
			}
		}
	}

	.period-box-wrap {
		display: flex;
		flex-direction: column;

		.period-box {
			display: flex;
			flex-direction: row;
			gap: 16rpx;
		}

		.period-description {
			padding: 24rpx 32rpx;
			background-color: #22262D6D;
			color: #8e8e8e;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
			font-size: 28rpx;
			margin-bottom: 16rpx;
		}

		.period-item {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			background-color: transparent;
			padding: 20rpx;
			height: 56px;
			box-sizing: border-box;
			border-radius: 16rpx;
			background-color: #22262D6D;
			color: #8e8e8e;
			position: relative;
			cursor: pointer;

			.time {
				font-size: 24rpx;
				color: #8e8e8e;
			}

			.time-chosen {
				position: absolute;
				width: 48rpx;
				height: 40rpx;
				right: 0px;
				bottom: 0px;
				background: #F06627;
				border-top-left-radius: 16rpx;
				border-bottom-right-radius: 16rpx;
			}

			.time-chosed {
				color: #F06627;
			}
		}
	}
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
		background-color: rgba(0, 0, 0, 0.5);
	}

	.z-content {
		z-index: 10075;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		inset: 0px;

		.modal-content {
			border-radius: 6px;
			overflow: hidden;
			margin-top: 0px;
			// height: 200px;
			background-color: #fff;
			position: relative;

			.z-modal {
				width: 289px;
				border-radius: 6px;
				overflow: hidden;

				.modal-title {
					font-size: 16px;
					font-weight: 700;
					color: #606266;
					text-align: center;
					padding-top: 25px;
				}

				.z-modal-content {
					padding: 12px 25px 25px 25px;
					display: flex;
					flex-direction: row;
					justify-content: center;
					font-size: 15px;
					color: #606266;
				}

				.line {
					margin: 0px;
					border-bottom: 1px solid rgb(214, 215, 217);
					width: 100%;
					transform: scaleY(0.5);
					border-top-color: rgb(214, 215, 217);
					border-right-color: rgb(214, 215, 217);
					border-left-color: rgb(214, 215, 217);
					vertical-align: middle;
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

					.foot-line {
						margin: 0px;
						border-left: 1px solid rgb(214, 215, 217);
						height: 48px;
						transform: scaleX(0.5);
						border-top-color: rgb(214, 215, 217);
						border-right-color: rgb(214, 215, 217);
						border-bottom-color: rgb(214, 215, 217);
					}

					.confirm {
						flex: 1;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						height: 48px;

						text {
							color: rgb(41, 121, 255);
						}
					}
				}
			}

		}
	}
}
</style>