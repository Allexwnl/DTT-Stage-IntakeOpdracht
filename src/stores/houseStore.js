import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useHouseStore = defineStore('house', {
  state: () => ({
    houses: reactive([]), // Alle huizen
    randomHouses: reactive([]), // Willekeurige huizen
    search: ref(''),
    activeFilter: 'price',
    selectedHouse: null,
    isLoading: ref(false), // Loading state voor API-aanroep
    error: ref(null),
  }),
  actions: {
    // Haal de huizen op via de API
    async fetchHouses() {
      this.isLoading = true; // Zet de loading state aan
      try {
        const response = await fetch('https://api.intern.d-tt.nl/api/houses', {
          headers: {
            'X-Api-Key': 'kjo_cVgHWNKfxQG16JYwyDdMsC3XzSRm',
          },
        });
        const data = await response.json();
        this.setHouses(data); // Update de lijst van huizen
        this.setRandomHouses(); // Kies willekeurige huizen
      } catch (error) {
        console.error('Fout bij het ophalen van huizen:', error);
        this.error = 'Er is een fout opgetreden bij het ophalen van de huizen.';
      } finally {
        this.isLoading = false; // Zet de loading state uit
      }
    },

    // Update de huizenlijst in de state
    setHouses(houses) {
      console.log('update store met huizen', houses);
      this.houses.splice(0, this.houses.length, ...houses);
    },

    // Kies willekeurige huizen uit de lijst
    setRandomHouses() {
      const randomHouses = this.houses
        .sort(() => 0.5 - Math.random()) // Shuffle de lijst van huizen
        .slice(0, 3); // Selecteer de eerste 3 huizen
      this.randomHouses.splice(0, this.randomHouses.length, ...randomHouses); // Sla de willekeurige huizen op
    },

    // Selecteer een specifiek huis
    async selectHouse(houseId) {
      this.selectedHouse = this.houses.find((house) => house.id === houseId) || null;
    },

    hardSelectHouse(house) {
      this.selectedHouse = house;
    },

    // Pas een filter toe
    applyFilter(filter) {
      this.activeFilter = filter;
    },

    // Verwijder een huis
    removeHouse(houseId) {
      const index = this.houses.findIndex((house) => house.id === houseId);
      if (index !== -1) {
        this.houses.splice(index, 1);
      }
    },
  },
});
