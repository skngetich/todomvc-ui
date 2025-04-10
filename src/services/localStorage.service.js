export default {
  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`Error saving "${key}" to localStorage:`, error)
    }
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
  getItem(key) {
    try {
      const item = localStorage.getItem(key)
      if (!item || item === 'undefined') return null
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading "${key}" from localStorage:`, error)
      return null
    }
  },
  clear() {
    localStorage.clear()
  },
}
