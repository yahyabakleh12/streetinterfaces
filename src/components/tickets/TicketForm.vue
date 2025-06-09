<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Ticket</h1>
    <form @submit.prevent="submit">
      <label>Plate Number: <input v-model="form.plate_number" /></label>
      <label>Plate Code: <input v-model="form.plate_code" /></label>
      <label>Plate City: <input v-model="form.plate_city" /></label>
      <label>Camera ID: <input v-model="form.camera_id" type="number" /></label>
      <label>Entry Time: <input v-model="form.entry_time" /></label>
      <label>Exit Time: <input v-model="form.exit_time" /></label>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ticketService from '@/services/ticketService'

const router = useRouter()
const route  = useRoute()

const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({
  plate_number: '',
  plate_code: '',
  plate_city: '',
  camera_id: 1,
  entry_time: '',
  exit_time: ''
})

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await ticketService.get(props.id)
    Object.assign(form, data)
  }
})

async function submit() {
  if (props.isEdit) {
    await ticketService.update(props.id, form)
  } else {
    await ticketService.create(form)
  }
  router.push('/tickets')
}
</script>
