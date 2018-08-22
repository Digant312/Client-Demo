import groupBy from 'lodash/groupBy'

interface IBook {
  bookId: string
  ownerId: number | string
  businessUnit?: string
  partyId?: string
  [prop: string]: any
}

const groupByCollection = (prop: string) => (books: IBook[]) =>
  groupBy(books, (book: IBook) => book[prop])
const groupByOwnerId = groupByCollection('ownerId')
const groupByBU = groupByCollection('businessUnit')
const groupByParty = groupByCollection('partyId')

export default (books: IBook[]) => {
  const BUs = groupByBU(books.filter((book: IBook) => book.businessUnit))
  const parties = groupByParty(books.filter((book: IBook) => book.partyId))
  const owners = groupByOwnerId(books.filter((book: IBook) => book.ownerId))

  // All Business Units visible
  const BUsVisible = books.filter(
    (book: IBook) => book.businessUnit && book.visible
  )
  // All BU visible
  const singleBUVisible = (bu: string) =>
    BUsVisible.filter((book: IBook) => book.businessUnit === bu)
  // All owner within BU
  const singleBUOwnerVisible = (bu: string) => (owner: string | number) =>
    singleBUVisible(bu).filter((book: IBook) => book.ownerId == owner)

  // All Parties visible
  const partiesVisible = books.filter(
    (book: IBook) => book.partyId && book.visible
  )
  // Single Party visible
  const singlePartyVisible = (party: string) =>
    partiesVisible.filter((book: IBook) => book.partyId === party)
  // All owner within party
  const singlePartyOwnerVisible = (party: string) => (owner: string | number) =>
    singlePartyVisible(party).filter((book: IBook) => book.ownerId == owner)

  // All owners visible
  const ownersVisible = books.filter((book: IBook) => book.ownerId && book.visible)

  // Single owner visible
  const singleOwnerVisible = (owner: string | number) =>
    books.filter((book: IBook) => book.ownerId == owner && book.visible)

  const BUTree = Object.keys(BUs).map((bu: string) => ({
    title: bu,
    content: books.filter((book: IBook) => book.businessUnit === bu).map((book: IBook) => ({ content: book.bookId, visible: book.visible })),
    type: 'businessUnit',
    visible: !!singleBUVisible(bu).length
  }))

  const PartyTree = Object.keys(parties).map((party: string) => ({
    title: party,
    content: books.filter((book: IBook) => book.partyId === party).map((book: IBook) => ({ content: book.bookId, visible: book.visible })),
    type: 'partyId',
    visible: !!singlePartyVisible(party).length
  }))

  const OwnerTree = Object.keys(owners).map((owner: string) => ({
    title: books.filter((book: IBook) => book.ownerId === owner)[0].ownerName || owner,
    content: books.filter((book: IBook) => book.ownerId === owner).map((book: IBook) => ({ content: book.bookId, visible: book.visible })),
    type: 'ownerId',
    visible: !!singleOwnerVisible(owner).length
  }))

  return [
    {
      title: 'Business Units',
      content: BUTree,
      type: 'allBU',
      visible: !!BUsVisible.length
    },
    {
      title: 'Parties',
      content: PartyTree,
      type: 'allParties',
      visible: !!partiesVisible.length
    },
    {
      title: 'Owners',
      content: OwnerTree,
      type: 'allOwners',
      visible: !!ownersVisible.length
    }
  ]
}
