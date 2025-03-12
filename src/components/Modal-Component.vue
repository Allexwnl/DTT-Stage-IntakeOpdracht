<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h1>Delete listing</h1>
      <p>Are you sure you want to delete this listing? This action cannot be undone.
      </p>
      <div class="modal-buttons">
        <button @click.stop="emitConfirm" class="btn-confirm">YES, DELETE</button>
        <button @click="emitCancel" class="btn-cancel">GO BACK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
/* globals defineProps, defineEmits */

// If you don't use the props in the script, you can simply call defineProps without assigning it:
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const emitConfirm = () => {
  emit('confirm');
  router.push('/');
};

function emitCancel() {
  emit('cancel');
}
</script>

<style scoped>
p {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  width: 50%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(52, 51, 51, 0.5);
  /* Zwarte achtergrond met 20% opacity */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 60px;
  border-radius: 8px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 400px;
}

.btn-confirm {
  width: 90%;
  background: #EB5440;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}

.btn-cancel {
  width: 90%;
  background: #4A4B4C;
  color: #fff;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}
</style>