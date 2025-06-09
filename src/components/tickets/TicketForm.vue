<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Ticket</h1>
    <form @submit.prevent="submit">
      <label>Plate: <input v-model="form.plate" /></label>
      <label>Status: <input v-model="form.status" /></label>
      <label>Amount: <input v-model="form.amount" type="number" /></label>
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
  plate: '',
  status: '',
  amount: 0
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
