import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import Company, {
  ICompanyContainerConnectInjectedProps,
  ICompanyContainerOwnProps
} from 'components/Protected/Account/Company'
import { fetchRelationships } from 'actions/data'
import { IState } from 'reducers'
import { assumedAMIDName, dataSelector, profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => ({
  darkProfile: profileSelector(state).darkProfile,
  assumedAMID: profileSelector(state).assumedAMID,
  companyName: assumedAMIDName(state)
})

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
  fetchRelationships: () => dispatch(fetchRelationships())
})

export default connect<
  {},
  ICompanyContainerConnectInjectedProps,
  ICompanyContainerOwnProps
>(mapStateToProps, mapDispatchToProps)(Company)
