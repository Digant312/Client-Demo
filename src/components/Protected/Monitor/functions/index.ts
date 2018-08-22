import { monitor } from '@amaas/amaas-core-sdk-js'

export const close = (apiFunction: Function) => (AMId: string, itemId: string, stateSetter: Function, onSuccess?: Function) => {
  if (!AMId) return
  stateSetter({ closing: true })
  let closing = apiFunction({
    AMId,
    resourceId: itemId
  })
  return closing
    .then((res: monitor.Item) => {
      stateSetter({ closing: false })
      onSuccess && onSuccess()
    })
    .catch((error: any) => {
      stateSetter({
        closing: false,
        closeError: error.message || error.toString()
      })
    })
}
export const resubmit = (apiFunction: Function) => (AMId: string, itemId: string, stateSetter: Function, onSuccess?: Function) => {
  if (!AMId) return
  stateSetter({ resubmitting: true })
  let resubmitting = apiFunction({
    AMId,
    resourceId: itemId
  })
  return resubmitting
    .then((res: monitor.Item) => {
      stateSetter({ resubmitting: false })
      onSuccess && onSuccess()
    })
    .catch((error: any) =>
      stateSetter({
        resubmitting: false,
        resubmitError: error.message || error.toString()
      })
    )
}