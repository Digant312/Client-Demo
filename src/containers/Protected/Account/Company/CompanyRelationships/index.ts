import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import CompanyRels, {
  ICompanyMapStateProps,
  ICompanyRelsOwnProps
} from 'components/Protected/Account/Company/CompanyRelationships'
import { IState } from 'reducers'
import { dataSelector, profileSelector, isAdminOfAssumedAMID } from 'selectors'

const mapStateToProps = (state: IState) => ({
  isAdmin: isAdminOfAssumedAMID(state),
  assetManagerId: profileSelector(state).assetManagerId,
  assumedAMID: profileSelector(state).assumedAMID,
  fetchingParties: dataSelector(state).parties.fetching,
  parties: dataSelector(state).parties.data,
  fetchingRelationships: dataSelector(state).relationships.fetching,
  relationships: dataSelector(state).relationships.data
})

export default connect<ICompanyMapStateProps, {}, ICompanyRelsOwnProps>(
  mapStateToProps
)(CompanyRels)
