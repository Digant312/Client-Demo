import React from 'react'
import { Accordion, Button, Icon } from 'semantic-ui-react'
import { defineMessages, FormattedMessage } from 'react-intl'

import AccordionWrapper from 'components/Shared/AccordionWrapper'

interface IOptions {
  title?: string
  content: IOptions[] | string
  visible: boolean
  type: string
}

const messages = defineMessages({
  selectAllNode: {
    id: 'bookSelectorNode.selectAll',
    defaultMessage: 'Select All'
  },
  clearAllNode: {
    id: 'bookSelectorNode.clearAll',
    defaultMessage: 'Clear All'
  }
})

const accordionBuilder = (
  options: any,
  toggle: Function,
  darkProfile: boolean
): any[] => {
  return options.map((option: IOptions, i: number) => {
    if (option.title) {
      return (
        <AccordionWrapper key={i}>
          {({ activeIndex, handleChangeIndex }) => (
            <Accordion inverted={darkProfile}>
              <Accordion.Title
                className="accordion-title"
                index={i}
                active={activeIndex === i}
                onClick={handleChangeIndex}
              >
                <Icon name="dropdown" />
                <strong>{option.title}</strong>
              </Accordion.Title>
              <Button
                basic
                onClick={() =>
                  toggle({ type: option.type, value: option.title })}
                size="mini"
                inverted={darkProfile}
              >
                {option.visible ? (
                  <FormattedMessage {...messages.clearAllNode} />
                ) : (
                  <FormattedMessage {...messages.selectAllNode} />
                )}
              </Button>
              {option.visible ? <Icon name="checkmark" /> : ''}
              <Accordion.Content
                style={{ marginLeft: `20px` }}
                active={activeIndex === i}
              >
                {accordionBuilder(
                  option.content as IOptions[],
                  toggle,
                  darkProfile
                )}
              </Accordion.Content>
            </Accordion>
          )}
        </AccordionWrapper>
      )
    } else {
      return (
        <Accordion.Content key={i}>
          <div className="accordion-book-btn">
            <Button
              basic
              onClick={() => toggle({ type: 'book', value: option.content })}
              size="mini"
              color="green"
              inverted={darkProfile}
            >
              {option.content}
            </Button>
            {option.visible ? <Icon name="checkmark" /> : ''}
          </div>
        </Accordion.Content>
      )
    }
  })
}

export default accordionBuilder
