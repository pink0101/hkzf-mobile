 /* 公共函数 */
 import axios from 'axios'

 // 通过百度地图获取ip定位
  export const getCurrentCity = () => {
    // 判断 localStorage 中是否有定位城市
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    // 如果没有
    if(!localCity){
      return new Promise((resolve,reject) => {
        const curCity = new window.BMap.LocalCity()
        curCity.get(async res => {
          try{
            const result =await axios.get(`http://47.94.219.128:8080/area/info?name=${res.name}`)
            //  console.log(result)
            // 存储到本地存储中
            localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
            // 获取城市定位成功了
            resolve(result.data.body)
          }catch(e){ // 失败了调用
            reject(e)
          }
        })
      })
    }
    // 如果有，直接返回本地存储中的城市数据
    // 注意：因为上面为了处理异步操作，使用了 Promise 因此，为了该函数返回值的统一，此处也应该使用 Promise
    // 因为此处的 Promise 不会失败，所以，此处，只要返回一个成功的 Promise 即可
    return Promise.resolve(localCity)
  }