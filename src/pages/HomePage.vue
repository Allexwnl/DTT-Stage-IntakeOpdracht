<script setup>
import { useHouseStore } from '@/stores/houseStore';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ModalComponent from '@/components/Modal-Component.vue';

// Store and router and other variables
const houseStore = useHouseStore();
const router = useRouter();
const activeFilter = ref('price');
const isMobile = ref(window.innerWidth <= 768)
const houseToDelete = ref(null);



// Fetch houses if not already loaded
if (!houseStore.houses.length) {
  fetch('https://api.intern.d-tt.nl/api/houses', {
    headers: {
      'X-Api-Key': 'kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      houseStore.setHouses(data);
    });
}

// Navigate to the house detail page
const viewDetails = (houseId) => {
  houseStore.selectHouse(houseId);
  router.push(`/house/${houseId}`);
};

// Checks screenwidth when resizing
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

// Event listeners for screensize
onMounted(() => window.addEventListener("resize", checkScreenSize));
onUnmounted(() => window.removeEventListener("resize", checkScreenSize));

const filteredHouses = computed(() => {
  let result = houseStore.houses;

  if (houseStore.search) {
    result = result.filter((house) =>
      house.location.street.toLowerCase().includes(houseStore.search.toLowerCase()) ||
      house.location.city.toLowerCase().includes(houseStore.search.toLowerCase()) ||
      house.location.zip.toLowerCase().includes(houseStore.search.toLowerCase())
    );
  }

  if (activeFilter.value === "price") {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (activeFilter.value === "size") {
    result = [...result].sort((a, b) => b.size - a.size);
  }

  return result;
});

// hide filter if width is less than 768px and search input is active
const showFilters = computed(() => {
  return !(isMobile.value && houseStore.search);
});

const clearInput = () => {
  houseStore.search = '';
};

// Handle filter button click
const applyFilter = (filter) => {
  activeFilter.value = filter; // Set the clicked filter as active
};

// Result count
const resultCount = computed(() => filteredHouses.value.length);

const editHouse = (houseId) => {
  router.push(`/edit/${houseId}`);
};

const openDeleteModal = (houseId) => {
    houseToDelete.value = houseId;
};

// Delete listing function
const deleteHouse = () => {
    if (houseToDelete.value) {
        fetch(`https://api.intern.d-tt.nl/api/houses/${houseToDelete.value}`, {
            method: 'DELETE',
            headers: {
                'X-Api-Key': 'kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm',
            },
        })
            .then((response) => {
                if (response.ok) {
                    houseStore.removeHouse(houseToDelete.value);
                } else {
                    alert('Er is een fout opgetreden bij het verwijderen van het huis.');
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Er is een fout opgetreden bij het verwijderen van het huis.');
            })
            .finally(() => {
                houseToDelete.value = null;
            });
    }
};
</script>

<template>
  <div id="container">
    <div id="title-createNew">
      <h1>Houses</h1>
      <button id="desktop-createNew-button"><router-link to="/createnewlisting" id="create-new-link"><img
            src="../assets/ic_plus_white@3x.png" alt="">
          CREATE NEW</router-link></button>
      <button id="mobile-createNew-button"><router-link to="/createnewlisting" id="create-new-link">
          <img src="../assets/ic_plus_grey@3x.png" alt=""></router-link></button>
    </div>

    <div id="search">
      <div id="searchbarcontainer">
        <img src="../assets/ic_search@3x.png" alt="searchIcon" />
        <input v-model="houseStore.search" id="searchbar" type="text" placeholder="Search for a house" />
        <button v-if="houseStore.search" @click="clearInput" id="clear-button">
          <img src="../assets/ic_clear@3x.png" alt="clear" />
        </button>
      </div>

      <!-- Filters verdwijnen op mobiel bij input -->
      <div id="filterbuttons" v-if="showFilters">
        <button :class="{ active: activeFilter === 'price' }" @click="applyFilter('price')">Price</button>
        <button :class="{ active: activeFilter === 'size' }" @click="applyFilter('size')">Size</button>
      </div>
    </div>


    <!-- Result count -->
    <div id="result-count">
      <h2 v-if="resultCount > 0">{{ resultCount }} results found</h2>
      <div v-else id="noresultsimg-container">
        <img src="../assets/img_empty_houses@3x.png" alt="No results" id="noresultsimg" />
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="houseStore.error" class="error">{{ houseStore.error }}</div>

    <div class="no-result" v-else-if="filteredHouses.length === 0">
      <p>No results found.</p>
      <p>Please try another keyword</p>
    </div>
    <!-- Empty state if no results -->

    <!-- Houses List -->
    <ul v-else id="Houses">
      <li v-for="house in filteredHouses" :key="house.id" @click="viewDetails(house.id)">
        <div id="housecontainer">
          <div id="house-image-container">
            <img :src="house.image" alt="Huis-afbeelding" width="150" />
          </div>
          <div id="house-details-container">
            <div>
              <h2>
                {{ house.location.street }} {{ house.location.houseNumber }}
              </h2>
              <p>€ {{ house.price.toLocaleString() }}</p>
              <p id="postcode">
                {{ house.location.zip }} {{ house.location.city }}
              </p>
            </div>
            <div id="houseDetails">
              <div class="bedrooms">
                <img src="../assets/ic_bed@3x.png" alt="" />
                <p>{{ house.rooms.bedrooms }}</p>
              </div>
              <div class="bathrooms">
                <img src="../assets/ic_bath@3x.png" alt="" />
                <p>{{ house.rooms.bathrooms }}</p>
              </div>
              <div class="size">
                <img src="../assets/ic_size@3x.png" alt="" />
                <p>{{ house.size }} m²</p>
              </div>
            </div>
          </div>
          <div id="admin-buttons-mobile">
            <button v-if="house.madeByMe" @click.stop="editHouse(house.id)"><img src="../assets/ic_edit@3x.png"
                alt=""></button>
            <button v-if="house.madeByMe" @click.stop="deleteHouse(house.id)"><img src="../assets/ic_delete@3x.png"
                alt=""></button>
          </div>
          <div id="admin-buttons">
            <button v-if="house.madeByMe" @click.stop="editHouse(house.id)"><img src="../assets/ic_edit@3x.png"
                alt=""></button>
            <button v-if="house.madeByMe" @click.stop="openDeleteModal(house.id)"><img src="../assets/ic_delete@3x.png"
                alt=""></button>
              </div>
            </div>
          </li>
          <ModalComponent :show="houseToDelete !== null" @confirm="deleteHouse" @cancel="houseToDelete = null" />
    </ul>

  </div>
</template>




<style scoped>
#title-createNew {
  display: flex;
  justify-content: space-between;
  width: 80%;
  align-items: center;
  margin-left: 10%;
}

#desktop-createNew-button {
  display: flex;
  flex-direction: row;
  text-align: center;
  background-color: #eb5440;
  border: none;
  padding: 10px;
  padding-right: 20px;
  border-radius: 8px;
}

#desktop-createNew-button img {
  width: 20px;
}

#mobile-createNew-button {
  display: none;
}

#title-createNew a {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  gap: 5px;
}

#create-new-link {
  text-decoration: none;
  color: #000000;
}

#search {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  margin-left: 10%;
}

#searchbarcontainer {
  display: flex;
  align-items: center;
  background-color: #e8e8e8;
  border-radius: 8px;
  width: 40%;
}

#searchbarcontainer img {
  margin-left: 10px;
  width: 24px;
  height: 24px;
}

#searchbar {
  padding: 20px;
  width: 100%;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #e8e8e8;
}

#clear-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  margin-right: 30px;
}

#result-count {
  margin-left: 10%;
}

#noresultsimg-container {
  display: flex;
  justify-content: center;
}

.no-result {
  text-align: center;
  margin-top: 50px;
}

#noresultsimg {
  display: flex;
  width: 300px;
  margin-top: 20px;
  align-items: center;
}

#filterbuttons {
  display: inline-flex;
  border-radius: 5px;
  overflow: hidden;
}

#filterbuttons button {
  padding: 10px 20px;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: #c3c3c3;
  color: #ffffff;
  font-size: 16px;
  width: 50%;
}

#filterbuttons button:first-child {
  border-right: 1px solid #c3c3c3;
}

#filterbuttons button.active {
  background-color: #eb5440;
  color: white;
}

#container {
  margin-top: 200px;
}

.error {
  color: red;
  font-weight: bold;
}

#Houses {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin-bottom: 50px;
}

li {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 80%;
  background-color: #fff;
  border-radius: 8px;
  transition: 0.5s ease-in-out;
}

li:hover {
  transform: scale(1.06);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#housecontainer {
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 20px;
  width: 100%;
}

li img {
  display: block;
  border-radius: 8px;
  width: 150px;
  height: 150px;
}

#postcode {
  font-size: 0.8rem;
  color: #666;
}

#houseDetails {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#houseDetails img {
  width: 20px;
  height: 20px;
}

.bedrooms,
.bathrooms,
.size {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #666;
  gap: 5px;
}

.size {
  width: 100px;
}

#admin-buttons {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: end;
  gap: 10px;
  width: 100%;
  margin-right: 50px;
}

#admin-buttons button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

#admin-buttons button img {
  width: 18px;
  height: 18px;
}

#admin-buttons-mobile {
  display: none;
}

@media (max-width: 768px) {
  li {
    width: 95%;
    transition: none;

  }

  li:hover {
    transform: none;
  }

  #container {
    margin-top: 20px;
  }

  button img {
    width: 18px;
    height: 18px;
  }

  #title-createNew {
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 20px;
  }

  #title-createNew h1 {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }

  #desktop-createNew-button {
    padding: 10px;
    padding-right: 20px;
    border-radius: 8px;
    display: none;
  }

  #mobile-createNew-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    padding: 10px;
    border-radius: 8px;
    margin-left: 95%;
  }

  #search {
    align-items: center;
    flex-direction: column;
    gap: 50px;
  }

  #searchbarcontainer {
    width: 120%;
  }

  #searchbar {
    padding: 14px;
  }

  #filterbuttons {
    width: 100%;
  }

  li img[alt="Huis-afbeelding"] {
    width: 90px;
    height: 90px;
  }

  #housecontainer {
    flex-direction: row;
    gap: 10px;
    width: 90%;
  }

  #house-image-container {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 10px;
  }

  #postcode {
    width: 100%;
  }

  #admin-buttons {
    display: none;
  }

  #admin-buttons-mobile {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: start;
    width: 100%;
    gap: 10px;
    position: absolute;
    left: -11%;
  }

  #admin-buttons-mobile button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

@media (max-width: 425px) {
  button img {
    width: 12px;
    height: 12px;
  }

  #houseDetails img {
    width: 12px;
    height: 12px;
  }
}
</style>
