<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useBestiaryStore } from "../stores/bestiary"


const bestiaryStore = useBestiaryStore();
</script>

<template>
  <main>
    <div v-for = "loc of bestiaryStore.locations">

      <RouterLink :to = "'/location/' + loc">{{ loc }}</RouterLink>
    </div>
  </main>
</template>
