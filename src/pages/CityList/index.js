import React from 'react'
import { NavBar } from 'antd-mobile'
import './index.scss'
// 导入 axios
import axios from 'axios'
// 导入 utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils/index'

// 导入 List 组件
import {List,AutoSizer} from 'react-virtualized'

// 索引(A,B等) 的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50

/*
// 接口返回的数据格式：
[{ "label": "北京", "value": "", "pinyin": "beijing", "short": "bj" }]

// 渲染城市列表的数据格式为：
{ a: [{}, {}], b: [{}, ...] }
// 渲染右侧索引的数据格式：
['a', 'b']
*/

// 数据格式化方法
const formatCityData = list => {
  const cityList = {}
  // 1.遍历list数组
  list.forEach(item => {
    // 2.获取每一个城市的首字母
    const first = item.short.substr(0,1)
    // 3.判断 citylist 中是否有该分类
    if(cityList[first]){
      // 4.如果有，直接往该分类中push数据
      cityList[first].push(item)
    }else{
      // 5.如果没有，就先创建一个数组，然后把当前城市信息添加到数组中
      cityList[first] = [item]
    }
  })
  
  // 获取索引数据
  // Object.keys() 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（ enumerable ）属性的键名。
  const cityIndex =  Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

// 处理字母索引的方法
const formatCityIndex = (letter) => {
  switch(letter){
    case '#' : return '当前定位'
    case 'hot' : return '热门城市'
    default : return letter.toUpperCase()
  }
}


export default class Home extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      cityList:{},
      cityIndex:[],
      activeIndex:0 // 指定右侧索引列表高亮的索引号
    }

    // 创建ref对象
    this.cityListComponent = React.createRef()
  }

  // 生命周期函数
  async componentDidMount() {
    await this.getCityList()

    // 调用 measureAllRows ,提前计算list中每一行的高度，实现scrollToRow的精确跳转
    // 注意：调用这个方法的时候，需要保证 list 组件中已经有数据，如果没有数据，就会调用该方法报错
    // 解决办法：由于获取数据的方法是异步的，所有生命周期函数也使用异步的方式，等待获取到数据再执行
    this.cityListComponent.current.measureAllRows()
  }

  // 获取城市列表数据的方法
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    console.log('城市列表数据',res)
    // 对请求到的数据进行处理并返回，解构
    const { cityList,cityIndex } = formatCityData(res.data.body)
    // console.log(cityList,cityIndex)

    // 获取热门城市数据
    const hotRes = await axios.get('http://localhost:8080/area/hot')
    console.log('热门城市数据',hotRes)
    cityList['hot'] = hotRes.data.body
    // 将索引添加到 cityIndex 中
    cityIndex.unshift('hot')

    // 获取当前定位城市
    const curCity = await getCurrentCity()
    /* 
      1.将当前定位城市数据添加到 cityList 中
      2.将当前定位城市的索引添加到 cityIndex 中
    */
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    // console.log(cityList,cityIndex,curCity)
    this.setState({
      cityList,
      cityIndex
    })
  }

  // 渲染每一行数据的渲染函数
// 函数的返回值就表示最终渲染在页面中的内容
rowRenderer = ({
  key, // Unique key within array of rows
  index, // 索引号
  isScrolling, // 当前项是否在滚动中
  isVisible, // 当前项在 list 中是可见的
  style, // 注意：重点属性，一定要给每一行数据添加该样式 作用：指定每一行的位置
}) => {
  const { cityIndex,cityList } = this.state
  const letter =  cityIndex[index]
  return (
    <div key={key} style={style} className='city'>
      <div className='title'>{formatCityIndex(letter)}</div>
      {
        cityList[letter].map(item => (
          <div className='name' key={item.value}>{item.label}</div>
        ))
      }
    </div>
  )
}

// 动态计算每一行高度的方法 index 为索引 List 组件提供的
getRowHeight = ( { index } ) => {
  // 索引标题高度 + 城市数量 * 城市名称的高度
  // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  const { cityList,cityIndex } = this.state
  return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
}


/* 
    1 给索引列表项绑定点击事件。
    2 在点击事件中，通过 index 获取到当前项索引号。
    3 调用 List 组件的 scrollToRow 方法，让 List 组件滚动到指定行。

    3.1 在 constructor 中，调用 React.createRef() 创建 ref 对象。
    3.2 将创建好的 ref 对象，添加为 List 组件的 ref 属性。
    3.3 通过 ref 的 current 属性，获取到组件实例，再调用组件的 scrollToRow 方法。

    4 设置 List 组件的 scrollToAlignment 配置项值为 start，保证被点击行出现在页面顶部。
    5 对于点击索引无法正确定位的问题，调用 List 组件的 measureAllRows 方法，提前计算高度来解决。
  */


// 渲染右侧索引列表的方法
renderCityIndex() {
  // 获取到 cityIndex，并遍历，实现渲染
  const {cityIndex,activeIndex} = this.state
  return cityIndex.map((item,index) => (
    <li className='city-index-item' key={item} onClick = {() => {
      this.cityListComponent.current.scrollToRow(index)
    }}>
      <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热': item.toUpperCase()}</span>
    </li>
  ))
}

// 用于获取list组件中渲染行的信息
onRowsRendered = ({startIndex}) =>{
  // console.log('startIndex（当前滚动的索引）:',startIndex)
  if(this.state.activeIndex !== startIndex){
    this.setState({
      activeIndex:startIndex
    })
  }
}

  
  render() {
    return (
      <div className='citylist'>
        <NavBar
          className='navbar'
          mode="light"
          icon={<i className='iconfont icon-back' />}
          onLeftClick={() => this.props.history.go(-1)}
        >城市选择</NavBar>

        {/* 城市列表 */}
        <AutoSizer>
          {
            ({width,height}) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment='start'
            />
            )
          }
        </AutoSizer>

        {/* 右侧索引列表 */}
        {/* 
          1 封装 renderCityIndex 方法，用来渲染城市索引列表。
          2 在方法中，获取到索引数组 cityIndex ，遍历 cityIndex ，渲染索引列表。
          3 将索引 hot 替换为 热。
          4 在 state 中添加状态 activeIndex ，指定当前高亮的索引。
          5 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件。
        */}
        <ul className='city-index'>
          {this.renderCityIndex()}
        </ul>

      </div>
    )
  }
}