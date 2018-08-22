import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Form, Loader, Message } from 'semantic-ui-react'

import Layout from 'containers/Shared/Layouts/Public'

interface IRequestProps {
  requesting: boolean
  requestError: string
  registerUser: () => void
}

class JoinCompany extends React.Component<IRequestProps & RouteComponentProps<{}>> {
  componentDidMount() {
    this.props.registerUser()
  }
  render() {
    const { requestError } = this.props
    return <Layout>
      <div>
        <Loader active inline='centered' size='massive' />
        { requestError ? <Message error>{requestError}</Message> : null }
      </div>
      <Message color='blue'>
        <Message.Header>Almost there...</Message.Header>
      </Message>
    </Layout>
  }
}

export default JoinCompany