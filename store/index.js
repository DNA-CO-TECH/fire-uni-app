import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		bookInfo: {}, // 当前预订的信息，要传给给后台
		desksLeft: [] // 从后台拿到的预订日期对应时间的桌子编号数组，用于前端初始化seat-map页面
	},
	mutations: {
		setBookInfo(state, bookInfo) {
			state.bookInfo = bookInfo
		},
		setDesksLeft(state, desksLeft) {
			state.desksLeft = desksLeft
		}
	},
	getters: {
		deskInfo(state) {
			return state.bookInfo?.desk || [0] //默认预订编号为1的桌子
		}
	},
	actions: {}
})

export default store