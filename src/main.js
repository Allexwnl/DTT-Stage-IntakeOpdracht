import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router'; // Import your router
import { createPinia } from 'pinia'; // Import Pinia


const app = createApp(App);
const pinia = createPinia();

app.use(router); // Add the router to your app
app.use(pinia);
app.mount('#app');
 