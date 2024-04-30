<script setup>
import useVuelidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  name: '',
  email: '',
  password: ''
})

const rules = computed(() => {
  return {
    name: { required, minLength: minLength(3) },
    email: { required, email },
    password: { required, minLength: minLength(6) }
  }
})

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      const request = await fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      await request.json()
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  } else {
    alert('deu errado')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center min-h-screen bg-gray-300">
      <div class="mx-auto w-full max-w-md px-4 py-8 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center mb-8">Registrar</h1>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 mb-2">Nome</label>
            <input
              v-model="formData.name"
              type="name"
              id="name"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span v-for="error in v$.name.$errors" :key="error.$uid" class="text-red-500">
              {{ error.$message }}
            </span>
          </div>
          <div class="mb-4">
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span v-for="error in v$.email.$errors" :key="error.$uid" class="text-red-500">
              {{ error.$message }}
            </span>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-gray-700 mb-2">Senha</label>
            <input
              v-model="formData.password"
              type="password"
              id="password"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span v-for="error in v$.password.$errors" :key="error.$uid" class="text-red-500">
              {{ error.$message }}
            </span>
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-700"
          >
            Registrar
          </button>
        </form>
        <div class="flex justify-center items-center mt-3">
          <router-link :to="{ name: 'login' }" class="text-sm text-blue-500 hover:underline"
            >Login</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
