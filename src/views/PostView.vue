<script setup>
import CommentComponent from '@/components/CommentComponent.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const postId = ref(null)
const route = useRoute()
const post = ref()
const user = ref()
const userMe = ref()
const comments = ref([])

const token = localStorage.getItem('authToken')
const router = useRouter()

const fetchPost = async () => {
  const response = await fetch(`http://localhost:8080/posts/${postId.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  post.value = data
  getUser()
  getMe()
  fetchComments()
}

const getUser = async () => {
  const response = await fetch(`http://localhost:8080/user/${post.value?.userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  user.value = data
}

const getMe = async () => {
  const response = await fetch('http://localhost:8080/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  userMe.value = data
}

const fetchComments = async () => {
  const response = await fetch('http://localhost:8080/comments?sort=createdAt,desc', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  comments.value = data.content
}

const handleDelete = async (id) => {
  const response = await fetch(`http://localhost:8080/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  router.push({ name: 'home' })
}

onMounted(() => {
  postId.value = route.params.id
  fetchPost()
})
</script>

<template>
  <div class="bg-gray-300">
    <router-link
      :to="{ name: 'home' }"
      class="fixed top-10 bg-red-500 translate-x-10 font-bold rounded shadow-lg border border-zinc-300 px-4 h-15 w-100 overflow-hidden"
      >Voltar</router-link
    >
    <div class="min-h-screen mx-auto w-full max-w-2xl pt-10">
      <div v-if="user" class="flex flex-col gap-10 px-4 py-4 bg-white rounded-lg shadow-md mb-4">
        <div class="flex justify-between">
          <h2>{{ user?.name }}</h2>
          <span>{{ post.createdAt }}</span>
        </div>
        <div>
          <p>{{ post.text }}</p>
          <button v-if="userMe?.id === user?.id" @click="handleDelete(post.id)">deletar</button>
        </div>
      </div>
      <h2 class="mb-2">Comentários</h2>
      <div v-for="comment in comments" :key="comment.id">
        <CommentComponent :post="comment" :token="token" :user="user" :fetch="fetchComments" />
      </div>
    </div>
  </div>
</template>
