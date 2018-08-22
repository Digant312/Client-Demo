import React, { EventHandler, MouseEvent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux'

import ProtectedIndexComponent from 'components/Routes/ProtectedIndex'
import { fetchBooks, fetchParties } from 'actions/data'
import { requestAuth, requestLogout } from 'actions/session'
import { requestConnection } from 'actions/pubsub'

interface IMapDispatchProps {
  initiatePubSub: Function
  fetchBooks: Function
  fetchParties: Function
  startSessionChecker: Function
  logout: EventHandler<MouseEvent<HTMLButtonElement>>
}

const mapDispatchToProps = (dispatch: Function, ownProps: RouteComponentProps<{}>) => (
  {
    initiatePubSub: () => dispatch(requestConnection()),
    fetchBooks: () => dispatch(fetchBooks()),
    fetchParties: () => dispatch(fetchParties()),
    startSessionChecker: () => dispatch(requestAuth()),
    logout: (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      dispatch(requestLogout({ history: ownProps.history }))
    }
  }
)

export default connect<{}, IMapDispatchProps, RouteComponentProps<{}>>(
  null,
  mapDispatchToProps
)(ProtectedIndexComponent)