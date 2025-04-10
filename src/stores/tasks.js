// stores/task.js
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import axios from 'config/axios'
// import localStorageService from 'services/localStorage.service'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    filter: 'all', // 'all', 'completed', or 'incomplete'
  }),

  getters: {
    filteredTasks(state) {
      if (state.filter === 'completed') {
        return state.tasks.filter((task) => task.is_completed)
      } else if (state.filter === 'incomplete') {
        return state.tasks.filter((task) => !task.is_completed)
      }
      return state.tasks
    },
  },

  actions: {
    async getTasks() {
      let response
      try {
        response = await axios.get('/task')
      } catch {
        Notify.create({
          message: 'An unknown error occurred',
          color: 'danger',
        })
        return false
      }

      if (response.data?.success) {
        this.tasks = response.data.tasks
      } else {
        Notify.create({
          message: response.data?.message,
          color: 'danger',
        })
      }
    },
    async addTask(title) {


      let response
      try {
        response = await axios.post('/task', { title })
      } catch {
        Notify.create({
          message: 'An unknown error occurred',
          color: 'danger',
        })
        return false
      }

      if (response.data?.success) {
        this.getTasks()
      } else {
        Notify.create({
          message: response.data?.message,
          color: 'danger',
        })
      }
    },

    async editTask(id, newTitle) {
      const task = this.tasks.find((task) => task.entity_id === id)
      if (task) {
        task.title = newTitle
      }

      let response
      try {

        response = await axios.put(`/task`,{
          title: newTitle,
          entity_id: task.entity_id
        })
      } catch {
        Notify.create({
          message: 'An unknown error occurred',
          color: 'danger',
        })
        return false
      }

      if (response.data?.success) {
        const task = this.tasks.find((task) => task.entity_id === id)
        if (task) {
          task.is_completed = !task.is_completed
        }

        this.getTasks()
      } else {
        Notify.create({
          message: response.data?.message,
          color: 'danger',
        })
      }
    },

    async toggleComplete(id) {

      let response
      try {

        response = await axios.put(`/task/${id}/toggle`)
      } catch {
        Notify.create({
          message: 'An unknown error occurred',
          color: 'danger',
        })
        return false
      }

      if (response.data?.success) {
        const task = this.tasks.find((task) => task.entity_id === id)
        if (task) {
          task.is_completed = !task.is_completed
        }

        this.getTasks()
      } else {
        Notify.create({
          message: response.data?.message,
          color: 'danger',
        })
      }
    },

    async deleteTask(id) {
      let response
      try {
        response = await axios.delete(`/task/${id}`)
      } catch {
        Notify.create({
          message: 'An unknown error occurred',
          color: 'danger',
        })
        return false
      }

      if (response.data?.success) {
        this.tasks = this.tasks.filter((task) => task.entity_id !== id)

        this.getTasks()
      } else {
        Notify.create({
          message: response.data?.message,
          color: 'danger',
        })
      }
    },

    setFilter(filter) {
      this.filter = filter
    },
  },
})
