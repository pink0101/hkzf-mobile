import React from 'react'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'

import { Flex } from 'antd-mobile'

// 导入自定义的 API
import { API } from '../../utils/api'
import { BASE_URL } from '../../utils/url'

// 导入样式
import styles from './index.module.css'

// 导入 List 组件
import {List,AutoSizer,WindowScroller,InfiniteLoader} from 'react-virtualized'
import HouseItem from '../../components/HouseItem/index'

// 存储到本地存储中
localStorage.setItem('hkzf_city',JSON.stringify({label: "上海", value: "AREA|dbf46d32-7e76-1196"}))
// 获取当前定位城市信息
const { label,value } = JSON.parse(localStorage.getItem('hkzf_city'))

/* 
  1. 在找房页面 SearchHeader 组件基础上，调整结构 (添加返回 icon 等)
  2. 给 SearchHeader 组件传递 className 属性，来调整组件样式，让其适应找房页面效果
*/

export default class HouseList extends React.Component{
  state = {
    list:[],// 列表数据
    count:0// 总条数
  }

  // 初始化实例属性
  filters ={}
  componentDidMount() {
    this.searchHouseList()
  }
  // 用来获取房屋列表数据
  async searchHouseList() {
    const res = await API.get(`/houses`,{
      params:{
        cityId:value,
        ...this.filters,
        start:1,
        end:20
      }
    })

    console.log(res)
    const { count,list } =res.data.body
    this.setState({
      list:list,
      count:count
    })
  }
  

  // 接收 Filter 组件中的筛选条件数据
  onFilter = (filters) => {
    this.filters = filters
    // 用来获取房屋列表数据
    this.searchHouseList()
  }

  // 渲染列表
  renderHouseList = ({
    key, // Unique key within array of rows
    index, // 索引号
    style, // 注意：重点属性，一定要给每一行数据添加该样式 作用：指定每一行的位置
  }) => {
    // 根据索引号来获取当前这一行的房屋数据
    const { list } = this.state
    const house = list[index]
    // 判断 house 是否存在
    // 如果不存在 ，就渲染 loading 元素占位
    if(!house){
      return (
        <div key={key} style={style}>
        <p className={styles.loading} />
      </div>
      )
    }
    return (
      <HouseItem
      key={key}
      style={style}
      src={ BASE_URL + house.houseImg }
      title={house.title}
      desc={house.desc}
      tags={house.tags}
      price={house.price}
      />
    )
  }

  // 表示每一行数据是否完成
  isRowLoaded = ({ index }) => {
    return this.state.list[index]
  }
  
  // 加载更多数据的方法，在需要加载更多数据时，会调用该方法
  // 注意：该方法的返回值是 Promise 对象，并且，这个对象应该在数据加载完成时，来调用 resolve 让 Promise 对象的状态变为已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log(startIndex, stopIndex)

    return new Promise(resolve => {
      // 数据加载完成时，调用 resolve 即可
      API.get(`/houses`,{
        params:{
          // cityId:value,
          ...this.filters,
          start:startIndex,
          end:stopIndex
        }
      }).then(res => {
        this.setState({
          list:[...this.state.list,...res.data.body.list]
        })
        // 数据加载完成时，调用 resolve 
        resolve()
      })
    })
  }


  render() {
    const { count } = this.state
    return (
      <div>
        {/* 顶部搜索栏 */}
        <Flex className={styles.header}>
          <i className='iconfont icon-back' onClick = {() => this.props.history.go(-1)}></i>
          {<SearchHeader cityName={label} className={styles.searchHeader}/>}
        </Flex>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded} // 表示每一行数据是否完成
            loadMoreRows={this.loadMoreRows} // 加载更多数据的方法，在需要加载更多数据时，会调用该方法
            rowCount={count} // 列表数据总条数
            minimumBatchSize={20}
          >
            {({ onRowsRendered,registerChild }) => (
              <WindowScroller>
                {({ height,isScrolling,scrollTop }) => (
                  <AutoSizer>
                    {({width}) => (
                      <List
                      autoHeight // 设置高度为 windowScroller 最终渲染的列表高度
                      width={width} // 视口的宽度
                      height={height} // 视口的高度
                      rowCount={count} // List 列表项的行数
                      rowHeight={120} // 每一行的高度
                      rowRenderer={this.renderHouseList} // 渲染列表项的每一行
                      isScrolling={isScrolling} // 表示是否滚动中，用来覆盖 List 组件自身滚动状态
                      scrollTop={scrollTop} // 页面滚动的距离，用来同步 List 组件的滚动距离
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                    )}
                  </AutoSizer>
                )}
                </WindowScroller>
            )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }
}