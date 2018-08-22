const devCfg = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_De6j7TWIB',
  clientAppId: '2qk35mhjjpk165vssuqhqoi1lk'
}

const stagingCfg = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_De6j7TWIB',
  clientAppId: '2qk35mhjjpk165vssuqhqoi1lk'
}

const prodCfg = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_0LilJdUR3',
  clientAppId: '6rn18a293mgnvgcfcepsqhr4a4'
}

export const staticAssetPath: any = {
  dev: 'https://d245lrezs6dicg.cloudfront.net',
  staging: 'https://d245lrezs6dicg.cloudfront.net',
  production: 'https://d3ekrasg6gwma7.cloudfront.net'
}

export const staticAssets = (env: string): any => ({
  stylesheet: `${staticAssetPath[env]}/stylesheets/argomi.min.css`,
  appIconOnDarkBig: `${staticAssetPath[env]}/${env === 'production'
    ? 'img/'
    : ''}argomi-app-icon-on-dark-grey-bg-flat.png`,
  appIconOnWhiteBig: `${staticAssetPath[env]}/${env === 'production'
    ? 'img/'
    : ''}argomi-app-icon-on-white-bg-flat.png`,
  darkLogoOnWhiteBig: `${staticAssetPath[env]}/${env === 'production'
    ? 'img/'
    : ''}dark-argomi-logo-on-white-bg.jpg`,
  logoOnlyOnTransparentHD: `${staticAssetPath[env]}/${env === 'production'
    ? 'img/'
    : ''}transparent-argomi-icon-hd.png`,
  darkLogoOnTransparentHD: `${staticAssetPath[env]}/${env === 'production'
    ? 'img/'
    : ''}transparent-dark-argomi-logo-hd.png`
})

const cfg = () => {
  switch (process.env.DEPLOY_ENV) {
    case 'staging':
      return stagingCfg
    case 'production':
      return prodCfg
    case 'dev':
    default:
      return devCfg
  }
}

export default cfg
