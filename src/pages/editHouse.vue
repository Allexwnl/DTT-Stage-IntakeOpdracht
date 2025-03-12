<script setup>
import { useHouseStore } from '@/stores/houseStore';
import { reactive, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const houseStore = useHouseStore();
const uploadStatus = ref('');
const route = useRoute();
const router = useRouter();

const goBack = () => {
  router.push('/');
};

// Makes the houseData reactive
const houseData = reactive({
    location: { street: '', houseNumber: '', houseNumberAddition: '', zip: '', city: '' },
    rooms: { bedrooms: '', bathrooms: '' },
    price: '',
    size: '',
    hasGarage: false,
    constructionYear: '',
    description: ''
});

// Upload image Function
const uploadImage = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        console.error("Geen bestand geselecteerd!");
        return;
    }
    console.log("Geselecteerd bestand:", file);


    const formData = new FormData();
    formData.append('image', file);
    houseData.image = formData;

    try {
        const response = await fetch(
            `https://api.intern.d-tt.nl/api/houses/${route.params.id}/upload`,
            {
                method: "POST",
                headers: {
                    "X-Api-Key": "kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm",
                },
                body: formData,
            }
        );
        if (!response.ok) throw new Error("Upload Failed");
        uploadStatus.value = 'Upload Successful';
        console.log("response:", await response.json());
    } catch (error) {
        uploadStatus.value = 'Upload Failed';
        console.error('Error uploading image:', error);
    }
};

// Fetch houseID data
onMounted(async () => {
    const houseId = route.params.id;
    try {
        const response = await fetch(`https://api.intern.d-tt.nl/api/houses/${houseId}`, {
            headers: { 'X-Api-Key': 'kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm' }
        });
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            Object.assign(houseData, {
                ...data[0],
                location: { ...houseData.location, ...data[0].location },
                rooms: { ...houseData.rooms, ...data[0].rooms }
            });
        }

    } catch (error) {
        console.error('Error fetching house data:', error);
    }
});

// Submit changes function
const submitChanges = async () => {
    const houseId = route.params.id;
    try {
        console.log('Verzonden data:', JSON.stringify(houseData, null, 2));

        const formData = new FormData();
        formData.append('price', houseData.price);
        formData.append('bedrooms', houseData.rooms.bedrooms);
        formData.append('bathrooms', houseData.rooms.bathrooms);
        formData.append('size', houseData.size);
        formData.append('streetName', houseData.location.street);
        formData.append('houseNumber', houseData.location.houseNumber);
        formData.append('numberAddition', houseData.location.houseNumberAddition);
        formData.append('zip', houseData.location.zip);
        formData.append('city', houseData.location.city);
        formData.append('constructionYear', houseData.constructionYear);
        formData.append('hasGarage', houseData.hasGarage.toString());
        formData.append('description', houseData.description);

        const response = await fetch(`https://api.intern.d-tt.nl/api/houses/${houseId}`, {
            method: 'POST',
            headers: {
                'X-Api-Key': 'kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm',
            },
            body: formData
        });

        const responseText = await response.text();
        console.log('Raw Server Response:', responseText);

        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('Parsed Server Response:', responseData);
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
        if (response.ok) {
            console.log(houseData)
            console.log('Huis succesvol aangepast!');
            console.log(houseStore.selectedHouse);
            houseStore.hardSelectHouse(houseData);
            console.log(houseStore.selectedHouse);
            router.push(
                `/house/${houseId}`
            );
        } else {
            console.error('API Error:', responseData);
        }
    } catch (error) {
        console.error('Fout bij verzenden:', error);
    }
};
</script>


<template>
    <main id="main-container">
        <div id="button-container">
            <button @click="goBack" id="goback-button">
                <img src="../assets/ic_back_grey@3x.png" alt="">
                Back to overview
            </button>
            <button @click="goBack" id="goback-button-mobile">
                <img src="../assets/ic_back_grey@3x.png" alt="">
            </button>
        </div>
        <h1>Edit Listing</h1>
        <form @submit.prevent="submitChanges">
            <div id="street-name">
                <label for="street-name">Street name*</label>
                <input type="text" id="street-input" v-model="houseData.location.street" required>
            </div>
            <div class="house-number-addition">
                <div>
                    <label for="house-number">House number*</label>
                    <input type="number" id="house-number-input" v-model="houseData.location.houseNumber" required>
                </div>
                <div>
                    <label for="number-addition">Number addition</label>
                    <input type="text" id="number-addition-input" v-model="houseData.location.houseNumberAddition">
                </div>
            </div>
            <div id="postcode">
                <label for="postal-code">Postal code*</label>
                <input type="text" id="postal-code-input" v-model="houseData.location.zip" required>
            </div>
            <div id="city">
                <label for="city">City*</label>
                <input type="text" id="city-input" v-model="houseData.location.city" required>
            </div>
            <div>
                <input id="uploadfile" type="file" @change="uploadImage"/>
                <p v-if="uploadStatus">{{ uploadStatus }}</p>
            </div>
            <div id="price">
                <label for="price">Price*</label>
                <input type="number" id="price-input" v-model="houseData.price" required>
            </div>
            <div class="house-number-addition">

            <div id="size">
                <label for="size">Size*</label>
                <input type="number" id="size-input" v-model="houseData.size" required>
            </div>
            <div id="garage">
                <label for="garage">Garage*</label>
                <select id="garage-input" v-model="houseData.hasGarage">
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                </select>
            </div>
            </div>
            <div class="house-number-addition">
                <div id="bedrooms">
                    <label for="bedrooms">Bedrooms*</label>
                    <input type="number" id="bedrooms-input" v-model="houseData.rooms.bedrooms" required>
                </div>
                <div id="bathrooms">
                    <label for="bathrooms">Bathrooms*</label>
                    <input type="number" id="bathrooms-input" v-model="houseData.rooms.bathrooms" required>
                </div>
            </div>
            <div id="construction-year">
                <label for="construction-year">Construction year*</label>
                <input type="number" id="construction-year-input" v-model="houseData.constructionYear" required>
            </div>
            <div id="description">
                <label for="description-textarea">Description</label>
                <textarea id="description-textarea-input" v-model="houseData.description"></textarea>
            </div>
            <div id="submit-button-container">
                <input id="submit-button" type="submit" value="SAVE">
            </div>
        </form>
    </main>
</template>


<style scoped>
#main-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 10%;
    background-image: url("../assets/img_background@3x.png");
    background-size: cover;
    height: 100%;
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
    cursor: pointer;
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

form div {
    margin-top: 10px;
}

#street-name,
#postcode,
#price,
#city,
#description,
#construction-year {

    display: flex;
    flex-direction: column;
    width: 350px;
}

#garage-input {
    padding: 20px;
    border-radius: 8px;
    border: none;
    margin-top: 10px;
}

#uploadfile {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
    border: dashed 3px #4A4B4C;
}

label {
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
}

input {
    padding: 20px;
    border-radius: 8px;
    border: none;
    margin-top: 10px;
}

.house-number-addition {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.house-number-addition div {
    display: flex;
    flex-direction: column;
    width: 163px;
}

#upload-button {
    border: none;
    background-color: transparent;
    border: dashed 3px #4A4B4C;
    border-radius: 8px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 135px;
    height: 135px;
    transition: border 0.3s ease-in-out;
}

/* Standaard kleine afbeelding met padding */
#upload-image {
    width: 24px;
    height: 24px;
    padding: 50px;
    object-fit: cover;
    transition: all 0.3s ease-in-out;
    border-radius: 8px;
}

/* Grotere afbeelding zonder padding zodra geüpload */
.uploaded-img {
    width: 135px !important;
    height: 135px !important;
    padding: 0 !important;
}

#description-textarea-input {
    resize: none;
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 350px;
    height: 150px;
}

#submit-button-container {
    display: flex;
    justify-content: end;
    width: 350px;
}

#submit-button {
    display: flex;
    align-items: end;
    background-color: #eb5440;
    color: #ffffff;
    border: none;
    padding: 20px;
    border-radius: 8px;
    width: 150px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    margin-bottom: 100px;
}

@media (max-width: 768px) {
    #goback-button {
        display: none;
    }

    #goback-button-mobile {
        display: flex;
        cursor: pointer;
    }
}

@media (max-width: 425px) {
    label {
        font-size: 12px;
    }

    input {
        padding: 10px;
        width: 80%;
    }

    #street-name,
    #postcode,
    #price,
    #city,
    #description,
    #construction-year {
        width: 100%;
    }

    .house-number-addition {
        width: 80%;
    }

    #description-textarea {
        width: 80%;
    }

    #description-textarea-input {
        width: 80%;
    }

    #submit-button-container {
        width: 80%;
        justify-content: start;
    }

    button img {
        width: 12px;
        height: 12px;
    }
    
}

</style>