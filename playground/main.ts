import { createApp } from 'vue'

import App from './App.vue'
import PlaygroundShell from './PlaygroundShell.vue'

// ?shell — окрема сторінка з KAppShell на весь екран.
const root = new URLSearchParams(location.search).has('shell') ? PlaygroundShell : App
createApp(root).mount('#app')
