import React from 'react'
import { NavBar, Toast } from 'antd-mobile'
import './index.scss'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
import { List, AutoSizer } from 'react-virtualized'

// List data as an array of strings
// const list = Array(50).fill('11')
// function rowRenderer({
//   key,
//   index,  // 索引号
//   isScrolling, // 是否正在滚动 
//   isVisible, // 是否可见
//   style, // 必须 指定每一行数据的位置
// }) {
//   return (
//     <div key={key} style={style}>
//       {list[index]}
//     </div>
//   )
// }

// 转换城市索引
const formatCityIndex = letter => {
  if (letter === '#') {
    return '当前定位'
  } else if (letter === 'hot') {
    return '热门城市'
  } else {
    return letter.toUpperCase()
  }
}

const title_height = 36
const name_height = 50
const hot_city = ['北京', '上海', '广州', '深圳']
class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0
    }
    // 创建 ref 右侧列表
    this.cityListComponent = React.createRef()
  }

  async componentDidMount() {
    await this.getCityList()

    // measureAllRows  提前计算右侧行的高度，精准跳转 调用时必须保证当前组件及数据已经存在
    this.cityListComponent.current.measureAllRows()
  }
  // 获取所有城市
  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { cityIndex, cityList } = this.formatCiltList(res.data.body)
    // 热门城市
    const hotCity = await axios.get('http://localhost:8080/area/hot')
    // 热门城市加在 数据最前端
    cityList['hot'] = hotCity.data.body
    cityIndex.unshift('hot')
    // 获取当前定位城市
    const curCity = await getCurrentCity()
    // 将当前城市添加到数据中
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    // console.log(curCity, cityIndex, cityList)
    this.setState({
      cityList,
      cityIndex
    })
  }
  // 转换数据格式的方法
  formatCiltList = list => {
    const cityList = {}
    list.forEach(item => {
      const first = item.short.substr(0, 1)
      if (cityList[first]) {
        cityList[first].push(item)
      } else {
        cityList[first] = [item]
      }
    })
    const cityIndex = Object.keys(cityList).sort()
    return {
      cityList,
      cityIndex
    }
  }
  rowRenderer = ({
    key,
    index,  // 索引号
    isScrolling, // 是否正在滚动 
    isVisible, // 是否可见
    style, // 必须 指定每一行数据的位置
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    // console.log(letter)
    const citys = cityList[letter]
    // console.log(citys)
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndex(letter)}</div>
        {
          citys.map((item) => <div key={item.value} className="name" onClick={() => this.changeCity(item)}>{item.label}</div>)
        }
      </div>
    )
  }
  // 点击切换城市
  changeCity({ label, value }) {
    if (hot_city.includes(label)) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无房源信息', 2, null, false)
    }
  }
  // 每行高度
  getRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state
    return cityList[cityIndex[index]].length * name_height + title_height
  }
  // 右侧列表
  getRightIndex() {
    return this.state.cityIndex.map((item, index) => <li className="city-index-item" key={item} onClick={() =>
      // console.log(this.cityListComponent)
      this.cityListComponent.current.scrollToRow(index)
    }>
      <span className={this.state.activeIndex === index ? 'index-active' : ''}>
        {item === 'hot' ? '热' : item.toUpperCase()}
      </span>
    </li>)
  }
  // 获取list组件行信息
  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }
  render() {
    return (
      <div className="citylist">
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>

        {/* 自动尺寸组件 */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={this.cityListComponent}
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>

        {/* 右侧索引 */}
        <ul className="city-index">
          {this.getRightIndex()}
        </ul>
      </div>
    )
  }
}
export default CityList