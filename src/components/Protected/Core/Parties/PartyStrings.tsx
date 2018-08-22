import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  bookId: {
    id: 'parties.bookId',
    defaultMessage: 'Book Id'
  },
  updateSuccess: {
    id: 'parties.partyUpdateToastMessage',
    defaultMessage: 'Party updated successfully'
  },
  addSuccess: {
    id: 'parties.partyAddToastMessage',
    defaultMessage: 'Party added successfully'
  },
  bookAddSuccess: {
    id: 'parties.bookAddToastMessage',
    defaultMessage: 'Book added successfully'
  },
  bookAddFailed: {
    id: 'parties.bookAddFailedToastMessage',
    defaultMessage: 'Book could not be added'
  },
  reactivate: {
    id: 'parties.reactivate',
    defaultMessage: 'Reactivate'
  },
  deactivate: {
    id: 'parties.deactivate',
    defaultMessage: 'Deactivate'
  },
  retireSuccess: {
    id: 'parties.partyRetireToastMessage',
    defaultMessage: 'Party deactivated successfully'
  },
  confirmRetireHeading: {
    id: 'parties.confirmRetireHeading',
    defaultMessage: 'Deactivate Party?'
  },
  confirmRetireMessage: {
    id: 'parties.confirmRetireMessage',
    defaultMessage: 'Are you sure you want to deactivate Party?'
  },
  confirmBrokerInactiveHeading: {
    id: 'parties.confirmBrokerInactiveHeading',
    defaultMessage: 'Deactivate Broker?'
  },
  confirmBrokerActiveHeading: {
    id: 'parties.confirmBrokerActiveHeading',
    defaultMessage: 'Reactivate Broker?'
  },
  confirmFundInActiveHeading: {
    id: 'parties.confirmFundInActiveHeading',
    defaultMessage: 'Deactivate Fund?'
  },
  confirmFundActiveHeading: {
    id: 'parties.confirmFundActiveHeading',
    defaultMessage: 'Reactivate Fund?'
  },
  confirmIndividualInActiveHeading: {
    id: 'parties.confirmIndividualInActiveHeading',
    defaultMessage: 'Deactivate Individual?'
  },
  confirmIndividualActivateHeading: {
    id: 'parties.confirmIndividualActivateHeading',
    defaultMessage: 'Reactivate Individual?'
  },
  brokerUpdateSuccess: {
    id: 'parties.partyBrokerUpdateToastMessage',
    defaultMessage: 'Broker updated successfully'
  },
  brokerAddSuccess: {
    id: 'parties.partyBrokerAddToastMessage',
    defaultMessage: 'Broker added successfully'
  },
  brokerUpdateFailed: {
    id: 'parties.partyBrokerUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Broker'
  },
  brokerAddFailed: {
    id: 'parties.partyBrokerAddFailedToastMessage',
    defaultMessage: 'Unable to add Broker'
  },
  brokerInactiveSuccess: {
    id: 'parties.brokerInactiveSuccess',
    defaultMessage: 'Broker deactivated successfully'
  },
  brokerActiveSuccess: {
    id: 'parties.brokerActiveSuccess',
    defaultMessage: 'Broker reactivated successfully'
  },
  brokerInactiveFailed: {
    id: 'parties.partyBrokerDeleteFailedToastMessage',
    defaultMessage: 'Unable to deactivate'
  },
  brokerActiveFailed: {
    id: 'parties.brokerActiveFailed',
    defaultMessage: 'Unable to reactivate'
  },
  fundUpdateSuccess: {
    id: 'parties.partyFundUpdateToastMessage',
    defaultMessage: 'Fund updated successfully'
  },
  fundAddSuccess: {
    id: 'parties.partyFundAddToastMessage',
    defaultMessage: 'Fund added successfully'
  },
  fundAddFailed: {
    id: 'parties.partyFundAddFailedToastMessage',
    defaultMessage: 'Unable to add Fund'
  },
  fundUpdatefailed: {
    id: 'parties.partyFundUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Fund'
  },
  fundInActiveSuccess: {
    id: 'parties.fundInActiveSuccess',
    defaultMessage: 'Fund deactivated successfully'
  },
  fundActiveSuccess: {
    id: 'parties.fundActiveSuccess',
    defaultMessage: 'Fund reactivated successfully'
  },
  fundInActiveFailed: {
    id: 'parties.partyfundInActiveFailed',
    defaultMessage: 'Unable to deactivate Fund'
  },
  fundActiveFailed: {
    id: 'parties.partyfundActiveFailed',
    defaultMessage: 'Unable to reactivate Fund'
  },
  individualUpdateSuccess: {
    id: 'parties.partyIndividualUpdateToastMessage',
    defaultMessage: 'Individual updated successfully'
  },
  individualAddFailed: {
    id: 'parties.partyIndividualAddFailedToastMessage',
    defaultMessage: 'Unable to add Individual'
  },
  individualAddSuccess: {
    id: 'parties.partyIndividualAddToastMessage',
    defaultMessage: 'Individual added successfully'
  },
  individualUpdateFailed: {
    id: 'parties.partyIndividualUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Individual'
  },
  individualInActiveSuccess: {
    id: 'parties.individualInActiveSuccess',
    defaultMessage: 'Individual deactivated successfully'
  },
  individualActivateSuccess: {
    id: 'parties.individualActivateSuccess',
    defaultMessage: 'Individual reactivated successfully'
  },
  individualInActiveFailed: {
    id: 'parties.individualInActiveFailed',
    defaultMessage: 'Unable to deactivate Individual'
  },
  individualActiveFailed: {
    id: 'parties.individualActiveFailed',
    defaultMessage: 'Unable to reactivate Individual'
  },
  addBrokerButtonLabel: {
    id: 'parties.addBrokerButtonLabel',
    defaultMessage: 'Add Party'
  },
  cancelButtonLabel: {
    id: 'parties.cancelButtonLabel',
    defaultMessage: 'Cancel'
  },
  addButtonLabel: {
    id: 'parties.addButtonLabel',
    defaultMessage: 'Add'
  },
  addButtonIndividualLabel: {
    id: 'parties.addButtonIndividualLabel',
    defaultMessage: 'Add Individual'
  },
  addButtonBrokersLabel: {
    id: 'parties.addButtonBrokersLabel',
    defaultMessage: 'Add Broker'
  },
  addButtonFundLabel: {
    id: 'parties.addButtonFundLabel',
    defaultMessage: 'Add Fund'
  },
  updateButtonLabel: {
    id: 'parties.updateButtonLabel',
    defaultMessage: 'Update'
  },
  searchBarPlaceHolder: {
    id: 'parties.searchbarPlaceholder',
    defaultMessage: 'Search...'
  },
  individual: {
    id: 'parties.individuals',
    defaultMessage: 'Individuals'
  },
  individualLbl: {
    id: 'parties.individualLbl',
    defaultMessage: 'Individual'
  },
  organisations: {
    id: 'parties.organisations',
    defaultMessage: 'Organisations'
  },
  brokers: {
    id: 'parties.brokers',
    defaultMessage: 'Brokers'
  },
  funds: {
    id: 'parties.funds',
    defaultMessage: 'Funds'
  },
  brokersLbl: {
    id: 'parties.brokersLbl',
    defaultMessage: 'Brokers'
  },
  fundsLbl: {
    id: 'parties.fundsLbl',
    defaultMessage: 'Funds'
  },
  parties: {
    id: 'parties.parties',
    defaultMessage: 'Parties'
  },
  organisationAll: {
    id: 'organisation.all',
    defaultMessage: 'All'
  },
  organisationAllLbl: {
    id: 'organisation.allLbl',
    defaultMessage: 'All'
  },
  organisationUpdateSuccess: {
    id: 'parties.partyOrganisationUpdateToastMessage',
    defaultMessage: 'Organisation updated successfully'
  },
  organisationAddSuccess: {
    id: 'parties.partyOrganisationAddToastMessage',
    defaultMessage: 'Organisation added successfully'
  },
  organisationUpdateFailed: {
    id: 'parties.partyOrganisationUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Organisation'
  },
  organisationAddFailed: {
    id: 'parties.partyOrganisationAddFailedToastMessage',
    defaultMessage: 'Unable to add Organisation'
  },
  organisationInActiveSuccess: {
    id: 'parties.organisationInActiveSuccess',
    defaultMessage: 'Organisation deactivated successfully'
  },
  organisationActiveSuccess: {
    id: 'parties.organisationActiveSuccess',
    defaultMessage: 'Organisation reactivated successfully'
  },
  organisationInActiveFailed: {
    id: 'parties.organisationInActiveFailed',
    defaultMessage: 'Unable to deactivate Organisation'
  },
  organisationActiveFailed: {
    id: 'parties.organisationActiveFailed',
    defaultMessage: 'Unable to reactivate Organisation'
  },
  addButtonOrganisationLabel: {
    id: 'parties.addButtonOrganisationLabel',
    defaultMessage: 'Add Organisation'
  },
  confirmOrganisationInActiveHeading: {
    id: 'parties.confirmOrganisationInActiveHeading',
    defaultMessage: 'Deactivate Organisation?'
  },
  confirmOrganisationActiveHeading: {
    id: 'parties.confirmOrganisationActiveHeading',
    defaultMessage: 'Reactivate Organisation?'
  },
  confirmOrganisationInActiveMessage: {
    id: 'parties.confirmOrganisationInActiveMessage',
    defaultMessage:
      'Are you sure you want to deactivate Organisation {partyId}?'
  },
  confirmOrganisationActiveMessage: {
    id: 'parties.confirmOrganisationActiveMessage',
    defaultMessage:
      'Are you sure you want to reactivate Organisation {partyId}?'
  },
  selectPartyType: {
    id: 'parties.selectPartyType',
    defaultMessage: 'Select Type'
  },
  noPartyMessage: {
    id: 'parties.noPartySelected',
    defaultMessage: 'Please Select a Party Type'
  },
  loadOrganisationsMessage: {
    id: 'parties.loadOrganisationsMessage',
    defaultMessage: 'Loading Organisations...'
  },
  loadBrokersMessage: {
    id: 'parties.loadBrokersMessage',
    defaultMessage: 'Loading Brokers...'
  },
  loadFundsMessage: {
    id: 'parties.loadFundsMessage',
    defaultMessage: 'Loading Funds...'
  },
  loadIndividualsMessage: {
    id: 'parties.loadIndividualsMessage',
    defaultMessage: 'Loading Individuals...'
  },
  reset: {
    id: 'parties.reset',
    defaultMessage: 'Reset'
  }
})
export default messages
