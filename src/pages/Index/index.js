import React from 'react'
import { Carousel, Flex } from 'antd-mobile'
import axios from 'axios'
// nav 图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 样式
import './index.css'
export default class Index extends React.Component {
  state = {
    // 图片名称
    swipers: []
  }
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    console.log(res)
    this.setState(() => {
      return {
        swipers: res.data.body
      }
    })
  }
  componentDidMount() {
    this.getSwipers()
  }
  randerSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }
  render() {
    return (
      <div className="index">
        <Carousel autoplay infinite>
          {this.randerSwipers()}
        </Carousel>
        <Flex className="nav">
          <Flex.Item>
            <img src={nav1} alt="" />
            <h2>整租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav2} alt="" />
            <h2>合租</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav3} alt="" />
            <h2>地图找房</h2>
          </Flex.Item>
          <Flex.Item>
            <img src={nav4} alt="" />
            <h2>去出租</h2>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}