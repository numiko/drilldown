import { gsap as e } from "gsap";
//#region lib/Drilldown.ts
var t = .2, n = "power1.out", r = class {
	constructor(r, i = {}) {
		this.activeMenuItem = null, this.menuResizeObserver = null, this.isAnimating = !1, this.handleMenuClick = (e) => {
			if (this.isAnimating) return;
			let t = e.target, n = t.closest(this.options.nextSelector) ?? t.closest(this.options.backSelector);
			if (!n) return;
			e.preventDefault();
			let r = !!n.closest(this.options.nextSelector), i = n.closest(this.options.submenuSelector);
			if (!i) return;
			let a = this.getTargetMenu(n, r);
			a && (r ? this.createAnimation(i, a, !0) : this.createAnimation(i, a, !1)).play();
		}, this.onShowParentTween = (t, n) => {
			let r = this.getElementsToHideForMenuTransition(n), i = this.getElementsToHideForMenuTransition(t), a = e.timeline();
			return a.to(i, {
				x: 20,
				autoAlpha: 0,
				duration: this.options.parentTweenOptions.outDuration,
				ease: this.options.parentTweenOptions.outEase,
				stagger: this.options.parentTweenOptions.outStagger
			}), a.to(this.context, {
				height: () => `${this.getNaturalHeight(n)}px`,
				duration: this.options.parentTweenOptions.heightDuration,
				ease: this.options.parentTweenOptions.heightEase
			}), a.set(t, { autoAlpha: 0 }), a.to(r, {
				autoAlpha: 1,
				x: 0,
				duration: this.options.parentTweenOptions.inDuration,
				ease: this.options.parentTweenOptions.inEase,
				stagger: this.options.parentTweenOptions.inStagger
			}), a;
		}, this.bindThisToMemberFunctions(), this.context = r;
		let a = i.childTweenOptions, o = i.parentTweenOptions;
		this.options = {
			backSelector: i.backSelector || "[data-js-menu-back]",
			nextSelector: i.nextSelector || "[data-js-menu-next]",
			submenuSelector: i.submenuSelector || "[data-js-menu-container]",
			itemSelector: i.itemSelector || "[data-js-menu-item]",
			onReset: i.onReset || null,
			childTweenOptions: {
				outDuration: a?.outDuration || t,
				outEase: a?.outEase || n,
				outStagger: a?.outStagger || 0,
				inDuration: a?.inDuration || t,
				inEase: a?.inEase || n,
				inStagger: a?.inStagger || 0,
				heightDuration: a?.heightDuration || t,
				heightEase: a?.heightEase || n,
				onStart: a?.onStart || null,
				onComplete: a?.onComplete || null
			},
			parentTweenOptions: {
				outDuration: o?.outDuration || t,
				outEase: o?.outEase || n,
				outStagger: o?.outStagger || 0,
				inDuration: o?.inDuration || t,
				inEase: o?.inEase || n,
				inStagger: o?.inStagger || 0,
				heightDuration: o?.heightDuration || t,
				heightEase: o?.heightEase || n,
				onStart: o?.onStart || null,
				onComplete: o?.onComplete || null
			}
		}, this.activeMenuItem = null, this.menuResizeObserver = null;
	}
	bindThisToMemberFunctions() {
		let e = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), t = this;
		e.forEach((e) => {
			let n = t[e];
			typeof n == "function" && (t[e] = n.bind(this));
		});
	}
	init() {
		this.context.addEventListener("click", this.handleMenuClick);
	}
	getTargetMenu(e, t) {
		return this.activeMenuItem = e.closest(this.options.itemSelector), this.activeMenuItem ? t ? this.activeMenuItem.querySelector(this.options.submenuSelector) : this.activeMenuItem.closest(this.options.submenuSelector) : null;
	}
	createAnimation(e, t, n) {
		let r = n ? this.onShowChildTween(e, t) : this.onShowParentTween(e, t);
		return this.setupTweenCallbacks(r, e, t, n), r.pause(), r;
	}
	setupTweenCallbacks(e, t, n, r) {
		let i = r ? this.options.childTweenOptions : this.options.parentTweenOptions, a = r ? this.onShowChildStart : this.onShowParentStart, o = r ? this.onShowChildComplete : this.onShowParentComplete;
		e.eventCallback("onStart", () => {
			i.onStart?.(t, n), a(t, n);
		}), e.eventCallback("onComplete", () => {
			i.onComplete?.(t, n), o(t, n);
		});
	}
	createMenuResizeObserver() {
		return this.menuResizeObserver ||= new ResizeObserver((e) => {
			for (let t of e) {
				let e = t.target;
				this.context.style.height = `${e.offsetHeight}px`;
			}
		}), this.menuResizeObserver;
	}
	getMenuListItems(e) {
		let t = Array.from(e.children).filter((e) => e.matches("ul"))[0];
		return t ? Array.from(t.children).filter((e) => e.matches(this.options.itemSelector)) : [];
	}
	getElementsToHideForMenuTransition(e) {
		let t = this.getMenuListItems(e).map((e) => e.querySelector("[data-js-menu-link]"));
		return [
			e.querySelector(this.options.backSelector),
			e.querySelector("[data-js-menu-parent]"),
			...t
		];
	}
	onShowChildStart(e, t) {
		e.scrollTop = 0, t.scrollTop = 0, this.isAnimating = !0;
	}
	onShowChildComplete(e, t) {
		this.isAnimating = !1, this.getMenuListItems(e).forEach((e) => {
			e !== this.activeMenuItem && e.classList.add("hidden");
		}), this.menuResizeObserver && this.menuResizeObserver.unobserve(e), this.createMenuResizeObserver().observe(t);
	}
	onShowParentStart(e, t) {
		this.isAnimating = !0, this.getMenuListItems(t).forEach((e) => {
			e.classList.remove("hidden");
		});
	}
	onShowParentComplete(e, t) {
		this.isAnimating = !1, this.menuResizeObserver && this.menuResizeObserver.unobserve(e), t === this.context ? this.context.style.height = "auto" : this.createMenuResizeObserver().observe(t);
	}
	onShowChildTween(t, n) {
		let r = n.offsetHeight, i = this.getElementsToHideForMenuTransition(t), a = this.getElementsToHideForMenuTransition(n), o = e.timeline();
		return o.to(i, {
			autoAlpha: 0,
			x: -20,
			duration: this.options.childTweenOptions.outDuration,
			ease: this.options.childTweenOptions.outEase,
			stagger: this.options.childTweenOptions.outStagger
		}), o.to(this.context, {
			height: `${r}px`,
			duration: this.options.childTweenOptions.heightDuration,
			ease: this.options.childTweenOptions.heightEase
		}), o.set(n, { autoAlpha: 1 }), o.fromTo(a, {
			autoAlpha: 0,
			x: 20
		}, {
			autoAlpha: 1,
			x: 0,
			duration: this.options.childTweenOptions.inDuration,
			ease: this.options.childTweenOptions.inEase,
			stagger: this.options.childTweenOptions.inStagger
		}), o;
	}
	removeInlineStyles(t) {
		let n = Array.from(t.querySelectorAll("[style]"));
		t.hasAttribute("style") && n.push(t), n.forEach((t) => {
			e.set(t, {
				clearProps: "all",
				overwrite: !0
			});
		});
	}
	getNaturalHeight(e) {
		let t = e.offsetHeight;
		e.style.height = "auto";
		let n = e.offsetHeight;
		return e.style.height = `${t}px`, n;
	}
	resetMenuListItems() {
		this.context.querySelectorAll(this.options.itemSelector).forEach((e) => {
			e.classList.remove("hidden");
		});
	}
	reset() {
		this.isAnimating = !1, typeof this.options.onReset == "function" && this.options.onReset(), this.resetMenuListItems(), this.removeInlineStyles(this.context), this.menuResizeObserver && this.menuResizeObserver.disconnect();
	}
	destroy() {
		this.context.removeEventListener("click", this.handleMenuClick), this.reset();
	}
};
//#endregion
export { r as Drilldown };
