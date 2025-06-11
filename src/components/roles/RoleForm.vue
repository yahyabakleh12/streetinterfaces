<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} Role</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="form.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Permissions</label>
        <select v-model="form.permission_ids" multiple class="form-select">
          <option v-for="p in permissions" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import roleService from '@/services/roleService'
import permissionService from '@/services/permissionService'

const router = useRouter()
const props = defineProps({ isEdit: Boolean, id: Number })

const permissions = ref([])
const form = reactive({
  name: '',
  permission_ids: []
})

onMounted(async () => {
  const { data: permData } = await permissionService.getAll()
  permissions.value = permData
  if (props.isEdit) {
    const { data } = await roleService.get(props.id)
    form.name = data.name
    form.permission_ids = (data.permissions || []).map(p => p.id)
  }
})

async function submit() {
  if (props.isEdit) {
    await roleService.update(props.id, form)
  } else {
    await roleService.create(form)
  }
  router.push('/roles')
}
</script>
