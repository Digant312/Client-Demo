import React from 'react'
import startCase from 'lodash/startCase'
import moment from 'moment'
import numeral from 'numeral'
import { Redirect, Route, RouteComponentProps, Link } from 'react-router-dom'
import {
  FormattedMessage,
  injectIntl,
  InjectedIntlProps,
  defineMessages
} from 'react-intl'
import {
  Button,
  Header,
  Icon,
  Label,
  Segment,
  List,
  Divider,
  Message,
  Grid
} from 'semantic-ui-react'
import '../styles.scss'

class ActivityList extends React.Component<any, any> {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {}

  getActivityMessage(row: any) {
    const entity = JSON.parse(row.entity)
    const newBookActivity = (
      <FormattedMessage
        id="activities.newBookActivity"
        defaultMessage="{userName} created a new book {link}"
        values={{
          userName: row.createdBy,
          link: <Link to={`/a-a/core/books/${row.bookId}`}>{row.bookId}</Link>
        }}
      />
    )
    const amendBookActivity = (
      <FormattedMessage
        id="activities.amendBookActivity"
        defaultMessage="{userName} amended a book {link}"
        values={{
          userName: row.createdBy,
          link: <Link to={`/a-a/core/books/${row.bookId}`}>{row.bookId}</Link>
        }}
      />
    )
    const retireBookActivity = (
      <FormattedMessage
        id="activities.retireBookActivity"
        defaultMessage="{userName} retired a book {link}"
        values={{
          userName: row.createdBy,
          link: <Link to={`/a-a/core/books/${row.bookId}`}>{row.bookId}</Link>
        }}
      />
    )
    const newTransactionActivity = (
      <FormattedMessage
        id="activities.newTransactionActivity"
        defaultMessage="{userName}: {action} {quantity} {assetId} at {price} - {link}"
        values={{
          userName: row.createdBy,
          action: entity.transaction_action,
          quantity: numeral(entity.quantity).format(),
          assetId: entity.asset_id,
          price: numeral(entity.price).format(),
          link: (
            <Link to={`/a-a/portfolio/transactions/${row.referenceId}`}>
              {row.referenceId}
            </Link>
          )
        }}
      />
    )
    const amendTransactionActivity = (
      <FormattedMessage
        id="activities.amendTransactionActivity"
        defaultMessage="{userName} amended transaction {link} to {action} {quantity} {assetId} at {price}"
        values={{
          userName: row.createdBy,
          action: entity.transaction_action,
          quantity: numeral(entity.quantity).format(),
          assetId: entity.asset_id,
          price: numeral(entity.price).format(),
          link: (
            <Link to={`/a-a/portfolio/transactions/${row.referenceId}`}>
              {row.referenceId}
            </Link>
          )
        }}
      />
    )
    const deleteTransactionActivity = (
      <FormattedMessage
        id="activities.deleteTransactionActivity"
        defaultMessage="{userName} cancelled a transaction {link}"
        values={{
          userName: row.createdBy,
          link: (
            <Link to={`/a-a/portfolio/transactions/${row.referenceId}`}>
              {row.referenceId}
            </Link>
          )
        }}
      />
    )

    let activityMessage: any
    switch (row.referenceType) {
      case 'book': {
        activityMessage = (
          <span>
            {row.activityType == 'new'
              ? newBookActivity
              : row.activityType == 'amend'
                ? amendBookActivity
                : row.activityType == 'retire' ? retireBookActivity : null}
          </span>
        )
        break
      }
      case 'transaction':
        activityMessage = (
          <span>
            {row.activityType == 'new'
              ? newTransactionActivity
              : row.activityType == 'amend'
                ? amendTransactionActivity
                : row.activityType == 'cancel'
                  ? deleteTransactionActivity
                  : null}
          </span>
        )
        break
      default:
        activityMessage = null
    }
    return activityMessage
  }

  render() {
    const data = this.props.data
    if (data !== undefined) {
      data.sort(function(a: any, b: any) {
        return b.createdTime.localeCompare(a.createdTime)
      })
    }

    return (
      <div className="time-line-component">
        {data.map((row: any, index: number) => (
          <div className="row-block" key={index}>
            {index > 0 ? (
              new Date(row.createdTime).toDateString() ==
              new Date(data[index - 1].createdTime).toDateString() ? null : (
                <Divider className="divider-block" horizontal>
                  <Icon name="calendar" size="huge" className="icon-block" />
                  {new Date(row.createdTime).toDateString()}
                </Divider>
              )
            ) : (
              <Divider className="divider-block" horizontal>
                <Icon name="calendar" size="huge" className="icon-block" />
                {new Date(row.createdTime).toDateString()}
              </Divider>
            )}
            <Message>
              <div className="full-width-block">
                <div className="left-icon-block">
                  <Icon size="big" name="mail outline" />
                </div>
                <div className="middle-content-block">
                  {this.getActivityMessage(row)}
                </div>
                <div className="right-icon-block">
                  <div className="timezone-container">
                    <div className="clock-block">
                      <Icon name="world" size="large" />
                    </div>
                    <div className="timezone-text">
                      {
                        new Date()
                          .toLocaleTimeString('en-us', {
                            timeZoneName: 'short'
                          })
                          .split(' ')[2]
                      }
                    </div>
                  </div>
                  <div className="time-container">
                    <div className="clock-block">
                      <Icon name="wait" size="large" />
                    </div>
                    <div className="time-block">
                      {moment
                        .utc(
                          row.createdTime.substring(
                            0,
                            row.createdTime.length - 9
                          )
                        )
                        .utcOffset(moment().utcOffset())
                        .format('LTS')}
                    </div>
                  </div>
                </div>
              </div>
            </Message>
          </div>
        ))}
      </div>
    )
  }
}

export default injectIntl(ActivityList)
