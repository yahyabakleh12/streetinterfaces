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
import ManualTransactionsList from '@/components/manualTransactions/ManualTransactionsList.vue'

const routes = [
  { path: '/', redirect: '/cameras' },
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
  { path: '/manual-transactions', component: ManualTransactionsList },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
