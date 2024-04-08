<template>
  <vue-monaco-editor
    v-model:value="code"
    :theme="vsTheme"
    language="typescript"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
  />
</template>

<script setup lang="ts">
import { shallowRef, watch, ref } from "vue";
import { useDisplay } from "vuetify";
import { editor, editor as editorTypes } from "monaco-types";
import { useTheme } from "vuetify";

export interface CodeError {
    message: string;
    lineNumber: number;
}
const theme = useTheme();
type EditorTheme = "vs" | "vs-dark";
const vsTheme = ref<EditorTheme>(theme.global.current.value.dark ? "vs-dark" : "vs");
watch(theme.global.name, () => {
    vsTheme.value = theme.global.current.value.dark ? "vs-dark" : "vs";
}, { deep: true });

const emit = defineEmits<{
    (e: 'code:error', errored: boolean): void
    (e: 'code:errors', errors: CodeError[]): void
}>();
const code = defineModel({
    type: String,
    default: "",
});

const editorRef = shallowRef<editorTypes.IEditor|undefined>();

function checkForErrors() {
    if (!editorRef.value) {
        emit("code:error", false);
        emit("code:errors", []);
        return;
    }
    let errors: editorTypes.IMarker[] = [];
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors = (window as any).monaco.editor.getModelMarkers({});
    } catch (e) {
        emit("code:error", true);
        emit("code:errors", [
            {
                message: "An error occurred while checking for errors.",
                lineNumber: 0,
            }
        ]);
        return;
    }
    const severeErrors: CodeError[] = errors.filter((error) => error.severity >= 8).map((error) => {
        return {
            message: error.message,
            lineNumber: error.startLineNumber,
        };
    });
    emit("code:error", severeErrors.length > 0);
    emit("code:errors", severeErrors);
}

let timeout: number|null = null;

watch(code, () => {
    if (timeout) {
        return;
    }
    timeout = setTimeout(() => {
        checkForErrors();
        timeout = null;
    }, 1000);
}, { immediate: true });


const props = defineProps({
    readOnly: {
        type: Boolean,
        default: true,
    },
});

const { mobile } = useDisplay();
const MONACO_EDITOR_OPTIONS: editorTypes.IEditorOptions = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    readOnly: props.readOnly,
    minimap: {
        enabled: !mobile.value,
    },
    fontSize: mobile.value ? 10 : 12,
};
const handleMount = (editor: editor.IEditor) => (editorRef.value = editor);

watch(props, (newProps) => {
    if (MONACO_EDITOR_OPTIONS.readOnly !== newProps.readOnly) {
        MONACO_EDITOR_OPTIONS.readOnly = props.readOnly;
        editorRef.value?.updateOptions(MONACO_EDITOR_OPTIONS);
    }
}, { deep: true, immediate: true });
</script>

<style scoped>
#code-editor {
    height: 500px;
    width: 100%;
}
</style>
