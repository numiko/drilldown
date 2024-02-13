var O = Object.defineProperty;
var k = (r, t, e) => t in r ? O(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var A = (r, t, e) => (k(r, typeof t != "symbol" ? t + "" : t, e), e);
import { gsap as c } from "gsap";
const a = 0.2, h = "power1.out";
class R {
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
    A(this, "onShowParentTween", (t, e) => {
      const i = this.getElementsToHideForMenuTransition(e), n = this.getElementsToHideForMenuTransition(t), s = new c.timeline();
      return s.to(n, {
        x: 20,
        autoAlpha: 0,
        duration: this.options.parentTween.outDuration,
        ease: this.options.parentTween.outEase,
        stagger: this.options.parentTween.outStagger
      }), s.to(this.context, {
        // This is calculated at runtime because the height of the parent menu changes
        // just before we animate it in: see the 'onShowParentStart' callback.
        height: () => `${this.getNaturalHeight(e)}px`,
        duration: this.options.parentTween.heightDuration,
        ease: this.options.parentTween.heightEase
      }), s.set(t, {
        autoAlpha: 0
      }), s.to(i, {
        autoAlpha: 1,
        x: 0,
        duration: this.options.parentTween.inDuration,
        ease: this.options.parentTween.inEase,
        stagger: this.options.parentTween.inStagger
      }), s;
    });
    var i, n, s, o, l, u, m, p, g, S, d, w, T, b, f, v, C, E, I, x;
    this.bindThisToMemberFunctions(), this.context = t, this.options = {
      backSelector: e.backSelector || "[data-js-menu-back]",
      nextSelector: e.nextSelector || "[data-js-menu-next]",
      submenuSelector: e.submenuSelector || "[data-js-menu-container]",
      itemSelector: e.itemSelector || "[data-js-menu-item]",
      childTween: {
        outDuration: ((i = e.childTween) == null ? void 0 : i.outDuration) || a,
        outEase: ((n = e.childTween) == null ? void 0 : n.outEase) || h,
        outStagger: ((s = e.childTween) == null ? void 0 : s.outStagger) || 0,
        inDuration: ((o = e.childTween) == null ? void 0 : o.inDuration) || a,
        inEase: ((l = e.childTween) == null ? void 0 : l.inEase) || h,
        inStagger: ((u = e.childTween) == null ? void 0 : u.inStagger) || 0,
        heightDuration: ((m = e.childTween) == null ? void 0 : m.heightDuration) || a,
        heightEase: ((p = e.childTween) == null ? void 0 : p.heightEase) || h,
        onStart: ((g = e.childTween) == null ? void 0 : g.onStart) || null,
        onComplete: ((S = e.childTween) == null ? void 0 : S.onComplete) || null
      },
      parentTween: {
        outDuration: ((d = e.parentTween) == null ? void 0 : d.outDuration) || a,
        outEase: ((w = e.parentTween) == null ? void 0 : w.outEase) || h,
        outStagger: ((T = e.parentTween) == null ? void 0 : T.outStagger) || 0,
        inDuration: ((b = e.parentTween) == null ? void 0 : b.inDuration) || a,
        inEase: ((f = e.parentTween) == null ? void 0 : f.inEase) || h,
        inStagger: ((v = e.parentTween) == null ? void 0 : v.inStagger) || 0,
        heightDuration: ((C = e.parentTween) == null ? void 0 : C.heightDuration) || a,
        heightEase: ((E = e.parentTween) == null ? void 0 : E.heightEase) || h,
        onStart: ((I = e.parentTween) == null ? void 0 : I.onStart) || null,
        onComplete: ((x = e.parentTween) == null ? void 0 : x.onComplete) || null
      }
    }, this.disableNavigation = !1, this.activeMenuItem = null, this.menuResizeObserver = null;
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
    if (this.isAnimating || this.disableNavigation)
      return;
    const e = t.target.closest(this.options.nextSelector) || t.target.closest(this.options.backSelector);
    if (!e)
      return;
    t.preventDefault();
    const i = !!e.closest(this.options.nextSelector), n = e.closest(this.options.submenuSelector), s = this.getTargetMenu(e, i);
    if (!s)
      return;
    const o = i ? this.createAnimation(n, s, !0) : this.createAnimation(n, s, !1);
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
  createAnimation(t, e, i) {
    const n = i ? this.onShowChildTween(t, e) : this.onShowParentTween(t, e);
    return this.setupTweenCallbacks(n, t, e, i), n.pause(), n;
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
  setupTweenCallbacks(t, e, i, n) {
    const s = n ? this.options.childTween : this.options.parentTween, o = n ? this.onShowChildStart : this.onShowParentStart, l = n ? this.onShowChildComplete : this.onShowParentComplete;
    t.eventCallback("onStart", () => {
      s.onStart && s.onStart(e, i), o(e, i);
    }), t.eventCallback("onComplete", () => {
      s.onComplete && s.onComplete(e, i), l(e, i);
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
   * @returns {NodeList}
   */
  getMenuListItems(t) {
    return t.querySelectorAll(`:scope > ul > ${this.options.itemSelector}`);
  }
  /**
   * Returns the elements that will be hidden when a menu is transitioning.
   * @param {HTMLElement} menu
   * @returns {NodeList}
   */
  getElementsToHideForMenuTransition(t) {
    const e = t.querySelectorAll(`:scope > ul > ${this.options.itemSelector} > [data-js-menu-link]`), i = t.querySelector(`${this.options.backSelector}`), n = t.querySelector("[data-js-menu-parent]");
    return [i, n, ...e];
  }
  /**
   * Calls a user-specified callback if it exists. This module has its own
   * internal callbacks, but we also allow the user to specify their own.
   * @param {String} callback The name of the callback to call.
   * @param {Object} args The arguments to pass to the callback.
   * @returns {Void}
  */
  callUserSpecifiedCallback(t, e) {
    var i;
    (i = this == null ? void 0 : this.options) != null && i[t] && this.options[t](e);
  }
  /**
   * A combination of the module's own onShowChildStart callback and, if supplied,
   * the user's onShowChildStart callback. The onShowChildStart callback will fire at the beginning
   * of the animation that is responsible for revealing a submenu.
   * @param {Object}
   */
  onShowChildStart(t, e) {
    t.scrollTop = 0, e.scrollTop = 0, this.isAnimating = !0, this.callUserSpecifiedCallback("onShowChildStart", {
      currentMenu: t,
      targetmenu: e
    });
  }
  /**
   * A combination of the module's own onShowChildComplete callback and, if supplied,
   * the user's onShowChildComplete callback. The onShowChildComplete callback will fire at the end
   * of the animation that is responsible for revealing a submenu.
   * @param {Object}
   */
  onShowChildComplete(t, e) {
    this.isAnimating = !1, this.getMenuListItems(this.activeMenuItem).forEach((s) => {
      s !== this.activeMenuItem && s.classList.add("hidden");
    }), this.menuResizeObserver && this.menuResizeObserver.unobserve(t), this.createMenuResizeObserver().observe(e), this.callUserSpecifiedCallback("onShowChildComplete", {
      currentMenu: t,
      targetMenu: e
    });
  }
  /**
   * A combination of the module's own onShowParentStart callback and, if supplied,
   * the user's onShowParentStart callback. The onShowParentStart callback will fire at the start
   * of the animation that is responsible for revealing a parent menu / hiding the current menu.
   * @param {Object}
   */
  onShowParentStart(t, e) {
    this.isAnimating = !0, this.getMenuListItems(e).forEach((n) => {
      n.classList.remove("hidden");
    }), this.callUserSpecifiedCallback("onShowParentStart", {
      currentMenu: t,
      targetMenu: e
    });
  }
  /**
   * A combination of the module's own onShowParentComplete callback and, if supplied,
   * the user's onShowParentComplete callback. The onShowParentComplete callback will fire at the end
   * of the animation that is responsible for revealing a parent menu / hiding the current menu.
   * @param {Object}
   */
  onShowParentComplete(t, e) {
    this.isAnimating = !1, this.menuResizeObserver && this.menuResizeObserver.unobserve(t), e == this.context ? this.context.style.height = "auto" : this.createMenuResizeObserver().observe(e), this.callUserSpecifiedCallback("onShowParentComplete", {
      currentMenu: t,
      targetMenu: e
    });
  }
  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param {HTMLElement} currentMenu - The currently active menu.
   * @param {HTMLElement} targetMenu - The submenu to be displayed.
   * @returns {gsap.core.Timeline} The GSAP timeline for the animation.
   */
  onShowChildTween(t, e) {
    const i = e.offsetHeight, n = this.getElementsToHideForMenuTransition(t), s = this.getElementsToHideForMenuTransition(e), o = new c.timeline();
    return o.to(n, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTween.outDuration,
      ease: this.options.childTween.outEase,
      stagger: this.options.childTween.outStagger
    }), o.to(this.context, {
      height: `${i}px`,
      duration: this.options.childTween.heightDuration,
      ease: this.options.childTween.heightEase
    }), o.set(e, {
      autoAlpha: 1
    }), o.fromTo(s, {
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
  removeInlineStylesFromChildren(t) {
    t.querySelectorAll("[style]").forEach((e) => {
      c.set(e, {
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
    const i = t.offsetHeight;
    return t.style.height = `${e}px`, i;
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
    this.isAnimating = !1, this.callUserSpecifiedCallback("onReset"), this.resetMenuListItems(), this.removeInlineStylesFromChildren(this.context), this.menuResizeObserver && this.menuResizeObserver.disconnect();
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
  R as Drilldown
};
