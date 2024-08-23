
import grapesjs from 'grapesjs';
import webPagePreset from 'grapesjs-preset-webpage'
import Text from '../components/Text.vue'
import Row from '../components/Row.vue'


export const editorStore = createStore("editor", ({ state, getter }) => {
   const instance = state(null, { shallow: true })

   const canvas = state(null, { shallow: true })
   const blocks = state(null, { shallow: true })
   const panels = state(null, { shallow: true })
   const traits = state(null, { shallow: true })
   const styles = state(null, { shallow: true })
   const selectors = state(null, { shallow: true })
   const layers = state(null, { shallow: true })


   const outlineShown = state(false, { shallow: false })

   function init(container) {
      const editor = grapesjs.init({
         container,
         height: '100dvh',
         fromElement: true,
         plugins: [webPagePreset],
         storageManager: { type: "local", autosave: true, autoload: true, stepsBeforeSave: 1 },
         layerManager: { appendTo: '#layers' },
         blockManager: { appendTo: '#properties' },
         selectorManager: { appendTo: '#selectors' },
         traitManager: { appendTo: '#properties' },
         styleManager: { clearProperties: 1, appendTo: '#styles', },
      })


      canvas.value = editor.Canvas
      panels.value = editor.Panels
      blocks.value = editor.BlockManager
      traits.value = editor.TraitManager
      styles.value = editor.StyleManager
      selectors.value = editor.SelectorManager
      layers.value = editor.LayerManager

      editor.addComponents({
         tagName: 'div',
         name: 'A4',
         removable: false,
         classes: ['min-h-100dvh', 'w-max', 'aspect-[1/1.414]', 'mx-auto', 'p-6'],
         traits: [],
         toolbar: []
      });

      const textHtml = vue2Html(Text), rowHtml = vue2Html(Row)

      blocks.value.render([
         {
            label: 'Text',
            media: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 7.5h-2.75v9h.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5h.5v-9H8.5v.75a.75.75 0 1 1-1.5 0v-1.5A.75.75 0 0 1 7.75 6h8.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0zM5.75 3A3.75 3.75 0 0 0 2 6.75v10.5A3.75 3.75 0 0 0 5.75 21h12.5A3.75 3.75 0 0 0 22 17.25V6.75A3.75 3.75 0 0 0 18.25 3zM3.5 6.75A2.25 2.25 0 0 1 5.75 4.5h12.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25H5.75a2.25 2.25 0 0 1-2.25-2.25z"/></svg>`,
            content: textHtml,
            type: 'text',
         },
         {
            label: 'Row',
            media: `<svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg)" viewBox="0 0 24 24"><path fill="currentColor" d="M4 3.77c0-.967.784-1.75 1.75-1.75h12.5c.966 0 1.75.783 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75H5.75A1.75 1.75 0 0 1 4 6.27zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zM4 10.77c0-.967.784-1.75 1.75-1.75h12.5c.966 0 1.75.783 1.75 1.75v2.5a1.75 1.75 0 0 1-1.75 1.75H5.75A1.75 1.75 0 0 1 4 13.27zm1.75-.25a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25zm0 5.5A1.75 1.75 0 0 0 4 17.77v2.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 20 20.27v-2.5a1.75 1.75 0 0 0-1.75-1.75zm-.25 1.75a.25.25 0 0 1 .25-.25h12.5a.25.25 0 0 1 .25.25v2.5a.25.25 0 0 1-.25.25H5.75a.25.25 0 0 1-.25-.25z"/></svg>`,
            content: rowHtml,
         },
      ])

      editor.DomComponents.addType('text', {
         model: {
            defaults: {
               resizable: {
                  tl: 0, // Top left
                  tc: 0, // Top center
                  tr: 0, // Top right
                  cl: 0, // Center left
                  bl: 0, // Bottom left
               }
            }
         }
      })

      panels.value.removePanel('devices-c')
      panels.value.removePanel('options')
      panels.value.removePanel('views')


      editor.on('load', (ctx) => {
         const { editor } = ctx

         const unocss = document.createElement('script')
         unocss.src = 'https://cdn.jsdelivr.net/npm/@unocss/runtime';
         editor.Canvas.getDocument().head.appendChild(unocss)
         document.querySelector('[data-states-c]').remove()
         document.querySelector('.gjs-clm-sels-info').remove()
      })


      editor.runCommand('core:component-outline')
      outlineShown.value = true

      instance.value = editor
   }

   return {
      instance, init,
      canvas, panels, blocks, traits, styles, selectors, layers,
      outlineShown
   };
});