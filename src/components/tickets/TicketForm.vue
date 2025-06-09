<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Ticket</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Plate Number</label>
        <input v-model="form.plate_number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Plate Code</label>
        <input v-model="form.plate_code" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Plate City</label>
        <input v-model="form.plate_city" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Camera ID</label>
        <input v-model="form.camera_id" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Entry Time</label>
        <input v-model="form.entry_time" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Exit Time</label>
        <input v-model="form.exit_time" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
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
