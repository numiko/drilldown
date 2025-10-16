[**@numiko/drilldown**](../README.md)

***

[@numiko/drilldown](../README.md) / Drilldown

# Class: Drilldown

Defined in: [Drilldown.ts:63](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-63)

## Constructors

### Constructor

> **new Drilldown**(`context`, `options`): `Drilldown`

Defined in: [Drilldown.ts:75](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-75)

Initializes a new instance of the Drilldown class.

#### Parameters

##### context

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)

The element to initialize the drilldown on.

##### options

[`DrilldownOptions`](../type-aliases/DrilldownOptions.md) = `{}`

#### Returns

`Drilldown`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [Drilldown.ts:515](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-515)

Cleans up event listeners and resets the menu, preparing the instance for garbage collection.
This method should be called to prevent memory leaks when the drilldown menu is no longer needed.

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: [Drilldown.ts:138](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-138)

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [Drilldown.ts:492](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-492)

Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
This is useful for cleaning up and preparing the menu for another interaction.

#### Returns

`void`
