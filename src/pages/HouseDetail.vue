<script setup>
import { onMounted, onActivated, ref } from 'vue';
import { useHouseStore } from '@/stores/houseStore';
import { useRouter } from 'vue-router';
import ModalComponent from '@/components/Modal-Component.vue';

// Store en router
const houseStore = useHouseStore();
const router = useRouter();
const houseToDelete = ref(null);

// Navigation functions
const goBack = () => {
  router.push('/');
};

// Fetch data function
const fetchData = async () => {
  console.log('Data wordt opgehaald...');
  try {
    await houseStore.fetchHouses();
    console.log('Data opgehaald:', houseStore.houses);
    console.log('selectedHouse data:', houseStore.selectedHouse);
    
  } catch (error) {
    console.error('Fout bij ophalen data:', error);
  }
};

// View details function
const viewDetails = (houseId) => {
  houseStore.selectHouse(houseId);
  router.push(`/house/${houseId}`);
};

onMounted(() => {
  console.log('onMounted triggered');
  fetchData();
});

onActivated(() => {
  console.log('onActivated triggered');
  fetchData();
});

// edit house function
const editHouse = (houseId) => {
  router.push(`/edit/${houseId}`);
};

// funnction to confirm the delete
const confirmDelete = (houseId) => {
  houseToDelete.value = houseId;
};

// Delete house function
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
          router.push('/');
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
    <div id="button-container">
      <button @click="goBack" id="goback-button">
        <img src="../assets/ic_back_grey@3x.png" alt="">
        Back to overview
      </button>
      <button @click="goBack" id="goback-button-mobile">
        <img src="../assets/ic_back_white@3x.png" alt="">
      </button>
    </div>
    <section id="house-card-and-recommended">
      <div id="house-card" v-if="houseStore.selectedHouse">
        <img :src="houseStore.selectedHouse.image" alt="Huis afbeelding" width="300" />
        <div id="house-info">
          <div id="house-name-and-admin-buttons">
            <h1>
              {{ houseStore.selectedHouse.location.street }}
              {{ houseStore.selectedHouse.location.houseNumber }}
            </h1>
            <div id="admin-buttons">
              <button v-if="houseStore.selectedHouse.madeByMe"
                      @click.stop="editHouse(houseStore.selectedHouse.id)">
                <img src="../assets/ic_edit@3x.png" alt="">
              </button>
              <button v-if="houseStore.selectedHouse.madeByMe"
                      @click.stop="confirmDelete(houseStore.selectedHouse.id)">
                <img src="../assets/ic_delete@3x.png" alt="">
              </button>
            </div>
          </div>
          <div id="postcode">
            <img src="../assets/ic_location@3x.png" alt="" class="icons">
            <p>
              {{ houseStore.selectedHouse.location.zip }}
              {{ houseStore.selectedHouse.location.city }}
            </p>
          </div>
          <div id="price-size-year-container">
            <div id="price">
              <img src="../assets/ic_price@3x.png" alt="" class="icons">
              <p>€ {{ houseStore.selectedHouse.price.toLocaleString() }}</p>
            </div>
            <div id="size">
              <img src="../assets/ic_size@3x.png" alt="" class="icons">
              <p>{{ houseStore.selectedHouse.size }} m²</p>
            </div>
            <div id="construction-year">
              <img src="../assets/ic_construction_date@3x.png" alt="" class="icons">
              <p>Built in {{ houseStore.selectedHouse.constructionYear }}</p>
            </div>
          </div>
          <div id="bedrooms-bathrooms-garage-container">
            <div id="bedrooms">
              <img src="../assets/ic_bed@3x.png" alt="" class="icons">
              <p>{{ houseStore.selectedHouse.rooms.bedrooms }}</p>
            </div>
            <div id="bathrooms">
              <img src="../assets/ic_bath@3x.png" alt="" class="icons">
              <p>{{ houseStore.selectedHouse.rooms.bathrooms }}</p>
            </div>
            <div id="garage">
              <img src="../assets/ic_garage@3x.png" alt="" class="icons">
              <p>{{ houseStore.selectedHouse.hasGarage }}</p>
            </div>
          </div>
          <p>{{ houseStore.selectedHouse.description }}</p>
        </div>
        <ModalComponent
          :show="houseToDelete !== null"
          @confirm="deleteHouse"
          @cancel="houseToDelete = null"
        />
      </div>

      <div id="Recommended-container">
        <div v-if="houseStore.isLoading">Laden...</div>

        <div v-if="houseStore.error">{{ houseStore.error }}</div>

        <h1>Recommended for you</h1>
        <ul id="recommended-houses-container" v-if="houseStore.randomHouses.length">
          <li
            v-for="house in houseStore.randomHouses"
            :key="house.id"
            class="house-item"
            @click="viewDetails(house.id)"
          >
            <div id="housecontainer">
              <div id="house-image-container">
                <img class="recommended-house" :src="house.image" alt="recommended-huis-afbeelding" width="150" />
              </div>
              <div id="house-details-container">
                <div>
                  <h2>
                    {{ house.location.street }} {{ house.location.houseNumber }}
                  </h2>
                  <p>€ {{ house.price }}</p>
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
              <div id="recommended-admin-buttons">
                <button v-if="house.madeByMe" @click.stop="editHouse(house.id)">
                  <img src="../assets/ic_edit@3x.png" alt="">
                </button>
                <button v-if="house.madeByMe" @click.stop="confirmDelete(house.id)">
                  <img src="../assets/ic_delete@3x.png" alt="">
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>



<style scoped>
button {
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
    font-size: 16px;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-left: 10%;
}

#house-card-and-recommended {
    display: flex;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 70px;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
}

#Recommended-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
}

#Recommended-container h1 {
    margin-left: 45px;
}

#recommended-houses-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
}

#button-container {
    display: flex;
    margin-top: 100px;
    border: none;
    background-color: transparent;
}

#goback-button {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
}

#goback-button-mobile {
    display: none;
    background-color: transparent;
    border: none;
    margin-top: -80px;
}

#button-container img {
    margin-right: 10px;
    width: 16px;
    height: 16px;
}

#house-card {
    margin-top: 20px;
    background-color: #fff;
    width: 700px;
}

#house-info {
    padding: 20px;
}

#house-name-and-admin-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

#price-size-year-container,
#bedrooms-bathrooms-garage-container {
    display: flex;
    flex-direction: row;
}

#postcode,
#price,
#size,
#construction-year,
#bedrooms,
#bathrooms,
#garage {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #4A4B4C;

}

.icons {
    width: 15px;
    margin-right: 10px;
    margin-left: 10px;
}

p {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    font-size: 16px;
}

h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 24px;
}

img[alt="Huis afbeelding"] {
    width: 100%;
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
    width: 430px;
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
    height: 150px;
}

#house-details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#house-details-container h2 {
    font-size: 22px;
}

li img {
    display: block;
    border-radius: 8px;
    width: 120px;
    height: 120px;
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
    gap: 10px;
    margin-right: 50px;
}

#admin-buttons button,
#recommended-admin-buttons button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

#admin-buttons button img,
#recommended-admin-buttons img {
    width: 18px;
    height: 18px;
}

#admin-buttons-mobile {
    display: none;
}

@media (max-width: 768px) {
    h1 {
        font-size: 18px;
    }

    h2,
    #house-details-container h2 {
        font-size: 14px;
    }

    li {
        width: 100%;
    }

    li:hover {
        transform: none;
    }

    #goback-button {
        display: none;
    }

    #goback-button-mobile {
        display: flex;
        margin-left: 40px;
    }

    #Recommended-container {
        width: 80%;
    }

    img[alt="Huis afbeelding"] {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
    }

    #container {
        width: 100%;
        margin-left: 0;
    }

    #house-card {
        margin-top: 20%;
        width: 100%;
        border-radius: 50px 50px 0px 0px;
    }

    #huis-info {
        width: 100%;
    }

    #admin-buttons {
      position: absolute;
      top: 20px;
      right: 10px;
    }

    #recommended-house-container {
        align-items: start;
    }

    #housecontainer {
        padding: 10px;
    }

    #house-card-and-recommended {
        justify-content: start;
    }

    #recommended-admin-buttons {
        display: none;
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

    #house-card {
        margin-top: 5%;
    }
}
</style>