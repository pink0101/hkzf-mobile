import React from 'react'

// 导入路由
import { Route } from 'react-router-dom'

// 导入组件自己的样式文件
import './index.css'
// 导入 News 组件
import News from './../News'

// 导入页面组件
import Index from './../Index'
import HouseList from './../HouseList'
import Profile from './../Profile'

// 导入 TabBar
import { TabBar } from 'antd-mobile'


// TabBar 数据
const tabItems = [
  {
    title:'首页',
    icon:'icon-ind',
    path:'/home'
  },
  {
    title:'找房',
    icon:'icon-findHouse',
    path:'/home/list'
  },
  {
    title:'资讯',
    icon:'icon-infom',
    path:'/home/news'
  },
  {
    title:'我的',
    icon:'icon-my',
    path:'/home/profile'
  }
]

export default class Home extends React.Component{
  state = {
    selectedTab: this.props.location.pathname, // TabBar默认选中的菜单项
  }

  // 会在更新后会被立即调用 生命周期函数
  componentDidUpdate(prevProps) {
    /* console.log('上一次的路由信息:',prevProps)
    console.log('当前的路由信息:',this.props) */
    if(prevProps.location.pathname !== this.props.location.pathname){
      // 此时路由发生切换
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  // 渲染 TabBar.item
  renderTabBarItem() {
    return tabItems.map( item => 
      <TabBar.Item
            title={item.title}
            key={item.title}
            icon={
              <i className={`iconfont ${item.icon}`}></i>
            }
            selectedIcon={
            <i className={`iconfont ${item.icon}`}></i>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.setState({
                selectedTab: item.path,
              });
              // 路由切换
              this.props.history.push(item.path)
            }}
          >
      </TabBar.Item>
      )
  }

  render() {
    return (
      <div className='home'>
        {/* 渲染子路由 */}
        <Route path='/home/news' component={News}></Route>
        <Route path='/home' exact component={Index}></Route>
        <Route path='/home/list' component={HouseList}></Route>
        <Route path='/home/profile' component={Profile}></Route>
        {/* TabBar */}
        <TabBar
          unselectedTintColor="#888" // 未选中颜色
          tintColor="#21b97a" // 选中字体颜色
          barTintColor="white"
          noRenderContent='false' // 只显示 tabBar 不显示内容
        >
          {this.renderTabBarItem()}
        </TabBar>
      </div>
    )
  }
}