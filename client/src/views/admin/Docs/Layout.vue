<template>
<div>
  <router-view :docsData="docsData" />
</div>
</template>

<script>
export default {
  data() {
    return {
      docsData: ''
    }
  },
  methods: {
    getDocsData() {
      this.axios.get(`${this.api}/docs/${this.$route.params.id}?docsData=true`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.docsData = res.data.res[0]
      })
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getDocsData()  
    }
  }
}
</script>
