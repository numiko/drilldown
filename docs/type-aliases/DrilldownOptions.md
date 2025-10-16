[**@numiko/drilldown**](../README.md)

***

[@numiko/drilldown](../README.md) / DrilldownOptions

# Type Alias: DrilldownOptions

> **DrilldownOptions** = `object`

Defined in: [Drilldown.ts:31](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-31)

Configuration options for initializing a Drilldown instance.
Defines selectors for menu elements and animation behavior customization.

## Properties

### backSelector?

> `optional` **backSelector**: `string`

Defined in: [Drilldown.ts:32](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-32)

***

### childTween?

> `optional` **childTween**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TweenOptions`](TweenOptions.md)\>

Defined in: [Drilldown.ts:45](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-45)

Animation configuration for child menu transitions.
Partial TweenOptions allowing selective override of default values.

***

### itemSelector?

> `optional` **itemSelector**: `string`

Defined in: [Drilldown.ts:35](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-35)

***

### nextSelector?

> `optional` **nextSelector**: `string`

Defined in: [Drilldown.ts:33](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-33)

***

### onReset?

> `optional` **onReset**: () => `void` \| `null`

Defined in: [Drilldown.ts:40](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-40)

Callback function executed when the drilldown menu is reset.
Useful for custom cleanup or state management.

***

### parentTween?

> `optional` **parentTween**: [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<[`TweenOptions`](TweenOptions.md)\>

Defined in: [Drilldown.ts:50](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-50)

Animation configuration for parent menu transitions.
Partial TweenOptions allowing selective override of default values.

***

### submenuSelector?

> `optional` **submenuSelector**: `string`

Defined in: [Drilldown.ts:34](https://bitbucket.org/numiko/drilldown/src/7cb860be80fc40dbc9933dfffbc3c91aba9acc61/lib/Drilldown.ts#lines-34)
