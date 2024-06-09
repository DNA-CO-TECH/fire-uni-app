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
			<view class="role-item cursor-pointer bg-white frc-start gap-20 p-20" v-if="isAdmin" @click="handleAdmin"
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
	import {
		systemInfo
	} from "../../store/mixin.js"
	export default {
		name: 'login',
		async onLoad() {
			this.initBackground("#F2F2F2")
			await this.handleLogin()
			const info = getStorage("userInfo");
			console.log("info", info);
			if (info) {
				this.isAdmin = info.isAdmin === 1
				console.log("info.isAdmin", info.isAdmin);
			}
		},
		mixins: [systemInfo],
		data() {
			return {
				isAdmin: false
			}
		},
		methods: {
			async handleLogin() {
				const that = this
				// #ifdef MP-WEIXIN
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
						setStorage('userInfo', data.data)
						console.log("data.data", data.data);
						if (data.data) {
							console.log("data.data.isAdmin", data.data.isAdmin);
							that.isAdmin = data.data.isAdmin
							if (!data.data.isAdmin) {
								await that.handleUser()
							}
						}
					},
					fail(e) {
						console.log("fail", e);
					},
					complete(e) {
						console.log("complete", e);
					}
				})
				// #endif

				// #ifdef H5
				const token = getStorage('token')
				console.log("token", token);
				const data = await reqUserInfo();
				setStorage('userInfo', data.data)
				this.isAdmin = data.data.isAdmin
				if (!data.data.isAdmin) {
					await this.handleUser()
				}
				// #endif
			},
			handleAdmin() {
				uni.navigateTo({
					url: "/pages/manage/manage",
				})
			},
			async handleUser() {
				const userInfo = getStorage("userInfo")
				const data = await getOrderList({
					count: 6,
					page: 1,
					userId: userInfo?.userId
				})
				if (data?.last_page && data.last_page > 0) {
					uni.navigateTo({
						url: "/pages/myorders/myorders",
					})
				} else {
					uni.navigateTo({
						url: "/pages/book/book",
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