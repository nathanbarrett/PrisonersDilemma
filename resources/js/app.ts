import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { vuetify } from '@js/vuetify/veutify'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'

createInertiaApp({
    resolve: name => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        return pages[`./Pages/${name}.vue`]
    },
    setup({ el, App, props, plugin }) {

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(vuetify)
            .use(VueMonacoEditorPlugin, {
                paths: {
                    // The recommended CDN config
                    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
                },
            })
            .mount(el)
    },
});
