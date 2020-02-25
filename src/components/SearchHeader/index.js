import React from 'react'

import { Flex } from 'antd-mobile'

import './index.scss'

// 导入字体图标库
import './../../assets/fonts/iconfont.css'

 // 导入 withRouter 高阶组件 作用：由于 SearchHeader 组件 不是路由渲染的 拿不到 history 等信息 所以 需要使用 withRouter 高阶组件
 import { withRouter } from 'react-router-dom'

 // 导入 props 校验的包
import PropTypes from 'prop-types'

function SearchHeader({ history,cityName,className }) {
  return(
    <Flex className={['search-box', className || ''].join(' ')}>
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => history.push('/citylist')}
              >
                <span className="name">{cityName}</span>
                <i className="iconfont icon-arrow"/>
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => history.push('/map')}
            />
      </Flex>
  )
}

// 添加 props 检验
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired, // 字符串 ，必填
  className:PropTypes.string
}

export default withRouter(SearchHeader)