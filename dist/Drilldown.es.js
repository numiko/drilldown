var x = Object.defineProperty;
var O = (r, t, e) => t in r ? x(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var M = (r, t, e) => O(r, typeof t != "symbol" ? t + "" : t, e);
import { gsap as u } from "gsap";
const h = 0.2, l = "power1.out";
class C {
  /**
   * Initializes a new instance of the Drilldown class.
   * @param {HTMLElement} context - The element to initialize the drilldown on.
   * @param {Object} options - Configuration options for the drilldown.
   */
  constructor(t, e = {}) {
    /**
     * Generates the tween animation for showing a parent menu.
     * This method configures the animation sequence for transitioning back to a parent menu.
     * @param {HTMLElement} currentMenu - The currently active submenu.
     * @param {HTMLElement} targetMenu - The parent menu to be displayed.
     * @returns {gsap.core.Timeline} The GSAP timeline for the animation.
     */
    M(this, "onShowParentTween", (t, e) => {
      const n = this.getElementsToHideForMenuTransition(e), s = this.getElementsToHideForMenuTransition(t), i = new u.timeline();
      return i.to(s, {
        x: 20,
        autoAlpha: 0,
        duration: this.options.parentTween.outDuration,
        ease: this.options.parentTween.outEase,
        stagger: this.options.parentTween.outStagger
      }), i.to(this.context, {
        // This is calculated at runtime because the height of the parent menu changes
        // just before we animate it in: see the 'onShowParentStart' callback.
        height: () => `${this.getNaturalHeight(e)}px`,
        duration: this.options.parentTween.heightDuration,
        ease: this.options.parentTween.heightEase
      }), i.set(t, {
        autoAlpha: 0
      }), i.to(n, {
        autoAlpha: 1,
        x: 0,
        duration: this.options.parentTween.inDuration,
        ease: this.options.parentTween.inEase,
        stagger: this.options.parentTween.inStagger
      }), i;
    });
    var n, s, i, o, a, c, m, g, p, w, T, d, S, b, f, v, E, I, A, y;
    this.bindThisToMemberFunctions(), this.context = t, this.options = {
      backSelector: e.backSelector || "[data-js-menu-back]",
      nextSelector: e.nextSelector || "[data-js-menu-next]",
      submenuSelector: e.submenuSelector || "[data-js-menu-container]",
      itemSelector: e.itemSelector || "[data-js-menu-item]",
      onReset: e.onReset || null,
      childTween: {
        outDuration: ((n = e.childTween) == null ? void 0 : n.outDuration) || h,
        outEase: ((s = e.childTween) == null ? void 0 : s.outEase) || l,
        outStagger: ((i = e.childTween) == null ? void 0 : i.outStagger) || 0,
        inDuration: ((o = e.childTween) == null ? void 0 : o.inDuration) || h,
        inEase: ((a = e.childTween) == null ? void 0 : a.inEase) || l,
        inStagger: ((c = e.childTween) == null ? void 0 : c.inStagger) || 0,
        heightDuration: ((m = e.childTween) == null ? void 0 : m.heightDuration) || h,
        heightEase: ((g = e.childTween) == null ? void 0 : g.heightEase) || l,
        onStart: ((p = e.childTween) == null ? void 0 : p.onStart) || null,
        onComplete: ((w = e.childTween) == null ? void 0 : w.onComplete) || null
      },
      parentTween: {
        outDuration: ((T = e.parentTween) == null ? void 0 : T.outDuration) || h,
        outEase: ((d = e.parentTween) == null ? void 0 : d.outEase) || l,
        outStagger: ((S = e.parentTween) == null ? void 0 : S.outStagger) || 0,
        inDuration: ((b = e.parentTween) == null ? void 0 : b.inDuration) || h,
        inEase: ((f = e.parentTween) == null ? void 0 : f.inEase) || l,
        inStagger: ((v = e.parentTween) == null ? void 0 : v.inStagger) || 0,
        heightDuration: ((E = e.parentTween) == null ? void 0 : E.heightDuration) || h,
        heightEase: ((I = e.parentTween) == null ? void 0 : I.heightEase) || l,
        onStart: ((A = e.parentTween) == null ? void 0 : A.onStart) || null,
        onComplete: ((y = e.parentTween) == null ? void 0 : y.onComplete) || null
      }
    }, this.activeMenuItem = null, this.menuResizeObserver = null;
  }
  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((e) => {
      typeof this[e] == "function" && (this[e] = this[e].bind(this));
    });
  }
  init() {
    this.context.addEventListener("click", this.handleMenuClick);
  }
  /**
   * Handles click events on the menu, determining whether a next or back button was clicked,
   * and initiates the appropriate animation to transition between menus.
   * This function prevents navigation if animations are currently running or if navigation is disabled.
   * It also ensures that the default action for the click event is prevented.
   *
   * @param {MouseEvent} e - The mouse event triggered by clicking on a menu item.
   * @returns {void}
   */
  handleMenuClick(t) {
    if (this.isAnimating) return;
    const e = t.target.closest(this.options.nextSelector) || t.target.closest(this.options.backSelector);
    if (!e) return;
    t.preventDefault();
    const n = !!e.closest(this.options.nextSelector), s = e.closest(this.options.submenuSelector), i = this.getTargetMenu(e, n);
    if (!i) return;
    const o = n ? this.createAnimation(s, i, !0) : this.createAnimation(s, i, !1);
    o == null || o.play();
  }
  /**
    * Determines the target menu based on the element that triggered the event.
    * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
    * If the action is to go back, it finds the parent menu of the current submenu.
    *
    * @param {Element} element - The element (typically a button or link) that triggered the navigation action.
    * @param {boolean} isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
    * @returns {HTMLElement|null} The target menu to navigate to, or null if no target menu can be determined.
  */
  getTargetMenu(t, e) {
    return e ? (this.activeMenuItem = t.closest(this.options.itemSelector), this.activeMenuItem.querySelector(this.options.submenuSelector)) : (this.activeMenuItem = t.closest(this.options.itemSelector), this.activeMenuItem.closest(this.options.submenuSelector));
  }
  /**
   * Creates the animation for transitioning between menus.
   * This function initializes a GSAP tween for either showing a child menu (next) or a parent menu (back),
   * depending on the direction of navigation. It also sets up onStart and onComplete callbacks for the animation.
   *
   * @param {HTMLElement} currentMenu - The currently active menu that is being transitioned from.
   * @param {HTMLElement} targetMenu - The target menu that is being transitioned to.
   * @param {boolean} isChild - Determines the type of animation to create; true for child menu, false for parent menu.
   * @returns {gsap.core.Timeline} The GSAP timeline instance for the created animation.
   */
  createAnimation(t, e, n) {
    const s = n ? this.onShowChildTween(t, e) : this.onShowParentTween(t, e);
    return this.setupTweenCallbacks(s, t, e, n), s.pause(), s;
  }
  /**
   * Sets up GSAP tween callbacks for menu animations. This method configures onStart and onComplete callbacks
   * for the tween animation based on whether it's an animation for showing a child menu or a parent menu.
   * It integrates both custom callback functions provided via options and internal logic defined in the class.
   *
   * @param {gsap.core.Tween} tween - The GSAP tween instance that controls the menu animation.
   * @param {HTMLElement} currentMenu - The currently active menu element that is being transitioned from.
   * @param {HTMLElement} targetMenu - The target menu element that is being transitioned to.
   * @param {boolean} isChild - Flag to determine if the animation is for showing a child menu (true) or a parent menu (false).
   */
  setupTweenCallbacks(t, e, n, s) {
    const i = s ? this.options.childTween : this.options.parentTween, o = s ? this.onShowChildStart : this.onShowParentStart, a = s ? this.onShowChildComplete : this.onShowParentComplete;
    t.eventCallback("onStart", () => {
      i.onStart && i.onStart(e, n), o(e, n);
    }), t.eventCallback("onComplete", () => {
      i.onComplete && i.onComplete(e, n), a(e, n);
    });
  }
  /**
   * Creates a ResizeObserver to adjust the height of the drilldown menu.
   * This ensures the menu height matches the content, especially useful when content changes size.
   * @returns {ResizeObserver} The created ResizeObserver instance.
   */
  createMenuResizeObserver() {
    return this.menuResizeObserver || (this.menuResizeObserver = new ResizeObserver((t) => {
      for (let e of t)
        this.context.style.height = e.target.offsetHeight + "px";
    })), this.menuResizeObserver;
  }
  /**
   * Returns the main list items for a given menu. It does not include supplementary items, for
   * example, the parent link or the back button.
   * @param {HTMLElement} menu
   * @returns {Array}
   */
  getMenuListItems(t) {
    const e = Array.from(t.children).filter((s) => s.matches("ul"))[0];
    return e ? Array.from(e.children).filter((s) => s.matches(this.options.itemSelector)) : [];
  }
  /**
   * Returns the elements that will be hidden when a menu is transitioning.
   * @param {HTMLElement} menu
   * @returns {Array}
   */
  getElementsToHideForMenuTransition(t) {
    const n = this.getMenuListItems(t).map((a) => a.querySelector("[data-js-menu-link]")), s = t.querySelector(`${this.options.backSelector}`), i = t.querySelector("[data-js-menu-parent]");
    return [s, i, ...n];
  }
  /**
   * The callback that is fired when the menu navigates down a level.
   * @param {Object}
   */
  onShowChildStart(t, e) {
    t.scrollTop = 0, e.scrollTop = 0, this.isAnimating = !0;
  }
  /**
   * The callback that is fired after the menu has moved down a level.
   * @param {Object}
   */
  onShowChildComplete(t, e) {
    this.isAnimating = !1, this.getMenuListItems(t).forEach((i) => {
      i !== this.activeMenuItem && i.classList.add("hidden");
    }), this.menuResizeObserver && this.menuResizeObserver.unobserve(t), this.createMenuResizeObserver().observe(e);
  }
  /**
   * The callback that is fired when the menu navigates up a level.
   * @param {Object}
   */
  onShowParentStart(t, e) {
    this.isAnimating = !0, this.getMenuListItems(e).forEach((s) => {
      s.classList.remove("hidden");
    });
  }
  /**
   * The callback that is fired after the menu has moved up a level.
   * @param {Object}
   */
  onShowParentComplete(t, e) {
    this.isAnimating = !1, this.menuResizeObserver && this.menuResizeObserver.unobserve(t), e == this.context ? this.context.style.height = "auto" : this.createMenuResizeObserver().observe(e);
  }
  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param {HTMLElement} currentMenu - The currently active menu.
   * @param {HTMLElement} targetMenu - The submenu to be displayed.
   * @returns {gsap.core.Timeline} The GSAP timeline for the animation.
   */
  onShowChildTween(t, e) {
    const n = e.offsetHeight, s = this.getElementsToHideForMenuTransition(t), i = this.getElementsToHideForMenuTransition(e), o = new u.timeline();
    return o.to(s, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTween.outDuration,
      ease: this.options.childTween.outEase,
      stagger: this.options.childTween.outStagger
    }), o.to(this.context, {
      height: `${n}px`,
      duration: this.options.childTween.heightDuration,
      ease: this.options.childTween.heightEase
    }), o.set(e, {
      autoAlpha: 1
    }), o.fromTo(i, {
      autoAlpha: 0,
      x: 20
    }, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.childTween.inDuration,
      ease: this.options.childTween.inEase,
      stagger: this.options.childTween.inStagger
    }), o;
  }
  /**
   * Removes all inline styles from elements within a given context.
   * This is particularly useful for cleaning up after dynamic style changes during menu animations.
   * @param {HTMLElement} context - The context within which to remove inline styles.
   */
  removeInlineStyles(t) {
    const e = Array.from(t.querySelectorAll("[style]"));
    t.hasAttribute("style") && e.push(t), e.forEach((n) => {
      u.set(n, {
        clearProps: "all",
        overwrite: !0
      });
    });
  }
  /**
   * Calculates the natural height of an element, disregarding any explicitly set heights.
   * This is useful for animations that need to adjust to the content's natural size.
   * @param {HTMLElement} element - The element to measure.
   * @returns {number} The natural height of the element.
   */
  getNaturalHeight(t) {
    const e = t.offsetHeight;
    t.style.height = "auto";
    const n = t.offsetHeight;
    return t.style.height = `${e}px`, n;
  }
  /**
   * Resets the menu items to their initial state, removing any dynamic modifications.
   * This method is typically called when the menu is being reset or destroyed.
   */
  resetMenuListItems() {
    this.context.querySelectorAll(this.options.itemSelector).forEach((e) => {
      e.classList.remove("hidden");
    });
  }
  /**
   * Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
   * This is useful for cleaning up and preparing the menu for another interaction.
   */
  reset() {
    this.isAnimating = !1, typeof this.options.onReset == "function" && this.options.onReset(), this.resetMenuListItems(), this.removeInlineStyles(this.context), this.menuResizeObserver && this.menuResizeObserver.disconnect();
  }
  /**
   * Cleans up event listeners and resets the menu, preparing the instance for garbage collection.
   * This method should be called to prevent memory leaks when the drilldown menu is no longer needed.
   */
  destroy() {
    this.context.removeEventListener("click", this.handleMenuClick), this.reset();
  }
}
export {
  C as Drilldown
};
