import { connect } from 'react-redux'

import DateCell, {
  IDateCellOwnProps
} from 'components/Shared/TableCells/DateCell'
import { IState } from 'reducers'
import { dateFormats } from 'reducers/profile'
import { profileSelector } from 'selectors'

export interface IMapStateProps {
  dateFormat: dateFormats
}

const mapStateToProps = (state: IState) => ({
  dateFormat: profileSelector(state).dateFormat
})

export default connect<IMapStateProps, {}, IDateCellOwnProps>(mapStateToProps)(
  DateCell
)
