import { createRouter, createWebHistory } from 'vue-router'
import CamerasList from '@/components/cameras/CamerasList.vue'
import CameraForm   from '@/components/cameras/CameraForm.vue'
import CameraDetail from '@/components/cameras/CameraDetail.vue'

import LocationsList from '@/components/locations/LocationsList.vue'
import LocationForm   from '@/components/locations/LocationForm.vue'
import LocationDetail from '@/components/locations/LocationDetail.vue'

import ZonesList from '@/components/zones/ZonesList.vue'
import ZoneForm   from '@/components/zones/ZoneForm.vue'
import ZoneDetail from '@/components/zones/ZoneDetail.vue'

import PolesList from '@/components/poles/PolesList.vue'
import PoleForm   from '@/components/poles/PoleForm.vue'
import PoleDetail from '@/components/poles/PoleDetail.vue'

import TicketsList from '@/components/tickets/TicketsList.vue'
import TicketForm   from '@/components/tickets/TicketForm.vue'
import TicketDetail from '@/components/tickets/TicketDetail.vue'

import ManualReviewsList from '@/components/manualReviews/ManualReviewsList.vue'
import ManualReviewDetail from '@/components/manualReviews/ManualReviewDetail.vue'
import UsersList from '@/components/users/UsersList.vue'
import UserForm from '@/components/users/UserForm.vue'
import UserDetail from '@/components/users/UserDetail.vue'
import RolesList from '@/components/roles/RolesList.vue'
import RoleForm from '@/components/roles/RoleForm.vue'
import RoleDetail from '@/components/roles/RoleDetail.vue'
import PermissionsList from '@/components/permissions/PermissionsList.vue'
import PermissionForm from '@/components/permissions/PermissionForm.vue'
import PermissionDetail from '@/components/permissions/PermissionDetail.vue'
import Statistics from '@/components/Statistics.vue'
import Login from '@/components/Login.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/statistics' },
  { path: '/statistics', component: Statistics },
  { path: '/cameras',          component: CamerasList },
  { path: '/cameras/create',   component: CameraForm,   props: { isEdit: false } },
  { path: '/cameras/:id/edit', component: CameraForm,   props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/cameras/:id',      component: CameraDetail, props: true },
  { path: '/locations',          component: LocationsList },
  { path: '/locations/create',   component: LocationForm, props: { isEdit: false } },
  { path: '/locations/:id/edit', component: LocationForm, props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/locations/:id',      component: LocationDetail, props: true },

  { path: '/zones',          component: ZonesList },
  { path: '/zones/create',   component: ZoneForm,   props: { isEdit: false } },
  { path: '/zones/:id/edit', component: ZoneForm,   props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/zones/:id',      component: ZoneDetail, props: true },

  { path: '/poles',          component: PolesList },
  { path: '/poles/create',   component: PoleForm,   props: { isEdit: false } },
  { path: '/poles/:id/edit', component: PoleForm,   props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/poles/:id',      component: PoleDetail, props: true },

  { path: '/tickets',          component: TicketsList },
  { path: '/tickets/create',   component: TicketForm,   props: { isEdit: false } },
  { path: '/tickets/:id/edit', component: TicketForm,   props: route => ({ isEdit: true, id: +route.params.id }) },
  { path: '/tickets/:id',      component: TicketDetail, props: true },

  { path: '/manual-reviews', component: ManualReviewsList },
  { path: '/manual-reviews/:id', component: ManualReviewDetail, props: true },

  { path: '/users', component: UsersList, meta: { requiresAdmin: true } },
  { path: '/users/create', component: UserForm, props: { isEdit: false }, meta: { requiresAdmin: true } },
  { path: '/users/:id/edit', component: UserForm, props: route => ({ isEdit: true, id: +route.params.id }), meta: { requiresAdmin: true } },
  { path: '/users/:id', component: UserDetail, props: true, meta: { requiresAdmin: true } },

  { path: '/roles', component: RolesList, meta: { requiresAdmin: true } },
  { path: '/roles/create', component: RoleForm, props: { isEdit: false }, meta: { requiresAdmin: true } },
  { path: '/roles/:id/edit', component: RoleForm, props: route => ({ isEdit: true, id: +route.params.id }), meta: { requiresAdmin: true } },
  { path: '/roles/:id', component: RoleDetail, props: true, meta: { requiresAdmin: true } },

  { path: '/permissions', component: PermissionsList, meta: { requiresAdmin: true } },
  { path: '/permissions/create', component: PermissionForm, props: { isEdit: false }, meta: { requiresAdmin: true } },
  { path: '/permissions/:id/edit', component: PermissionForm, props: route => ({ isEdit: true, id: +route.params.id }), meta: { requiresAdmin: true } },
  { path: '/permissions/:id', component: PermissionDetail, props: true, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()

  if (authRequired && !auth.token) {
    return next('/login')
  }
  if (to.meta.requiresAdmin && !auth.roles.includes('admin')) {
    return next('/')
  }
  next()
})

export default router
