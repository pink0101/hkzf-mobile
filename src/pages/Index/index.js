import React from 'react'
// 导入组件
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
// 导入 API
import { API } from '../../utils/api'
import { BASE_URL } from './../../utils/url'
// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
// 导入样式文件
import './index.scss'

// 导入 utils 中获取定位城市的方法
import { getCurrentCity } from '../../utils/index'


// 导航菜单数据
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  }
]

/* 
  轮播图存在的两个问题
  1.不会自动播放
  2.从其他路由返回的时候，高度不够
  原因：轮播图数据是动态获取的，加载完成前后轮播图数量不一致

  解决
  1. 在state 中添加表示轮播图加载完成的数据
  2. 在轮播图数据加载完成时，修改该数据状态为 true
  3. 只有在轮播图数据加载完成的情况下，才能渲染轮播图组件
*/

export default class Index extends React.Component{
  state = {
    swipers: [], // 轮播图状态数据
    isSwiperLoaded:false,
    groups:[], // 租房小组数据
    news:[], // 最新资讯数据
    curCityName:'上海'// 当前城市名称
  }
  // 获取轮播图数据的方法
  async getSwiper() {
    const res = await API.get('/home/swiper')
    this.setState({
      swipers: res.data.body,
      isSwiperLoaded:true
    })
  }

  // 获取租房小组数据的方法
  async getGroups() {
    const res = await API.get('/home/groups',{params:{
      area: 'area=AREA%7C88cff55c-aaa4-e2e0'
    }})
    this.setState({
      groups: res.data.body,
    })
  }

  // 获取最新资讯数据
  async getNews() {
    const res = await API.get(`/home/news`,{params:{
      area: 'area=AREA%7C88cff55c-aaa4-e2e0'
    }})
    this.setState({
      news: res.data.body,
    })
  }

  //  会在组件挂载后（插入 DOM 树中）立即调用
  async componentDidMount() {
   this.getSwiper()
   this.getGroups()
   this.getNews()

   // 通过 ip 定位获取到当前城市名称 (百度地图)
   /* const curCity = new window.BMap.LocalCity()
   curCity.get(async res => {
     console.log('当前城市名称',res.name)
     const result =await axios.get(`http://47.94.219.128:8080/area/info?name=${res.name}`)
    //  console.log(result)
    this.setState({
      curCityName:result.data.body.label
    })
   }) */
   // 封装后的
   const curCity = await getCurrentCity()
   this.setState({
     curCityName:curCity.label
   })
  }

  // 轮播图渲染方法
  renderSwiper() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="0"
        style={{ display: 'inline-block', width: '100%', height:212}}
      >
        <img
          src={BASE_URL + item.imgSrc}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 导航菜单渲染方法
  renderNavs() {
    return navs.map(item => <Flex.Item key={item.id} onClick={()=> 
    this.props.history.push(item.path)}>
      <img src={item.img} alt="" />
    <h2>{item.title}</h2>
    </Flex.Item>)
  }

  // 最新资讯渲染方法
  renderNews() {
    return this.state.news.map(item => (
      <div className='item-news' key={item.id}>
        <div className='imgwrap'>
          <img src={BASE_URL + item.imgSrc} alt=''/>
        </div>
        <Flex className='content' direction='column' justify='between'> 
          <h3 className='title'>{item.title}</h3>
          <Flex className='info' justify='between'>
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div className='index'>
        {/* 轮播图 */}
        <div className='swiper'>
        {
          this.state.isSwiperLoaded?
          <Carousel
          autoplay={true}
          infinite={true}
          >
            {this.renderSwiper()}
          </Carousel>:''
        }

        {/* 搜索框 */}
        <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow"/>
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>

        {/* 导航菜单 */}
        <Flex className='nav'>
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className='group'>
          <h3 className='group-title'>
            租房小组 <span className='more'>更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid data={this.state.groups}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={item=>(
            <Flex className="group-item" justify="around" key={item.key}>
            <div className="desc">
              <p className="title">{item.title}</p>
              <span className="info">{item.desc}</span>
            </div>
            <img src={ BASE_URL + item.imgSrc} alt="" />
          </Flex>
          )} />
        </div>

        {/* 最新资讯 */}
        <div className='news'>
          <h3 className='group-title'>最新资讯</h3>
          <WingBlank size='md'>{this.renderNews()}</WingBlank>
          </div>
      </div>
    )
  }
}