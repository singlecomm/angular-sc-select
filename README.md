# angular-sc-select
[![Build Status](https://snap-ci.com/singlecomm/angular-sc-select/branch/master/build_image)](https://snap-ci.com/singlecomm/angular-sc-select/branch/master)

This is a wrapper of the [ui-select](https://github.com/angular-ui/ui-select) directive that adds the following features:
* Pagination between large lists of items
* Select / unselect all if appropriate
* A simpler more opinionated API that is a subset of ng-options

It supports most of the original ui-select options, but if you need more fine grained control then just use the original ui-select directive.

## Demo
http://singlecomm.github.io/angular-sc-select

## Installation
### via bower
```
bower install angular-sc-select --save
```

```javascript
angular.module('myApp', ['sc.select']);
```

Include `dist/sc-select.js` in your project, `dist/sc-select.css` contains the select2 and select2-bootstrap css for convenience.

### via npm
```
npm install angular-sc-select --save
```

```javascript
angular.module('myApp', [require('angular-sc-select'), require('ngSanitze'), require('ui-select')]);
```

## API
Example:
```
<sc-select
  ng-model="vm.selectedValue"
  sc-options="item.id as item.label for item in vm.item"
  placeholder="Select from this list...">
</sc-select>
```

### ng-model
A variables the value of the select directive will be bound to. Will be an array of items if multiple items can be selected.

### sc-options
A subset of the angular `ng-options` directive. Supports values are:
* `label for value in sourceArray`
* `select as label for value in sourceArray`

`sourceArray` can also be a function which returns a promise. `searchText` and `page` are variables available to the function expression as the search value and current page of the select results.

### group-by
This has 2 possible types that can be passed to it:
* A string value that indicates the field to group by e.g. `group-by="name"` will group by the items `name` field
* A function in the scope that returns a value to group by e.g. `group-by="vm.groupBy"` where `vm.groupBy` is defined as:
```
vm.groupBy = function(item) {
  return 'My custom prefix: ' + item.label; // you would put more advanced logic here than this
};
```

For more examples see the [demo page](https://github.com/singlecomm/angular-sc-select/blob/master/index.html).

### loading-delay
How long to wait until displaying the loading indicator. If items are loaded before this delay occurs then the loading indicator will never be shown. Default `0`.

### multiple
Set to `true` to enable multiple items to be selected.

### multiple-limit
The maximum number of items that can be selected. Set to `0` or `false` to disable. Default is disabled.

### placeholder
A placeholder value that will display if no value is assigned to the `ng-model` value.

### page-limit
The total number of items that will be shown on each set of results. If omitted pagination will be hidden.

### refresh-delay
The delay in ms between finishing typing and the select values being queries from the server. Default `200`.

### search-enabled
Set to `false` to hide the search box.

### toggle-all-enabled
Set to `false` to hide the select/de-select all buttons.

### total-items
The total number of search results.

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + run tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests (this is automatic when you run `npm start`).

### Build
Run `npm run build` to build the project files in the dist folder

## Licence
MIT
