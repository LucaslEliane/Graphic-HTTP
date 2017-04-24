import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router'
import Link from './Link'

/**
 * 相当于是对于Link组件的一个封装，通过一个Route组件进行子组件渲染
 * 
 * @param {*} param0 
 */
const NavLink = ({
  to,
  exact,
  strict,
  location,
  activeClassName,
  className,
  activeStyle,
  style,
  isActive,
  ...rest
}) => {
  <Route
    path={typeof to === 'object' ? to.pathname : to}
    exact={exact}
    strict={strict}
    location={location}
    children={({ location, match }) => {
      // 判断对于某个Link，是不是在激活状态
      const isActive = !!(getIsActive ? getIsActive(match, location) : match)

      return (
      // 通过激活状态的判断，来进行相应的Link样式的渲染
        <Link
          to={to}
          className={isActive ? [activeClassName, className].filter(i => i).join(' ') : className}
          style={isActive ? { ...style, ...activeStyle } : style}
          {...rest}
        />
      )
    }}
  />
}