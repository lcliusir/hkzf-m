import React from 'react'
import './index.scss'
export default class Map extends React.Component {
  componentDidMount() {
    const map = new window.BMap.Map('container')
    const point = new window.BMap.Point(112.982, 28.194)
    map.centerAndZoom(point, 25)
  }
  render() {
    return (
      <div className="map">
        <div id="container">地图容器</div>
      </div>
    )
  }
}