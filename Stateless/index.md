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
