import React from 'react'
import { Link } from 'react-router-dom'
import { Image, Segment } from 'semantic-ui-react'

import { staticAssets } from 'config'
import './styles.scss'

const logo = staticAssets(process.env.DEPLOY_ENV as string)
  .darkLogoOnTransparentHD

interface IPublicLayoutProps {
  children: JSX.Element[] | JSX.Element
  handleCancelSignup: Function
}

const PublicLayout = (props: IPublicLayoutProps) => {
  let PriComp,
    SecComp,
    TertComp = null
  if (Array.isArray(props.children)) {
    ;[PriComp, SecComp, TertComp] = props.children
  } else {
    PriComp = props.children
  }
  return (
    <div className="div-height-fill public-layout-wrapper">
      <div className="public-layout-panel">
        <div className="public-layout-content">
          <div className="public-panel public-panel-top">
            <Image
              onClick={() => props.handleCancelSignup()}
              as={Link}
              to="/"
              src={logo}
            />
          </div>
        </div>
        {TertComp}
        <div className="public-layout-content">
          <div className="public-panel public-panel-main">
            {SecComp}
            {PriComp}
          </div>
        </div>
      </div>
      {/* <div className='public-layout-panel-secondary'>
      <div className='public-panel public-panel-top' />
      <div className='public-panel public-panel-main'>
        {SecComp}
      </div>
    </div> */}
    </div>
  )
}

export default PublicLayout
