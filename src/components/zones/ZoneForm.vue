<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Zone</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Code</label>
        <input v-model="form.code" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Location ID</label>
        <input v-model="form.location_id" type="number" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
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
