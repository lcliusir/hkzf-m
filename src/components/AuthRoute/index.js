import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

const AuthRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => {
    if (isAuth()) {
      // 已登录
      return <Component {...props} />
    } else {
      // 未登录
      return <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }} />
    }
  }}></Route>
}

export default AuthRoute