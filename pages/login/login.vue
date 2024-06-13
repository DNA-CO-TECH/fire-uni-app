<template>
	<view class="login-container">
		<view class="frc-start gap-16">
			<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/yan_circle.png"
				class="logo" />
			<text class="alipuhui-medium logo-text">炎·薪火</text>
		</view>
		<view class="alipuhui-medium title-description">
			<text>选择登陆身份</text>
		</view>
		<view class="w-full fcs-between gap-24" v-show="!loading">
			<view class="role-item cursor-pointer bg-white frc-start gap-40 p-40" v-if="isAdmin" @click="handleAdmin"
				style="border-radius: 12px;">
				<image src="https://dnamini-1316443200.cos.ap-shanghai.myqcloud.com/yanstatic/manage/admin.png"
					class="avatar" />
				<view class="fcs-between gap-8">
					<text>管理员</text>
					<text style="font-size: 12px;color:darkgray">管理员身份可以修改客户预约信息</text>
				</view>
			</view>
			<view class="role-item cursor-pointer bg-white frc-start gap-40 p-40" @click="handleUser(userInfo.userId)"
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
			this.handleLogin()
		},
		mixins: [systemInfo],
		data() {
			return {
				isAdmin: false,
				userInfo: {},
				loading: true,
			}
		},
		methods: {
			async handleLogin() {
				uni.showLoading({
					title: "加载中"
				})
				this.loading = true
				// #ifdef MP-WEIXIN
				const cache = getStorage("userInfo")
				// #endif
				// #ifdef H5
				const userstr = getStorage("userInfo")
				let cache = JSON.parse(userstr || {})
				// #endif

				// 缓存有就不用请求
				if (cache && cache.userId) {
					console.log("login-handleLogin-cache", cache)
					this.userInfo = cache
					this.isAdmin = cache.isAdmin === 1
					this.loading = false
					uni.hideLoading()
					if (!cache.isAdmin) {
						await this.handleUser(cache.userId)
					}
					return
				}
				console.log("login-handleLogin")
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
							this.isAdmin = data.data.isAdmin === 1
							this.loading = false
							uni.hideLoading()
							if (!data.data.isAdmin) {
								await this.handleUser(data.data.userId)
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
				// 手动去localStorage加token和userInfo
				const token = getStorage('token')
				console.log("token", token);
				const userInfoStr = getStorage('userInfo');
				console.log("userInfoStr", userInfoStr);
				if (userInfoStr) {
					const userInfo = JSON.parse(userInfoStr)
					console.log("userInfo", userInfo);
					this.userInfo = userInfo
					this.isAdmin = userInfo.isAdmin
					this.loading = false
					uni.hideLoading()
					if (!userInfo.isAdmin) {
						this.handleUser(userInfo.userId)
					}
				}
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
	@import "../../font.scss";

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

		.logo-text {
			width: 148rpx;
			height: 44rpx;
			line-height: 44rpx;
		}

		.avatar {
			width: 80rpx;
			height: 80rpx;
		}

		.title-description {
			width: 100%;
			font-size: 20px;
			font-weight: 500;
			margin-top: 36rpx;
			margin-bottom: 112rpx;
		}

		.role-item {
			width: calc(100% - 80rpx);
		}
	}
</style>