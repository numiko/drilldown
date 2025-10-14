import { Drilldown } from '../lib/Drilldown';

/**
 * This file is used to run the package locally for development and testing purposes.
 */
const menuElement = document.getElementById('menu');
if (!menuElement) {
  throw new Error('Menu element not found');
}

const options = {
  backSelector: '[data-js-menu-back]',
  nextSelector: '[data-js-menu-next]',
  submenuSelector: '[data-js-menu-container]',
  itemSelector: '[data-js-menu-item]',
};

const menu = new Drilldown(menuElement, options);
menu.init();
