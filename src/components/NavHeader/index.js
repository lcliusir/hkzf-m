import React from 'react'
import { NavBar } from 'antd-mobile'
// import './index.scss'
import styles from './index.module.css'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
function NavHeader({ children, history, onLeftClick }) {
  // 左侧按钮默认点击行为
  const defaultClick = () => history.go(-1)
  return (
    <NavBar
      className={styles['am-navbar-light']}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={onLeftClick || defaultClick}
    >
      {children}
    </NavBar>
  )
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func
}
export default withRouter(NavHeader)