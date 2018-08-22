import React from 'react'
import debounce from 'lodash/debounce'
import { reduxForm, Field, FormProps } from 'redux-form'
import {
  Button,
  Form,
  Grid,
  GridColumnProps,
  Message,
  Segment
} from 'semantic-ui-react'

import CompactInput from 'containers/Shared/CompactInput'

import './styles.scss'

interface fieldConfig {
  name: string | JSX.Element
  component: JSX.Element
}

interface IGridSearcherProps {
  fuzzySearchId: string
  searchId: string
  fields: fieldConfig[]
  eSearchFunction: Function
  handleSearch: Function
}

interface IGridSearcherState {
  showGridSearcher: boolean
  noResults: boolean
  fuzzySearching: boolean
  searching: boolean
  searchError: boolean
}

interface IGridSearchFields {
  fuzzySearch: string
  [fieldName: string]: string
}

const wideCol = {
  widescreen: 4,
  largeScreen: 4,
  computer: 4,
  tablet: 5,
  mobile: 5
} as GridColumnProps
const narrowCol = {
  widescreen: 1,
  largeScreen: 1,
  computer: 2,
  tablet: 5,
  mobile: 5
} as GridColumnProps

/**
 * How to use this component:
 * There are 4 mandatory props: fuzzySearchId, fields, eSearchFunction, handleSearch
 * fuzzySearchId is the string accessor for the id of the service being queried (i.e. assetId for assets, partyId for party etc.)
 * searchId is the query key for the normal search function (i.e. assetIds for assets)
 * fields is an array of objects with props `name` and `component`
 * `name` is a string or JSX Element (FormattedMessage) that will render as the label for the search options.
 * `component` is a redux-form Field component with a `name` prop that MATCHES THE QUERY PARAM for the SDK search function
 * i.e. if this field is supposed to search across countryId for assets, then the Field name must be `countryIds`.
 * eSearchFunction is the ElasticSearch function. It should accept a single string arg as the parameter for the search.
 * handleSearch is a function that accepts arguments of the same form as the amaas SDK search query shape, i.e. { assetIds: string or array, countryIds: string or array }
 */

class GridSearcher extends React.Component<
  IGridSearcherProps & FormProps<IGridSearchFields, {}, {}>,
  IGridSearcherState
> {
  mounted: boolean
  constructor() {
    super()
    this.state = {
      showGridSearcher: true,
      noResults: false,
      fuzzySearching: false,
      searching: false,
      searchError: false
    }
    this.handleFuzzySearch = debounce(this.handleFuzzySearch.bind(this), 200)
  }
  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  async handleFuzzySearch(value: string) {
    if (this.mounted) {
      this.setState({ searchError: false, noResults: false })
    }
    if (value.length <= 2 || !this.mounted) return
    this.setState({ fuzzySearching: true })
    try {
      let res = await this.props.eSearchFunction(value)

      if (res.total === 0 && this.mounted)
        return this.setState({ noResults: true })
    } catch (e) {
      if (this.mounted) {
        this.setState({ searchError: true })
        return Promise.reject('Search Error')
      }
    } finally {
      if (this.mounted) {
        this.setState({ fuzzySearching: false })
      }
    }
  }

  async handleSearchMain(data: IGridSearchFields) {
    if (this.mounted) {
      this.setState({ searching: true, searchError: false, noResults: false })
    }
    const { fuzzySearchId } = this.props
    const { fuzzySearch, ...otherFields } = data
    try {
      let fuzzyRes = await this.props.eSearchFunction(data.fuzzySearch)

      if (fuzzyRes.total === 0 && this.mounted)
        return this.setState({ noResults: true })

      // CHECK THE RETURN SHAPE OF HITS

      const serviceIDs = fuzzyRes.hits.map((hit: any) => hit[fuzzySearchId])
      this.props.handleSearch({
        [this.props.searchId]: serviceIDs,
        ...otherFields
      })
    } catch (e) {
      console.error(e)
      if (this.mounted) this.setState({ searchError: true })
    } finally {
      if (this.mounted) this.setState({ searching: false })
    }
  }

  render() {
    const { fields, handleSubmit } = this.props
    const { noResults, fuzzySearching, searching, searchError } = this.state
    const extraFields = fields.map((field, i) => (
      <div className="column-inner-row" key={i}>
        <div className="column-inner-column">
          {field.name}
          {field.component}
        </div>
      </div>
    ))
    const oddExtraFields = extraFields.filter((field, i) => i % 2 !== 0)
    const evenExtraFields = extraFields.filter((field, i) => i % 2 === 0)
    return (
      <div
        className="grid-searcher-container"
        style={{
          margin: '0 0.5em 0.5em 0',
          padding: '0 0em 0em 0',
          width: '80%'
        }}
      >
        <Form size="tiny">
          <Grid columns={4} divided style={{ width: '100% !important' }}>
            <Grid.Row>
              <Grid.Column
                {...wideCol}
                style={{
                  boxShadow: 'none',
                  borderRight: '1px solid #eee',
                  maxWidth: '160px'
                }}
              >
                <div className="column-inner-row">
                  <div className="column-inner-column">
                    Search
                    <Field
                      name="fuzzySearch"
                      component={CompactInput}
                      type="text"
                      onChange={(e: React.SyntheticEvent<{}>, data: string) =>
                        this.handleFuzzySearch(data)}
                      loading={fuzzySearching}
                    />
                  </div>
                </div>
                {/* <div className="column-inner-row">
                  <div className="column-inner-column">
                    <Message compact warning>
                      Too many results, please try another search term.
                    </Message>
                  </div>
                </div> */}
              </Grid.Column>
              <Grid.Column
                {...wideCol}
                style={{
                  boxShadow: 'none',
                  borderRight: '1px solid #eee',
                  maxWidth: '160px'
                }}
              >
                {oddExtraFields}
              </Grid.Column>
              <Grid.Column
                {...wideCol}
                style={{
                  boxShadow: 'none',
                  borderRight: '1px solid #eee',
                  maxWidth: '200px'
                }}
              >
                {evenExtraFields}
              </Grid.Column>
              <Grid.Column {...wideCol} style={{ boxShadow: 'none' }}>
                <Button
                  compact
                  size="tiny"
                  color="green"
                  disabled={searching}
                  loading={searching}
                  onClick={
                    handleSubmit &&
                    handleSubmit(data => this.handleSearchMain(data))
                  }
                  style={{ marginTop: '28px', marginLeft: '6px' }}
                >
                  Search
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {searchError ? (
            <div>
              <Message compact negative>
                Search error, please try again
              </Message>
              <br />
            </div>
          ) : null}
          {noResults ? (
            <div>
              <Message compact negative>
                No results, please try another search term
              </Message>
              <br />
            </div>
          ) : null}
        </Form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'GridSearcher'
})(GridSearcher)
