import { connect } from 'react-redux'
import PartyContainer from 'components/Protected/Core/Parties/'
import { IState } from 'reducers'
import { profileSelector } from 'selectors'

interface IMapStateProps {
    darkProfile: boolean
}

const mapStateToProps = (state: IState) => ({
  darkProfile: profileSelector(state).darkProfile
})

export default connect(
  mapStateToProps
)(PartyContainer)