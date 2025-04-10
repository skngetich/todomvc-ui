<template>
  <q-page class="flex flex-center column">
    <h6>Hi, {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</h6>

    <h4>TODO</h4>
    <TaskList />
  </q-page>
</template>

<script setup>
import TaskList from "components/TaskList.vue";
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();



</script>
