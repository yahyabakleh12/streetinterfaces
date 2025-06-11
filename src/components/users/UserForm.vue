<template>
  <div>
    <h1>{{ isEdit ? 'Edit' : 'Create' }} User</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="form.username" class="form-control" />
      </div>
      <div class="mb-3" v-if="!isEdit">
        <label class="form-label">Password</label>
        <input v-model="form.password" type="password" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Roles</label>
        <select v-model="form.role_ids" multiple class="form-select">
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import userService from '@/services/userService'
import roleService from '@/services/roleService'

const router = useRouter()

const props = defineProps({ isEdit: Boolean, id: Number })

const roles = ref([])
const form = reactive({
  username: '',
  password: '',
  role_ids: []
})

onMounted(async () => {
  const { data: roleData } = await roleService.getAll()
  roles.value = roleData
  if (props.isEdit) {
    const { data } = await userService.get(props.id)
    form.username = data.username
    form.role_ids = (data.roles || []).map(r => r.id)
  }
})

async function submit() {
  if (props.isEdit) {
    await userService.update(props.id, form)
  } else {
    await userService.create(form)
  }
  router.push('/users')
}
</script>
