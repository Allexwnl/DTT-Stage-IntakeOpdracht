<template>
  <NavBar/>
  <Modal/>
</template>

<script>
import NavBar from './components/NavBar-Component.vue'
import Modal from '@/components/Modal-Component.vue';


export default {
  name: 'App',
  components: {
    NavBar,
    Modal
  },
  setup() {
  }
}
</script>

<style>
/* Add global CSS here */
body {
  margin: 0;
  background-color: #f6f6ff;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}


@media (max-width: 768px) {
  h1 {
    font-size: 18px;
  }

  h2 {
    font-size: 14px;
  }
}
</style>
