const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : `0${n}`
}

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
const formatDate = (date, fmt, type) => {
	if (!fmt) {
		fmt = 'yyyy-MM-dd HH:mm:ss'
	}
	date = date === undefined ? new Date() : date
	date = typeof date === 'number' ? new Date(date) : date
	date = typeof date === 'string' ? new Date(parseInt(date, 10)) : date
	const hours = type ? date.getUTCHours() : date.getHours()
	const obj = {
		y: date.getFullYear(), // 年份，注意必须用getFullYear
		M: date.getMonth() + 1, // 月份，注意是从0-11
		d: date.getDate(), // 日期
		q: Math.floor((date.getMonth() + 3) / 3), // 季度
		w: date.getDay(), // 星期，注意是0-6
		H: hours, // 24小时制
		h: hours % 12 === 0 ? 12 : hours % 12, // 12小时制
		m: date.getMinutes(), // 分钟
		s: date.getSeconds(), // 秒
		S: date.getMilliseconds(), // 毫秒
	}
	const week = ['天', '一', '二', '三', '四', '五', '六']
	Object.keys(obj).forEach(i => {
		fmt = fmt.replace(new RegExp(`${i}+`, 'g'), m => {
			const val = obj[i]
			if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
			let valStr = val.toString()
			for (let j = 0, len = valStr.length; j < m.length - len; j++) valStr = `0${valStr}`
			return m.length === 1 ? valStr : valStr.substring(valStr.length - m.length)
		})
	})
	return fmt
}

export {
	formatDate
}