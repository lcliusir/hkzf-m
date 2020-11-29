import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        <Route path="/" render={() => <Redirect to="/home" />}></Route>
        <Route path="/home" component={Home}></Route>
        <Route path="/map" component={Map}></Route>
        <Route path="/citylist" component={CityList}></Route>
      </div>
    </Router>
  )
}

export default App;
