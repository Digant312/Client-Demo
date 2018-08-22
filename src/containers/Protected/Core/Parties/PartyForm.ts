import { connect } from 'react-redux'

import PartyForm from 'components/Protected/Core/Parties/PartyForm'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

const mapStateToProps = (state: IState) => (
  {
    dateFormat: profileSelector(state).dateFormat
  }
)

export default connect<{ dateFormat: string }, {}, any>(
  mapStateToProps
)(PartyForm)