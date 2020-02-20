import React from 'react'

// 导入 封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader/index'

// 导入样式
import styles from './index.module.css'

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
    var marker = new window.BMap.Marker(point);        // 创建标注    
    map.addOverlay(marker)                     // 将标注添加到地图中 
    map.centerAndZoom(new window.BMap.Point(109.01511111111,34.0297900000), 11);    
    map.addControl(new window.BMap.NavigationControl()) // PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
    map.addControl(new window.BMap.ScaleControl()) // 默认位于kol地图左下方，显示地图的比例关系
    map.addControl(new window.BMap.OverviewMapControl()) // 默认位于地图右下方，是一个可折叠的缩略地图
    // map.addControl(new window.BMap.MapTypeControl()) // 默认位于地图右上方
  }
  /* 
    1 封装 NavHeader 组件实现城市选择、地图找房页面的复用。
    2 在 components 目录中创建组件 NavHeader/index.js。
    3 在该组件中封装 antd-mobile 组件库中的 NavBar 组件。
      3.1 使用 children 属性，动态设置标题
      3.2 创建 NavHeader 组件自己的样式文件
      3.3 调整入口组件中 index.js 组件导入顺序，解决样式覆盖问题
      3.4 使用 NavHeader 组件时，在页面中设置组件的特殊样式

    4 在地图找房页面使用封装好的 NavHeader 组件实现顶部导航栏功能。
    5 使用 NavHeader 组件，替换城市选择页面的 NavBar 组件。
  */

  render() {
    return <div className={styles.map}>
      {/* 顶部导航栏组件 */}
      <NavHeader>
        地图找房
      </NavHeader>
      {/* 地图容器元素 */}
      <div id='container' className={styles.container}/>
    </div>
  }
}