# NavigationToolbar Component

## Getting Started

Basic usage of the NavigationToolbar component is to place it at the top of your page.
There are no real settings to get this working, just insert what you want to put on the Toolbar as children of the element.

```jsx
<NavigationToolbar onScroll={action('scrollUp')}>
    <Button>Test Title 1</Button>
    <Button>Test Title 2</Button>
</NavigationToolbar>
```

## API

### NavigationToolbar

__props__

__onSelect:__ _function(scrollUp: boolean)_ This is called every time the user scrolls the page.
