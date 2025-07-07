<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Camera {{ camera.api_code || camera.id }} Spots</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div
              v-for="spot in camera.spots"
              :key="spot.id"
              class="col-6 col-md-3 mb-2"
            >
              <div
                class="card text-white text-center"
                :class="spotOccupied(spot) ? 'bg-danger' : 'bg-success'"
              >
                <div class="card-body p-2">
                  {{ spot.spot_number || spot.id }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ camera: Object })

function spotOccupied(spot) {
  if ('occupied' in spot) return spot.occupied
  if ('status' in spot) return spot.status === 'occupied'
  if ('is_free' in spot) return !spot.is_free
  return false
}
</script>
