<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Pole</h1>
    <form @submit.prevent="submit">
      <label>Zone ID: <input v-model="form.zone_id" type="number" /></label>
      <label>Code: <input v-model="form.code" /></label>
      <label>Location ID: <input v-model="form.location_id" type="number" /></label>
      <label># Cameras: <input v-model="form.number_of_cameras" type="number" /></label>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import poleService from '@/services/poleService'

const router = useRouter()
const route  = useRoute()

const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({
  zone_id: 1,
  code: '',
  location_id: 1,
  number_of_cameras: 0
})

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await poleService.get(props.id)
    Object.assign(form, data)
  }
})

async function submit() {
  if (props.isEdit) {
    await poleService.update(props.id, form)
  } else {
    await poleService.create(form)
  }
  router.push('/poles')
}
</script>
