import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  InjectedIntlProps,
  defineMessages
} from 'react-intl'
import {
  Button,
  Icon,
  Label,
  Modal,
  Divider,
  Segment,
  Message
} from 'semantic-ui-react'

import Loading from 'components/Shared/Loader'
import messages from '../CompanyStrings'
import FileDragAndDrop from 'react-file-drag-and-drop'
import Dropzone from 'react-dropzone'
import ConfirmDialogBox from '../../../../Shared/ConfirmDialogBox'

export interface IDataMigratesOwnProps {
  type: string
}

export interface IDataMigratesMapStateProps {
  isAdmin: boolean
  assetManagerId: string
  assumedAMID: string
  darkProfile: boolean
}

interface IDataMigratesState {
  selectedFile: any
}

var selectedFile: any
var showFileList: boolean = false
var showWarning: boolean = false
const acceptedFiles =
  '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'

let dropzoneRef: any

class DataMigration extends React.Component<
  IDataMigratesOwnProps & IDataMigratesMapStateProps & InjectedIntlProps,
  IDataMigratesState
> {
  constructor() {
    super()
    this.state = {
      selectedFile: null
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleDismiss = this.handleDismiss.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleDrop(dataTransfer: any) {
    showWarning = false
    var acceptedFileFormatArr = acceptedFiles.split(',')
    var dataTransferArr = Object.keys(dataTransfer.files).map(function(key) {
      if (acceptedFileFormatArr.indexOf(dataTransfer.files[key].type) > -1) {
        return dataTransfer.files[key]
      } else {
        showWarning = true
      }
    })
    dataTransferArr = dataTransferArr.filter(function(element: any) {
      return element !== undefined
    })

    if (
      this.state.selectedFile !== undefined &&
      this.state.selectedFile !== null
    ) {
      selectedFile = selectedFile.concat(dataTransferArr)
      this.setState({
        selectedFile: selectedFile
      })
    } else {
      this.setState({
        selectedFile: dataTransferArr
      })
    }
  }

  onDrop(files: any) {
    showWarning = false
    var dataTransferArr: any[] = files
    if (
      this.state.selectedFile !== undefined &&
      this.state.selectedFile !== null
    ) {
      selectedFile = selectedFile.concat(dataTransferArr)
      this.setState({
        selectedFile: selectedFile
      })
    } else {
      this.setState({
        selectedFile: dataTransferArr
      })
    }
  }

  onDropRejected() {
    showWarning = true
  }

  handleDismiss = (index: any, event: any) => {
    let remainedFilesArr = selectedFile.filter((file: any, index: number) => {
      if (index !== parseInt(event.children.key)) {
        return file
      }
    })
    this.setState({
      selectedFile: remainedFilesArr
    })
  }

  handleConfirm() {
    // do stuff here on files upload confirmation
  }

  render() {
    var dropFileMessage: any = (
      <FormattedMessage
        id="dataMigration.dropFileMessage"
        defaultMessage="Drop {fileType} here... (only '.csv' files are accepted)"
        values={{
          fileType: this.props.type || 'files'
        }}
      />
    )
    var uploadFileButtonlabel: any = (
      <FormattedMessage
        id="dataMigration.uploadFileButtonlabel"
        defaultMessage="Upload {fileType}"
        values={{
          fileType: this.props.type || 'File'
        }}
      />
    )

    if (
      this.state.selectedFile !== undefined &&
      this.state.selectedFile !== null
    ) {
      selectedFile = this.state.selectedFile
      selectedFile = Object.keys(selectedFile).map(function(key) {
        return selectedFile[key]
      })
      if (selectedFile.length > 0) {
        showFileList = true
      } else {
        showFileList = false
      }
    } else {
      showFileList = false
    }
    let { darkProfile } = this.props

    return (
      <div>
        <Segment padded inverted={darkProfile}>
          <Segment
            secondary
            inverted={darkProfile}
            style={{
              textAlign: 'center',
              height: '250px',
              border: '2px dashed #999',
              borderRadius: '4px',
              margin: '15px',
              position: 'relative'
            }}
          >
            <Dropzone
              onDrop={this.onDrop.bind(this)}
              accept={acceptedFiles}
              onDropRejected={this.onDropRejected.bind(this)}
              ref={(node: any) => {
                dropzoneRef = node
              }}
              className="default"
              disableClick
            >
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  margin: 'auto',
                  fontSize: '20px',
                  height: '115px',
                  fontStyle: 'italic',
                  color: '#999',
                  padding: '0 20px'
                }}
              >
                {dropFileMessage}
                <Divider horizontal style={{ marginTop: '20px' }}>
                  Or
                </Divider>
                <Button
                  onClick={() => {
                    dropzoneRef.open()
                  }}
                  content={uploadFileButtonlabel}
                  icon="upload"
                  color="green"
                  labelPosition="left"
                  style={{ textTransform: 'capitalize', margin: '10px 0' }}
                />
              </div>
            </Dropzone>
          </Segment>
        </Segment>
        {showWarning ? (
          <Message negative>
            <Message.Header>
              <Icon
                size="big"
                name="warning circle"
                style={{ fontSize: '40px' }}
              />Only '.csv' files are accepted
            </Message.Header>
          </Message>
        ) : null}
        {showFileList ? (
          <div className="uploaded-files-container">
            {selectedFile.map((file: any, index: number) => (
              <Message success onDismiss={this.handleDismiss} key={index}>
                <div className="full-width-block" key={index}>
                  <div className="left-icon-block">
                    <Icon
                      size="big"
                      name="file excel outline"
                      style={{ fontSize: '40px' }}
                    />
                  </div>
                  <div
                    className="middle-content-block"
                    style={{
                      color: '#1a531b',
                      fontWeight: 'bold',
                      fontSize: '1.14285714em'
                    }}
                  >
                    {this.state.selectedFile[index].name}
                  </div>
                </div>
              </Message>
            ))}
            <div className="confirm-btn-container">
              <Button
                content="Confirm"
                color="green"
                onClick={this.handleConfirm}
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

export default injectIntl(DataMigration)
