import React from 'react'
import { NavBar } from 'antd-mobile'
// import './index.scss'
import styles from './index.module.css'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
function NavHeader({ children, history, onLeftClick, className, rightContent }) {
  // 左侧按钮默认点击行为
  const defaultClick = () => history.go(-1)
  return (
    <NavBar
      className={[styles.navBar, className || ''].join(' ')}
      mode="light"
      icon={<i className="iconfont icon-back"></i>}
      onLeftClick={onLeftClick || defaultClick}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}
NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onLeftClick: PropTypes.func,
  className: PropTypes.string,
  rightContent: PropTypes.array
}
export default withRouter(NavHeader)