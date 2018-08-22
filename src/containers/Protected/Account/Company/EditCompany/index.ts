import { connect } from 'react-redux'

import EditCompany, { IEditCompanyProps } from 'components/Protected/Account/Company/EditCompany'
import { IState } from 'reducers'
import { profileSelector} from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    darkProfile: profileSelector(state).darkProfile
  }
)

export default connect<{ darkProfile: boolean }, {}, IEditCompanyProps>(
  mapStateToProps
)(EditCompany)