import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'
import { API } from '../../../../utils/api'

// 高亮原始数据
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
// 默认选中值
const selectedValues = {
  area: ["area", 'null'],
  mode: ["null"],
  price: ["null"],
  more: []
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: "",
    filtersData: {},
    selectedValues
  }
  // 点击菜单项
  titleClicked = (type) => {
    this.htmlBody.className = 'body-fixed'
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[key] = true
        return
      }
      const selectedVal = selectedValues[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length > 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    // console.log(newTitleSelectedStatus)
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 取消
  onCancel = type => {
    this.htmlBody.className = ''
    const { titleSelectedStatus, selectedValues } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = selectedValues[type]
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length > 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 保存，隐藏对话框
  onSave = (value, type) => {
    // console.log(value, type)
    this.htmlBody.className = ''
    const { titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = value
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length > 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    // 根据筛选条件  获取房屋数据
    const newSelectedValues = {
      ...this.state.selectedValues,
      [type]: value
    }
    console.log('选中值', newSelectedValues)
    const { area, mode, price, more } = newSelectedValues
    const filters = {}
    // 区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] === 'null' ? area[1] : area[2]
    }
    filters[areaKey] = areaValue
    // 方式租金
    filters.mode = mode[0]
    filters.price = price[0]
    // 更多 more 筛选
    filters.more = more.join(',')
    // console.log(filters)

    // 调用父组件的方法，将组装数据传给父组件
    this.props.onFilter(filters)

    // 更新数据
    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      }
    })
  }
  // 获取条件筛选数据
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState(() => {
      return {
        filtersData: res.data.body
      }
    })
  }
  // 渲染组件内容函数
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    if (openType !== "area" && openType !== "mode" && openType !== "price") {
      return null
    }
    // 根据openType 获取不同的数据
    let data = []
    // 列数
    let cols = 3
    // 默认选中值
    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;

      case 'mode':
        data = rentType
        cols = 1
        break;

      case 'price':
        data = price
        cols = 1
        break;

      default:
        break;
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
  componentDidMount() {
    this.htmlBody = document.body
    this.getFiltersData()
  }
  // 筛选菜单内容
  renderFilterMore() {
    const { openType, selectedValues, filtersData: { roomType, oriented, floor, characteristic } } = this.state
    if (openType !== 'more') {
      return null
    }
    const defaultValue = selectedValues.more
    const data = { roomType, oriented, floor, characteristic }
    return <FilterMore data={data} onSave={this.onSave} type={openType} defaultValue={defaultValue} onCancel={this.onCancel} />
  }
  // 渲染遮罩层
  renderMask() {
    const { openType } = this.state
    const isHide = openType === "more" || openType === ""
    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }
          return (
            <div style={props} className={styles.mask} onClick={() => this.onCancel(openType)}></div>
          )
        }}
      </Spring>
    )
  }
  // 组件结构
  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>

        {/* 前三个菜单的遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.titleClicked} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* {openType === "more" ? <FilterMore /> : ''} */}
          {this.renderFilterMore()}

        </div>
      </div>
    )
  }
}
