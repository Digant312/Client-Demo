import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import { IState } from 'reducers'
import { bookSelectorSelector } from 'selectors'
import { profileSelector } from 'selectors'
import Main from 'components/Shared/Layouts/Protected/Main'
import { IBook } from 'reducers/bookSelector'
import { ISubMenuConfig } from 'components/Shared/Layouts/Protected/Main'

interface IMapStateProps {
  bookSelector: IBook[]
  darkProfile: boolean
}

interface IOwnProps {
  showBookSelector?: boolean
  subMenu?: ISubMenuConfig[]
}

const mapStateToProps = (state: IState) => (
  {
    bookSelector: bookSelectorSelector(state),
    darkProfile: profileSelector(state).darkProfile
  }
)

export default withRouter<IOwnProps>(connect<IMapStateProps, {}, IOwnProps & RouteComponentProps<{}>>(
  mapStateToProps
)(Main))