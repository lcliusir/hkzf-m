import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'
import { API } from '../../utils/api'
import { withFormik, Field, Form, ErrorMessage } from 'formik'
import { setToken } from '../../utils/auth'
import * as Yup from 'yup'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // state = {
  //   username: '',
  //   password: ''
  // }
  // getUsername = (e) => {
  //   this.setState({
  //     username: e.target.value
  //   })
  // }
  // getPassword = (e) => {
  //   this.setState({
  //     password: e.target.value
  //   })
  // }
  // // 表单提交处理程序
  // handleSubmit = async (e) => {
  //   e.preventDefault()
  //   const { username, password } = this.state
  //   const res = await API.post('/user/login', {
  //     username, password
  //   })
  //   console.log('提交结果', res)
  //   const { body, description, status } = res.data
  //   // 登录成功
  //   if (status === 200) {
  //     localStorage.setItem('hkzf_token', body.token)
  //     this.props.history.go(-1)
  //   } else {
  //     // 登录失败
  //     Toast.info(description, 2, null, false)
  //   }
  // }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号" />
            </div>
            <ErrorMessage
              name="username"
              className={styles.error}
              component="div"
            />
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                type="password"
                className={styles.input}
                name="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage
              name="password"
              className={styles.error}
              component="div"
            />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}

            {/* 登录按钮 */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>


          {/* 底部连接 */}
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  // 提供状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    const res = await API.post('/user/login', {
      username, password
    })
    console.log('登录结果', res)
    const { body, description, status } = res.data
    // 登录成功
    if (status === 200) {
      // localStorage.setItem(body.token)
      setToken(body.token)
      if (!props.location.state) {
        // 正常登陆
        props.history.go(-1)
      } else {
        props.history.replace(props.location.state.from.pathname)
      }
      // 处理 this 指向 handleSubmit 的第二个参数
      // props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到12位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  })
})(Login)

export default Login
