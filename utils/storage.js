/**
 * @description 存储数据
 * @param {*} key 本地缓存中指定的 key
 * @param {*} data 需要缓存的数据
 */
export const setStorage = (key, data) => {
	try {
		uni.setStorageSync(key, data)
	} catch (error) {
		console.error(`存储指定 ${key} 数据发生了异常`, error)
	}
}

/**
 * @description 从本地读取指定 key 的数据
 * @param {*} key
 */
export const getStorage = (key) => {
	try {
		const value = uni.getStorageSync(key)

		if (value) {
			return value
		}
	} catch (error) {
		console.error(`读取指定 ${key} 数据发生了异常`, error)
	}
}

/**
 * @description 从本地移除指定 key 的数据
 * @param {*} key
 */
export const removeStorage = (key) => {
	try {
		uni.removeStorageSync(key)
	} catch (error) {
		console.error(`移除指定 ${key} 数据发生了异常`, error)
	}
}

/**
 * @description 从本地移除、清空全部的数据
 */
export const clearStorage = () => {
	try {
		uni.clearStorageSync()
	} catch (error) {
		console.error(`清除、清空数据发生了异常`, error)
	}
}

/**
 * @description 异步将数据存储到本地
 * @param {*} key 本地缓存中指定的 key
 * @param {*} data 需要缓存的数据
 */
export const asyncSetStorage = (key, data) => {
	return new Promise((resolve) => {
		uni.setStorage({
			key,
			data,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 异步从本地获取指定 key 的数据
 * @param {*} key
 */
export const asyncGetStorage = (key) => {
	return new Promise((resolve) => {
		uni.getStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 异步从本地移除指定 key 的数据
 * @param {*} key
 */
export const asyncRemoveStorage = (key) => {
	return new Promise((resolve) => {
		uni.removeStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 异步从本地清除、移除全部缓存的数据
 */
export const asyncClearStorage = () => {
	return new Promise((resolve) => {
		uni.clearStorage({
			complete(res) {
				resolve(res)
			}
		})
	})
}