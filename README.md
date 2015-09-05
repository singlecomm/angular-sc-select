# angular-sc-select
This is a wrapper of the [ui-select](https://github.com/angular-ui/ui-select) directive that adds the following features: 
* Pagination between large lists of items
* Select / unselect all if appropriate
* A simpler more opinionated API that is a subset of ng-options

It supports most of the original ui-select options, but if you need more fine grained control then just use the original ui-select directive.

## Demo
http://singlecomm.github.io/angular-sc-select

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

### placeholder
A placeholder value that will display if no value is assigned to the `ng-model` value.

### page-limit
The total number of items that will be shown on each set of results. If omitted pagination will be hidden.

### total-items
The total number of search results.

### multiple
Set to `true` to enable multiple items to be selected.

### search-enabled
Set to `false` to hide the search box.

### refresh-delay
The delay in ms between finishing typing and the select values being queries from the server. Default `200`.

### loading-delay
How long to wait until displaying the loading indicator. If items are loaded before this delay occurs then the loading indicator will never be shown. Default `0`.

### group-by
An expression used to group options by a value. Passed to the original `ui-select` so works exactly the same as that.

## Licence
MIT
