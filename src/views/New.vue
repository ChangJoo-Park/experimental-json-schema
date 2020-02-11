<template>
  <div style="width: 100%:">
    <div style="padding: 1rem;">
      <h1>이 페이지는 새 설문 만들기 테스트입니다</h1>
    </div>

    <div style="padding: 1rem;">
      <div>
        <input type="text" name="" placeholder="TITLE"> &nbsp;
        <input type="text" name="" placeholder="DESCRIPTION">
      </div>
    </div>
    <div style="display: flex; flex-direction: row; min-height: 600px; overflow-y: auto;">
      <div style="min-width: 300px; border-right: 1px solid black;">
        <ul>
          <li @click="addPage">페이지 추가</li>
        </ul>
      </div>
      <div style="flex: 1;">
        <div style="margin: 0 auto; max-width: 600px;">
          <div v-if="!survey.pages.length">
            페이지가 없습니다
          </div>
          <draggable
            v-model="survey.pages"
            v-bind="dragOptions"
            handle=".handle"
          >
            <transition-group type="transition" name="flip-list">
              <div
                v-for="(page, pageIndex) in survey.pages"
                :key="page._id"
                style="min-height: 200px; border: 1px solid black; padding: .5rem; margin-bottom: 1rem; display:flex; flex-direction: column;"
              >
                <div style="flex: 1;">
                  <div>
                    <input type="text" placeholder="PAGE TITLE" style="width: 100%;">
                  </div>
                  <div>
                    <input type="text" placeholder="PAGE DESCRIPTION" style="width: 100%;">
                  </div>
                  <div style="min-height: 300px; border: 1px solid black; padding: .5rem;">
                    <div style="text-align: right;">
                      <a-button @click="addElement('OPTION', 'SHORT_TEXT', page, pageIndex)">새 질문 추가</a-button>
                    </div>
                    <draggable v-model="page.elements" handle=".handle">
                      <ElementEditable
                        v-for="(item, itemIndex) in page.elements"
                        :key="item._id"
                        :item="item"
                        :page="page"
                        @changed="onElementChanged"
                        @delete="deleteElement(pageIndex, itemIndex)"
                      />
                    </draggable>
                  </div>
                </div>
                <hr>
                <div style="justify-content: space-between; display: flex;">
                  <div>
                    <a-button class="handle">이동 핸들</a-button>
                  </div>
                  <div>
                    <a-button @click="showDeleteConfirm(page, pageIndex)">
                      삭제
                    </a-button>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
      <div style="min-width: 200px; border-left: 1px solid black;">
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import shortid from 'shortid'
import ElementEditable from '@/components/ElementEditable'

export default {
  components: {
    draggable,
    ElementEditable
  },
  data () {
    return {
      survey: {
        pages: []
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    makeMediaElement () {
      return {
        type: 'MEDIA'
      }
    },
    makeOptionElement (subtype) {
      console.log(subtype)
      const OPTIONS = {
        'PHONE_NUMBER': () => ({ value: '' }),
        'SHORT_TEXT': () => ({ value: '' }),
        'LONG_TEXT': () => ({ value: '' }),
        'DATE': () => ({ value: '' }),
        'TIME': () => ({ value: '' }),
        'MULTIPLE_CHOICE': () => ({items: [ { label: '예', value: '예' }] }),
        'CHECKBOXES': () => ({items: [ { label: '옵션1', value: '옵션1' }] }),
        'DROPDOWN': () => ({items: [ { label: '옵션1', value: '옵션1' }] }),
        'LINEAR_SCALE': () => ({items: [ { label: '옵션1', value: '옵션1' }] }),
      }
      const _id = shortid()
      const type = 'OPTION'
      const title = ''
      const description = ''
      const optionElement = { _id, type, subtype, title, description, ...OPTIONS[subtype]()}
      return optionElement
    },
    makePage() {
      const shortTextOption = { _id: shortid(), type: 'OPTION', subtype: 'SHORT_TEXT', title: '', description: '', value: '' }
      return { _id: shortid(), title: '', description: '', elements: [ shortTextOption ] }
    },
    addPage () {
      this.survey.pages.push(this.makePage())
    },
    showDeleteConfirm (page, index) {
      const removePage = () => {
        this.survey.pages.splice(index, 1)
      }
      this.$confirm({
        title: '페이지를 삭제합니다',
        onOk() {
          console.log('OK');
          removePage()
          // this.survey.pages.splice(index, 1)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    addElement (type, subtype, page, index) {
      if (type === 'OPTION') {
        this.survey.pages[index].elements.push(this.makeOptionElement(subtype))
      }
    },
    onElementChanged ({pageId, elementId, key, value}) {
      const pageIndex = this.survey.pages.findIndex(p => p._id === pageId)
      const elementIndex = this.survey.pages[pageIndex].elements.findIndex(e => e._id === elementId)
      const oldValue = this.survey.pages[pageIndex].elements[elementIndex][key]
      const newValue = value
      const textSubTypes = ['SHORT_TEXT', 'LONG_TEXT', 'PHONE_NUMBER', 'DATE', 'TIME']
      let needChangeOptionsType = false
      this.survey.pages[pageIndex].elements[elementIndex][key] = value
      if (key === 'subtype') {
        const isOldSubTypeText = textSubTypes.findIndex(t => t === oldValue) > -1
        const isNextSubTypeText = textSubTypes.findIndex(t => t === newValue) > -1
        if (isOldSubTypeText == isNextSubTypeText) { // 둘다 같은 타입인경우
        } else { // 다른경우 next를 따라감
          if (isNextSubTypeText) {
            this.$delete(this.survey.pages[pageIndex].elements[elementIndex], 'items')
            this.$set(this.survey.pages[pageIndex].elements[elementIndex], 'value', '')
          } else {
            this.$set(this.survey.pages[pageIndex].elements[elementIndex], 'items', this.makeOptionElement(newValue).items)
            this.$delete(this.survey.pages[pageIndex].elements[elementIndex], 'value')
          }
        }
      }
    },
    deleteElement (pageIndex, elementIndex) {
      this.survey.pages[pageIndex].elements.splice(elementIndex, 1)
    }
  }
}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>