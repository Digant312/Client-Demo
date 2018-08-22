import { connect } from 'react-redux'

import AssetsForm from 'components/Protected/Core/Assets/AssetsForm'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    dateFormat: profileSelector(state).dateFormat
  }
)

export default connect<{ dateFormat: string }, {}, any>(
  mapStateToProps
)(AssetsForm)