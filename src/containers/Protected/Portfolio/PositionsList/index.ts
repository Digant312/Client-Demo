import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { RouteComponentProps } from 'react-router-dom'

import Positions from 'components/Protected/Portfolio/PositionsList'
import { fetchPositions } from 'actions/data'
import { IState } from 'reducers'
import { bookSelectorSelector, dataSelector, profileSelector } from 'selectors'

interface IMapStateProps {
  assumedAMID: string
  positionsFetching: boolean
  positions: any[]
  fetchError: string
}

interface IMapDispatchProps {
  fetchPositions: Function
}

const selector = formValueSelector('toggle-position-form')

const mapStateToProps = (state: IState) => {
  const visibleBooks = bookSelectorSelector(state)
    .filter(book => book.visible)
    .map(book => book.bookId)
  return {
    togglePositionCheckBox: selector(state, 'togglePositionCheckBox'),    
    assumedAMID: profileSelector(state).assumedAMID,
    positionsFetching: dataSelector(state).positions.fetching,
    positions: dataSelector(state).positions.data.filter(pos => {
      return visibleBooks.indexOf(pos.bookId as string) !== -1
    }),
    fetchError: dataSelector(state).positions.error
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  fetchPositions: (query?: { [queryKey: string]: string | string[] }) => {
    dispatch(fetchPositions(query))
  }
})

export default connect<
  IMapStateProps,
  IMapDispatchProps,
  RouteComponentProps<{}>
>(mapStateToProps, mapDispatchToProps)(Positions)
