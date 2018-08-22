import { defineMessages } from 'react-intl'

export default defineMessages({
  // CompanyInformation
  companyInfo: {
    id: 'editCompany.companyInfo',
    defaultMessage: 'Company Information'
  },

  // EditCompany
  header: {
    id: 'editCompany.modalHeader',
    defaultMessage: 'Edit Company Information'
  },
  cancel: {
    id: 'editCompany.cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'editCompany.save',
    defaultMessage: 'Save'
  },
  profileUpdateError: {
    id: 'editCompany.updateError',
    defaultMessage: 'Error updating profile, please try again'
  },

  // CompanyRelationships
  name: {
    id: 'companyRelationships.nameLabel',
    defaultMessage: 'Name'
  },
  action: {
    id: 'companyRelationships.actionLabel',
    defaultMessage: 'Action'
  },
  revoke: {
    id: 'companyRelationships.revokeAction',
    defaultMessage: 'Revoke'
  },
  approve: {
    id: 'companyRelationships.approveAction',
    defaultMessage: 'Approve'
  },
  reject: {
    id: 'companyRelationships.rejectAction',
    defaultMessage: 'Reject'
  },
  loadingRels: {
    id: 'companyRelationships.loadingRelationships',
    defaultMessage: 'Loading Relationships'
  },
  rejectModalHeader: {
    id: 'companyRelationships.rejectModalHeader',
    defaultMessage: 'Revoke or Reject Relationship'
  },
  rejectModalContent: {
    id: 'companyRelationships.rejectModalContent',
    defaultMessage:
      'Are you sure you want to revoke or reject this Relationship?'
  },
  rejectModalCancel: {
    id: 'companyRelationships.cancelReject',
    defaultMessage: 'No'
  },
  rejectModalConfirm: {
    id: 'companyRelationships.confirmReject',
    defaultMessage: 'Yes'
  },

  uploadFileHeadingText: {
    id: 'dataMigration.uploadFileHeadingText',
    defaultMessage: 'Select your file'
  }
})
