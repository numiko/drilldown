import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi, beforeEach } from 'vitest'
import { Drilldown } from '../lib/Drilldown';

// Read the HTML document content
const htmlDocumentContent = fs.readFileSync(path.join(process.cwd(), 'index.html')).toString();

// Initalise Happy DOM
const window = new Window();
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

/**
 * Make sure the coument is in a clear state before each test
 */
beforeEach(() => {
  document.body.innerHTML = "";
  document.write(htmlDocumentContent);
})

describe('Drilldown Menu Tests', () => {
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


  // Add more tests for animations, event listeners, resize observer, reset, and destroy methods
});
