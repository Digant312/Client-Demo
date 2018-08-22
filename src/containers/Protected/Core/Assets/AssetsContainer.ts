import { connect } from 'react-redux'
import AssetsContainer from 'components/Protected/Core/Assets/'
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
)(AssetsContainer)