import { createRouter, createWebHistory } from 'vue-router';

// Import your components (pages)
import HomePage from '../pages/HomePage.vue';
import AboutPage from '../pages/AboutmePage.vue';
import HouseDetail from '../pages/HouseDetail.vue';
import HouseList from '../pages/CreateNewListing.vue';
import EditHouse from '../pages/editHouse.vue';

//routes
const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/house/:id', name: 'HouseDetail', component: HouseDetail },
  { path: '/createnewlisting', name: 'CeateNewListing', component: HouseList },
  { path: '/edit/:id', name: 'editHouse', component: EditHouse },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
