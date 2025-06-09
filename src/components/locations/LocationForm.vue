<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Location</h1>
    <form @submit.prevent="submit">
      <label>Name: <input v-model="form.name" /></label>
      <label>Code: <input v-model="form.code" /></label>
      <label>Portal Name: <input v-model="form.portal_name" /></label>
      <label>Portal Password: <input v-model="form.portal_password" /></label>
      <label>IP Schema: <input v-model="form.ip_schema" /></label>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import locationService from '@/services/locationService'

const router = useRouter()
const route  = useRoute()

const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({
  name: '',
  code: '',
  portal_name: '',
  portal_password: '',
  ip_schema: ''
})

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await locationService.get(props.id)
    Object.assign(form, data)
  }
})

async function submit() {
  if (props.isEdit) {
    await locationService.update(props.id, form)
  } else {
    await locationService.create(form)
  }
  router.push('/locations')
}
</script>
