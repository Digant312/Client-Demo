import { close, resubmit } from './'

describe('close', () => {
  it('returns if there is no AMId', () => {
    const closeWithMockAPI = close(jest.fn())
    const mockedStateSetter = jest.fn()
    closeWithMockAPI('', 'testId', mockedStateSetter)
    expect(mockedStateSetter).not.toHaveBeenCalled()
  })
  it('calls stateSetter and apiFunction correctly if apiFunction resolves', async () => {
    const mockedApiFunction = jest.fn(() => Promise.resolve())
    const mockedStateSetter = jest.fn()
    const closeWithMockAPI = close(mockedApiFunction)
    await closeWithMockAPI('testAMId', 'testId', mockedStateSetter)
    expect(mockedApiFunction).toHaveBeenCalledWith({ AMId: 'testAMId', resourceId: 'testId' })
    expect(mockedStateSetter).toHaveBeenCalledTimes(2)
    expect(mockedStateSetter).toHaveBeenCalledWith({ closing: true })
    expect(mockedStateSetter).toHaveBeenCalledWith({ closing: false })
  })
  // WHY WONT THIS WORK
  it('calls stateSetter and apiFunction correctly if apiFunction rejects', async () => {
    const mockedApiFunction = jest.fn(() => Promise.reject('testError'))
    const mockedStateSetter = jest.fn()
    const closeWithMockAPI = close(mockedApiFunction)
    await closeWithMockAPI('testAMId', 'testId', mockedStateSetter)
    expect(mockedApiFunction).toHaveBeenCalledWith({ AMId: 'testAMId', resourceId: 'testId' })
    expect(mockedStateSetter).toHaveBeenCalledTimes(2)
    expect(mockedStateSetter).toHaveBeenCalledWith({ closing: true })
    expect(mockedStateSetter).toHaveBeenCalledWith({ closing: false, closeError: 'testError' })
  })
})

describe('resubmit', () => {
  it('returns if there is no AMId', () => {
    const resubmitWithMockApi = resubmit(jest.fn())
    const mockedStateSetter = jest.fn()
    resubmitWithMockApi('', 'testAMId', mockedStateSetter)
    expect(mockedStateSetter).not.toHaveBeenCalled()
  })
  it('calls stateSetter and apiFunction correctly if apiFunction resolves', async () => {
    const mockedApi = jest.fn(() => Promise.resolve())
    const mockedStateSetter = jest.fn()
    const resubmitWithMockApi = resubmit(mockedApi)
    await resubmitWithMockApi('testAMId', 'testItemId', mockedStateSetter)
    expect(mockedApi).toHaveBeenCalledWith({ AMId: 'testAMId', resourceId: 'testItemId' })
    expect(mockedStateSetter).toHaveBeenCalledTimes(2)
    expect(mockedStateSetter).toHaveBeenCalledWith({ resubmitting: true })
    expect(mockedStateSetter).toHaveBeenCalledWith({ resubmitting: false })
  })
  it('calls stateSetter and apiFunction correct if apiFunction rejects', async () => {
    const mockedApi = jest.fn(() => Promise.reject('testError'))
    const mockedStateSetter = jest.fn()
    const resubmitWithMockApi = resubmit(mockedApi)
    await resubmitWithMockApi('testAMId', 'testItemId', mockedStateSetter)
    expect(mockedApi).toHaveBeenCalledWith({ AMId: 'testAMId', resourceId: 'testItemId' })
    expect(mockedStateSetter).toHaveBeenCalledTimes(2)
    expect(mockedStateSetter).toHaveBeenCalledWith({ resubmitting: true })
    expect(mockedStateSetter).toHaveBeenCalledWith({ resubmitting: false, resubmitError: 'testError' })
  })
})