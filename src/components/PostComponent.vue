<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps(['post', 'token', 'user', 'fetch'])

const userPost = ref()

const handleDelete = async (id) => {
  const response = await fetch(`http://localhost:8080/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  })
  props.fetch()
}

onMounted(async () => {
  const request = await fetch(`http://localhost:8080/user/${props.post.userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  })
  const data = await request.json()
  userPost.value = data
})
</script>

<template>
  <router-link :to="{ path: `/posts/${post?.id}` }">
    <div v-if="user" class="flex flex-col gap-10 px-4 py-4 bg-white rounded-lg shadow-md">
      <div class="flex justify-between">
        <h2>{{ userPost?.name }}</h2>
        <span>{{ post.createdAt }}</span>
      </div>
      <p>{{ post.text }}</p>
    </div>
  </router-link>
</template>
