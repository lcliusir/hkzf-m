import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.css'

// dom.getBoundingClientRect() 获取元素的大小及其相对于视口的位置。

/* 
  1 封装 Sticky 组件，实现吸顶功能。
  2 在 HouseList 页面中，导入 Sticky 组件。
  3 使用 Sticky 组件包裹要实现吸顶功能的 Filter 组件。

  4 在 Sticky 组件中，创建两个 ref 对象（placeholder、content），分别指向占位元素和内容元素。
  5 组件中，监听浏览器的 scroll 事件（注意销毁事件）。
  6 在 scroll 事件中，通过 getBoundingClientRect() 方法得到筛选栏占位元素当前位置（top）。
  7 判断 top 是否小于 0（是否在可视区内）。
  8 如果小于，就添加需要吸顶样式（fixed），同时设置占位元素高度（与条件筛选栏高度相同）。
  9 否则，就移除吸顶样式，同时让占位元素高度为 0。
*/

class Sticky extends Component {
  // 创建 ref 
  placeHolder = createRef()
  content = createRef()
  // scroll 事件处理程序
  handleScroll = () => {
    const { height } = this.props
    const placeHolderEl = this.placeHolder.current
    const contentEl = this.content.current
    const { top } = placeHolderEl.getBoundingClientRect()
    if (top < 0) {
      // 固定定位
      contentEl.classList.add(styles.fixed)
      placeHolderEl.style.height = `${height}px`
    } else {
      // 默认
      contentEl.classList.remove(styles.fixed)
      placeHolderEl.style.height = '0px'
    }
  }
  // 监听scroll 事件 
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeHolder}></div>
        {/* 内容元素 */}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }
}
Sticky.propTypes = {
  height: PropTypes.number.isRequired
}
export default Sticky
