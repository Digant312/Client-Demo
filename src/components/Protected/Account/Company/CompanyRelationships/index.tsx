import React from 'react'
import ReactTable, { ReactTableDefaults } from 'react-table'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'
import startCase from 'lodash/startCase'
import { Button, Icon, Label, Modal } from 'semantic-ui-react'
import {
  api,
  assetManagers,
  parties,
  relationships
} from '@amaas/amaas-core-sdk-js'

import InviteModal from 'containers/Protected/Account/Company/Invite'
import Loading from 'components/Shared/Loader'
import messages from '../CompanyStrings'
import CustomButton from 'containers/Shared/ArgomiGrid/ComponentOverrides/NextPrevButton'
import CustomExpanderComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/ExpanderComponent'
import CustomFilterComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/FilterComponent'
import CustomPaginationComponent from 'containers/Shared/ArgomiGrid/ComponentOverrides/PaginationComponent'
import CustomNoDataComponent from 'components/Shared/ArgomiGrid/ComponentOverrides/NoDataComponent'
import CustomDefaultCell from 'components/Shared/ArgomiGrid/ComponentOverrides/CustomDefaultCell'

export interface ICompanyRelsOwnProps {
  fetchRelationships: Function
}

export interface ICompanyMapStateProps {
  isAdmin: boolean
  assetManagerId: string
  assumedAMID: string
  fetchingParties: boolean
  parties: parties.PartiesClassType[]
  fetchingRelationships: boolean
  relationships: relationships.Relationship[]
}

interface ICompanyRelsState {
  confirmOpen: boolean
  confirmRelatedId: number
  confirmRelationshipType: string
  inviteOpen: boolean
  updatingRelationship: boolean
  updateRelationshipError: boolean
  userAccountType: string
}

const headerAttributes = ['relationshipType', 'relationshipStatus']

const relColumns = headerAttributes.map((attr: any) => {
  const normalCol = {
    Header: startCase(attr),
    id: attr,
    accessor: (d: any) => d[attr]
  }
  if (attr === 'relationshipStatus') {
    return {
      ...normalCol,
      Cell: ({ row }: any) => {
        const status = row.relationshipStatus
        let labelConfig = {
          size: 'mini' as 'mini',
          color: 'grey' as any,
          icon: 'user outline',
          content: status
        }
        if (status === 'Active') {
          labelConfig = {
            ...labelConfig,
            color: 'green' as 'green',
            icon: 'check'
          }
        } else if (status === 'Pending') {
          labelConfig = {
            ...labelConfig,
            color: 'yellow' as 'yellow',
            icon: 'question'
          }
        }
        return (
          <div style={{ textAlign: 'center' }}>
            <Label {...labelConfig} />
          </div>
        )
      }
    }
  }
  return normalCol
})

class CompanyRels extends React.Component<
  ICompanyRelsOwnProps & ICompanyMapStateProps & InjectedIntlProps,
  ICompanyRelsState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      confirmOpen: false,
      confirmRelatedId: -1,
      confirmRelationshipType: '',
      inviteOpen: false,
      updatingRelationship: false,
      updateRelationshipError: false,
      userAccountType: ''
    }
    this.handleAmendRelationship = this.handleAmendRelationship.bind(this)
    this.handleConfirmCancel = this.handleConfirmCancel.bind(this)
    this.renderTableColumns = this.renderTableColumns.bind(this)
    this.fetchAccountType = this.fetchAccountType.bind(this)
  }

  fetchAccountType(AMId: string) {
    let promise = api.AssetManagers.retrieve({
      AMId: parseInt(AMId)
    }) as Promise<any[]>
    promise.then((res: any) => {
      const { accountType } = res
      this.setState({ userAccountType: accountType })
    })
  }

  componentDidMount() {
    this.mounted = true
    const { assumedAMID } = this.props
    this.fetchAccountType(assumedAMID)
  }

  componentWillReceiveProps(
    nextProps: ICompanyRelsOwnProps & ICompanyMapStateProps & InjectedIntlProps
  ) {
    if (this.props.assumedAMID != nextProps.assumedAMID) {
      this.props.fetchRelationships()
      const { assumedAMID } = nextProps
      this.fetchAccountType(assumedAMID)
    }
  }

  handleToggleInviteModal() {
    if (!this.mounted) return
    this.setState({ inviteOpen: !this.state.inviteOpen })
  }

  handleAmendRelationship(
    type: string,
    relationshipData: { relatedId?: number; relationshipType?: string }
  ) {
    if ((type === 'reject' || type === 'revoke') && !this.state.confirmOpen) {
      return this.setState({
        confirmOpen: true,
        confirmRelatedId: relationshipData.relatedId as number,
        confirmRelationshipType: relationshipData.relationshipType as string
      })
    }
    if (this.props.assumedAMID) {
      if (!this.mounted) return
      this.setState({ updatingRelationship: true })
      const { relatedId, relationshipType } = relationshipData
      const params = {
        AMId: parseInt(this.props.assumedAMID),
        relatedId: JSON.stringify(relatedId || this.state.confirmRelatedId)
      }
      let promise
      switch (type) {
        case 'approve':
          promise = api.Relationships.approveRel(params) as Promise<null>
          break
        case 'reject':
          promise = api.Relationships.rejectRel(params) as Promise<null>
          break
        case 'revoke':
          promise = api.Relationships.revokeRel(params) as Promise<null>
          break
        default:
          return
      }
      promise
        .then((res: null) => {
          if (!this.mounted) return
          this.props.fetchRelationships()
          this.setState({ updatingRelationship: false, confirmOpen: false })
        })
        .catch(err => {
          if (!this.mounted) return
          this.setState({
            updatingRelationship: false,
            updateRelationshipError: true
          })
        })
    }
  }

  handleConfirmCancel() {
    if (!this.mounted) return
    this.setState({ confirmOpen: false })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  renderTableColumns(commonColumns: any[], adminOnlyColumns: any[]) {
    if (this.props.isAdmin) return commonColumns.concat(adminOnlyColumns)
    return commonColumns
  }

  render() {
    const {
      isAdmin,
      fetchingParties,
      parties,
      fetchingRelationships,
      intl
    } = this.props
    let { relationships } = this.props

    let displayInviteButton = false
    if (isAdmin && this.state.userAccountType.toLowerCase() !== 'demo') {
      displayInviteButton = true
    }

    // Remove the user's own Relationship to the assumedAMID. Should not be able to amend your own relationship
    relationships = relationships.filter(rel => {
      return (
        JSON.stringify(rel.relatedId) != this.props.assetManagerId &&
        rel.relationshipType !== 'Data Provider' &&
        rel.relationshipType !== 'Demo'
      )
    })
    const { inviteOpen } = this.state
    const { formatMessage } = intl
    const relatedIdColumn = {
      Header: formatMessage(messages.name),
      accessor: 'relName'
    }

    const actionColumn = {
      Header: formatMessage(messages.action),
      accessor: 'relationshipId',
      Cell: ({ original: row }: any) => {
        if (
          row.relationshipType === 'Data Provider' ||
          row.relationshipType === 'Demo'
        )
          return null
        const status = row.relationshipStatus
        const actionText =
          status === 'Active'
            ? formatMessage(messages.revoke)
            : status === 'Pending' ? formatMessage(messages.approve) : ''
        const btnColour =
          status === 'Active' ? 'red' : status === 'Pending' ? 'green' : 'grey'
        return (
          <div style={{ textAlign: 'center' }}>
            {status === 'Pending' ? (
              <Button.Group size="mini">
                <Button
                  basic
                  compact
                  color="red"
                  size="mini"
                  disabled={this.state.updatingRelationship}
                  onClick={() =>
                    this.handleAmendRelationship('reject', {
                      relatedId: row.relatedId,
                      relationshipType: row.relationshipType
                    })}
                >
                  <FormattedMessage {...messages.reject} />
                </Button>
                <Button
                  basic
                  compact
                  color={btnColour}
                  size="mini"
                  disabled={this.state.updatingRelationship}
                  onClick={() =>
                    this.handleAmendRelationship(
                      status === 'Active' ? 'revoke' : 'approve',
                      {
                        relatedId: row.relatedId,
                        relationshipType: row.relationshipType
                      }
                    )}
                >
                  {actionText}
                </Button>
              </Button.Group>
            ) : (
              <Button
                basic
                compact
                color={btnColour}
                size="mini"
                disabled={this.state.updatingRelationship}
                onClick={() =>
                  this.handleAmendRelationship(
                    status === 'Active' ? 'revoke' : 'approve',
                    {
                      relatedId: row.relatedId,
                      relationshipType: row.relationshipType
                    }
                  )}
              >
                {actionText}
              </Button>
            )}
          </div>
        )
      }
    }
    return (
      <div style={{ minWidth: '700px' }}>
        <Modal
          size="mini"
          open={this.state.confirmOpen}
          onClose={this.handleConfirmCancel}
        >
          <Modal.Header>
            <FormattedMessage {...messages.rejectModalHeader} />
          </Modal.Header>
          <Modal.Content>
            <FormattedMessage {...messages.rejectModalContent} />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              disabled={this.state.updatingRelationship}
              loading={this.state.updatingRelationship}
              onClick={this.handleConfirmCancel}
            >
              <FormattedMessage {...messages.rejectModalCancel} />
            </Button>
            <Button
              color="red"
              disabled={this.state.updatingRelationship}
              loading={this.state.updatingRelationship}
              onClick={() => this.handleAmendRelationship('reject', {})}
            >
              <FormattedMessage {...messages.rejectModalConfirm} />
            </Button>
          </Modal.Actions>
        </Modal>
        <InviteModal
          closeOnDimmerClick={false}
          closeOnEscape={false}
          open={inviteOpen}
          size="tiny"
          onClose={() => this.handleToggleInviteModal()}
          toggleModal={this.handleToggleInviteModal.bind(this)}
        />
        {displayInviteButton ? (
          <Button
            size="tiny"
            color="green"
            onClick={() => this.handleToggleInviteModal()}
          >
            Invite
          </Button>
        ) : null}
        {fetchingRelationships ? (
          <Loading delay={200} />
        ) : (
          <ReactTable
            className="-striped -highlight"
            data={relationships.length > 0 ? relationships : []}
            columns={this.renderTableColumns(
              [relatedIdColumn, ...relColumns],
              [actionColumn]
            )}
            PreviousComponent={CustomButton}
            NextComponent={CustomButton}
            ExpanderComponent={CustomExpanderComponent}
            FilterComponent={(props: any) => (
              <CustomFilterComponent {...props} />
            )}
            PaginationComponent={CustomPaginationComponent}
            NoDataComponent={CustomNoDataComponent}
            column={{
              ...ReactTableDefaults.column,
              Cell: CustomDefaultCell
            }}
          />
        )}
      </div>
    )
  }
}

export default injectIntl(CompanyRels)
