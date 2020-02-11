<template>
  <div>
    <div v-if="item">
      <div>
        <h1>설문 이름 : {{ item.title }}</h1>
        <p>설문 상세 : {{ item.description }}</p>
        <div>생성일 : {{ item.created_at }}</div>
        <div>갱신일 : {{ item.updated_at }}</div>
        <div>시작일 : {{ item.start_at }}</div>
        <div>종료일 : {{ item.end_at }}</div>
        <div>공개여부 : {{ item.is_published ? '공개중' : '비공개'}}</div>
        <div>페이지수 : {{ item.pages.length }}</div>
      </div>
      <div style="display: flex; overflow-x:auto; padding: 1rem;">
        <div
          v-for="(page, index) in item.pages"
          :key="page._id"
          style="margin-right: .5rem; min-width: 400px; height: 500px; border: 1px solid black; padding: .5rem; display: flex; flex-direction: column;"
        >
          <div>
            <h2>{{ page.title }}</h2>
            <p>{{ page.description }}</p>
          </div>
          <hr>
          <div
            style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;"
          >
            <ElementComponent v-for="element in page.elements" :key="element._id" :element="element" />
          </div>
          <div style="text-align: center;">
            <strong>{{ index + 1 }} / {{ item.pages.length }}</strong>
          </div>
        </div>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
const list = require('../../survey.json')

import ElementComponent from '@/components/Element.js'

export default {
  components: {
    ElementComponent
  },
  data () {
    return {
      item: null
    }
  },
  mounted () {
    this.item = list.find(item => item._id == this.$route.params.id)
  }
}
</script>

<style>

</style>