<!-- App.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
    <div class="container">
      <router-link class="navbar-brand" to="/">Street</router-link>
      <div class="navbar-nav">
        <router-link class="nav-link" to="/cameras">Cameras</router-link>
        <router-link class="nav-link" to="/locations">Locations</router-link>
        <router-link class="nav-link" to="/zones">Zones</router-link>
        <router-link class="nav-link" to="/poles">Poles</router-link>
        <router-link class="nav-link" to="/tickets">Tickets</router-link>
      </div>
    </div>
  </nav>
  <div class="container">
    <router-view />
  </div>
</template>
