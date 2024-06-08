<template>
	<view class="container">
		<view class="nav-wrap" :style="`height:${navHeight}px;`">
			<!-- 胶囊区域 -->
			<view class="capsule-box"
				:style="`height:${navigationBarHeight}px; min-height:${navigationBarHeight}px; line-height:${navigationBarHeight}px; margin-top:${statusBarHeight}px;`">
				<image class="nav-logo" src="/static/manage/switch.png" @click="handleSwitch"></image>
				<view class="nav-title" style="flex:1; text-align: center">炎·薪火预订记录</view>
			</view>
		</view>
		<view class="search-bar" :style="`padding-top:${navHeight+20}px;`">
			<!-- 查询框（左侧有放大镜图标） -->
			<view class="search-input">
				<input style="font-size: 14px;" type="text" placeholder="通过手机号搜索" @input="onKeyInput" />
				<icon class="iconfont icon-search" type="search" size="14" @click.stop="handleSearch"></icon>
			</view>
			<!-- 新增预订按钮（左侧有+号） -->
			<view>
				<button class="add-order" type="none" @click="addOrder">+ 预订</button>
			</view>
		</view>
		<!-- 订单列表 -->
		<data-list :page="page" :size="size" emptyText="~ 我是有底线的 ~" @load="handleLoad" @refresh="handleRefresh"
			@scrollTolower="handleScrolltolower">
			<view class="list-container">
				<view class="item-list" v-for="(item, itemIndex) in orderList" :key="itemIndex">
					<view class="item-content frc-start gap-20">
						<!-- 日期 -->
						<view class="item-date">{{ new Date(item.dateInfo).getMonth()+1}}月{{new Date(item.dateInfo).getDate()}}日
						</view>
						<!-- 时间段 -->
						<view class="item-time">{{ item.timeInfo===0?'17:30~18:30':'19:00 ~20:00' }}</view>
						<!-- 共x位客人 -->
						<view class="item-guests">共{{ item.orders.length }}位客人</view>
					</view>
					<view class="order-list fcc-start gap-12">
						<view v-for="(order, index) in item.orders" :key="index" :index="index" class="order-item">
							<liu-swipe-action :index="index" @clickItem="(btn)=>{clickItem(item,order,btn)}" :btnList="btnList">
								<view class="slide-left w-full frc-start gap-8">
									<!-- 头像 -->
									<view>
										<image class="avatar" src="/static/manage/fire.svg" />
									</view>
									<view class="order-info">
										<!-- x号桌，x位客人 -->
										<view class="desk-info frc-between" style="font-size: 14px;">
											{{ order.desk.some(num=>num>3)?`吧台${order.desk.filter(d=>d<=3).length>0?','+order.desk.filter(d=>d<=3)+'号桌':''}`:`${order.desk}号桌` }}
											，客人：{{ order.people }}位
										</view>
										<!-- 手机号 + 复制按钮 -->
										<view class="phone-info frc-start">
											<text>{{ `手机号: ${order.phone}` }}</text>
											<button class="copy" @click.stop="copyPhone(order.phone)">复制</button>
										</view>
									</view>
								</view>
							</liu-swipe-action>
						</view>
					</view>
				</view>
			</view>
		</data-list>
	</view>
</template>

<script>
	import {
		debounce
	} from "radash"
	import {
		setStorage,
		getStorage
	}
	from "/utils/storage.js"
	import {
		getOrderList,
		deleteOrder,
	} from "../../api/order"
	import {
		systemInfo
	} from "../../store/mixin.js"
	let phoneNumber = null
	export default {
		onShow() {
			this.initBackground("#F2F2F2")
			this.getSystemInfo()
		},
		mixins: [systemInfo],
		data() {
			return {
				page: 1,
				size: 6,
				btnList: [{
					id: '1',
					name: '修改',
					width: '160rpx',
					bgColor: '#131415',
					color: '#FFFFFF',
					fontSize: '28rpx'
				}, {
					id: '2',
					name: '删除',
					width: '160rpx',
					bgColor: '#ed656d',
					color: '#FFFFFF',
					fontSize: '28rpx'
				}],
				orderList: [
					// 	{
					// 	date: "5月9日",
					// 	time: "17:30 ~ 18:30",
					// 	orders: [{
					// 		desk: [1],
					// 		people: 2,
					// 		phone: 17212311231,
					// 		right: 0
					// 	}, {
					// 		desk: [2],
					// 		people: 1,
					// 		phone: 16812311231,
					// 		right: 0
					// 	}, {
					// 		desk: [3],
					// 		people: 5,
					// 		phone: 18212311231,
					// 		right: 0
					// 	}]
					// },
				]
			}
		},
		methods: {
			async handleRefresh(params, callback) {
				this.orderList = [];
				this.data = [];
				this.total = 0;
				this.page = 1;
				this.size = 6;
				const data = await this.getOrders()
				this.data = data.data;
				this.total = data.last_page;
				callback({
					list: this.data,
					total: this.total,
				});
			},
			async handleScrolltolower(event) {
				if (this.data.length < this.total) {
					await this.loadNextPage();
				}
			},
			async loadNextPage() {
				const currentPage = this.page + 1;
				const pageSize = this.size;
				this.page = currentPage;
				this.size = pageSize;
				const data = await this.getOrders()
				this.data = data.data;
				this.total = data.last_page;
				this.list = this.list.concat(data);
				this.total = this.total;
			},
			async handleLoad(params, callback) {
				this.page = params.page;
				this.size = params.size;
				const data = await this.getOrders()
				this.data = data.data;
				this.total = data.last_page;
				callback({
					list: this.data,
					total: this.total,
				});
			},
			onKeyInput: (event) => {
				phoneNumber = event.detail.value;
			},
			async handleSearch() {
				this.page = 1;
				this.size = 6;
				this.orderList = []
				await this.getOrders();
			},
			async getOrders() {
				const userInfo = getStorage("userInfo")
				let params = {
					count: this.size,
					page: this.page,
				}
				if (phoneNumber) {
					params = Object.assign(params, {
						phoneNumber: phoneNumber
					})
				}
				const data = await getOrderList(params)
				this.orderList = this.orderList.concat(this.formatData(data.data))
				return data
			},
			formatData(ordersData) {
				const orderList = [];
				// Group orders by date and time
				ordersData.forEach(order => {
					let existingDateItem = orderList.find(item =>
						item.dateInfo === ordersData.dateInfo && item.timeInfo === ordersData.timeInfo);
					if (!existingDateItem) {
						existingDateItem = {
							dateInfo: order.dateInfo,
							timeInfo: order.timeInfo,
							orders: [],
						};
						orderList.push(existingDateItem);
					}

					const formattedOrder = {
						orderId: order.orderId,
						desk: order.desk,
						people: order.people,
						phone: order.phoneNumber,
						right: 0,
					};
					existingDateItem.orders.push(formattedOrder);
				});

				return orderList;
			},
			// 点击编辑或者删除按钮
			async clickItem(item, order, {
				index,
				id
			}) {
				if (id === '1') {
					const orderDetail = {
						"dateInfo": item.dateInfo,
						"timeInfo": item.timeInfo,
						...order,
					}
					this.editOrder(orderDetail)
				} else {
					await this.handleDeleteOrder(item, order)
				}
			},
			// 编辑订单
			editOrder(orderDetail) {
				// console.log("editOrder-orderDetail", orderDetail);
				setStorage("orderDetail", orderDetail)
				uni.navigateTo({
					url: `/pages/editOrder/editOrder?orderId=${orderDetail.orderId}`
				})
			},
			// 新增预订
			addOrder() {
				uni.navigateTo({
					url: '/pages/book/book',
				})
			},
			// 删除预订
			async handleDeleteOrder(item, detail) {
				// console.log("item", item);
				uni.showModal({
					title: "是否取消以下预订",
					content: `${item.date} ${item.time} ${detail.people}位就餐\r\n桌号： ${detail.desk}\r\n订餐手机号： ${detail.phone}
					`,
					success: async () => {
						console.log("detail.orderId", detail.orderId);
						await deleteOrder(detail.orderId)
						await this.getOrders()
					},
					cancelText: "取消"
				})
			},
			// 切换角色
			handleSwitch() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			},
			// 复制手机号
			copyPhone(phone) {
				uni.setClipboardData({
					data: phone.toString(),
					success: () => {
						uni.showToast({
							title: '手机号已复制',
							icon: 'none'
						});
					}
				});
			},
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
		background-color: #F2F2F2;
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

	.search-bar {
		display: flex;
		align-items: center;
		padding: 10px;

		.search-input {
			flex: 1;
			background-color: #FFFFFF;
			border-radius: 5px;
			display: flex;
			align-items: center;
			padding: 5px 10px;

			input {
				flex: 1;
			}

			.iconfont {
				font-size: 16px;
			}
		}

		.add-order {
			margin-left: 6px;
			margin-right: 10px;
			font-size: 28rpx;
			padding: 6px 8px;
		}
	}

	.list-container {
		min-height: calc(100vh - 150px);
	}

	.item-list {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;

		.item-content {
			border-bottom: 1px solid #F6F4F4;
			padding: 0px 20rpx 20rpx 20rpx;

			.item-date {
				font-size: 28rpx;
				color: #ffffff;
				background-color: #131415;
				border-radius: 24rpx;
				padding: 8rpx 16rpx;
			}

			.item-time {
				font-size: 28rpx;
			}

			.item-guests {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
			}

		}

		.order-list {

			.order-item {
				width: 100%;
				position: relative;
				padding: 0px 32rpx;

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
					}

					text {
						white-space: nowrap;
					}
				}

				.action-buttons {
					width: 160px;
					height: 100%;
					position: absolute;
					top: 0;
					right: -160px;
					display: flex;
					justify-content: center;
					align-items: center;

					.edit,
					.remove {
						width: 80px;
						height: calc(100% - 64rpx);
						margin: 32rpx 0rpx;
						position: absolute;
						top: 0;
						right: -80px;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 16px;
					}

					.remove {
						background-color: red;
						color: #FFFFFF;
						right: 0;
					}

					.edit {
						background-color: green;
						color: white;
						right: -80px;
					}
				}
			}
		}
	}
</style>