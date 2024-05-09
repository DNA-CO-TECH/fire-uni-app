<template>
	<view class="root">
		<view class="myorders-container fcc-start gap-20">
			<image class="back-image" src="/static/book/bookback.png" />
			<view class="list-item-wrap mt-12" v-for="item in orderList" :key="item.id">
				<view class="list-item flex">
					<view class="image-wrap">
						<image src="/static/myorders/fork.svg" class="w-32 h-32" />
					</view>
					<view class="fcs-between flex-1 w-full">
						<view class="item-title frc-start gap-20">
							<text>{{item.date}}</text>
							<text> {{item.seats.length}}位就餐</text>
						</view>
						<view class="item-time">{{item.time}}</view>
						<view class="frc-end gap-20 w-full">
							<view class="flex-1 frc-center gap-12 cursor-pointer" @click="handleEditOrder(item)">
								<image src="/static/myorders/edit.svg" class="w-14 h-14" />
								<text class="item-operate">修改</text>
							</view>
							<view class="flex-1 frc-center gap-12 cursor-pointer" @click="handleCancelOrder(item)">
								<image src="/static/myorders/back.svg" class="w-14 h-14" />
								<text class="item-operate">取消预订</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="confirm mt-32" @click="confirm">
				<image src="/static/myorders/add.svg" class="w-14 h-14" />
				<text class="item-operate">新增预订</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderList: [{
						id: "1",
						date: "2024-5-8",
						seats: [1, 2],
						time: "17:30 ~ 18:30"
					},
					{
						id: "2",
						date: "2024-5-9",
						seats: [1, 2, 3, 4],
						time: "19:00 ~ 20:00"
					},
				]
			}
		},
		methods: {
			confirm() {
				uni.navigateTo({
					url: '/pages/book/book'
				})
			},
			handleEditOrder() {
				console.log("缓存此数据，打开book页面初始化")
				uni.navigateTo({
					url: '/pages/book/book'
				})
			},
			handleCancelOrder(item) {
				console.log("发送取消的请求，然后刷新当前页面")
				// this.orderList = this.orderList.filter(order => order.id !== item.id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myorders-container {
		display: flex;
		flex-direction: column;
		position: relative;
		height: calc(100% - 40px);
		padding: 20px 20px 20px 20px;
	}

	.myorders-container .back-image {
		position: absolute;
		z-index: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.list-item-wrap {
		z-index: 1;
		width: 100%;
	}

	.image-wrap {
		width: 50px;
	}

	.list-item {
		padding: 16px;
		border: 1px solid #3C3830;
		width: calc(100% - 32px);
		font-size: 16px;
	}

	.confirm {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 48px;
		width: 100%;
		cursor: pointer;
		z-index: 1;
		border: 1px solid #3C3830;

		text {
			padding: 10px;
			text-align: center;
			width: 100%;
		}
	}

	.item-operate,
	.item-title,
	.item-time {
		color: #8B7D7A;
	}

	.confirm .item-operate {
		width: unset;
	}

	.item-time {
		font-size: 12px;
		margin-bottom: 16px;
	}
</style>