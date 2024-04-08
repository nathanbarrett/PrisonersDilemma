import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { vuetify } from '@js/vuetify/veutify';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';
import BugsnagPerformance from '@bugsnag/browser-performance';

Bugsnag.start({
    apiKey: '0f7d2cccb138238593bf334fed218eba',
    plugins: [new BugsnagPluginVue()]
});
BugsnagPerformance.start({ apiKey: '0f7d2cccb138238593bf334fed218eba' });
const bugsnagVue = Bugsnag.getPlugin('vue');
createInertiaApp({
    resolve: name => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
        return pages[`./Pages/${name}.vue`];
    },
    setup({ el, App, props, plugin }) {

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(vuetify)
            .use(bugsnagVue)
            .use(VueMonacoEditorPlugin, {
                paths: {
                    // The recommended CDN config
                    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
                },
            })
            .mount(el);
    },
});
