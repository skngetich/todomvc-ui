<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="authStore.isAuthenticated"
        />

        <q-toolbar-title> Todomvc </q-toolbar-title>

        <div v-if="authStore.isAuthenticated">
          <div class="cursor-pointer">
            <q-dialog v-model="showDialog">
              <q-card style="min-width: 350px">
                <q-card-section>
                  <div class="text-h6">Change Name</div>
                </q-card-section>

                <q-card-section>
                  <q-input
                    filled
                    v-model="authStore.user.first_name"
                    label="First Name"
                    class="q-mb-sm"
                  />
                  <q-input filled v-model="authStore.user.last_name" label="Last Name" />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancel" color="primary" v-close-popup />
                  <q-btn color="primary" label="Save" @click="saveName" />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>

        <div v-if="authStore.isAuthenticated" class="cursor-pointer">
          Logged in as
          <b>{{ authStore.user.first_name }} {{ authStore.user.last_name }}</b>
          <q-icon size="xs" name="arrow_drop_down" />
          <q-menu fir anchor="bottom right" self="top right">
            <q-list>
              <q-item v-close-popup>
                <q-item-section clickable @click="showDialog = true" class="flex">
                  Change Profile Name
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="authStore.logout()">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="authStore.isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore();
const showDialog = ref(false);

const linksList = [
  {
    title: "Dashboard",
    icon: "code",
    link: "/dashboard",
  },
];

const leftDrawerOpen = ref(false);

function saveName() {
  authStore.changeName({
    first_name: authStore.user.first_name,
    last_name: authStore.user.last_name,
    entity_id: authStore.user.entity_id,
  });

  // close dialog
  showDialog.value = false;
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
