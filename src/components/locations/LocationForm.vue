<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Location</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="form.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Code</label>
        <input v-model="form.code" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Portal Name</label>
        <input v-model="form.portal_name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Portal Password</label>
        <input v-model="form.portal_password" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">IP Schema</label>
        <input v-model="form.ip_schema" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Parkonic API Token</label>
        <input v-model="form.parkonic_api_token" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Camera User</label>
        <input v-model="form.camera_user" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Camera Password</label>
        <input v-model="form.camera_pass" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
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
  ip_schema: '',
  parkonic_api_token: '',
  camera_user: '',
  camera_pass: ''
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
