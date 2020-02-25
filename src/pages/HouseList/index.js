import React from 'react'

// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'

import { Flex } from 'antd-mobile'

// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

/* 
  1. 在找房页面 SearchHeader 组件基础上，调整结构 (添加返回 icon 等)
  2. 给 SearchHeader 组件传递 className 属性，来调整组件样式，让其适应找房页面效果
*/

export default class HouseList extends React.Component{
  render() {
    return (
      <div>
        {/* 顶部搜索栏 */}
        <Flex className={styles.header}>
          <i className='iconfont icon-back' onClick = {() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={label} className={styles.searchHeader}/>
        </Flex>
        {/* 条件筛选栏 */}
        <Filter/>
      </div>
    )
  }1
}