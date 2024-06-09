import ajax from 'uni-ajax'
// 导入封装的本地存储操作模块
import {
	getStorage,
	clearStorage
} from './storage'
// 导入封装的增强 API
import {
	env
} from "@/utils/env"

// 对类进行实例化
const instance = ajax.create({
	baseURL: env.baseURL,
	timeout: 5000
})

// 添加请求拦截器 (在请求发送之前对请求参数进行新增或者修改)
instance.interceptors.request.use((config) => {
	// 需要先从本地获取到存储的 token
	const token = getStorage('token');

	// 如果本地存在 token，这时候就需要在请求头中添加 token 字段
	if (token) {
		config.header['token'] = token
	}

	// 在发送请求之前做些什么
	return config
}, err => {
	console.error('is global fail request interceptor: ', err);
	return false;
});

// 添加响应拦截器 (在服务器响应数据以后，对返回的数据进行逻辑处理)
instance.interceptors.response.use((res, config) => {
	const {
		statusCode,
		data
	} = res;
	if (statusCode !== 200) {
		uni.showToast({
			title: "状态码：" + statusCode,
			content: "请求失败"
		})
		return Promise.reject(res)
	}

	// 需要开发者对返回的参数进行逻辑判断
	// 需要对后端返回的业务状态码进行判断
	// 业务状态码 === 200，接口调用成功，服务器成功返回了数据
	// 业务状态码 === 208，没有 token 或者 token 失效，需要让用户重新进行登录
	// 业务状态码既不等于 200，也不等于 208，说明出现了其他异常，需要给用户统一进行提示
	switch (data.code) {
		case 0:
			return data

		case 200:
			// 接口调用成功，服务器成功返回了数据，只需要将数据简化以后返回即可
			console.log("data222", data)
			return Promise.resolve(data)

		case 208:
			uni.showModal({
				content: '鉴权失败，请重新登录',
				showCancel: false,
				success: () => {
					// 既然用户需要重新进行登录，就需要把之前用户存储的信息(过期的 token) 进行清除
					clearStorage()

					uni.navigateTo({
						url: '/pages/login/login',
					})
				},
				error: () => {
					return Promise.reject(res)
				}
			})
		default:
			uni.showToast({
				title: data.message
			})
			return Promise.reject(res)
	}
}, (err, config) => {
	const {
		errMsg,
		data
	} = err;

	return Promise.reject({
		errMsg,
		data,
		config
	});
});

// 导出实例
export default instance