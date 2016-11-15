---
title: SearchSelect Component
layout: default
---

# SearchSelect Component

## Getting Started

This Component is a simple search dropdown select using rebass components

([Live Demo]({{ '/storybook/?selectedKind=SearchSelect&selectedStory=basic' | prepend: site.baseurl }}))

```jsx
<SearchSelect/>
```

## API

### SearchSelect

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __children__ | _func (required)_ | Function to render children, parameters are (item, onClick, isSelected, isHighlighted) |
| __open__ | _boolean (required)_ | Value if the select list is open or not |
| __onOpen__ | _func (required)_ | Function called when the select is opened (normally sets __open__ to true) |
| __onDismiss__ | _func (required)_ | Function called when the select should be closed (normally sets __open__ to false) |
| __maxResults__ | _number_ | If defined will trim the passed in search results to this number and places a child at the end with params _(undefined, onNew, false, isSelected)_ |
| __value__ | _any_ | Currently selected value, will be passed through the __children__ function to display the normal value _(value, onOpen, true)_ |
| __onChange__ | _func_ | Function called when the selected value is changed, gets passed the "item" of __children__ function via the onClick |
| __onNew__ | _func_ | Function that is called when a "New" item should be added, is displayed based on maxResults and searchResults |
| __searchValue__ | _string_ | Value currently displayed in the search input |
| __onSearchChange__ | _func_ | Function passed to the onChange property of the Input field |
| __searchResults__ | _array_ | Array of items to display as children via __children__ |
| __searching__ | _bool_ | If true will display the __searchElement__ instead of the children |
| __searchElement__ | _Element / string / func_ | React display element/string/function to display while searching is in progress | 
| __styles__ | _object_ | See Styling below. 
| __animationSpeed__ | _number_ | Speed of the show/hide animation in ms |

### Styling

The __styles__ property is used to override the following styling. NOTE: There are two styles that cannot be overridden in dropdownMenu to ensure correct functioning.

```
const baseStyles = {
	input: {}, // Styles for the search input
	dropdown: { // styling for the dropdown itself
		base: {
			position: 'absolute',
			zIndex: zIndex[1],
			margin: 0,
			top: 0,
			left: 0,
			right: 0,
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			minWidth: 128,
			overflow: 'hidden',
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: 'rgba(0, 0, 0, 0.247059)',
			borderRadius: 2,
			color: colors.text,
			backgroundColor: colors.white,
			transition: `all ${animationSpeed / 1000.0}s`
		},
		open: {
			padding: (scale[1] / 2),
			left: -(scale[1] / 2),
			right: -(scale[1] / 2),
			top: -(scale[1] / 2),
			opacity: 1,
			boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)'
		},
		closed: {
			padding: 0,
			opacity: 0,
			boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)'
		}
	},
	dropdownMenu: { // this wraps around the dropdown
		root: {
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: open ? 0 : '100%', // cannot be overridden
			zIndex: 4
		},
		overlay: {
			position: 'fixed',
			display: open ? null : 'none', // cannot be overridden
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	}
};
```
