<script setup>
import { reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import { useHouseStore } from '@/stores/houseStore';
import uploadIcon from "@/assets/ic_upload@3x.png";

const goBack = () => {
    router.push('/');
};

// variables
const fileInput = ref(null);
const router = useRouter();
const imageFile = ref(null);
const imagePreview = ref(uploadIcon);
const isImageUploaded = ref(false);
const uploadStatus = ref('');
const houseStore = useHouseStore();

// Reactive object for form data
const houseData = reactive({
    streetName: "",
    houseNumber: "",
    numberAddition: "",
    zip: "",
    city: "",
    price: "",
    size: "",
    hasGarage: "",
    bedrooms: "",
    bathrooms: "",
    constructionYear: "",
    description: "",
    file: null,
});

// Function to select file input
const triggerFileInput = () => {
    fileInput.value.click();
};

// Functie to load image preview
const handleFileUpload = (event) => {
    houseData.file = event.target.files[0];
    if (houseData.file) {
        console.log("Geselecteerd bestand:", houseData.file); // Debugging
        imageFile.value = houseData.file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
            isImageUploaded.value = true;
        };
        reader.readAsDataURL(houseData.file);
    }
};

// upload image function
const uploadImage = async (id) => {
    const file = houseData.file;
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
            `https://api.intern.d-tt.nl/api/houses/${id}/upload`,
            {
                method: "POST",
                headers: {
                    "X-Api-Key": "kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm",
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload Failed: ${errorText}`);
        }

        // chekcs if the response is JSON
        const responseText = await response.text();
        if (responseText) {
            try {
                const jsonData = JSON.parse(responseText);
                console.log("response:", jsonData);
            } catch (parseError) {
                console.error("Fout bij het parsen van JSON:", parseError);
            }
        } else {
            console.log("Geen response content ontvangen.");
        }
        uploadStatus.value = 'Upload Successful';
    } catch (error) {
        uploadStatus.value = 'Upload Failed';
        console.error('Error uploading image:', error);
    }
};


// API-function to create a house
const createHouse = async (formData) => {
    try {
        const response = await fetch("https://api.intern.d-tt.nl/api/houses", {
            method: "POST",
            headers: { "X-Api-Key": "kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm" },
            body: formData,
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            if (!response.ok) throw new Error(data.message || "Fout bij het aanmaken van het huis");
            return data;
        } catch {
            throw new Error(`Ongeldige API-respons: ${text}`);
        }
    } catch (error) {
        console.error("API Fout:", error.message);
        return null;
    }
};


// send form data to API
const submitHouse = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.keys(houseData).forEach((key) => {
        formData.append(key, houseData[key]);
    });

    if (imageFile.value) {
        formData.append("image", imageFile.value);
    }

    const response = await createHouse(formData);

    if (response) {
        await uploadImage(response.id);
        alert("Huis succesvol toegevoegd!");
        console.log('hiiiiiiiiiiiiii');
        houseStore.hardSelectHouse(response);
        router.push(`/house/${response.id}`);
        console.log("Succesvolle respons:", response);
    } else {
        alert("Er is iets misgegaan. Probeer opnieuw.");
    }

    if (imageFile.value) {
        formData.append("image", imageFile.value);
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
        <h1>Create new listing</h1>
        <form @submit="submitHouse">
            <div id="street-name">
                <label for="street-name">Street name*</label>
                <input type="text" v-model="houseData.streetName" placeholder="Enter the street name" required>
            </div>
            <div class="house-number-addition">
                <div>
                    <label for="house-number">House number*</label>
                    <input type="number" v-model="houseData.houseNumber" placeholder="Enter house number" required>
                </div>
                <div>
                    <label for="number-addition">Number addition*</label>
                    <input type="text" v-model="houseData.numberAddition" placeholder="e.g. A" required>
                </div>
            </div>
            <div id="postcode">
                <label for="postal-code">Postal code*</label>
                <input type="text" v-model="houseData.zip" placeholder="e.g. 1000 AA" required>
            </div>
            <div id="city">
                <label for="city">City*</label>
                <input type="text" v-model="houseData.city" placeholder="e.g. Utrecht" required>
            </div>
            <div id="upload">
                <label for="upload-image-input">Upload picture (PNG or JPG)*</label>
                <button id="upload-button" @click="triggerFileInput" :class="{ 'uploaded': isImageUploaded }">
                    <img :src="imagePreview" alt="Upload Preview" id="upload-image"
                        :class="{ 'uploaded-img': isImageUploaded }">
                    <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" required hidden>
                </button>
            </div>
            <div id="price">
                <label for="price">Price*</label>
                <input type="number" v-model="houseData.price" placeholder="Enter price" required>
            </div>
            <div class="house-number-addition">
                <div>
                    <label for="size">Size*</label>
                    <input type="number" v-model="houseData.size" placeholder="Enter size" required>
                </div>
                <div>
                    <label for="garage">Garage*</label>
                    <select id="garage-input" v-model="houseData.hasGarage" required>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>
            <div class="house-number-addition">
                <div>
                    <label for="bedrooms">Bedrooms*</label>
                    <input type="text" v-model="houseData.bedrooms" placeholder="Enter bedrooms" required>
                </div>
                <div>
                    <label for="bathrooms">Bathrooms*</label>
                    <input type="text" v-model="houseData.bathrooms" placeholder="Enter bathrooms" required>
                </div>
            </div>
            <div id="construction-date">
                <label for="construction-year">Construction date*</label>
                <input type="number" v-model="houseData.constructionYear" placeholder="e.g. 2000" required>
            </div>
            <div id="description">
                <label for="description-textarea">Description</label>
                <textarea id="description-textarea" v-model="houseData.description"
                    placeholder="Enter description"></textarea>
            </div>
            <div id="submit-button-container">
                <input id="submit-button" type="submit" value="Post">
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
#construction-date {

    display: flex;
    flex-direction: column;
    width: 350px;
}

#upload {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
}

#garage-input {
    padding: 20px;
    border-radius: 8px;
    border: none;
    margin-top: 10px;
}   

img[alt="Upload-Preview"] {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: fill;
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

#description-textarea {
    resize: none;
    padding: 20px;
    border-radius: 8px;
    border: none;
    width: 340px;
    height: 150px;
}

#description label {
    margin-bottom: 20px;
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

@media (max-width:768px) {
    #goback-button {
        display: none;
    }

    #goback-button-mobile {
        display: flex;
        cursor: pointer;
    }

    #description-textarea {
        width: 80%;
    }

    #submit-button-container {
        justify-content: start;
        width: auto;
    }

    #street-name,
    #postcode,
    #price,
    #city,
    #description,
    #construction-date {
        width: 80%;
    }

    .house-number-addition div {
        width: 30%;
    }
}

@media (max-width:425px) {
    button img {
        width: 12px;
        height: 12px;
    }
}
</style>