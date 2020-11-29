import React from 'react'
// import './index.scss'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader'
export default class Map extends React.Component {
  componentDidMount() {
    this.initMap()
  }
  initMap() {
    const { label } = JSON.parse(localStorage.getItem('hkzf_city'))
    const map = new window.BMap.Map('container')
    // const point = new window.BMap.Point(112.982, 28.194)

    //创建地址解析器实例
    const myGeo = new window.BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(label, (point) => {
      if (point) {
        map.centerAndZoom(point, 11)
        // map.addOverlay(new window.BMap.Marker(point))
        // 添加控件
        map.addControl(new window.BMap.ScaleControl())
        map.addControl(new window.BMap.NavigationControl())

      } else {
        alert('您选择的地址没有解析到结果！')
      }
    }, label)
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>
          地图找房
        </NavHeader>
        <div id="container" className={styles.container} />
      </div>
    )
  }
}