<script setup>
import PostFormComponent from '@/components/PostFormComponent.vue'
import PostComponent from '@/components/PostComponent.vue'
import { onMounted, ref } from 'vue'

const posts = ref([])
const user = ref()

const token = localStorage.getItem('authToken')

const fetchPosts = async () => {
  const response = await fetch(
    'https://api-posts-production-6d52.up.railway.app/posts?sort=createdAt,desc',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data = await response.json()
  posts.value = data.content
}

const fetchUser = async () => {
  const response = await fetch('https://api-posts-production-6d52.up.railway.app/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  user.value = data
}

onMounted(() => {
  fetchPosts()
  fetchUser()
})
</script>

<template>
  <div class="bg-gray-300">
    <router-link
      :to="{ name: 'login' }"
      class="fixed top-10 bg-red-500 translate-x-10 font-bold rounded shadow-lg border border-zinc-300 px-4 h-15 w-100 overflow-hidden"
      >Logout</router-link
    >
    <div class="min-h-screen mx-auto w-full max-w-2xl pt-10">
      <PostFormComponent class="mb-4" :token="token" :fetch="fetchPosts" />
      <h1 class="text-2xl font-bold mb-2">Posts</h1>
      <div v-if="posts.length > 0" class="flex flex-col gap-8">
        <div v-for="post in posts" :key="post.id">
          <PostComponent :post="post" :token="token" :user="user" :fetch="fetchPosts" />
        </div>
      </div>
      <div v-else class="flex justify-center">
        <h1 class="text-xl font-bold mb-2">Nenhum post encontrado...</h1>
      </div>
    </div>
  </div>
</template>
