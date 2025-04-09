<template>
  <q-page class="flex row flex-center">
    <q-card class="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3 q-pa-xs q-pa-md-sm q-mb-xl">
      <q-card-section>
        <div class="text-h6 text-center">Set password</div>
        <div class="text-subtitle2 text-center">
          Set a password for your account to gain access to your account.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="full-width">
          <!-- Password -->
          <q-input
            v-model="password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            outlined
            class="q-mb-lg"
            :rules="passwordRules"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- Confirm Password -->
          <q-input
            v-model="passwordConfirm"
            type="password"
            label="Confirm password"
            :disable="!validatePassword(password)"
            outlined
            lazy-rules
            :rules="confirmPasswordRules"
            class="q-mb-lg"
          />

          <!-- Set password Button -->
          <q-btn label="Set password" color="primary" type="submit" class="full-width" />
          <div class="password-criteria q-pa-sm q-mt-lg">
            <div class="text-subtitle2 q-mb-sm">Password Criteria:</div>
            <div>
              <q-icon
                :name="validPassword.length ? 'check_circle' : 'cancel'"
                :color="validPassword.length ? 'positive' : 'negative'"
              ></q-icon>
              Must be at least 8 characters long.
            </div>
            <div>
              <q-icon
                :name="validPassword.capital ? 'check_circle' : 'cancel'"
                :color="validPassword.capital ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one capital letter.
            </div>
            <div>
              <q-icon
                :name="validPassword.number ? 'check_circle' : 'cancel'"
                :color="validPassword.number ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one number.
            </div>
            <div>
              <q-icon
                :name="validPassword.symbol ? 'check_circle' : 'cancel'"
                :color="validPassword.symbol ? 'positive' : 'negative'"
              ></q-icon>
              Must contain at least one special character: !@#$%^&*()-_+=
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const token = route.params.token;
const uidb64 = route.params.uidb64;

const password = ref("");
const passwordConfirm = ref("");
const isPwd = ref(true);

const validPassword = reactive({
  length: false,
  capital: false,
  number: false,
  symbol: false,
});

function validatePassword(password) {
  // Test length
  validPassword.length = password.length >= 12;

  // Test capital
  validPassword.capital = /^(?=.*[A-Z])/.test(password);

  // Test number
  validPassword.number = /^(?=.*[0-9])/.test(password);

  // Test symbol
  validPassword.symbol = /^(?=.*[!@#$%^&*_\-=+])/.test(password);

  return (
    validPassword.length &&
    validPassword.capital &&
    validPassword.number &&
    validPassword.symbol
  );
}

const passwordRules = [
  (val) => validatePassword(val) || "Password must meet all criteria.",
];

const confirmPasswordRules = [(v) => v === password.value || "Passwords do not match."];

// Set password function
async function onSubmit() {
  await authStore.setPassword(token, uidb64, {
    password: password.value,
  });
}
</script>
