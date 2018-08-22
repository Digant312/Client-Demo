import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  books: {
    id: 'books.booksLabel',
    defaultMessage: 'Books'
  },
  permission: {
    id: 'books.permissions',
    defaultMessage: 'Permissions'
  },
  updateSuccess: {
    id: 'books.bookUpdateToastMessage',
    defaultMessage: 'Book updated successfully'
  },
  addSuccess: {
    id: 'books.bookAddToastMessage',
    defaultMessage: 'Book added successfully'
  },
  retireSuccess: {
    id: 'books.bookRetireToastMessage',
    defaultMessage: 'Book retired successfully'
  },
  reactivateSuccess: {
    id: 'books.bookReactivateToastMessage',
    defaultMessage: 'Book Unretired successfully'
  },
  addFailed: {
    id: 'books.bookAddFailedToastMessage',
    defaultMessage: 'Unable to add Book'
  },
  updateFailed: {
    id: 'books.bookUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Book'
  },
  editPermissions: {
    id: 'bookPermissions.editPermissions',
    defaultMessage: 'Edit Permissions'
  },
  retire: {
    id: 'books.retire',
    defaultMessage: 'Retire'
  },
  reactivate: {
    id: 'books.reactivate',
    defaultMessage: 'Unretire'
  },
  retireFailed: {
    id: 'books.bookRetireFailedToastMessage',
    defaultMessage: 'Unable to retire Book'
  },
  reactivateFailed: {
    id: 'books.bookReactivateFailedToastMessage',
    defaultMessage: 'Unable to Unretire Book'
  },
  confirmRetireHeading: {
    id: 'books.confirmRetireHeading',
    defaultMessage: 'Retire Book?'
  },
  confirmRetireMessage: {
    id: 'books.confirmRetireMessage',
    defaultMessage: 'Are you sure you want to retire Book?'
  },
  confirmReactivateHeading: {
    id: 'books.confirmReactivateHeading',
    defaultMessage: 'Unretire Book?'
  },
  confirmReactivateMessage: {
    id: 'books.confirmReactivateMessage',
    defaultMessage: 'Are you sure you want to Unretire Book?'
  },
  addBookButtonLabel: {
    id: 'books.addBookButtonLabel',
    defaultMessage: 'Add Book'
  },
  cancelButtonLabel: {
    id: 'books.cancelButtonLabel',
    defaultMessage: 'Cancel'
  },
  addButtonLabel: {
    id: 'books.addButtonLabel',
    defaultMessage: 'Add'
  },
  updateButtonLabel: {
    id: 'books.updateButtonLabel',
    defaultMessage: 'Update'
  },
  action: {
    id: 'books.action',
    defaultMessage: 'Action'
  },
  loadBooksMessage: {
    id: 'books.loadBooksMessage',
    defaultMessage: 'Loading Books...'
  },
  loadPermissionsMessage: {
    id: 'books.loadPermissionsMessage',
    defaultMessage: 'Loading Permissions...'
  },
  reset: {
    id: 'books.reset',
    defaultMessage: 'Reset'
  }
})
export default messages
