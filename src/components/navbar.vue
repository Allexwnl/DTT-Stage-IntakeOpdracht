<template>
  <header>
    <nav id="navbar">
      <img src="@/assets/img_logo_dtt@3x.png" alt="logo">
      <ul id="desktop-menu">
        <li><router-link to="/" :class="{ active: isActive('Home') }">Houses</router-link></li>
        <li><router-link to="/about" :class="{ active: isActive('About') }">About</router-link></li>
      </ul>
      <ul id="mobile-menu">
        <li>
          <router-link to="/" :class="{ active: isActive('Home') }">
            <img :src="isActive('Home') ? activeHomeIcon : homeIcon" alt="home">
          </router-link>
        </li>
        <li>
          <router-link to="/about" :class="{ active: isActive('About') }">
            <img :src="isActive('About') ? activeInfoIcon : infoIcon" alt="info">
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
  <router-view />
</template>

<script setup>
import { computed } from 'vue';
import { useHouseStore } from '@/stores/houseStore';
import homeIcon from '@/assets/ic_mobile_navigarion_home@3x.png';
import activeHomeIcon from '@/assets/ic_mobile_navigarion_home_active@3x.png';
import infoIcon from '@/assets/ic_mobile_navigarion_info@3x.png';
import activeInfoIcon from '@/assets/ic_mobile_navigarion_info_active@3x.png';

const houseStore = useHouseStore();

// Define isActive as a computed function
const isActive = computed(() => (routeName) => houseStore.activeRoute === routeName);
</script>



<style scoped>
#mobile-menu {
  display: none;
}

#navbar {
  font-family: 'Montserrat Semibold', sans-serif;
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  gap: 10px;
  list-style: none;
}

#navbar img {
  width: 10.8rem;
}

#desktop-menu {
  display: flex;
  flex-direction: row;
  width: 50%;
  gap: 30px;
  list-style: none;
}

.router-link-active {
  color: #000000;
}

a {
  font-size: x-large;
  text-decoration: none;
  color: #4A4B4C;
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
}

a:hover {
  color: #000000;
}

@media (max-width: 768px) {
  #navbar {
    top: auto;
    position: fixed;
    bottom: 0;
    background-color: transparent;
    box-shadow: none;
  }

  #mobile-menu {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    list-style: none;
    background-color: #ffffff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin: 0;
    padding: 0;
  }

  #mobile-menu li {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    padding: 10px;
  }

  #mobile-menu img {
    gap: 20px;
    width: 40px;
  }

  #desktop-menu {
    display: none;
  }

  #navbar ul {
    justify-content: center;
  }

  #navbar ul {
    width: 100%;
    justify-content: center;
  }

  #navbar [alt="logo"] {
    display: none;
  }
}
</style>
