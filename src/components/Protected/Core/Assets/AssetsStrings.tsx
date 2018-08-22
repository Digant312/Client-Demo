import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  assets: {
    id: 'assets.assetsLable',
    defaultMessage: 'Assets'
  },
  equity: {
    id: 'equity.equityMenuLable',
    defaultMessage: 'Equity'
  },
  fx: {
    id: 'fx.fxMenuLable',
    defaultMessage: 'FX'
  },
  future: {
    id: 'future.futureMenuLable',
    defaultMessage: 'Future'
  },
  otherAssets: {
    id: 'otherAssets.otherAssetsMenuLable',
    defaultMessage: 'Other Assets'
  },
  updateEquitySuccess: {
    id: 'equity.equityUpdateToastMessage',
    defaultMessage: 'Equity updated successfully'
  },
  addEquitySuccess: {
    id: 'equity.equityAddToastMessage',
    defaultMessage: 'Equity added successfully'
  },
  retireEquitySuccess: {
    id: 'equity.equityRetireToastMessage',
    defaultMessage: 'Equity deactivated successfully'
  },
  reactivateEquitySuccess: {
    id: 'equity.equityReactivateToastMessage',
    defaultMessage: 'Equity reactivated successfully'
  },
  addEquityFailed: {
    id: 'equity.equityAddFailedToastMessage',
    defaultMessage: 'Unable to add Equity'
  },
  updateEquityFailed: {
    id: 'equity.equityUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Equity'
  },
  retireEquityFailed: {
    id: 'equity.equityRetireFailedToastMessage',
    defaultMessage: 'Unable to deactivate Equity'
  },
  confirmDeactivateEquityHeading: {
    id: 'equity.confirmDeactivateHeading',
    defaultMessage: 'Deactivate Equity?'
  },
  confirmReactivateEquityHeading: {
    id: 'equity.confirmReactivateHeading',
    defaultMessage: 'Reactivate Equity?'
  },
  confirmDeactivateEquityMessage: {
    id: 'equity.confirmDeactivateMessage',
    defaultMessage: 'Are you sure you want to deactivate Equity?'
  },
  cancelButtonLabel: {
    id: 'equity.cancelButtonLabel',
    defaultMessage: 'Cancel'
  },
  addButtonLabel: {
    id: 'equity.addButtonLabel',
    defaultMessage: 'Add'
  },
  updateButtonLabel: {
    id: 'equity.updateButtonLabel',
    defaultMessage: 'Update'
  },
  addEquityButtonLabel: {
    id: 'equity.addEquityButtonLabel',
    defaultMessage: 'Add Equity'
  },
  addFxButtonLabel: {
    id: 'equity.addFxButtonLabel',
    defaultMessage: 'Add FX'
  },
  addFutureButtonLabel: {
    id: 'equity.addFutureButtonLabel',
    defaultMessage: 'Add Future'
  },
  addAssetButtonLabel: {
    id: 'otherAsset.addAssetButtonLabel',
    defaultMessage: 'Add Asset'
  },
  updateFxSuccess: {
    id: 'fx.fxUpdateToastMessage',
    defaultMessage: 'FX updated successfully'
  },
  addFxSuccess: {
    id: 'fx.fxAddToastMessage',
    defaultMessage: 'FX added successfully'
  },
  retireFxSuccess: {
    id: 'fx.fxRetireToastMessage',
    defaultMessage: 'FX deactivated successfully'
  },
  reactivateFxSuccess: {
    id: 'fx.fxReactivateToastMessage',
    defaultMessage: 'FX reactivated successfully'
  },
  updateFxFailed: {
    id: 'fx.fxUpdateFailedToastMessage',
    defaultMessage: 'Unable to update FX'
  },
  addFxFailed: {
    id: 'fx.fxAddFailedToastMessage',
    defaultMessage: 'Unable to add FX'
  },
  retireFxFailed: {
    id: 'fx.fxRetireFailedToastMessage',
    defaultMessage: 'Unable to deactivate FX'
  },
  confirmDeactivateFxHeading: {
    id: 'fx.confirmDeactivateFxHeading',
    defaultMessage: 'Deactivate FX?'
  },
  confirmDeactivateFxMessage: {
    id: 'fx.confirmDeactivateFxMessage',
    defaultMessage: 'Are you sure you want to deactivate FX?'
  },
  updateFutureSuccess: {
    id: 'future.futureUpdateToastMessage',
    defaultMessage: 'Future updated successfully'
  },
  addFutureSuccess: {
    id: 'future.futureAddToastMessage',
    defaultMessage: 'Future added successfully'
  },
  retireFutureSuccess: {
    id: 'future.futureRetireToastMessage',
    defaultMessage: 'Future deactivated successfully'
  },
  reactivateFutureSuccess: {
    id: 'future.futureReactivateToastMessage',
    defaultMessage: 'Future reactivated successfully'
  },
  updateFutureFailed: {
    id: 'future.futureUpdateFailedToastMessage',
    defaultMessage: 'Unable to update Future'
  },
  addFutureFailed: {
    id: 'future.futureAddFailedToastMessage',
    defaultMessage: 'Unable to add Future'
  },
  retireFutureFailed: {
    id: 'future.futureRetireFailedToastMessage',
    defaultMessage: 'Unable to deactivate Future'
  },
  confirmDeactivateFutureHeading: {
    id: 'fx.confirmDeactivateFxHeading',
    defaultMessage: 'Deactivate FX?'
  },
  confirmDeactivateFutureMessage: {
    id: 'fx.confirmDeactivateFxMessage',
    defaultMessage: 'Are you sure you want to deactivate FX?'
  },
  updateAssetSuccess: {
    id: 'otherAsset.assetUpdateToastMessage',
    defaultMessage: 'Asset updated successfully'
  },
  updateAssetFailed: {
    id: 'otherAsset.updatedAssetFailed',
    defaultMessage: 'Unable to update Asset'
  },
  addAssetSuccess: {
    id: 'otherAsset.assetAddToastMessage',
    defaultMessage: 'Asset added successfully'
  },
  addAssetFailed: {
    id: 'otherAsset.addAssetFailedMessage',
    defaultMessage: 'Unable to add Asset'
  },
  deactivateAssetSuccess: {
    id: 'otherAsset.assetRetireToastMessage',
    defaultMessage: 'Asset deactivated successfully'
  },
  reactivateAssetSuccess: {
    id: 'otherAsset.assetReactivateToastMessage',
    defaultMessage: 'Asset reactivated successfully'
  },
  confirmDeactivateAssetHeading: {
    id: 'otherAsset.confirmDeactivateAssetHeading',
    defaultMessage: 'Deactivate Asset?'
  },
  confirmDeactivateAssetMessage: {
    id: 'otherAsset.confirmDeactivateAssetMessage',
    defaultMessage: 'Are you sure you want to deactivate Asset?'
  },
  deactivateAssetFailed: {
    id: 'otherAsset.deactivateAssetFailed',
    defaultMessage: 'Unable to deactivate Asset'
  },
  loadEquitiesMessage: {
    id: 'books.loadEquitiesMessage',
    defaultMessage: 'Loading Equities...'
  },
  loadFuturesMessage: {
    id: 'books.loadFuturesMessage',
    defaultMessage: 'Loading Futures...'
  },
  loadFxsMessage: {
    id: 'books.loadFxsMessage',
    defaultMessage: 'Loading FXs...'
  },
  loadAssetsMessage: {
    id: 'books.loadAssetsMessage',
    defaultMessage: 'Loading Assets...'
  },
  reset: {
    id: 'assets.reset',
    defaultMessage: 'Reset'
  },
  loadETFMessage: {
    id: 'etf.loadAssetsMessage',
    defaultMessage: 'Loading ETF...'
  },
  addETFButtonLabel: {
    id: 'etf.addETFButtonLabel',
    defaultMessage: 'Add ETF'
  },
  etf: {
    id: 'etf.etfMenuLable',
    defaultMessage: 'ETF'
  },
  updateETFSuccess: {
    id: 'etf.etfUpdateToastMessage',
    defaultMessage: 'ETF updated successfully'
  },
  addETFSuccess: {
    id: 'etf.etfAddToastMessage',
    defaultMessage: 'ETF added successfully'
  },
  retireETFSuccess: {
    id: 'etf.etfRetireToastMessage',
    defaultMessage: 'ETF deactivated successfully'
  },
  reactivateETFSuccess: {
    id: 'etf.etfReactivateToastMessage',
    defaultMessage: 'ETF reactivated successfully'
  },
  updateETFFailed: {
    id: 'etf.etfUpdateFailedToastMessage',
    defaultMessage: 'Unable to update ETF'
  },
  addETFFailed: {
    id: 'etf.etfAddFailedToastMessage',
    defaultMessage: 'Unable to add ETF'
  },
  retireETFFailed: {
    id: 'etf.etfRetireFailedToastMessage',
    defaultMessage: 'Unable to deactivate ETF'
  },
  confirmDeactivateETFHeading: {
    id: 'etf.confirmDeactivateETFHeading',
    defaultMessage: 'Deactivate ETF?'
  },
  confirmDeactivateETFMessage: {
    id: 'etf.confirmDeactivateETFMessage',
    defaultMessage: 'Are you sure you want to deactivate ETF?'
  },
  reactivate: {
    id: 'assets.reactivate',
    defaultMessage: 'Reactivate'
  },
  deactivate: {
    id: 'assets.deactivate',
    defaultMessage: 'Deactivate'
  }
})
export default messages
