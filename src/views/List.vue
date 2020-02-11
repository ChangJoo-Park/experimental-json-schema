<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item._id">
        <div>
          <strong>
            <router-link
              :to="{ name: 'Detail', params: { id: item._id} }"
            >
              {{ item.title }}
            </router-link>
          </strong>
          <span v-if="item.description">/ {{ item.description }}</span>
          / [총 {{ item.pages.length }} 페이지]
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
const list = require('../../survey.json')
export default {
  data() {
    return {
      list
    }
  }
}
</script>

<style>

</style>