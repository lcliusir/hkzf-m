import axios from 'axios'
export const getCurrentCity = () => {
  // 先从本地取出
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  // 没有本地存储的城市
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const currentCity = new window.BMap.LocalCity()
      currentCity.get(async city => {
        try {
          const res = await axios.get(`http://localhost:8080/area/info?name=${city.name}`)
          // 存入本地
          localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
          resolve(res.data.body)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  // 本地有城市数据 直接返回 Promise 形式的数据
  return Promise.resolve(localCity)
}

export { API } from './api'
export { BASE_URL } from './url'
export * from './auth'
export * from './city'