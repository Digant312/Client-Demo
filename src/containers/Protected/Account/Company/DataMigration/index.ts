import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import DataMigration, {
  IDataMigratesMapStateProps,
  IDataMigratesOwnProps
} from 'components/Protected/Account/Company/DataMigration'
import { IState } from 'reducers'
import { profileSelector, isAdminOfAssumedAMID } from 'selectors'

const mapStateToProps = (state: IState) => ({
  isAdmin: isAdminOfAssumedAMID(state),
  assetManagerId: profileSelector(state).assetManagerId,
  assumedAMID: profileSelector(state).assumedAMID,
  darkProfile: profileSelector(state).darkProfile
})

export default connect<IDataMigratesMapStateProps, {}, IDataMigratesOwnProps>(
  mapStateToProps
)(DataMigration)
