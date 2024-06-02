import http from '../utils/http'

/**
 * @description 查询日期后三十天的可预订数量
 * @param {*} date 开始日期
 * @returns Promise
 */
export const reqOrderInfo = async (date) => {
	const res = await http.get(`/app/order/order/${date}`)
	if (res.success && res.data) {
		return res.data
	} else {
		return []
	}
}

/**
 * @description 创建订单
 * @param {*} form 
 * @returns Promise
 */
export const postOrderInfo = async (form) => {
	const res = await http.post(`/app/order/createOrUpdate`, form)
	if (res.success && res.data) {
		return res.data
	} else {
		return []
	}
}

/**
 * @description 删除订单
 * @param {*} id
 * @returns Promise
 */
export const deleteOrder = async (id) => {
	const res = await http.delete(`/app/order/order/${id}`)
	if (res.success && res.data) {
		return res.data
	} else {
		return []
	}
}


/**
 * @description 查询个人订单列表
 * @param {*} form 
 *
 * 每页的数量
 * count，
 * 
 * 订单结束日期
 * dateEndInfo	integer($int64)
 * 
 * 订单开始日期
 * dateStartInfo	integer($int64)
 * 
 * 排序
 * order	string
 * 
 * 当前页码
 * page	integer($int32)
 * 
 * 手机号
 * phoneNumber	string
 * 
 * 时间段
 * timeInfo	integer($int32) 0: 17:30 ~ 18:30, 1: 19:00 ~ 20:00
 * 
 * 用户id
 * userId	integer($int64)
 * 
 * @returns Promise
 */
export const getOrderList = async (form) => {
	const res = await http.post(`/app/order/order`, form)
	if (res.success && res.data) {
		return res.data
	} else {
		return []
	}
}