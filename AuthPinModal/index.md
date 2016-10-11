---
title: AuthPinModal Component
layout: default
---

# AuthPinModal Component

## Getting Started

This component is designed as an authentication pin popup, it allows customisation of all settings to function as you need.
Can be placed anywhere the rebass Overlay can be used.

([Live Demo]({{ '/storybook/?selectedKind=AuthPinModal' | prepend: site.baseurl }}))

```jsx
<AuthPinModal 
	open={true}
	unlockPin={'1111'}
	onPinAuth={action('onPinAuth')}
	onCancel=action('onCancel')}
	onFailure={action('onFailure')}
	cancelText={'cancel'}
	maxTries={4}
	errorMessage={(incorrectTries) => `Incorrect Pin, you have ${4 - incorrectTries} attempts left.`}
	message={'Enter Authentication Pin'}
/>
```

## API

### AuthPinModal

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __open__ |  _boolean (required)_ | If true the modal is shown and functioning, if false it is not shown |
| __onPinAuth__ |  _function() (required)_ | Called with a successful pin entry |
| __onCancel__ |  _function() (required)_ | Called when the cancel button is clicked |
| __onFailure__ |  _function() (required)_ | Called when the the maxTries is exceeded |
| __cancelText__ |  _string (required)_ | The text to put in the cancel button |
| __errorMessage__ |  _function(incorrectTries: number) | string (required)_ | This function should return the error message to display when at least one incorrect attempt has been made, or if a string is provided the string is used. |
| __message__ |  _string (required)_ | The text to put above the pin input |
| __maxTries__ |  _number_ | Maximum number of attempts allowed, if false or <= 0 unlimited tries are allowed |
| __unlockPin__ |  _string (required if not createLength)_ | The pin value that should result in a success |
| __createLength__ |  _number_ | If this is defined as > 0 then the modal will act as a create pin field |
| __autoFocus__ |  _boolean_ | If true then the first input will be automatically focussed when the modal opens |
| __forceError__ |  _boolean_ | If true the error message will be shown all the time |
