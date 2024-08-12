import { Monster, Bestiary } from 'ffx-bestiary-server'
import { get } from './api'

export async function getKids(): Promise<Monster[]> {
  const response = await get('/kids/list')

  if (response.ok) {
    const monsters = await response.json()
    return monsters
  } else {
    throw new Error('API responded with error: ' + response.statusText)
  }
}
