import http from '../utils/http'

/**
 * @description 进行登录操作
 * @param {*} code 临时登录凭证
 * @returns Promise
 */
export const reqLogin = ({
	code,
	avatar,
	username
}) => {
	return http.post(`/app/user/miniWxlogin`, {
		code,
		avatar,
		username
	})
}

/**
 * @description 获取用户信息
 * @returns Promise
 */
export const reqUserInfo = () => {
	return http.get('/app/user/userInfo')
}

/**
 * @description 实现本地资源上传
 * @param {*} filePath 要上传的文件资源路径
 * @param {*} name 文件对应的 key
 * @returns Promise
 */
export const reqUploadFile = (filePath, name) => {
	return http.upload('/fileUpload', filePath, name)
}