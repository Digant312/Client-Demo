# README

Quick start
---
This is the Argomi Web Application.

To set this project up for development, clone and run

`npm install`

to install dependencies.

Run

`npm start`

to start the app on `localhost:8080`

---


## Development Guide

### Routes

The app has a route structure that is defined in `src/components/Routes/ProtectedIndex/index.tsx`. The routes defined here map to the top-level routes displayed in the main navigation bar. Additional routes can be added by creating more `NavRoute` components. `NavRoute` accepts the following props:

* `path`: a string defining the URL for the route. Always concatenate this with the provided `match.url` prop to ensure that the base URL for the route is preserved.
* `exact` (optional): whether the path you supplied should match exactly. This behaviour is identical to the React Router v4 `exact`. This should never be true, otherwise any nested routes you define within `NavRoute` will never be rendered.
* `component`: the component to render for this route. Note that this accepts a component reference rather than rendering a component directly. Any additional props you provude to `NavRoute` will be passed on. It will also receive the usual React Router props such as `location`, `history` etc.

Example:

```javascript
<NavRoute
  path={`${match.url}/portfolio`}
  exact
  component={PortfolioComponent}
  portfolioProp='someProp'
/>
```

> **This file should be limited to only top-level routes. i.e. Do not put paths like `/{match.url}/portfolio/sub-portfolio` here. These Sub-Routes should be configured in the `component` that you pass to `NavRoute`. Remember that Route handling in React Router v4 is declarative so it doesn't matter where you define Routes.**

### Sub-Routes & Sub-Components

Most development will happen in Sub-Routes or Sub-Components.

Let's say you have this `NavRoute` component:

```javascript
<NavRoute
  path={`${match.url}/portfolio`}
  component={Portfolio}
/>
```

In this configuration, the `<Portfolio />` component will be rendered on the `.../portfolio` URL. Create the `Portfolio` component in `src/components/Protected/Portfolio/index.tsx`.

Portfolio should render its contents in the `<ProtectedContainer />` component. The `<ProtectedContainer />` component accepts the following props:

* `showBookSelector` (optional): A boolean that determines whether or not to render the Book Selector (see more below).
* `subMenu` (optional): An array of config options that handle the rendering of Sub-Routes within `<Portfolio />`. A config option is an object with the following interface:
  * `name`: a string defining the name of the Sub-Route. This name will be rendered in the Sub-Routes menu.
  * `path`: a string defining the URL for the Sub-Route. As with `NavRoute`, always concatenate with `props.match.url` to ensure consistency. In our example, `props.match.url` === `<baseURL>/portfolio`.
  * `exact` (optional): a boolean to determine whether this path should match exactly (following React Router conventions).
  * `component`: the component to render for this Sub-Route.

The subMenu will render a secondary navigation bar within the `<Portfolio />` component. The navigation bar will have as many tabs as the length of `subMenu`, with each tab named according to `name`. Clicking the tab will set the url to `path`, and render the `component`.

Example:

```javascript
// src/components/Protected/Portfolio/index.tsx

import ProtectedContainer from 'containers/Shared/Layouts/Protected/Main'
import TransactionsComponent from 'somewhere'

const Portfolio = (props /* this contains the injected Route props. location, match etc. */) => {
  const menuConfig = [
    { name: 'Positions', path: `${props.match.url}`, exact: true, component: () => <div>Positions</div> },
    { name: 'Transactions', path: `${props.match.url}/transactions`, component: TransactionsComponent }
  ]
  return <ProtectedContainer
    showBookSelector
    subMenu={menuConfig}
  />
}
```

If your component does not need Sub-Routes, you may omit the `subMenu` prop. If you do this, you will need to pass child components to `ProtectedContainer`, otherwise nothing will be rendered.

Example:

```javascript
// src/components/Protected/Portfolio/index.tsx

import ProtectedContainer from 'containers/Shared/Layouts/Protected/Main'
import TransactionsComponent from 'somewhere'

const Portfolio = (props /* this contains the injected Route props. location, match etc. */) => {
  
  return <ProtectedContainer>
    <TransactionsComponent />
    <div>Other Component</div>
  </ProtectedContainer>
}

/* You could render <Route /> components instead if you wanted Sub-Routes without the secondary menu navigation. */

```

Book Selector
---
All Sub-Routes or Sub-Components have the option of rendering a Book Selector. This controls the visibility of books globally across Argomi. The state is managed in the redux store, therefore any component that needs access to the book visibility state can do so by injecting the state through `react-redux`'s `connect()`. Remember that as with most things in React and Redux, this is declarative. Simply rendering the book selector does not automatically cause books to appear and disappear. You will need to map or filter your resource based on the bookSelector state.

### Internationalisation

Argomi is built with internationalisation in mind. It uses the `react-intl` and `react-intl-redux` packages to achieve a language-agnostic UI with dynamic loading of locale data and messages.

For the most part incorporating internationalisation to the workflow is simple. Words are replaced by the `<FormattedMessage />` component from `react-intl`. Refer to the `react-intl` documentation for more info (including replacing numbers and time).

There are two things to take note of here:

#### 1. Use of `<FormattedMessage />`

`<FormattedMessage />` can only be used in a direct render:

```javascript

const Component = () => {
  return <div>
    <FormattedMessage id='id' defaultMessage='Hello World' />
  </div>
}
```

It will not work like so:

```javascript

const Component = () => {
  return <div>
    <NavRoute name={<FormattedMessage id='id' defaultMessage='Hello World' />} />
  </div>
}
```

In order to make this work, you will need to inject a special prop from `react-intl` called `intl`. This is achieved by wrapping your component in a function `injectIntl` from `react-intl`. This in turn gives your component access to the `intl` prop:

```javascript
import { injectIntl } from 'react-intl'

const Component = (props) => {
  return <div>
    <NavRoute name={props.intl.formatMessage({ id: 'id', defaultMessage: 'Portfolio' })} />
  </div>
}

export default injectIntl(Component)
```

#### 2. Keeping track of messages

Argomi uses a babel plugin that runs through the `src` directory, searching for occurences of `<FormattedMessage />`, `<FormattedDate />` etc. It then collects all the `id` and `defaultMessage` and extracts them into a separate `.json` file. You can then run `npm run messages` to combine all the separate `.json` files into a single messages file. The key is the `id` and the value is `defaultMessage`. Therefore it is implied that **no two `id`s can be the same**, otherwise this script will fail. In order to solve this problem without forcing developers to know all existing `id`s, you should name your `id` according to the following convention:

> `id = componentName.id`

So if your message occurs in the `Portfolio` component, your `id` should be `portfolio.submitButton`. This keeps the namespace clean. The compromise is possible duplications in the consolidated messages file: if 2 components both have a `submitButton` id, the final messages file will be:

```json
{
  ...
  "portfolio.submitButton": "Submit",
  "transactions.submitButton": "Submit"
  ...
}
```

This is acceptable since it keeps the messages tightly coupled to the components where they occur. If you decide one day that the `Transactions` submit button should not say `Submit` it can easily be altered without affecting other components.

Finally, the babel plugin does **not** detect instances of the `intl` prop. That means all messages defined like `props.intl.formatMessage({ /* ... */ })` will not be extracted. To ensure that these messages are caught, you will need to use the `defineMessages()` function from `react-intl`. This should clone the data passed to `props.intl.formatMessage()`. Usage is best illustrated by an example:

#### Consolidated Example of internationalisation usage

```javascript
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import NavRoute from 'path/to/NavRoute'

const Portfolio = (props) => {

  const messages = defineMessages({
    title: {
      id: 'portfolio.title',
      defaultMessage: 'Welcome to Portfolio'
    },
    routeName: {
      id: 'portfolio.routeName',
      defaultMessage: 'Portfolio'
    },
    propText: {
      id: 'portfolio.propText',
      defaultMessage: 'Hello World'
    }
  })

  return <div>
    {/* We spread this object since FormattedMessage requires separate id and defaultMessage props */}
    <h1><FormattedMessage {...messages.title} /></h1>
    <NavRoute name={props.intl.formatMessage(messages.routeName)} />
    <SomeOtherComponent withProp={props.intl.formatMessage(messages.propText)} />
  </div>
}

export default injectIntl(Portfolio)
```

## Forms in Argomi

Argomi uses plenty of forms. A lot of our forms are built on [open-source data models](https://github.com/amaas-fintech/amaas-core-sdk-js) of financial data. In order to maintain consistency as well as for ease of development, there is a form-building higher order component that makes generating forms easy-ish.

### FormBuilder

In `src/components/Shared/FormBuilder/index.tsx` you can find the component that builds the form columns. This uses a standardised UI schematic designed to work within the Semantic-UI `Form` component. `FormBuilder` currently only builds 3-column forms. It accepts a `formConfig` prop - an array of config objects:

```typescript
interface IConfigInterface {
  name: string
  component: React.ComponentType<any>
  label: { id: string, defaultMessage: string }
  type?: string
  options?: DropdownItemProps[]
  validate?: any[]
  normalize?: Function
  valueKey?: string
  normal?: boolean
  fieldArray?: boolean
}
```

`name`, `component` and `label` are required fields of the config object, with label accepting an object of `id` and `defaultMessage` keys in accordance with the `react-intl` `FormattedMessage` component. Note that `name` needs to correspond to the appropriate property of the data type the field represents.

Example:
```typescript
const exampleConfig: IConfigInterface[] = [
  { name: 'assetId', label: messages.assetId, component: Input, validate: [required], normal: true },
  { name: 'description', label: messages.description, component: Input, validate: [required], normal: true },
  { name: 'displayName', label: messages.displayName, component: Input, normal: true }
]

// `name`, `label`, `component` and `fieldArray` are used directly in the form building. The other fields are passed to `component`.
```

We can maintain a set of configs that correspond to all labels and fields that are required for each class or type of financial data. Further customisation is possible by filtering out fields or concatenating additional ones depending on the use-case. Note that if you filter out fields for use in a data creation form, you may need to default the values if they are mandatory. For example, if you have chosen to filter out the `currency` field from the Asset config, it will be absent not just from the rendered form, but from the captured values set too. You will need to add the `currency` field into the value set manually.

### Usage

```tsx
const formConfig = [
  { name: 'assetId', label: messages.assetId, component: Input, validate: [required], normal: true },
  { name: 'description', label: messages.description, component: Input, validate: [required], normal: true },
  { name: 'displayName', label: messages.displayName, component: Input, normal: true }
]
const MyForm = (props: any) => (
  <div>
    <Form onSubmit={ props.handleSubmit }>
      <Segment.Group size='tiny'>
        <Segment>
          <FormBuilder formConfig={formConfig}>
        </Segment>
        <Segment>
          {/* Actions, buttons, other info */}
        </Segment>
      </Segment.Group>
    </Form>
  </div>
)
```

Tests
===

Jest and Enzyme are available for testing.

Run `npm test` to start the tests.

Run `npm run test:watch` to run in watch mode. This is useful to run alongside development for continuous monitoring.