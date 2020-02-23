import React from 'react'

// 导入 封装好的 NavHeader 组件
import NavHeader from '../../components/NavHeader/index'

import { Toast } from 'antd-mobile'

// 导入样式
import styles from './index.module.css'

// 导入 API
import { API } from '../../utils/api'
// 导入 BASE_URL
import { BASE_URL } from '../../utils/url'

// 导入 路由
import { Link } from 'react-router-dom'

// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {

  state = {
    // 小区下的房源列表
    housesList:[],
    // 表示是否展示房源列表
    isShowList: false
  }

  // 生命周期函数 会在组件挂载后（插入 DOM 树中）立即调用。
  componentDidMount() {
    this.initMap()
  }

  // 初始化地图
  initMap() {
    // 初始化地图实例
    // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 eslint 校验错误
    const map = new window.BMap.Map("container")

    // 作用： 能够在其他方法中通过 this 来获取到 地图对象
    this.map = map

    // 设置中心点坐标
    // const point = new window.BMap.Point(109.01511111111,34.0297900000)
    

    /* 
    1. 获取当前定位城市
    2. 使用地址解析器解析当前城市坐标
    3. 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11
    4. 在地图中展示该城市，并添加比例尺和平移缩放控件
    */

    // 获取当前定位城市
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    // 创建地址解析器实例     
    const myGeo = new window.BMap.Geocoder();      
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(label, 
      async point => {      
        if (point) {      
            map.centerAndZoom(point, 11)
            // map.addOverlay(new window.BMap.Marker(point));      
            map.addControl(new window.BMap.NavigationControl()) // PC端默认位于地图左上方，它包含控制地图的平移和缩放的功能。移动端提供缩放控件，默认位于地图右下方
            map.addControl(new window.BMap.ScaleControl()) // 默认位于kol地图左下方，显示地图的比例关系
            map.addControl(new window.BMap.OverviewMapControl()) // 缩略地图	默认位于地图右下方，是一个可折叠的缩略地图
            // map.addControl(new window.BMap.MapTypeControl()) // 地图类型 ，默认位于地图右上方

            // 调用 renderOverlays 方法
            this.renderOverlays(value)

            /* 
            1. 创建 label 实例对象
            2. 调用 setStyle() 方法设置样式
            3. 在 map 对象上调用 addOverlay() 方法，将文本覆盖物添加到地图中
            */

            /* 
              1 调用 Label 的 setContent() 方法，传入 HTML 结构，修改 HTML 内容的样式。
              2 调用 setStyle() 修改覆盖物样式。
              3 给文本覆盖物添加单击事件。

            <div class="${styles.bubble}">
              <p class="${styles.name}">${name}</p>
              <p>${num}套</p>
            </div>
            */

            /* const res = await axios.get(`http://47.94.219.128:8080/area/map?id=${value}`)
            console.log(res.data.body)
            // 为每一条数据创建覆盖物
            res.data.body.forEach(item => {

              const { coord:{longitude,latitude}, label: areaName, count, value } = item

              // 创建地图坐标
              const areaPoint = new window.BMap.Point(longitude,latitude)
              const opts = {
                position : areaPoint,    // 指定文本标注所在的地理位置
                offset   : new window.BMap.Size(-35, -35)    //设置文本偏移量
              }
    
              // 说明： 设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
              const label = new window.BMap.Label("", opts);  // 创建文本标注对象
    
              // 给 label 对象添加一个唯一标识
              label.id = value

              // 设置房源覆盖物内容
              label.setContent(`
              <div class="${styles.bubble}">
                <p class="${styles.name}">${areaName}</p>
                <p>${count}套</p>
              </div>`)
    
              // 设置样式
              label.setStyle(labelStyle);
    
              // 添加单击事件
              label.addEventListener('click',() => {
                
                // 放大地图，以当前点击的覆盖物为中心放大地图
                // 第一个参数：坐标对象
                map.centerAndZoom(areaPoint, 13)
                // 清除当前覆盖物信息
                // 添加定时器，解决清除覆盖物时，百度地图 api 报错的问题
                setTimeout(() => {
                  map.clearOverlays()
                },0)
              })
    
              // 添加覆盖物到地图中
              map.addOverlay(label); 
            })   */
        }
    }, 
    label)

    // 给地图绑定移动事件
    map.addEventListener('movestart',() => {
      if(this.state.isShowList){
        this.setState({
          isShowList:false
        })
      }
    })
  }

  /* 渲染覆盖物入口 */
  // 1 接收区域 id 参数， 获取该区域下的房源数据
  // 2 获取房源类型以及下级地图的缩放级别
  async renderOverlays(id){
    try{
      // 开启loading效果
      Toast.loading('加载中...',0,null,false)

      const res = await API.get(`/area/map?id=${id}`)
      // 关闭loading
      Toast.hide()

      // console.log(res)
      const data = res.data.body

      // 调用 getTypeAndZoom 方法获取级别和类型
      const { nextZoom,type } = this.getTypeAndZoom()

      data.forEach(item => {
        // 创建覆盖物
        this.createOverlays(item,nextZoom,type)
      })
    }catch(e){
      // 关闭loading
      Toast.hide()
    }
  }

  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 区 -> 11 ,范围 >=10 <12
  // 镇 -> 13 ,范围 >=12 <14
  // 小区 -> 15, 范围 >=14 <16
  getTypeAndZoom() {
    // 调用地图的 getZoom() 方法 ，来获取当前缩放级别
    const zoom = this.map.getZoom()
    // 下一个缩放级别，类型
    let nextZoom, type
    if(zoom >= 10 && zoom <12){
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物(区，镇)
      type = 'circle'
    }else if(zoom >= 12 && zoom < 14){
      nextZoom = 15
      type = 'circle'
    }else if(zoom >=14 && zoom <16){
      // 小区
      type = 'rect'
    }

    return {nextZoom,type}
  }

  // 创建覆盖物
  createOverlays(data,zoom,type) {
    const { coord:{longitude,latitude}, label: areaName, count, value } = data
    // 创建地图坐标
    const areaPoint = new window.BMap.Point(longitude,latitude)
    if( type === 'rect'){
      //小区
      this.createRect(areaPoint,areaName,count,value)
    }else{
      // 参数 地图坐标 地域名称 房源数量 id值 地图缩放级别
      this.createCircle(areaPoint,areaName,count,value,zoom)
    }
  }

  // 创建区、镇覆盖物
  createCircle(areaPoint,areaName,count,value,zoom) {
    const opts = {
      position : areaPoint,    // 指定文本标注所在的地理位置
      offset   : new window.BMap.Size(-35, -35)    //设置文本偏移量
    }

    // 说明： 设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
    const label = new window.BMap.Label("", opts);  // 创建文本标注对象

    // 设置房源覆盖物内容
    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${areaName}</p>
      <p>${count}套</p>
    </div>`)

    // 设置样式
    label.setStyle(labelStyle);

    // 添加单击事件
    label.addEventListener('click',() => {
      // 调用 renderOverlays 方法，获取该区域下的房源数据、
      this.renderOverlays(value)
      
      // 放大地图，以当前点击的覆盖物为中心放大地图
      // 第一个参数：坐标对象
      this.map.centerAndZoom(areaPoint, zoom)
      // 清除当前覆盖物信息
      // 添加定时器，解决清除覆盖物时，百度地图 api 报错的问题
      setTimeout(() => {
        this.map.clearOverlays()
      },0)
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label); 
  }

  // 创建小区覆盖物
  createRect(areaPoint,areaName,count,value){
    const opts = {
      position : areaPoint,    // 指定文本标注所在的地理位置
      offset   : new window.BMap.Size(-50, -28)    //设置文本偏移量
    }

    // 说明： 设置 setContent 后，第一个参数中设置的文本内容就失效了，因此，直接清空即可
    const label = new window.BMap.Label("", opts);  // 创建文本标注对象

    // 设置房源覆盖物内容
    label.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${areaName}</span>
      <span class="${styles.housenum}">${count}套</span>
      <i class="${styles.arr}"></i>
    </div>`)

    // 设置样式
    label.setStyle(labelStyle);

    // 添加单击事件
    label.addEventListener('click',(e) => {
      /* 
        1 创建 Label 、设置样式、设置 HTML 内容，绑定单击事件。
        
        2 在单击事件中，获取该小区的房源数据。
        3 展示房源列表。
        4 渲染获取到的房源数据。

        5 调用地图 panBy() 方法，移动地图到中间位置。
          公式：
              垂直位移：(window.innerHeight - 330) / 2 - target.clientY
              水平位移：window.innerWidth / 2 - target.clientX
        6 监听地图 movestart 事件，在地图移动时隐藏房源列表。
      */
      this.getHousesList(value)

      // 获取当前被点击项
      const target = e.changedTouches[0]
      this.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY)

    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label); 
  }

  // 获取小区房源数据
  async getHousesList(id) {
    try{
      // 开启loading效果
      Toast.loading('加载中...',0,null,false)
      const res = await API.get(`/houses?cityId=${id}`)
      // 关闭loading
      Toast.hide()
      const data = res.data.body.list
      console.log(data)
      this.setState({
        housesList:data,

        // 展示房源列表
        isShowList:true
      })
    }catch(e){
      // 关闭loading
      Toast.hide()
    }
  }


  // 封装渲染房屋列表的方法
  renderHousesList() {
    return this.state.housesList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        {/* 图片展示 */}
        <div className={styles.imgWrap}>
          <img
            className={styles.img}
            src={BASE_URL + item.houseImg}
            alt=""
          />
        </div>
        {/* 文字部分 */}
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {item.tags.map((tag,index) => {
              const tagClass = 'tag' + (index + 1)
              return (
                <span
                className={[styles.tag, styles[tagClass]].join(' ')}
                key={tag}
                >
                {tag}
                </span>
              )
              })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
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
      
      {/* 房源列表 */}
      {/* 添加 styles.show 展示房屋列表 */}
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : ''
        ].join(' ')}
      >
        {/* 房源标题 */}
        <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

        {/* 房源展示 */}
        <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {
              this.renderHousesList()
            }
        </div>
      </div>
    </div>
  }
}