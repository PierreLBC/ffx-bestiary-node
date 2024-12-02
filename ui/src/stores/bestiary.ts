import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import * as bestiaryApi from '../utils/bestiary-api'

export const useBestiaryStore = defineStore('bestiary', () => {
  const locations = ref<string[]>([])
  const monsters = ref<string[]>([])

  onMounted(async () => {
    locations.value = await bestiaryApi.getLocations()
    console.log('await bestiaryApi.getLocations() ->', await bestiaryApi.getLocations())
  })

  return { locations, monsters }
})
