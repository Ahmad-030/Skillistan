/**
 * ScrollStack — Vanilla JS implementation
 * Based on the React ScrollStack component provided.
 * Uses native smooth scrolling (no Lenis dependency needed for vanilla).
 */

(function () {
  'use strict';

  class ScrollStack {
    constructor(scrollerId, options = {}) {
      this.scroller = document.getElementById(scrollerId);
      if (!this.scroller) return;

      // Config
      this.itemDistance       = options.itemDistance       ?? 100;
      this.itemScale          = options.itemScale          ?? 0.03;
      this.itemStackDistance  = options.itemStackDistance  ?? 30;
      this.stackPosition      = options.stackPosition      ?? '20%';
      this.scaleEndPosition   = options.scaleEndPosition   ?? '10%';
      this.baseScale          = options.baseScale          ?? 0.85;
      this.rotationAmount     = options.rotationAmount     ?? 0;
      this.blurAmount         = options.blurAmount         ?? 0;
      this.onStackComplete    = options.onStackComplete    ?? null;

      this.cards = [];
      this.lastTransforms = new Map();
      this.stackCompleted = false;
      this.rafId = null;
      this.isUpdating = false;

      this._init();
    }

    _parsePercentage(value, containerHeight) {
      if (typeof value === 'string' && value.includes('%')) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value);
    }

    _calculateProgress(scrollTop, start, end) {
      if (scrollTop < start) return 0;
      if (scrollTop > end)   return 1;
      return (scrollTop - start) / (end - start);
    }

    _init() {
      this.cards = Array.from(this.scroller.querySelectorAll('.scroll-stack-card'));

      this.cards.forEach((card, i) => {
        if (i < this.cards.length - 1) {
          card.style.marginBottom = `${this.itemDistance}px`;
        }
        card.style.willChange         = 'transform, filter';
        card.style.transformOrigin    = 'top center';
        card.style.backfaceVisibility = 'hidden';
        card.style.transform          = 'translateZ(0)';
        card.style.perspective        = '1000px';
      });

      this.scroller.addEventListener('scroll', () => this._update(), { passive: true });
      this._update();

      // RAF loop for smoother feel
      const tick = () => {
        this._update();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    _update() {
      if (!this.cards.length || this.isUpdating) return;
      this.isUpdating = true;

      const scrollTop       = this.scroller.scrollTop;
      const containerHeight = this.scroller.clientHeight;
      const stackPx         = this._parsePercentage(this.stackPosition, containerHeight);
      const scaleEndPx      = this._parsePercentage(this.scaleEndPosition, containerHeight);

      const endEl    = this.scroller.querySelector('.scroll-stack-end');
      const endElTop = endEl ? endEl.offsetTop : 0;

      this.cards.forEach((card, i) => {
        const cardTop    = card.offsetTop;
        const triggerStart = cardTop - stackPx - this.itemStackDistance * i;
        const triggerEnd   = cardTop - scaleEndPx;
        const pinStart     = cardTop - stackPx - this.itemStackDistance * i;
        const pinEnd       = endElTop - containerHeight / 2;

        const scaleProgress = this._calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale   = this.baseScale + i * this.itemScale;
        const scale         = 1 - scaleProgress * (1 - targetScale);
        const rotation      = this.rotationAmount ? i * this.rotationAmount * scaleProgress : 0;

        // Blur
        let blur = 0;
        if (this.blurAmount) {
          let topIdx = 0;
          this.cards.forEach((c, j) => {
            const jTop   = c.offsetTop;
            const jStart = jTop - stackPx - this.itemStackDistance * j;
            if (scrollTop >= jStart) topIdx = j;
          });
          if (i < topIdx) {
            blur = Math.max(0, (topIdx - i) * this.blurAmount);
          }
        }

        // Translate
        let translateY = 0;
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPx + this.itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPx + this.itemStackDistance * i;
        }

        const nT = {
          translateY: Math.round(translateY * 100) / 100,
          scale     : Math.round(scale      * 1000) / 1000,
          rotation  : Math.round(rotation   * 100)  / 100,
          blur      : Math.round(blur        * 100)  / 100,
        };

        const lT = this.lastTransforms.get(i);
        const changed = !lT
          || Math.abs(lT.translateY - nT.translateY) > 0.1
          || Math.abs(lT.scale      - nT.scale)      > 0.001
          || Math.abs(lT.rotation   - nT.rotation)   > 0.1
          || Math.abs(lT.blur       - nT.blur)        > 0.1;

        if (changed) {
          card.style.transform = `translate3d(0, ${nT.translateY}px, 0) scale(${nT.scale}) rotate(${nT.rotation}deg)`;
          card.style.filter    = nT.blur > 0 ? `blur(${nT.blur}px)` : '';
          this.lastTransforms.set(i, nT);
        }

        // onStackComplete callback
        if (i === this.cards.length - 1) {
          const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (inView && !this.stackCompleted) {
            this.stackCompleted = true;
            this.onStackComplete?.();
          } else if (!inView && this.stackCompleted) {
            this.stackCompleted = false;
          }
        }
      });

      this.isUpdating = false;
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.cards = [];
      this.lastTransforms.clear();
    }
  }

  // Expose globally
  window.ScrollStack = ScrollStack;

})();
