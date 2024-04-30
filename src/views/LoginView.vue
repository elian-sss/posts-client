<script setup>
import useVuelidate from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const formData = reactive({
  email: '',
  password: ''
})

const rules = computed(() => {
  return {
    email: { required, email },
    password: { required, minLength: minLength(6) }
  }
})

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      const url = 'http://localhost:8080/oauth2/token' // Substitua pela URL da sua API de login

      const loginData = {
        grant_type: 'password',
        username: formData.email,
        password: formData.password
      }

      const base64Credentials = btoa(`myclientid:myclientsecret`)

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${base64Credentials}`
        },
        body: new URLSearchParams(loginData).toString()
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`Erro ao fazer login: ${response.status}`)
      }

      const data = await response.json()

      store.commit('setAuthentication', data.access_token)

      // Aqui você pode armazenar o token de autenticação, por exemplo, em localStorage
      localStorage.setItem('authToken', data.access_token)

      // Redirecionar o usuário para a página inicial ou outra página após o login
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      alert('deu errado')
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
        <h1 class="text-2xl font-bold text-center mb-8">Login</h1>
        <form @submit.prevent="handleSubmit">
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
            Entrar
          </button>
        </form>
        <div class="flex justify-center items-center mt-3">
          <router-link :to="{ name: 'register' }" class="text-sm text-blue-500 hover:underline"
            >Registrar</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
