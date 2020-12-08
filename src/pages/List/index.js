import React from 'react'
import SearchHeader from '../../components/SearchHeader'
import { Flex, Toast } from 'antd-mobile'
import Filter from './components/Filter'
import { API } from '../../utils/api'
import { getCurrentCity } from '../../utils'
import { List, WindowScroller, AutoSizer, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem'
import { BASE_URL } from '../../utils/url'
import styles from './index.module.css'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

// 拿到当前位置
// const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
export default class HouseList extends React.Component {

  // 初始化对象
  state = {
    list: [],
    count: 0,
    // 数据是否已加载
    isLoading: false
  }

  // 初始化 相关数据
  filters = {}
  value = ''
  label = ''

  // 钩子
  async componentDidMount() {
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  // 拿到子组件组装的数据
  onFilter = (filters) => {
    window.scrollTo(0, 0)
    this.filters = filters
    console.log('组装数据', filters)
    this.searchHouseList()
  }

  // 发请求获取房源数据
  async searchHouseList() {
    try {
      this.setState({
        isLoading: true
      })
      Toast.loading('加载中...', 0, null, false)
      const res = await API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: 1,
          end: 20
        }
      })
      console.log(res)
      const { list, count } = res.data.body
      // 轻提示
      Toast.hide()
      if (count !== 0) {
        Toast.info(`共找到${count}套房源`, 2, null, false)
      }
      this.setState({
        list,
        count,
        isLoading: false
      })
    } catch (e) {
      Toast.fail('数据出错啦~')
    }
  }
  // 渲染行
  renderHouseItem = ({
    key, // 必须
    index,
    style, // 指定每一行数据的位置  必须
  }) => {
    const { list } = this.state
    const house = list[index]
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    } else {
      return (
        <HouseItem
          key={key}
          onClick={() => { this.props.history.push(`/detail/${house.houseCode}`) }}
          style={style}
          src={BASE_URL + house.houseImg}
          title={house.title}
          desc={house.desc}
          tags={house.tags}
          price={house.price}
        ></HouseItem>
      )
    }
  }
  // 判断是否已渲染
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  // 加载更多数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex)
    return new Promise(resolve => {
      API.get('/houses', {
        params: {
          cityId: this.value,
          ...this.filters,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {
        // console.log('loadMoreRows', res)
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        resolve()
      })
    })
  }
  renderList() {
    const { count, isLoading } = this.state
    if (count === 0 && !isLoading) {
      return (
        <NoHouse>没有找到房源，请您搜索条件吧~</NoHouse>
      )
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ isScrolling, height, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={this.state.count}
                    rowHeight={120}
                    rowRenderer={this.renderHouseItem} // 渲染每一行
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }
  render() {
    return (
      <div className="hosesList">
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)} />
          <SearchHeader curCityName={this.label} className={styles.searchHeader} />
        </Flex>

        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}