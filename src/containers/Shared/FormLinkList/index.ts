import { connect } from 'react-redux'

import FormLinkList, { ILinkListBaseProps } from 'components/Shared/FormLinkList'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect<{ darkProfile: boolean }, {}, ILinkListBaseProps>(
  mapStateToProps
)(FormLinkList)