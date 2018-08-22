import { connect } from 'react-redux'

import ChildFields from 'components/Shared/FormChildFields'
import { IState } from 'reducers'
import { dataSelector } from 'selectors'

/******** DELETE THIS FILE ********/

const mapStateToProps = (state: IState) => (
  {
    parties: dataSelector(state).parties.data,
    partiesFetching: dataSelector(state).parties.fetching
  }
)

export default connect()(ChildFields)