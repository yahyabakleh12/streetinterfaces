import { createRouter, createWebHistory } from 'vue-router'
import CamerasList from '@/components/cameras/CamerasList.vue'
import CameraForm   from '@/components/cameras/CameraForm.vue'
import CameraDetail from '@/components/cameras/CameraDetail.vue'

const routes = [
  { path: '/cameras',          component: CamerasList },
  { path: '/cameras/create',   component: CameraForm,   props: { isEdit: false } },
  { path: '/cameras/:id/edit', component: CameraForm,   props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/cameras/:id',      component: CameraDetail, props: true },
  // → repeat for other resources...
]

export default createRouter({
  history: createWebHistory(),
  routes
})
