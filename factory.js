const faker = require('faker/locale/ko')
const fs = require('fs')

faker.locale = "ko";
const iterate = (count, callback) => {
  const result = []
  for (let index = 0; index < count; index++) {
    result.push(callback())
  }
  return result
}
const getColor = () => Math.random().toString(16).substr(2,6)
const getObjectId = () => require('mongoose').Types.ObjectId()
const makeTitle = () => faker.lorem.sentence()
const makeDescription = () => faker.random.boolean() ? faker.lorem.sentence() : ''
const makeQuota = () => []
const makeMedium = () => ({ type: 'MEDIA', subtype: 'IMAGE', uri: `https://via.placeholder.com/200.png/${getColor()}/${getColor()}` })

const makeGuidePage = (next_page) => ({
  _id: getObjectId(),
  title: makeTitle(),
  description: makeDescription(),
  next_page,
  elements: [makeMedium()]
})

const makeOption = (subtype) => {
  const title = makeTitle()
  const description = makeDescription()

  switch (subtype) {
    case 'PHONE_NUMBER':
    case 'SHORT_TEXT':
    case 'LONG_TEXT':
      return {
        _id: getObjectId(),
        title,
        description,
        type: 'OPTION',
        value: '',
        subtype
      }
    case 'MULTIPLE_CHOICE':
    case 'CHECKBOXES':
    case 'DROPDOWN':
      const numbers_multiple = faker.random.number({ min: 2, max: 5 })
      return {
        _id: getObjectId(),
        type: 'OPTION',
        title,
        description,
        items: iterate(numbers_multiple, () => ({ label: faker.lorem.word(), value: faker.lorem.word() })),
        subtype
      }
    case 'LINEAR_SCALE':
      const min = faker.random.number({ min: 0, max: 2 })
      const max = faker.random.number({ min: 6, max: 8 })
      return {
        _id: getObjectId(),
        type: 'OPTION',
        title,
        description,
        min_label: faker.lorem.word(),
        max_label: faker.lorem.word(),
        min,
        max,
        subtype
      }
    case 'DATE':
      return {
        _id: getObjectId(),
        type: 'OPTION',
        title,
        description,
        value: '',
        subtype
      }
    case 'TIME':
      return {
        _id: getObjectId(),
        title,
        description,
        type: 'OPTION',
        value: '',
        subtype
      }
  }
}

const makeQuestion = (type) => {
  return makeOption(type)
}

const makeQuestionPage = (next_page) => {
  const numberOfQuestions = faker.random.number({ min: 1, max: 3 })
  const TYPES = [
    "PHONE_NUMBER",
    "SHORT_TEXT",
    "LONG_TEXT",
    "MULTIPLE_CHOICE",
    "CHECKBOXES",
    "DROPDOWN",
    "LINEAR_SCALE",
    "DATE",
    "TIME"
  ]

  const questions = iterate(numberOfQuestions, () => makeQuestion(faker.random.arrayElement(TYPES)))

  return {
    _id: getObjectId(),
    title: makeTitle(),
    description: makeDescription(),
    next_page,
    elements: questions
  }
}

const makePages = () => {
  const numberOfPages = faker.random.number({ min: 2, max: 10 })
  const questionPages = iterate(numberOfPages, () => makeQuestionPage())

  return [
    makeGuidePage(),
    ...questionPages,
    makeGuidePage(),
  ]
}

const makeSurvey = () => ({
  _id: getObjectId(),
  title: makeTitle(),
  description: makeDescription(),
  created_at: faker.date.past(),
  updated_at: faker.date.past(),
  start_at: faker.date.past(),
  end_at: faker.date.future(),
  is_published: faker.random.boolean(),
  pages: makePages(),
  quota: makeQuota()
})

const result = []

for (let index = 0; index < 100; index++) {
  result.push(makeSurvey())
}

fs.writeFile('survey.json', JSON.stringify(result), 'utf8', () => {
  console.log('end')
});