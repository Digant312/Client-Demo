// import React, { Component } from "react"
// import { Button, Modal } from 'semantic-ui-react'
// import { FormattedMessage, injectIntl } from 'react-intl'

// let button:string = 'Confirm';

// class FormDialogBox extends Component<any,any> {
//   constructor(props:any) {
//     super(props);
//     this.confirmYes = this.confirmYes.bind(this);
//     this.confirmNo = this.confirmNo.bind(this);
//     this.state = {openConfirm : this.props.openModalProp}; 
//     button = this.props.button;
//     this.confirmYes = this.confirmYes.bind(this);
//     this.openModal = this.openModal.bind(this);
//   }

//   openModal(){
//     this.setState( {openConfirm : true});
//   } 

//   close(){
//     // define action on modal close here
//   }

//   confirmYes(){
//     this.setState( {openConfirm : false});
//     // this.props.handleYes(this.props.bookId);
//   }

//   confirmNo(){
//     this.setState( {openConfirm : false});
//     // this.props.handleNo();
//   }

//   render() {
//     return (
//       <div>
//         {/* <div onClick={this.openModal} > <img width="16" src="https://cdn2.hubspot.net/hubfs/476360/delete32X32.png" /> </div> */}
//         <Modal open={this.props.openModalProp} size='mini' onClose={this.close} >
//           <Modal.Header>
//             {this.props.HeadingText}
//           </Modal.Header>
//           <Modal.Content>
//             {this.props.MessageText}
//           </Modal.Content>
//           {/* <Modal.Actions >
//             <Button negative content={this.props.cancelButtonLabel} onClick={this.confirmNo}/>
//             <Button positive content={this.props.submitButtonLabel} onClick={this.confirmYes}/>
//           </Modal.Actions> */}
//         </Modal>
//       </div>      
//     )
//   }
// }
// export default injectIntl(FormDialogBox)

import React, { Component } from "react"
import { Modal, Segment } from 'semantic-ui-react'
import { FormattedMessage, injectIntl } from 'react-intl'

class FormDialogBox extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { openConfirm: this.props.openModalProp };
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.setState({ openConfirm: true });
  }

  close() {
    // define action on modal close here
  }

  render() {
    const { darkProfile } = this.props
    return (
      <Modal open={this.props.openModalProp} size='tiny' onClose={this.close} >
        <Segment.Group size="tiny">
          <Segment inverted={darkProfile}>
              {this.props.dialogForm}
          </Segment>
        </Segment.Group>
      </Modal>
    )
  }
}
export default injectIntl(FormDialogBox)