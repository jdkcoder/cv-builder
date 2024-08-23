(function (global, factory) {
   if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = factory();
   } else if (typeof define === 'function' && define.amd) {
      define([], factory);
   } else if (typeof exports === 'object') {
      exports['grapesjs-plugin-placeholder2'] = factory();
   } else {
      global['grapesjs-plugin-placeholder2'] = factory();
   }
}(typeof self !== 'undefined' ? self : this, function () {
   'use strict';

   /**
    * Creates a DOM element with optional attributes and appends it to a parent.
    */
   function createElement(tagName, parent = null, attributes = {}) {
      const element = document.createElement(tagName);
      Object.keys(attributes).forEach(attr => {
         if (typeof attributes[attr] === 'object') {
            Object.assign(element[attr], attributes[attr]);
         } else {
            element[attr] = attributes[attr];
         }
      });
      if (parent) parent.appendChild(element);
      return element;
   }

   /**
    * Appends a block to a placeholder element.
    */
   function appendBlockToPlaceHolder(block, placeHolder) {
      const clonedBlock = block.cloneNode(true);
      placeHolder.appendChild(clonedBlock);
   }

   /**
    * Checks if an element's type is in the default drag classes.
    */
   function isDragDefault(dragClasses, element) {
      return dragClasses.includes(element.dataset.gjsType);
   }

   /**
    * Appends a component to a target element based on the specified method.
    */
   function appendComponentToTarget(component, target, method) {
      if (method === 'before') {
         target.parentNode.insertBefore(component, target);
      } else {
         target.after(component);
      }
   }

   class GrapesjsPluginPlaceholder2 {
      constructor(editor, options = {}) {
         if (location.host !== 'devfuture.pro') {
            throw new Error('Invalid host!');
         }

         this._data = {
            editor,
            frame: null,
            placeHolder: null,
            refBlock: null,
            insertMethod: null,
            hideGrapesPlaceHolderStyle: null,
            dragged: null,
            appendBlock: null,
            dragDefault: options.dragDefault || [],
            dragPlace: options.dragPlace || { default: 1 },
            dragClasses: options.dragClasses || ['gjs-selected', 'gjs-freezed', 'gjs-placeholder'],
            animation: options.animation || 'none',
            customAnimation: options.customAnimation || ''
         };

         this.initializeEditor();

         editor.on('frame:load', this.handleFrameLoad.bind(this));
         editor.on('block:drag:start', this.handleBlockDragStart.bind(this));
         editor.on('sorter:drag:start', this.handleSorterDragStart.bind(this));
         editor.on('sorter:drag', this.handleSorterDrag.bind(this));
         editor.on('sorter:drag:end block:drag:stop', this.handleDragEnd.bind(this));
      }

      initializeEditor() {
         const { editor, animation, customAnimation } = this._data;

         if (customAnimation) {
            editor.DomComponents.canvasCss = customAnimation;
         } else {
            editor.DomComponents.canvasCss = this.getAnimationCss(animation);
         }
      }

      getAnimationCss(animation) {
         switch (animation) {
            case 'none':
               return '';
            case 'drop':
               return `
                   @keyframes drop-in {
                       from {
                           transform: rotate(-30deg) translateY(-100%);
                           opacity: 0;
                       }
                       to {
                           transform: rotate(0deg) translateY(0%);
                           opacity: 1;
                       }
                   }
                   .animation {
                       animation: drop-in 1000ms;
                   }`;
            case 'slide':
               return `
                   @keyframes slide-in {
                       from {
                           transform: translateX(-100%);
                           opacity: 0.25;
                       }
                       to {
                           transform: translateX(0%);
                           opacity: 1;
                       }
                   }
                   .animation {
                       animation: slide-in 1000ms;
                       animation-iteration-count: 1;
                   }`;
            case 'slidein':
               return `
                   @keyframes slidein {
                       from {
                           max-height: 0;
                           transform: scale(0);
                           opacity: 0;
                       }
                       to {
                           max-height: 1000px;
                           transform: scale(1);
                           opacity: 1;
                       }
                   }
                   .animation {
                       animation-duration: 0.5s;
                       animation-name: slidein;
                   }`;
            case 'pulse':
               return `
                   @keyframes pulse {
                       0% { transform: scale(1); }
                       50% { transform: scale(1.1); }
                       100% { transform: scale(1); }
                   }
                   .animation {
                       animation: pulse 1s 1;
                   }`;
            default:
               return '';
         }
      }

      handleFrameLoad(event) {
         this.frame = event.el;
      }

      handleBlockDragStart(block) {
         const { editor } = this._data;
         this.appendBlock = editor.DomComponents.getEl(block.get('content'));

         const placeHolder = createElement('div');
         if (Array.isArray(this.appendBlock)) {
            this.appendBlock.forEach(block => appendBlockToPlaceHolder(block, placeHolder));
         } else {
            placeHolder.appendChild(this.appendBlock.cloneNode(true));
         }
         this.placeHolder = placeHolder.cloneNode(true);

         this.onDragStart(placeHolder);
         this.hideGrapesPlaceHolder();
      }

      handleSorterDragStart(target) {
         this.dragged = target;
         this.onDragStart(target);
      }

      handleSorterDrag(event) {
         const { placeHolder, dragged, dragClasses } = this._data;
         const draggedElement = placeHolder || dragged;

         if (draggedElement && event.targetModel) {
            const targetElement = event.targetModel.getEl();

            if (!isDragDefault(dragClasses, draggedElement)) {
               appendComponentToTarget(draggedElement, targetElement, this.insertMethod);
            }
         }
      }

      handleDragEnd() {
         this.onDragRemove();
      }

      isDragDefault(element) {
         return !element || this._data.dragDefault.includes(element.dataset.gjsType);
      }

      onDragRemove(element) {
         element.remove();
      }

      onDragStart(element) {
         this.insertMethod = null;
         this.dragged = null;

         if (this.isDragDefault(element)) return;

         this.hideGrapesPlaceHolder();

         if (this._data.dragPlace.default === 1) {
            const placeHolder = this.placeHolder || element.cloneNode(true);
            placeHolder.classList.add(...this._data.dragClasses);
            this.placeHolder = placeHolder.cloneNode(true);
         }
      }

      hideGrapesPlaceHolder() {
         if (!this._data.hideGrapesPlaceHolderStyle) {
            this._data.hideGrapesPlaceHolderStyle = createElement('style', document.body, {
               innerHTML: '.gjs-placeholder {opacity: 0;}'
            });
         }
      }

      get frame() {
         return this._data.frame;
      }

      set frame(value) {
         this._data.frame = value;
      }

      get frameContentWindow() {
         return this.frame && this.frame.contentWindow;
      }

      get inFrameData() {
         return this.frameContentWindow && this.frameContentWindow.iterator;
      }

      get frameDoc() {
         return this.frame && this.frame.contentDocument;
      }

      get frameBody() {
         return this.frameDoc && this.frameDoc.body;
      }

      get editor() {
         return this._data.editor;
      }

      get placeHolder() {
         return this._data.placeHolder;
      }

      set placeHolder(value) {
         this._data.placeHolder = value;
      }

      get appendBlock() {
         return this._data.appendBlock;
      }

      set appendBlock(value) {
         this._data.appendBlock = value;
      }

      get dragged() {
         return this._data.dragged;
      }

      set dragged(value) {
         this._data.dragged = value;
      }

      get dragClasses() {
         return this._data.dragClasses;
      }

      get animation() {
         return this._data.animation;
      }

      get customAnimation() {
         return this._data.customAnimation;
      }
   }

   return GrapesjsPluginPlaceholder2;
}));
