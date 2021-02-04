<template>
  <div class='Data'>
    <collection></collection>
    <month-rent></month-rent>
    <supplier></supplier>
    <category-data></category-data>
  </div>
</template>

<script>
import Collection from './components/collection'
import MonthRent from './components/MonthRent'
import CategoryData from './components/CategoryData'
import Supplier from './components/Supplier'
export default {
  name: 'Data',
  components: {
    Collection,
    MonthRent,
    CategoryData,
    Supplier
  },
  data () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
