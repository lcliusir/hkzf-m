import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import AuthRoute from './components/AuthRoute'

import Home from './pages/Home'

const CityList = lazy(() => import('./pages/CityList'))
const Map = lazy(() => import('./pages/Map'))
const HouseDetail = lazy(() => import('./pages/HouseDetail'))
const Login = lazy(() => import('./pages/Login'))
const Registe = lazy(() => import('./pages/Registe'))
const Rent = lazy(() => import('./pages/Rent'))
const RentAdd = lazy(() => import('./pages/Rent/Add'))
const RentSearch = lazy(() => import('./pages/Rent/Search'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="route-loading">loading...</div>}>
        <div className="App">
          {/* 配置路由 */}

          <Route path="/" exact render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/map" component={Map} />

          <Route path="/citylist" component={CityList} />

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
      </Suspense>
    </Router>
  )
}

export default App
