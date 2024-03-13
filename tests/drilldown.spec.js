import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi, beforeEach } from 'vitest'
import { Drilldown } from '../lib/Drilldown';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Read the HTML document content
const htmlDocumentContent = fs.readFileSync(path.join(process.cwd(), 'index.html')).toString();

// Initialise Happy DOM
const window = new Window();
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

/**
 * Make sure the document is in a clear state before each test
 */
beforeEach(() => {
  document.body.innerHTML = "";
  document.write(htmlDocumentContent);
})

describe('Drilldown initialisation', () => {
  let drilldown;
  const DEFAULT_DURATION = 0.2;
  const DEFAULT_EASE = 'power1.out';
  const DEFAULT_STAGGER = 0;

  it('should correctly initialize with default options', () => {
    const menuElement = document.getElementById('menu');
    drilldown = new Drilldown(menuElement);

    expect(drilldown.options.backSelector).toBe('[data-js-menu-back]');
    expect(drilldown.options.nextSelector).toBe('[data-js-menu-next]');
    expect(drilldown.options.submenuSelector).toBe('[data-js-menu-container]');
    expect(drilldown.options.itemSelector).toBe('[data-js-menu-item]');
    expect(drilldown.options.childTween.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTween.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTween.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTween.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTween.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.childTween.outStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTween.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTween.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTween.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTween.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTween.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTween.outStagger).toBe(DEFAULT_STAGGER);
    // Add more assertions for other default options and initial state
  });
})

describe('Interacting with the menu', () => {
  it('should reveal a submenu when a link is clicked that has a submenu', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
    });
    drilldown.init();

    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    const submenuWrapper = document.querySelector('[data-js-menu-container-level="1"]');
    const submenuLinks = document.querySelectorAll('[data-js-menu-link-level="1"]');

    linkWithSubmenu.click();

    await delay(250);

    expect(submenuWrapper.style.opacity).toBe('1');
    expect(submenuWrapper.style.visibility).toBe('inherit');

    submenuLinks.forEach((link) => {
      expect(link.style.opacity).toBe('1');
      expect(link.style.visibility).toBe('inherit');
    });
  });
});
