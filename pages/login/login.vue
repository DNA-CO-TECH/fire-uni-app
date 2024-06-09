<template>
	<view class="login-container">
		<view class="frc-start gap-12">
			<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/yan_circle.png"
				class="logo" />
			<text>炎·薪火</text>
		</view>
		<view class="title-description">
			<text>选择登陆身份</text>
		</view>
		<view class="w-full fcs-between gap-12" v-show="userInfo.userId">
			<view class="role-item cursor-pointer bg-white frc-start gap-20 p-20" v-if="isAdmin" @click="handleAdmin"
				style="border-radius: 12px;">
				<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/admin.png"
					class="avatar" />
				<view class="fcs-between gap-8">
					<text>管理员</text>
					<text style="font-size: 12px;color:darkgray">管理员身份可以修改客户预约信息</text>
				</view>
			</view>
			<view class="role-item cursor-pointer bg-white frc-start gap-20 p-20" @click="handleUser(userInfo.userId)"
				style="border-radius: 12px;">
				<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/fork.png" class="avatar" />
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
		onLoad() {
			console.log("login-onLoad")
			this.initBackground("#F2F2F2")
			this.handleLogin()
		},
		onShow() {
			console.log("login-onShow")
			this.initBackground("#F2F2F2")
		},
		mixins: [systemInfo],
		data() {
			return {
				isAdmin: false,
				userInfo: {}
			}
		},
		methods: {
			handleLogin() {
				const cache = getStorage("userInfo")
				// 缓存有就不用请求
				if (cache && cache.userId) {
					console.log("login-handleLogin", cache)
					return
				}
				console.log("login-handleLogin")
				this.isHandleLogin = true
				const that = this
				// #ifdef MP-WEIXIN
				wx.login({
					success: async (res) => {
						const response = await reqLogin({
							code: res.code,
							username: null,
							avatar: null,
						});
						console.log("login-reqLogin")
						const token = response.data.token;
						setStorage('token', token)
						const data = await reqUserInfo();
						console.log("login-reqUserInfo")
						setStorage('userInfo', data.data)

						if (data.data) {
							this.userInfo = data.data
							that.isAdmin = data.data.isAdmin === 1
							if (!data.data.isAdmin) {
								await that.handleUser(data.data.userId)
							}
						}
					},
					fail(e) {
						console.log("fail", e);
					},
					complete(e) {
						console.log("complete", e);
						this.isHandleLogin = false
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
					await this.handleUser(data.data.userId)
				}
				this.isHandleLogin = false
				// #endif
			},
			handleAdmin() {
				uni.navigateTo({
					url: "/pages/manage/manage",
				})
			},
			async handleUser(_userId) {
				console.log("login-handleUser");
				if (_userId) {
					const data = await getOrderList({
						count: 6,
						page: 1,
						userId: _userId
					})
					console.log("login-getOrderList");
					if (data && data.last_page && data.last_page > 0) {
						uni.navigateTo({
							url: "/pages/myorders/myorders",
						})
					} else {
						uni.navigateTo({
							url: "/pages/book/book",
						})
					}
				} else {
					console.log("userId none");
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