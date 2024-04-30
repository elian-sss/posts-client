<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps(['post', 'token', 'user', 'fetch'])

const userPost = ref()

const handleDelete = async (id) => {
  const response = await fetch(`https://api-posts-production-6d52.up.railway.app/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${props.token}`
    }
  })
  props.fetch()
}

onMounted(async () => {
  const request = await fetch(
    `https://api-posts-production-6d52.up.railway.app/user/${props.post.userId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${props.token}`
      }
    }
  )
  const data = await request.json()
  userPost.value = data
})
</script>

<template>
  <div v-if="user" class="flex flex-col gap-10 px-4 py-4 bg-white rounded-lg shadow-md mb-4">
    <div class="flex justify-between">
      <h2>{{ userPost?.name }}</h2>
      <p>{{ post.text }}</p>
    </div>
  </div>
</template>
