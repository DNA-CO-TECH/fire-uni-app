<template>
	<view class="login-container">
		<view class="frc-start gap-12">
			<image src="/static/manage/yan_circle.png" class="logo" />
			<text>炎·薪火</text>
		</view>
		<view class="title-description">
			<text>选择登陆身份</text>
		</view>
		<view class="w-full fcs-between gap-12">
			<view class="role-item cursor-pointer bg-white frc-start gap-20 p-20" @click="handleAdmin"
				style="border-radius: 12px;">
				<image src="/static/manage/admin.png" class="avatar" />
				<view class="fcs-between gap-8">
					<text>管理员</text>
					<text style="font-size: 12px;color:darkgray">管理员身份可以修改客户预约信息</text>
				</view>
			</view>
			<view class="role-item cursor-pointer bg-white frc-start gap-20 p-20" @click="handleUser"
				style="border-radius: 12px;">
				<image src="/static/manage/fork.png" class="avatar" />
				<view class="fcs-between gap-8">
					<text>就餐客人</text>
					<text style="font-size: 12px;color:darkgray">预约餐厅座位</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reqLogin,
		reqUserInfo
	} from "../../api/user.js"
	import {
		getStorage
	} from "../../utils/storage.js";
	import {
		setStorage
	} from "/utils/storage.js"
	import {
		getOrderList,
	} from "/api/order.js"
	export default {
		name: 'login',
		onLoad() {
			this.handleLogin()
		},
		methods: {
			async handleLogin() {
				const info = uni.getStorageSync("userInfo");
				console.log("info", info);
				if (info) {
					// 如果信息存在并且这个人不是管理员，获取用户信息以后进入book页面
					const data = await reqUserInfo();
					console.log(data);
					// uni.navigateTo({
					// 	url: '/pages/book/book'
					// })
				} else {
					console.log("调用登录");
					await wx.login({
						success: async (res) => {
							const response = await reqLogin({
								code: res.code,
								username: null,
								avatar: null,
							});
							const token = response.data.token;
							setStorage('token', token)
							const data = await reqUserInfo();
							console.log("data", data);
							setStorage('userInfo', data.data)
							// 如果这个人不是管理员
							if (data.isAdmin) {
								this.handleAdmin()
							} else {
								this.handleUser()
							}
						},
						fail(e) {
							console.log("fail", e);
						},
						complete(e) {
							console.log("complete", e);
						}
					})
				}
			},
			handleAdmin() {
				uni.navigateTo({
					url: "/pages/manage/manage"
				})
			},
			async handleUser() {
				const userInfo = getStorage("userInfo")
				const data = await getOrderList({
					count: 6,
					page: 1,
					userId: userInfo?.userId
				})
				if (data?.success) {
					uni.navigateTo({
						url: "/pages/myorders/myorders"
					})
				} else {
					uni.navigateTo({
						url: "/pages/book/book"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.login-container {
		padding: 80rpx;
		width: calc(100% - 160rpx);
		height: calc(100% - 160rpx);

		.logo {
			width: 48rpx;
			height: 48rpx;
		}

		.avatar {
			width: 96rpx;
			height: 96rpx;
		}

		.title-description {
			width: 100%;
			font-size: 20px;
			font-weight: 700;
			margin-top: 40rpx;
			margin-bottom: 80rpx;
		}

		.role-item {
			width: calc(100% - 40rpx);
		}
	}
</style>