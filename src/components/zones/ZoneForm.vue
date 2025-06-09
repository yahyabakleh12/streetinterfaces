<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Zone</h1>
    <form @submit.prevent="submit">
      <label>Code: <input v-model="form.code" /></label>
      <label>Location ID: <input v-model="form.location_id" type="number" /></label>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import zoneService from '@/services/zoneService'

const router = useRouter()
const route  = useRoute()

const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({
  code: '',
  location_id: 1
})

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await zoneService.get(props.id)
    Object.assign(form, data)
  }
})

async function submit() {
  if (props.isEdit) {
    await zoneService.update(props.id, form)
  } else {
    await zoneService.create(form)
  }
  router.push('/zones')
}
</script>
