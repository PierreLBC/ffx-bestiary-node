// import BestiaryC from 'ffx-bestiary-server'
import { get } from './api'

export async function getLocations(): Promise<string[]> {
  const response = await get('/bestiary/locations')

  if (response.ok) {
    const monsters = await response.json()
    return monsters
  } else {
    throw new Error('API responded with error: ' + response.statusText)
  }
}
