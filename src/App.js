import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Registe from './pages/Registe'
import Profile from './pages/Profile'
import AuthRoute from './components/AuthRoute'

import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}

        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/map" component={Map} />

        <Route path="/citylist" component={CityList} />
        <Route path="profile" component={Profile} />

        {/* 房屋详情 */}
        <Route path="/detail/:id" component={HouseDetail} />

        {/* 登录 */}
        <Route path="/login" component={Login} />

        {/* 注册 */}
        <Route path="/registe" component={Registe} />

        {/* 发布房源 */}
        <AuthRoute exact path="/rent" component={Rent} />
        <AuthRoute path="/rent/add" component={RentAdd} />
        <AuthRoute path="/rent/search" component={RentSearch} />
      </div>
    </Router>
  )
}

export default App
