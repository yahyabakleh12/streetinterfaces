<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Pole</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Zone ID</label>
        <input v-model="form.zone_id" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Code</label>
        <input v-model="form.code" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Location ID</label>
        <input v-model="form.location_id" type="number" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label"># Cameras</label>
        <input v-model="form.number_of_cameras" type="number" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
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
