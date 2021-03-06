import React, { lazy } from 'react'
import './index.css'

import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import Index from '../Index'
const News = lazy(() => import('../News'))
const List = lazy(() => import('../List'))
const Profile = lazy(() => import('../Profile'))

// TabBar 数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-ind',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-findHouse',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-infom',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]
class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    // tabBar的显示与隐藏
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState(() => {
        return {
          selectedTab: this.props.location.pathname
        }
      })
    }
  }
  renderTabBarItems() {
    return tabItems.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          })
          this.props.history.push(item.path)
        }}
      >
      </TabBar.Item>
    ))
  }
  render() {
    return (
      <div className="home">
        {/* Home下的子路由规则 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/list" component={List}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>

        <TabBar
          noRenderContent={true}
          tintColor="#21b97a"
          barTintColor="white"
        >
          {this.renderTabBarItems()}
        </TabBar>
      </div>
    )
  }
}
export default Home