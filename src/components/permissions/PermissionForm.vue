<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Permission</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="form.name" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import permissionService from '@/services/permissionService'

const router = useRouter()
const props = defineProps({ isEdit: Boolean, id: Number })

const form = reactive({ name: '' })

onMounted(async () => {
  if (props.isEdit) {
    const { data } = await permissionService.get(props.id)
    form.name = data.name
  }
})

async function submit() {
  if (props.isEdit) {
    await permissionService.update(props.id, form)
  } else {
    await permissionService.create(form)
  }
  router.push('/permissions')
}
</script>
