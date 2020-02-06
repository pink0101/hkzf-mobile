import React from 'react'
// 导入样式
import './index.scss'
export default class Map extends React.Component {
  // 生命周期函数 会在组件挂载后（插入 DOM 树中）立即调用。
  componentDidMount() {
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 eslint 校验错误
    const map = new window.BMap.Map("container")
    // 设置中心点坐标
    const point = new window.BMap.Point(109.01511111111,34.0297900000)
    // 地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 17)
    map.setMapStyleV2({     
      styleId: '4c75ce1e88fea307fa1bbf2829efa80d'
    });
  }
  render() {
    return <div className='map'>
      {/* 地图容器元素 */}
      <div id='container'>

      </div>
    </div>
  }
}