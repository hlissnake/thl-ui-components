---
title: Stateless Components
layout: default
---

# Stateless Components

## Information

This package contains useful helper components which mostly wrap other components to be compatible with each other.

### NavItem

This component wraps rebass' `NavItem` component and changes the default `is` parameter to user react-router's `Link` component.

__REQUIRED__ Optional dependency `react-router`

### ToggleButton

This component wraps rebass' `Button` and `ButtonOutline` components and outputs `Button` if prop `selected` is true and `ButtonOutline` if false

### InlineForm

This component is an extension of rebass' `InlineForm` it has all the functionality of [http://jxnblk.com/rebass/#InlineForm](http://jxnblk.com/rebass/#InlineForm) with the addition of the following parameters:

| Property Name | Type | Description |
| --- | --- | --- | 
| __type__ |  _string_ | This is passed as the type param to the input field. |
| __message__ |  _string_ | An optional message to send to the input field. |
| __invalid__ |  _boolean_ | If true sets `aria-invalid` on the input and disables the submit button. |
| __buttonOutline__ |  _boolean (true)_ | If true it uses the `ButtonOutline` component, if false uses the `Button` component. |
