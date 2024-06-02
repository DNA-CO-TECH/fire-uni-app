<template>
	<view>
		<!-- 查询 / 新增 -->
		<view>

		</view>
		<!-- 时间段 + 桌子 + 人 -->
		<view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					date: "2024/5/9",
					time: "17:30 ~ 18:30",
					seatsBooked: [{
						desk: 1,
						people: 2,
						seats: [1, 2],
						phone: 17212311231,
					}, {
						desk: 2,
						people: 1,
						seats: [5],
						phone: 16812311231,
					}, {
						desk: 3,
						people: 5,
						seats: [3, 4, 5, 6, 7],
						phone: 18212311231,
					}]
				}]
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
</style>