import { ref, computed } from 'vue'

export default function useSortable(items, defaultKey = 'id') {
  const sortKey = ref(defaultKey)
  const sortAsc = ref(true)

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      const vA = a[sortKey.value]
      const vB = b[sortKey.value]
      if (vA == null) return 1
      if (vB == null) return -1
      if (typeof vA === 'number' && typeof vB === 'number')
        return sortAsc.value ? vA - vB : vB - vA
      const sA = vA.toString().toLowerCase()
      const sB = vB.toString().toLowerCase()
      if (sA < sB) return sortAsc.value ? -1 : 1
      if (sA > sB) return sortAsc.value ? 1 : -1
      return 0
    })
  })

  function sortBy(key) {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

  return { sortKey, sortAsc, sortedItems, sortBy }
}
