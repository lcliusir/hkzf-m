import React from 'react'
import FilterFooter from '../../../../components/FilterFooter'
import styles from './index.module.css'
import { Spring } from 'react-spring/renderprops'

export default class FilterMore extends React.Component {
  state = {
    selectedValue: this.props.defaultValue
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    const { selectedValue } = this.state
    return data.map(item => {
      const isSelected = selectedValue.indexOf(item.value) > -1
      return (
        <span
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          key={item.value}
          onClick={() => this.onTagClick(item.value)}
        >
          {item.label}
        </span>
      )
    })
  }
  // 标签点击事件
  onTagClick(value) {
    console.log(value)
    const newSelectedValue = [...this.state.selectedValue]
    if (newSelectedValue.indexOf(value) <= -1) {
      newSelectedValue.push(value)
    } else {
      const index = newSelectedValue.findIndex(item => item === value)
      newSelectedValue.splice(index, 1)
    }
    this.setState({
      selectedValue: newSelectedValue
    })
  }
  // 清除按钮事件
  Cleared = () => {
    this.setState({
      selectedValue: []
    })
  }
  // 确定按钮事件
  onOk = () => {
    const { type, onSave } = this.props
    onSave(this.state.selectedValue, type)
  }

  // render() {
  //   const { data: { roomType, oriented, floor, characteristic }, onCancel, type } = this.props
  //   return (
  //     <div className={styles.root}>
  //       {/* 遮罩层 */}
  //       <div className={styles.mask} onClick={() => onCancel(type)} />

  //       {/* 条件内容 */}
  //       <div className={styles.tags}>
  //         <dl className={styles.dl}>
  //           <dt className={styles.dt}>户型</dt>
  //           <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

  //           <dt className={styles.dt}>朝向</dt>
  //           <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

  //           <dt className={styles.dt}>楼层</dt>
  //           <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

  //           <dt className={styles.dt}>房屋亮点</dt>
  //           <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
  //         </dl>
  //       </div>

  //       {/* 底部按钮 */}
  //       <FilterFooter className={styles.footer} cancelText='清除' onCancel={this.Cleared} onOk={this.onOk} />
  //     </div>
  //   )
  // }

  render() {
    const { data: { roomType, oriented, floor, characteristic }, onCancel, type } = this.props
    // 该组件是否展示
    const isOpen = type !== 'more'
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <Spring from={{ opacity: 0 }} to={{ opacity: isOpen ? 0 : 1 }}>
          {props => {
            if (props.opacity === 0) {
              return null
            }
            return (
              <div
                style={props}
                className={styles.mask}
                onClick={() => onCancel(type)}
              />
            )
          }}
        </Spring>

        <Spring
          to={{ transform: `translate(${isOpen ? '100%' : '0px'}, 0px)` }}
        >
          {props => {
            return (
              <>
                <div style={props} className={styles.tags}>
                  <dl className={styles.dl}>
                    <dt className={styles.dt}>户型</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(roomType)}
                    </dd>

                    <dt className={styles.dt}>朝向</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(oriented)}
                    </dd>

                    <dt className={styles.dt}>楼层</dt>
                    <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

                    <dt className={styles.dt}>房屋亮点</dt>
                    <dd className={styles.dd}>
                      {this.renderFilters(characteristic)}
                    </dd>
                  </dl>
                </div>

                {/* 底部按钮 */}
                <FilterFooter
                  style={props}
                  className={styles.footer}
                  cancelText="清除"
                  onCancel={this.onCancel}
                  onOk={this.onOk}
                />
              </>
            )
          }}
        </Spring>

      </div>
    )
  }
}
