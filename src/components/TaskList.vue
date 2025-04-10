<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-md" style="min-width: 400px;">
      <q-input
        v-model="newTask"
        label="Add a task"
        @keyup.enter="addTask"
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-btn icon="add" round flat @click="addTask" />
        </template>
      </q-input>

      <div class="q-mb-md">
        <q-btn-toggle
          v-model="taskStore.filter"
          toggle-color="primary"
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Completed', value: 'completed' },
            { label: 'Incomplete', value: 'incomplete' },
          ]"
          dense
        />
      </div>

      <q-list bordered separator>
        <q-item v-for="task in taskStore.filteredTasks" :key="task.entity_id" clickable>
          <q-item-section avatar>
            <q-checkbox
              :model-value="task.is_completed"
              @update:model-value="() => taskStore.toggleComplete(task.entity_id)"
            />
          </q-item-section>

          <q-item-section>
            <q-input
              v-model="task.title"
              dense
              debounce="1000"
              borderless
              @blur="() => taskStore.editTask(task.entity_id, task.title)"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn
              icon="delete"
              flat
              round
              color="red"
              @click="taskStore.deleteTask(task.entity_id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted} from "vue";
import { useTaskStore } from "stores/tasks";

const taskStore = useTaskStore();

const newTask = ref("");

function addTask() {
  if (newTask.value.trim() !== "") {
    taskStore.addTask(newTask.value);
    newTask.value = "";
  }
}

onMounted(async ()=>{
  await taskStore.getTasks()
})
</script>

<style scoped>
.q-item-section input {
  width: 100%;
}
</style>
