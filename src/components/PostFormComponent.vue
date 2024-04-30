<script setup>
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import { reactive, computed } from 'vue'

const props = defineProps(['token', 'fetch'])

const formData = reactive({
  text: ''
})

const rules = computed(() => {
  return {
    text: { required, maxLength: maxLength(500) }
  }
})

const v$ = useVuelidate(rules, formData)

const handleSubmit = async () => {
  const result = await v$.value.$validate()
  if (result) {
    try {
      const url = 'http://localhost:8080/posts' // Substitua pela URL da sua API de login

      const postData = {
        text: formData.text
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`
        },
        body: JSON.stringify(postData)
      }

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw new Error(`Erro ao postar: ${response.status}`)
      }

      const data = await response.json()
      console.log(data)
      props.fetch()
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    }
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="handleSubmit" class="flex items-center gap-5 h-12">
      <textarea
        name="text"
        id="text"
        class="w-full h-full px-4 py-2 resize-none"
        v-model="formData.text"
      ></textarea>

      <button
        class="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-700"
        type="submit"
      >
        Postar
      </button>
    </form>
    <span v-for="error in v$.text.$errors" :key="error.$uid" class="text-red-500">
      {{ error.$message }}
    </span>
  </div>
</template>
