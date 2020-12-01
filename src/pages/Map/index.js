import React from 'react'
// import './index.scss'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
// import axios from 'axios'
import { API } from '../../utils/api'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { BASE_URL } from '../../utils/url'

// 覆盖物样式
const labelstyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255,0,0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rbg(255,255,255)',
  textAlign: 'center'
}
export default class Map extends React.Component {
  state = {
    housesList: [],
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }
  initMap() {
    const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const map = new window.BMap.Map('container')
    this.map = map
    //创建地址解析器实例
    const myGeo = new window.BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, async (point) => {
      if (point) {
        map.centerAndZoom(point, 11)
        // map.addOverlay(new window.BMap.Marker(point))
        // 添加控件
        map.addControl(new window.BMap.ScaleControl())
        map.addControl(new window.BMap.NavigationControl())

        // 入口函数
        this.renderOverlays(value)

        // // 区的数据
        // const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
        // console.log(res)
        // // 遍历数据，创建覆盖物
        // res.data.body.forEach(item => {
        //   const { coord: { longitude, latitude }, label: areaName, count, value: areaValue } = item
        //   // 覆盖物
        //   // 各地的坐标
        //   const areaPoint = new window.BMap.Point(longitude, latitude)
        //   const opts = {
        //     position: areaPoint,
        //     offset: new window.BMap.Size(-35, -35)
        //   }
        //   const label = new window.BMap.Label('', opts)
        //   // 给label 添加唯一标识
        //   label.id = areaValue
        //   // 覆盖物 子节点内容
        //   label.setContent(`
        //   <div class="${styles.bubble}">
        //     <p class="${styles.name}">${areaName}</p>
        //     <p>${count}套</p>
        //   </div>
        // `)
        //   // 设置样式
        //   label.setStyle(labelstyle)
        //   // 单击事件
        //   label.addEventListener('click', () => {
        //     console.log(label.id)
        //     map.centerAndZoom(areaPoint, 13)
        //     // 解决清除覆盖物报错，用定时器就行
        //     setTimeout(() => {
        //       map.clearOverlays()
        //     }, 0)
        //   })
        //   // 添加到地图中
        //   map.addOverlay(label)
        // })
      } else {
        alert('您选择的地址没有解析到结果！')
      }
    }, label)

    map.addEventListener('movestart', () => {
      if (this.state.isShowList) {
        this.setState({
          isShowList: false
        })
      }
    })
  }
  // 覆盖物入口函数
  async renderOverlays(id) {
    try {
      Toast.loading('加载中...', 0, null, false)
      const res = await API.get(`/area/map?id=${id}`)
      Toast.hide()
      // console.log(res)
      const data = res.data.body
      const { nextZoom, type } = this.getTypeAndZoom()
      data.forEach(item => {
        this.createOverlays(item, nextZoom, type)
      })
    } catch (e) {
      Toast.hide()
    }
  }
  // 创建覆盖物
  createOverlays(data, zoom, type) {
    const {
      coord: { longitude, latitude },
      label: areaName,
      count,
      value: areaValue
    } = data
    // 创建坐标
    const areaPoint = new window.BMap.Point(longitude, latitude)
    if (type === 'circle') {
      this.createCircle(areaPoint, areaName, count, areaValue, zoom)
    } else {
      this.createRect(areaPoint, areaName, count, areaValue)
    }
  }

  // 确定覆盖物类型
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    // console.log(zoom)
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      type = 'rect'
    }
    return {
      nextZoom,
      type
    }
  }

  // 创建区 或 镇 覆盖物 
  createCircle(point, name, count, id, zoom) {
    const opts = {
      position: point,
      offset: new window.BMap.Size(-35, -35)
    }
    const label = new window.BMap.Label('', opts)
    // 给label 添加唯一标识
    label.id = id
    // 覆盖物 子节点内容
    label.setContent(`
        <div class="${styles.bubble}">
          <p class="${styles.name}">${name}</p>
          <p>${count}套</p>
        </div>
      `)
    // 设置样式
    label.setStyle(labelstyle)
    // 单击事件
    label.addEventListener('click', () => {
      console.log(labelstyle)
      this.renderOverlays(id)
      this.map.centerAndZoom(point, zoom)
      // 解决清除覆盖物报错，用定时器就行
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)
    })
    // 添加到地图中
    this.map.addOverlay(label)
  }

  // 创建 小区 覆盖物 
  createRect(point, name, count, id) {
    const opts = {
      position: point,
      offset: new window.BMap.Size(-50, -28)
    }
    const label = new window.BMap.Label('', opts)
    // 给label 添加唯一标识
    label.id = id
    // 覆盖物 子节点内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)
    // 设置样式
    label.setStyle(labelstyle)
    // 单击事件
    label.addEventListener('click', (e) => {
      // console.log('点击了小区')
      this.getHousesList(id)

      const target = e.changedTouches[0]
      console.log(target)
      this.map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY)
    })
    // 添加到地图中
    this.map.addOverlay(label)
  }

  // 获取小区房屋信息
  async getHousesList(id) {
    try {
      Toast.loading('加载中...', 0, null, false)
      const res = await API.get(`/houses?cityId=${id}`)
      Toast.hide()
      this.setState(() => {
        return {
          isShowList: true,
          housesList: res.data.body.list
        }
      })
    } catch (e) {
      Toast.hide()
    }

    // console.log(this.state.housesList)
  }

  // 渲染房屋列表
  renderHousesList() {
    return this.state.housesList.map(item => (
      <div className={styles.house} key={item.houseCode}>
        <div className={styles.imgWrap}>
          <img className={styles.img} src={BASE_URL + item.houseImg} alt="" />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.desc}>{item.desc}</div>
          <div>
            {/* ['近地铁', '随时看房'] */}
            {item.tags.map((tag, index) => {
              const tagClass = 'tag' + (index + 1)
              return (
                <span
                  className={[styles.tag, styles[tagClass]].join(' ')}
                  key={tag}
                >
                  {tag}
                </span>
              )
            })}
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{item.price}</span> 元/月
          </div>
        </div>
      </div>
    )
    )
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container" className={styles.container} />

        {/* 房屋列表  */}
        <div className={[styles.houseList, this.state.isShowList ? styles.show : ''].join(' ')}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源</Link>
          </div>
          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>

      </div>
    )
  }
}