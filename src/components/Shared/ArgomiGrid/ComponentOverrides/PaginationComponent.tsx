import React, { Component } from 'react'
import classnames from 'classnames'
import { Button, Dropdown, Form, Input } from 'semantic-ui-react'

const defaultButton = (props: any) => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
)

export default class ReactTablePagination extends Component<any, any> {
  constructor(props: any) {
    super()

    this.getSafePage = this.getSafePage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.applyPage = this.applyPage.bind(this)

    this.state = {
      page: props.page
    }
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({ page: nextProps.page })
  }

  getSafePage(page: number) {
    if (isNaN(page)) {
      page = this.props.page
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1)
  }

  changePage(page: number) {
    page = this.getSafePage(page)
    this.setState({ page })
    if (this.props.page !== page) {
      this.props.onPageChange(page)
    }
  }

  applyPage(e: React.SyntheticEvent<any>) {
    e && e.preventDefault()
    const page = this.state.page
    this.changePage(page === '' ? this.props.page : page)
  }

  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent = defaultButton,
      NextComponent = defaultButton,
      // Custom
      darkProfile
    } = this.props

    return (
      <div
        className={classnames(className, '-pagination')}
        style={this.props.paginationStyle}
      >
        <div className="-previous">
          <Button
            inverted={darkProfile}
            fluid
            onClick={e => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
            disabled={!canPrevious}
          >
            {this.props.previousText}
          </Button>
        </div>
        <div className="-center">
          <Form style={{ width: '100%' }} size="mini" inverted={darkProfile}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                width: '100%'
              }}
            >
              {/* <span className="-pageInfo">
                {this.props.pageText}{' '}
                {showPageJump ? (
                  <div className="-pageJump">
                    <Form.Input
                      transparent={darkProfile}
                      type="text"
                      onChange={(e, { value }) => {
                        const val = value
                        if (val === '') {
                          return this.setState({ page: val })
                        }
                        const page = parseInt(val) - 1
                        this.setState({ page: this.getSafePage(page) })
                      }}
                      value={this.state.page === '' ? '' : this.state.page + 1}
                      onBlur={this.applyPage}
                    />
                  </div>
                ) : (
                  <span className="-currentPage">{page + 1}</span>
                )}{' '}
                {this.props.ofText}{' '}
                <span className="-totalPages">{pages || 1}</span>
              </span> */}
              {showPageSizeOptions && (
                <Form.Field className="inverted">
                  <Dropdown
                    fluid
                    upward
                    className={darkProfile ? 'inverted' : ''}
                    selection
                    options={pageSizeOptions.map(
                      (option: string | number, i: number) => {
                        return {
                          key: i,
                          value: option,
                          text: `${option} ${this.props.rowsText}`
                        }
                      }
                    )}
                    onChange={(e, { value }) => onPageSizeChange(value)}
                    value={pageSize}
                  />
                </Form.Field>
              )}
            </div>
          </Form>
        </div>
        <div className="-next">
          <Button
            fluid
            inverted={darkProfile}
            onClick={e => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
            disabled={!canNext}
          >
            {this.props.nextText}
          </Button>
        </div>
      </div>
    )
  }
}
