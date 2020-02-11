const emptyTemplate = ``
const renderMediumTemplate = (element) => `<div style="text-align:center;"><img src="${element.uri}" /></div>`
const textOptionTemplate = () => `<input type="text" style="width: 100%;">`
const datetimeOptionTemplate = (element) => {
  const type = element.subtype === 'DATE' ? 'date' : 'time'
  return `<input type="${type}" style="width: 100%;">`
}
const linearScaleTemplate = ({ _id, max, max_label, min, min_label }) => {
  const options = []
  for (let index = 0; index < (max-min); index++) {
    options.push(`<input type="radio" name="${_id}">&nbsp;`)
  }
  return `${min_label} ${options.join('')} ${max_label}`
}
const checkBoxOptionTemplate = ({items}) => items.map(item => `
  <label><input type="checkbox">&nbsp;${item.label}</label><br>
`).join('')

const dropdownOptionTemplate = ({items}) => {
  const options = items.map(item => `<option value="${item.value}">${item.label}</option>`).join('')
  return `<select style="width: 100%;">${options}</select>`
}

const multipleChoiceOptionTemplate = ({_id, items}) => {
  return items.map(item => `<label><input type="radio" name="${_id}" value="${item.value}">&nbsp;${item.label}</label><br>`).join('')
}

const renderOptionTemplate = (element) => {
  let options = ''
  switch (element.subtype) {
    case 'PHONE_NUMBER':
    case 'SHORT_TEXT':
    case 'LONG_TEXT':
      options = textOptionTemplate(element)
      break;
    case 'DATE':
    case 'TIME':
      options = datetimeOptionTemplate(element)
      break
    case 'CHECKBOXES':
      options = checkBoxOptionTemplate(element)
      break
    case 'MULTIPLE_CHOICE':
      options = multipleChoiceOptionTemplate(element)
      break
    case 'LINEAR_SCALE':
      options = linearScaleTemplate(element)
      break
    case 'DROPDOWN':
      options = dropdownOptionTemplate(element)
      break
    default:
      break
  }
  return `
  <div style="margin-bottom: 1rem; width: 100%;">
    <div>${element.title} - ${element.subtype}</div>
    <div style="margin-bottom: .5rem;"><small>${element.description}</small></div>
    <div>${options}</div>
  </div<
  `
}

const renderTemplate = (element) => {
  switch (element.type) {
    case 'MEDIA':
      return renderMediumTemplate(element)
    case 'OPTION':
      return renderOptionTemplate(element)
    default:
      return emptyTemplate
  }
}

export default {
  name: 'element-component',
  props: {
    element: {
      type: Object
    }
  },
  render: function(createElement) {
    return createElement('div', {
      class: 'element-inner',
      style: 'width: 100%;',
      domProps: {
        innerHTML: renderTemplate(this.element)
      }
    })
  }
}