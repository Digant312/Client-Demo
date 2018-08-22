import React from 'react'
import { Link } from 'react-router-dom'

import { staticAssets } from 'config'

import './styles.scss'

const NotFound = (props: { redirectPath: string }) => (
  <div className="not-found-wrapper">
    <div className="not-found-img">
      <img
        src={`${staticAssets(process.env.DEPLOY_ENV as string)
          .darkLogoOnTransparentHD}`}
      />
    </div>
    <div className="not-found-text">
      <h2>Unfortunately the page you are looking for cannot be found.</h2>
      <p>
        You may have accidentally navigated to a non-existent page, or perhaps
        something is not working. If you think you should be able to see this
        page, please <a href="mailto:help@argomi.com">contact us</a>.
      </p>
      <p>
        Click <Link to={props.redirectPath || '/a-p/home'}>here</Link> to go
        back home
      </p>
    </div>
  </div>
)

export default NotFound
