import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Loader, Message } from 'semantic-ui-react'

import Layout from 'containers/Shared/Layouts/Public'

const DomainChecker = (props: RouteComponentProps<{}> & { checkDomain: Function }) => {
  // call the action to check the domain
  props.checkDomain()
  return (
    <Layout>
      <Loader active inline='centered' size='massive' />
      <Message color='blue'>
        <Message.Header>Just a moment...</Message.Header>
        <br/>
        <p>
          We are checking your email address against our system, please be patient.
        </p>
      </Message>
    </Layout>
  )
}

export default DomainChecker