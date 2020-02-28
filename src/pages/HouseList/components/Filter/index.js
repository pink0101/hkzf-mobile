import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
// 导入自定义的axios
import { API } from '../../../../utils/api'

// 标题高亮状态
// true 表示高亮
const titleSelectedStatus = {
  area:false,
  mode:false,
  price:false,
  more:false
}
// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area:['area','null'],
  mode:['null'],
  price:['null'],
  more:[]
}

/* 
  控制 FilterPicker 组件的展示和隐藏：

  1 在 Filter 组件中，提供控制对话框展示或隐藏的状态： openType（表示展示的对话框类型）。
  2 在 render 中判断 openType 值为 area/mode/price 时，就展示 FilterPicker 组件，以及遮罩层。
  3 在 onTitleClick 方法中，修改状态 openType 为当前 type，展示对话框。
  4 在 Filter 组件中，提供 onCancel 方法，作为取消按钮和遮罩层的事件处理程序。
  5 在 onCancel 方法中，修改状态 openType 为空，隐藏对话框。
  6 将 onCancel 通过 props 传递给 FilterPicker 组件，在取消按钮的单击事件中调用该方法。
  7 在 Filter 组件中，提供 onSave 方法，作为确定按钮的事件处理程序，逻辑同上。
*/

/* 
  获取当前筛选条件的数据：

  1 在 Filter 组件中，发送请求，获取所有筛选条件数据。
  2 将数据保存为状态：filtersData。
  3 封装渲染 FilterPicker 的方法 renderFilterPicker。

  4 在方法中，根据 openType 的类型，从 filtersData 中获取到需要的数据。
  5 将数据通过 props 传递给 FilterPicker 组件。
  6 FilterPicker 组件接收到数据后，将其作为 PickerView 组件的 data （数据源）。
*/ 

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制 FilterPicker 或 FilteMore 组件的展示或隐藏
    openType:'',
    // 所有筛选条件数据
    filtersData:{},
    // 筛选条件的选中值
    selectedValues
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 封装获取所有所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    console.log('filtersData',res)
    this.setState({
      filtersData:res.data.body
    })
  }

  // 点击标题菜单实现高亮
  // 注意 this 指向的问题
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    // 遍历标题选中状态对象
    // Object.keys 返回值['area','mode','price','more']
    Object.keys(titleSelectedStatus).forEach(item => {
      // item 表示数组中的每一项， 此处，就是每个标题的 type 值
      if(item === type){
        // 点击当前标题
        newTitleSelectedStatus[type] = true
        return
      }
      // 其他标题
      const selectedVal = selectedValues[item]
      if(item === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area') ){
        // 高亮
        newTitleSelectedStatus[item] = true
      }else if(item === 'mode' && selectedVal[0] !== 'null'){
        newTitleSelectedStatus[item] = true
      }else if(item === 'price' && selectedVal[0] !== 'null'){
        newTitleSelectedStatus[item] = true
      }else if (item === 'more' && selectedVal.length !== 0 ){
        // 更多选择项 FilterMore 组件
        newTitleSelectedStatus[item] = true
      }else {
        newTitleSelectedStatus[item] = false
      }
    })

    this.setState(() => {
      return {
        titleSelectedStatus:newTitleSelectedStatus,
        // 展示对话框
        openType: type
      }
    })
  }

  // 取消（隐藏对话框）
  onCancel = (value,type) => {
    console.log(type)
    const { titleSelectedStatus,selectedValues } = this.state
    // 菜单高亮逻辑处理
    const selectedVal = selectedValues[type]
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus}
    if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area') ){
      // 高亮
      newTitleSelectedStatus[type] = true
    }else if(type === 'mode' && selectedVal[0] !== 'null'){
      newTitleSelectedStatus[type] = true
    }else if(type === 'price' && selectedVal[0] !== 'null'){
      newTitleSelectedStatus[type] = true
    }else if (type === 'more' && selectedVal.length !== 0 ){
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    }else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      titleSelectedStatus:newTitleSelectedStatus,
      openType:''
    })
  }
  // 确定 (隐藏对话框)
  onSave = (value,type) => {
    // 菜单高亮逻辑处理
    const selectedVal = value
    const { titleSelectedStatus } = this.state
    // 创建新的标题选中状态对象
    const newTitleSelectedStatus = {...titleSelectedStatus}
    if(type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area') ){
      // 高亮
      newTitleSelectedStatus[type] = true
    }else if(type === 'mode' && selectedVal[0] !== 'null'){
      newTitleSelectedStatus[type] = true
    }else if(type === 'price' && selectedVal[0] !== 'null'){
      newTitleSelectedStatus[type] = true
    }else if (type === 'more' && selectedVal.length !== 0 ){
      // 更多选择项 FilterMore 组件
      newTitleSelectedStatus[type] = true
    }else {
      newTitleSelectedStatus[type] = false
    }

    /* 
      组装筛选条件：

      1 在 Filter 组件的 onSave 方法中，根据最新 selectedValues 组装筛选条件数据 filters。
      2 获取区域数据的参数名：area 或 subway（选中值数组的第一个元素）。
      3 获取区域数据的值（以最后一个 value 为准）。
      4 获取方式和租金的值（选中值的第一个元素）。
      5 获取筛选（more）的值（将选中值数组转化为以逗号分隔的字符串）。

      {
        area: 'AREA|67fad918-f2f8-59df', // 或 subway: '...'
        mode: 'true', // 或 'null'
        price: 'PRICE|2000',
        more: 'ORIEN|80795f1a-e32f-feb9,ROOM|d4a692e4-a177-37fd'
      }
    */
    const newSelectedValues = {
      ...this.state.selectedValues,
      // 只更新当前 type 对应的值
      [type]:value
    }

    console.log('最新的选中值:',newSelectedValues)
    const { area,mode,price,more } = newSelectedValues
    // 筛选条件数据
    const filters = {}

    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if(area.length === 3){
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }
    filters[areaKey] = areaValue

    // 方式和租金
    filters.mode = mode[0]
    filters.price = price[0]
    // 更多
    filters.more = more.join(',')

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters)
    
    this.setState({
      openType:'',
      titleSelectedStatus:newTitleSelectedStatus,
      selectedValues:newSelectedValues
    })
  }

  // 渲染 FilterPicker 组件的方法
  renderFilterPicker() {
    const { openType, filtersData:{area,subway, rentType, price},selectedValues } = this.state
    if(openType !== 'area' && openType !== 'mode' && openType !== 'price'){
      return null
    }
    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3 // 列数
    let defaultValue = selectedValues[openType]
    switch(openType) {
      case 'area': 
        data = [area,subway]
        cols = 3
        break
      case 'mode': 
        data = rentType
        cols = 1
        break
      case 'price': 
        data = price
        cols = 1
        break
      default:
        break
    }
    return (
      <FilterPicker 
      key={openType}
      onCancel={this.onCancel} 
      onSave={this.onSave} 
      data={data} 
      cols={cols} 
      type={openType} 
      defaultValue={defaultValue}
      />
    )
  }

  /* 
    1 封装 renderFilterMore 方法，渲染 FilterMore 组件。
    2 从 filtersData 中，获取数据（roomType, oriented, floor, characteristic），通过 props 传递给 FilterMore 组件。
    3 FilterMore 组件中，通过 props 获取到数据，分别将数据传递给 renderFilters 方法。
    4 在 renderFilters 方法中，通过参数接收数据，遍历数据，渲染标签。
  */

  renderFilterMore() {
    const { selectedValues,openType,filtersData:{roomType, oriented, floor, characteristic} } = this.state
    if( openType !== 'more'){
      return null
    }
    const data = {
      roomType, oriented, floor, characteristic
    }

    const defaultValue = selectedValues.more

    return <FilterMore data={data} type = {openType} onSave = {this.onSave} defaultValue={defaultValue} onCancel={this.onCancel}/>
  }

  render() {
    const { titleSelectedStatus,openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price') ? <div className={styles.mask} onClick={() => this.onCancel(null,openType)} /> :null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }

          {/* 最后一个菜单对应的内容： */}
          {
            this.renderFilterMore()
          }
        </div>
      </div>
    )
  }
}
