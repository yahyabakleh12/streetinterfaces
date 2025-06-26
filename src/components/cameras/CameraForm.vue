<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Camera</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Pole ID</label>
        <input v-model="form.pole_id" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Portal ID</label>
        <input v-model="form.portal_id" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">API Code</label>
        <input v-model="form.api_code" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">IP</label>
        <input v-model="form.p_ip" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label"># Spots</label>
        <input v-model="form.number_of_parking" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">VPN IP</label>
        <input v-model="form.vpn_ip" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import cameraService from '@/services/cameraService'

const router = useRouter()
const route  = useRoute()

// props: isEdit (Boolean), id (Number)
const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({
  pole_id: 1,
  portal_id: 1,
  api_code: '',
  p_ip: '',
  number_of_parking: 0,
  vpn_ip: ''
})

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await cameraService.get(props.id)
    Object.assign(form, data)
  }
})

async function submit() {
  if (props.isEdit) {
    await cameraService.update(props.id, form)
  } else {
    await cameraService.create(form)
  }
  router.push('/cameras')
}
</script>
