<template>
  <div v-if="element" style="margin-bottom: 1rem;">
    <div class="handle">질문 이동 핸들</div>
    <a-button @click="$emit('delete')">삭제</a-button>
    <div style="margin-bottom: .5rem;">
      <div><input type="text" v-model="element.title" placeholder="OPTION TITLE" style="width: 100%;"></div>
      <div><input type="text" v-model="element.description" placeholder="OPTION DESCRIPTION" style="width: 100%;"></div>
    </div>
    <a-dropdown>
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="SHORT_TEXT">단답형</a-menu-item>
        <a-menu-item key="LONG_TEXT">장문형</a-menu-item>
        <a-menu-item key="PHONE_NUMBER">전화번호</a-menu-item>
        <a-menu-item key="MULTIPLE_CHOICE">객관식</a-menu-item>
        <a-menu-item key="CHECKBOXES">체크박스</a-menu-item>
        <a-menu-item key="DROPDOWN">드랍다운</a-menu-item>
        <a-menu-item key="LINEAR_SCALE">직선단계</a-menu-item>
        <a-menu-item key="DATE">날짜</a-menu-item>
        <a-menu-item key="TIME">시간</a-menu-item>
      </a-menu>
      <a-button> 변경 - {{element.subtype}} <a-icon type="down" /> </a-button>
    </a-dropdown>
    <div v-if="isText">
      <input type="text" v-model="element.value" style="width: 100%;" :placeholder="element.subtype">
    </div>
    <div v-else-if="element.subtype === 'LINEAR_SCALE'">
      직선단계
      <div>
        최소값 : <input type="number" value="0"> &nbsp;
        최소값 텍스트 : <input type="text" value="최소값 텍스트">
      </div>
      <div>
        최대값 : <input type="number" value="5"> &nbsp;
        최대값 텍스트 : <input type="text" value="최대값 텍스트">
      </div>
    </div>
    <div v-else>
      <li v-for="(item, index) in element.items" :key="index">
        <input type="text" v-model="item.label"> / <input type="text" v-model="item.value">
        <a-button @click="element.items.splice(index, 1)">삭제</a-button>
      </li>
      <li><a-button @click="element.items.push({ label: '', value: ''})">항목 추가</a-button></li>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
export default {
  props: {
    page: { type: Object },
    item: { type: Object }
  },
  data () {
    return {
      element: null
    }
  },
  watch: {
    'item'(newItem) {
      this.element = JSON.parse(JSON.stringify(this.item))
    }
  },
  computed: {
    isText() {
      if (!this.element) {
        return false
      }
      if (this.element.subtype === 'SHORT_TEXT' ||
        this.element.subtype === 'LONG_TEXT' ||
        this.element.subtype === 'PHONE_NUMBER' ||
        this.element.subtype === 'DATE' ||
        this.element.subtype === 'TIME'
      ) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.element = JSON.parse(JSON.stringify(this.item))
  },
  methods: {
    onChanged (key,value) {
      this.$emit('changed', { pageId: this.page._id, elementId: this.element._id, key, value })
    },
    handleMenuClick ({key}) {
      this.element.subtype = key
      this.onChanged('subtype', this.element.subtype)
    }
  }
}
</script>

<style>

</style>