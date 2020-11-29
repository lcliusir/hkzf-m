import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import axios from 'axios'
import { getCurrentCity } from '../../utils'
// nav 图片
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 样式
import './index.scss'
// 导航数据
const navs = [
  {
    id: 1,
    img: nav1,
    title: '整租',
    path: '/home/list'
  },
  {
    id: 2,
    img: nav2,
    title: '合租',
    path: '/home/list'
  },
  {
    id: 3,
    img: nav3,
    title: '地图找房',
    path: '/home/map'
  },
  {
    id: 4,
    img: nav4,
    title: '去出租',
    path: '/home/sale'
  }
]
// const data = Array.from(new Array(4)).map((_val, i) => ({
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
//   text: `name${i}`,
// }))


// 获取经纬度
// window.navigator.geolocation.getCurrentPosition(() => { console.log(11) })

export default class Index extends React.Component {
  state = {
    // 图片名称
    swipers: [],
    isSwiperLoaded: false,
    groups: [],
    news: [],
    curCityName: '上海'
  }
  // 拿到轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8080/home/swiper')
    // console.log(res)
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }
  // 拿到小组数据
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // console.log(res)
    this.setState(() => {
      return {
        groups: res.data.body
      }
    })
  }
  // 拿到资讯数据
  async getNews() {
    let { data: res } = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // 判断返回的状态是否是成功
    if (res.status !== 200) {
      console.error(res.description)
      return
    }
    // 把获取到的值设置给state
    this.setState({
      news: res.body
    })
  }
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    // const currentCity = new window.BMap.LocalCity()
    // currentCity.get(async city => {
    //   // console.log(city)
    //   const res = await axios.get(`http://localhost:8080/area/info?name=${city.name}`)
    //   // console.log(res)
    //   this.setState({
    //     curCityName: res.data.body.label
    //   })
    // })

    // 优化
    const curCity = await getCurrentCity()
    this.setState(() => {
      return {
        curCityName: curCity.label
      }
    })
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
  renderNavs() {
    return navs.map(item => (
      <Flex.Item key={item.id} onClick={() => this.props.history.push(item.path)}>
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }
  // 宫格渲染 item 
  renderGroups(item) {
    return (
      <Flex className="group-item" justify="around" key={item.id}>
        <div className="desc">
          <p className="title">{item.title}</p>
          <span className="info">{item.desc}</span>
        </div>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
      </Flex>
    )
  }
  // 渲染资讯item
  renderNews() {
    return this.state.news.map(item => {
      return (
        <div className="news-item" key={item.id}>
          <div className="imgwrap">
            <img
              className="img"
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
            />
          </div>
          <Flex className="content" direction="column" justify="between">
            <h3 className="title">{item.title}</h3>
            <Flex className="info" justify="between">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </Flex>
          </Flex>
        </div>
      )
    })
  }
  render() {
    return (
      <div className="index">

        {/* 轮播图 */}
        <div className="swiper">
          {
            this.state.isSwiperLoaded ?
              (<Carousel autoplay infinite>
                {this.randerSwipers()}
              </Carousel>)
              : ''
          }
        </div>

        {/* 顶部导航 */}
        <Flex className='search-box'>
          {/* 左侧白色区域 */}
          <Flex className="search">
            {/* 位置 */}
            <div className="location" onClick={() => this.props.history.push('/citylist')}>
              <span className="name">{this.state.curCityName}</span>
              <i className="iconfont icon-arrow" />
            </div>

            {/* 搜索表单 */}
            <div className="form" onClick={() => this.props.history.push('/search')}>
              <i className="iconfont icon-seach" />
              <span className="text">请输入小区或地址</span>
            </div>
          </Flex>
          {/* 右侧地图图标 */}
          <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')} />
        </Flex>

        {/* nav导航 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>
          {/* 宫格组件 */}
          <Grid data={this.state.groups} square={false} hasLine={false} columnNum={2} renderItem={data => this.renderGroups(data)} />
        </div>

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}