import React, { Fragment, type ReactElement } from 'react'
import Header from '../Header'
import AuthRequired from './AuthRequired'

const Layout = (): ReactElement => {
  return (
    <Fragment>
      <Header />

      <div className='container-page'>
        <AuthRequired />
      </div>
    </Fragment>
  )
}

export default Layout
