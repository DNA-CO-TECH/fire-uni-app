// 就是配置当前小程序项目的环境变量

// 获取当前小程序的账号信息
// const { miniProgram } = uni.getAccountInfoSync()

// 获取小程序的版本
// const { envVersion } = miniProgram

let env = {
  baseURL: 'https://aiyin.xyz:3005'
//   baseURL: 'https://gmall-prod.atguigu.cn/mall-api'
}

// switch (envVersion) {
//   // 开发版
//   case 'develop':
//     env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api/develop'
//     break

//   // 体验版
//   case 'trial':
//     env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api/test'
//     break

//   // 正式版
//   case 'release':
//     env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
//     break

//   default:
//     env.baseURL = 'https://gmall-prod.atguigu.cn/mall-api'
//     break
// }

export { env }
