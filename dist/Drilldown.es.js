import { gsap as m } from "gsap";
const u = 0.2, l = "power1.out";
class f {
  /**
   * Initializes a new instance of the Drilldown class.
   * @param context - The element to initialize the drilldown on.
   * @param options
   */
  constructor(i, s = {}) {
    this.activeMenuItem = null, this.menuResizeObserver = null, this.isAnimating = !1, this.handleMenuClick = (o) => {
      if (this.isAnimating) return;
      const n = o.target, r = n.closest(this.options.nextSelector) ?? n.closest(this.options.backSelector);
      if (!r) return;
      o.preventDefault();
      const a = !!r.closest(this.options.nextSelector), h = r.closest(this.options.submenuSelector);
      if (!h) return;
      const c = this.getTargetMenu(r, a);
      if (!c) return;
      (a ? this.createAnimation(h, c, !0) : this.createAnimation(h, c, !1)).play();
    }, this.onShowParentTween = (o, n) => {
      const r = this.getElementsToHideForMenuTransition(n), a = this.getElementsToHideForMenuTransition(o), h = m.timeline();
      return h.to(a, {
        x: 20,
        autoAlpha: 0,
        duration: this.options.parentTween.outDuration,
        ease: this.options.parentTween.outEase,
        stagger: this.options.parentTween.outStagger
      }), h.to(this.context, {
        // This is calculated at runtime because the height of the parent menu changes
        // just before we animate it in: see the 'onShowParentStart' callback.
        height: () => `${this.getNaturalHeight(n)}px`,
        duration: this.options.parentTween.heightDuration,
        ease: this.options.parentTween.heightEase
      }), h.set(o, {
        autoAlpha: 0
      }), h.to(r, {
        autoAlpha: 1,
        x: 0,
        duration: this.options.parentTween.inDuration,
        ease: this.options.parentTween.inEase,
        stagger: this.options.parentTween.inStagger
      }), h;
    }, this.bindThisToMemberFunctions(), this.context = i;
    const t = s.childTweenOptions, e = s.parentTweenOptions;
    this.options = {
      backSelector: s.backSelector || "[data-js-menu-back]",
      nextSelector: s.nextSelector || "[data-js-menu-next]",
      submenuSelector: s.submenuSelector || "[data-js-menu-container]",
      itemSelector: s.itemSelector || "[data-js-menu-item]",
      onReset: s.onReset || null,
      childTween: {
        outDuration: (t == null ? void 0 : t.outDuration) || u,
        outEase: (t == null ? void 0 : t.outEase) || l,
        outStagger: (t == null ? void 0 : t.outStagger) || 0,
        inDuration: (t == null ? void 0 : t.inDuration) || u,
        inEase: (t == null ? void 0 : t.inEase) || l,
        inStagger: (t == null ? void 0 : t.inStagger) || 0,
        heightDuration: (t == null ? void 0 : t.heightDuration) || u,
        heightEase: (t == null ? void 0 : t.heightEase) || l,
        onStart: (t == null ? void 0 : t.onStart) || null,
        onComplete: (t == null ? void 0 : t.onComplete) || null
      },
      parentTween: {
        outDuration: (e == null ? void 0 : e.outDuration) || u,
        outEase: (e == null ? void 0 : e.outEase) || l,
        outStagger: (e == null ? void 0 : e.outStagger) || 0,
        inDuration: (e == null ? void 0 : e.inDuration) || u,
        inEase: (e == null ? void 0 : e.inEase) || l,
        inStagger: (e == null ? void 0 : e.inStagger) || 0,
        heightDuration: (e == null ? void 0 : e.heightDuration) || u,
        heightEase: (e == null ? void 0 : e.heightEase) || l,
        onStart: (e == null ? void 0 : e.onStart) || null,
        onComplete: (e == null ? void 0 : e.onComplete) || null
      }
    }, this.activeMenuItem = null, this.menuResizeObserver = null;
  }
  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    const i = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), s = this;
    i.forEach((t) => {
      const e = s[t];
      typeof e == "function" && (s[t] = e.bind(this));
    });
  }
  init() {
    this.context.addEventListener("click", this.handleMenuClick);
  }
  /**
    * Determines the target menu based on the element that triggered the event.
    * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
    * If the action is to go back, it finds the parent menu of the current submenu.
    *
    * @param element - The element (typically a button or link) that triggered the navigation action.
    * @param isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
    * @returns The target menu to navigate to, or null if no target menu can be determined.
  */
  getTargetMenu(i, s) {
    return this.activeMenuItem = i.closest(this.options.itemSelector), this.activeMenuItem ? s ? this.activeMenuItem.querySelector(this.options.submenuSelector) : this.activeMenuItem.closest(this.options.submenuSelector) : null;
  }
  /**
   * Creates the animation for transitioning between menus.
   * This function initializes a GSAP tween for either showing a child menu (next) or a parent menu (back),
   * depending on the direction of navigation. It also sets up onStart and onComplete callbacks for the animation.
   *
   * @param currentMenu - The currently active menu that is being transitioned from.
   * @param targetMenu - The target menu that is being transitioned to.
   * @param isChild - Determines the type of animation to create; true for child menu, false for parent menu.
   * @returns The GSAP timeline instance for the created animation.
   */
  createAnimation(i, s, t) {
    const e = t ? this.onShowChildTween(i, s) : this.onShowParentTween(i, s);
    return this.setupTweenCallbacks(e, i, s, t), e.pause(), e;
  }
  /**
   * Sets up GSAP tween callbacks for menu animations. This method configures onStart and onComplete callbacks
   * for the tween animation based on whether it's an animation for showing a child menu or a parent menu.
   * It integrates both custom callback functions provided via options and internal logic defined in the class.
   *
   * @param tween - The GSAP tween instance that controls the menu animation.
   * @param currentMenu - The currently active menu element that is being transitioned from.
   * @param targetMenu - The target menu element that is being transitioned to.
   * @param isChild - Flag to determine if the animation is for showing a child menu (true) or a parent menu (false).
   */
  setupTweenCallbacks(i, s, t, e) {
    const o = e ? this.options.childTween : this.options.parentTween, n = e ? this.onShowChildStart : this.onShowParentStart, r = e ? this.onShowChildComplete : this.onShowParentComplete;
    i.eventCallback("onStart", () => {
      var a;
      (a = o.onStart) == null || a.call(o, s, t), n(s, t);
    }), i.eventCallback("onComplete", () => {
      var a;
      (a = o.onComplete) == null || a.call(o, s, t), r(s, t);
    });
  }
  /**
   * Creates a ResizeObserver to adjust the height of the drilldown menu.
   * This ensures the menu height matches the content, especially useful when content changes size.
   */
  createMenuResizeObserver() {
    return this.menuResizeObserver || (this.menuResizeObserver = new ResizeObserver((i) => {
      for (const s of i) {
        const t = s.target;
        this.context.style.height = `${t.offsetHeight}px`;
      }
    })), this.menuResizeObserver;
  }
  /**
   * Returns the main list items for a given menu. It does not include supplementary items, for
   * example, the parent link or the back button.
   * @param menu
   */
  getMenuListItems(i) {
    const s = Array.from(i.children).filter((e) => e.matches("ul"))[0];
    return s ? Array.from(s.children).filter((e) => e.matches(this.options.itemSelector)) : [];
  }
  /**
   * Returns the elements that will be hidden when a menu is transitioning.
   * @param menu
   */
  getElementsToHideForMenuTransition(i) {
    const t = this.getMenuListItems(i).map((r) => r.querySelector("[data-js-menu-link]")), e = i.querySelector(this.options.backSelector), o = i.querySelector("[data-js-menu-parent]");
    return [e, o, ...t];
  }
  /**
   * The callback that is fired when the menu navigates down a level.
   */
  onShowChildStart(i, s) {
    i.scrollTop = 0, s.scrollTop = 0, this.isAnimating = !0;
  }
  /**
   * The callback that is fired after the menu has moved down a level.
   */
  onShowChildComplete(i, s) {
    this.isAnimating = !1, this.getMenuListItems(i).forEach((o) => {
      o !== this.activeMenuItem && o.classList.add("hidden");
    }), this.menuResizeObserver && this.menuResizeObserver.unobserve(i), this.createMenuResizeObserver().observe(s);
  }
  /**
   * The callback that is fired when the menu navigates up a level.
   */
  onShowParentStart(i, s) {
    this.isAnimating = !0, this.getMenuListItems(s).forEach((e) => {
      e.classList.remove("hidden");
    });
  }
  /**
   * The callback that is fired after the menu has moved up a level.
   */
  onShowParentComplete(i, s) {
    this.isAnimating = !1, this.menuResizeObserver && this.menuResizeObserver.unobserve(i), s === this.context ? this.context.style.height = "auto" : this.createMenuResizeObserver().observe(s);
  }
  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param currentMenu - The currently active menu.
   * @param targetMenu - The submenu to be displayed.
   */
  onShowChildTween(i, s) {
    const t = s.offsetHeight, e = this.getElementsToHideForMenuTransition(i), o = this.getElementsToHideForMenuTransition(s), n = m.timeline();
    return n.to(e, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTween.outDuration,
      ease: this.options.childTween.outEase,
      stagger: this.options.childTween.outStagger
    }), n.to(this.context, {
      height: `${t}px`,
      duration: this.options.childTween.heightDuration,
      ease: this.options.childTween.heightEase
    }), n.set(s, {
      autoAlpha: 1
    }), n.fromTo(o, {
      autoAlpha: 0,
      x: 20
    }, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.childTween.inDuration,
      ease: this.options.childTween.inEase,
      stagger: this.options.childTween.inStagger
    }), n;
  }
  /**
   * Removes all inline styles from elements within a given context.
   * This is particularly useful for cleaning up after dynamic style changes during menu animations.
   * @param context - The context within which to remove inline styles.
   */
  removeInlineStyles(i) {
    const s = Array.from(i.querySelectorAll("[style]"));
    i.hasAttribute("style") && s.push(i), s.forEach((t) => {
      m.set(t, {
        clearProps: "all",
        overwrite: !0
      });
    });
  }
  /**
   * Calculates the natural height of an element, disregarding any explicitly set heights.
   * This is useful for animations that need to adjust to the content's natural size.
   * @param element - The element to measure.
   */
  getNaturalHeight(i) {
    const s = i.offsetHeight;
    i.style.height = "auto";
    const t = i.offsetHeight;
    return i.style.height = `${s}px`, t;
  }
  /**
   * Resets the menu items to their initial state, removing any dynamic modifications.
   * This method is typically called when the menu is being reset or destroyed.
   */
  resetMenuListItems() {
    this.context.querySelectorAll(this.options.itemSelector).forEach((s) => {
      s.classList.remove("hidden");
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
  f as Drilldown
};
