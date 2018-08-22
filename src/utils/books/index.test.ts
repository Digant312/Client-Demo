import buildTree from './'

const sampleBooks = [
  { bookId: 'Book 1', ownerId: 'Trader 1', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 2', ownerId: 'Trader 2', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 3', ownerId: 'Trader 3', businessUnit: 'BU 1', partyId: 'Fund 1', visible: true },
  { bookId: 'Book 4', ownerId: 'Trader 4', businessUnit: 'BU 2', partyId: 'Fund 1', visible: false },
  { bookId: 'Book 5', ownerId: 'Trader 5', businessUnit: 'BU 2', partyId: 'Fund 2', visible: false },
  { bookId: 'Book 6', ownerId: 'Trader 5', businessUnit: 'BU 2', partyId: 'Fund 2', visible: false },
  { bookId: 'Book 88', ownerId: 'Trader 88', visible: true }
]

const loose = { title: 'Trader 88', content: [{ content: 'Book 88', visible: true }], type: 'ownerId', visible: true }

const tradersInBU1 = [
  { title: 'Trader 1', content: [{ content: 'Book 1', visible: true }], type: 'ownerId', visible: true },
  { title: 'Trader 2', content: [{ content: 'Book 2', visible: true }], type: 'ownerId', visible: true },
  { title: 'Trader 3', content: [{ content: 'Book 3', visible: true }], type: 'ownerId', visible: true }
]

const booksInBU1 = sampleBooks.filter((book: any) => book.businessUnit === 'BU 1').map((book: any) => ({ content: book.bookId, visible: book.visible }))

const tradersInBU2 = [
  { title: 'Trader 4', content: [{ content: 'Book 4', visible: false }], type: 'ownerId', visible: false }, 
  { title: 'Trader 5', content: [{ content: 'Book 5', visible: false }], type: 'ownerId', visible: false }
]

const booksInBU2 = sampleBooks.filter((book: any) => book.businessUnit === 'BU 2').map((book: any) => ({ content: book.bookId, visible: book.visible }))

const tradersInFund1 = [
  { title: 'Trader 1', content: [{ content: 'Book 1', visible: true }], type: 'ownerId', visible: true },
  { title: 'Trader 2', content: [{ content: 'Book 2', visible: true }], type: 'ownerId', visible: true },
  { title: 'Trader 3', content: [{ content: 'Book 3', visible: true }], type: 'ownerId', visible: true },
  { title: 'Trader 4', content: [{ content: 'Book 4', visible: false }], type: 'ownerId', visible: false }
]

const booksInFund1 = sampleBooks.filter((book: any) => book.partyId === 'Fund 1').map((book: any) => ({ content: book.bookId, visible: book.visible }))

const tradersInFund2 = [
  { title: 'Trader 5', content: [{ content: 'Book 5', visible: false }], type: 'ownerId', visible: false }
]

const booksInFund2 = sampleBooks.filter((book: any) => book.partyId === 'Fund 2').map((book: any) => ({ content: book.bookId, visible: book.visible }))

const booksInTrader1 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 1').map((book: any) => ({ content: book.bookId, visible: book.visible }))
const booksInTrader2 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 2').map((book: any) => ({ content: book.bookId, visible: book.visible }))
const booksInTrader3 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 3').map((book: any) => ({ content: book.bookId, visible: book.visible }))
const booksInTrader4 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 4').map((book: any) => ({ content: book.bookId, visible: book.visible }))
const booksInTrader5 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 5').map((book: any) => ({ content: book.bookId, visible: book.visible }))
const booksInTrader88 = sampleBooks.filter((book: any) => book.ownerId === 'Trader 88').map((book: any) => ({ content: book.bookId, visible: book.visible }))

const BUs = { title: 'Business Units', content: [
  { title: 'BU 1', content: booksInBU1, type: 'businessUnit', visible: true },
  { title: 'BU 2', content: booksInBU2, type: 'businessUnit', visible: false }
], type: 'allBU', visible: true }

const parties = { title: 'Parties', content: [
  { title: 'Fund 1', content: booksInFund1, type: 'partyId', visible: true },
  { title: 'Fund 2', content: booksInFund2, type: 'partyId', visible: false }
], type: 'allParties', visible: true }

const owners = { title: 'Owners', content: [
  { title: 'Trader 1', content: booksInTrader1, type: 'ownerId', visible: true },
  { title: 'Trader 2', content: booksInTrader2, type: 'ownerId', visible: true },
  { title: 'Trader 3', content: booksInTrader3, type: 'ownerId', visible: true },
  { title: 'Trader 4', content: booksInTrader4, type: 'ownerId', visible: false },
  { title: 'Trader 5', content: booksInTrader5, type: 'ownerId', visible: false },
  { title: 'Trader 88', content: booksInTrader88, type: 'ownerId', visible: true }
], type: 'allOwners', visible: true }

describe('buildTree function', () => {
  it('works', () => {
    const expectedResult = [
      BUs,
      parties,
      owners
    ]
    const result = buildTree(sampleBooks)
    expect(result).toEqual(expectedResult)
  })
})