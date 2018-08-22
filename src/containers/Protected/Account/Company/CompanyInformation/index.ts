import { connect } from 'react-redux'

import { IState } from 'reducers'
import {
  assumedAMIDName,
  profileSelector,
  isAdminOfAssumedAMID
} from 'selectors'
import CompanyInformation, {
  ICompanyInformationMapInjectedProps,
  ICompanyInformationOwnProps
} from 'components/Protected/Account/Company/CompanyInformation'

const mapStateToProps = (state: IState) => ({
  isAdmin: isAdminOfAssumedAMID(state),
  assumedAMID: profileSelector(state).assumedAMID,
  companyName: assumedAMIDName(state)
})

export default connect<
  ICompanyInformationMapInjectedProps,
  {},
  ICompanyInformationOwnProps
>(mapStateToProps)(CompanyInformation)
