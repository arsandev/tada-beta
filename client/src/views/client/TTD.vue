<template lang="html">
  <div>
    <center>
      <VueSignaturePad width="300px" height="150px" ref="signaturePad" style="border: 1px solid #DDD"/>
    </center>
    <div>
      <button @click="save">Save</button>
      <button @click="undo">Undo</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MySignaturePad',
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature()
    },
    save() {
      const {
        isEmpty,
        data
      } = this.$refs.signaturePad.saveSignature()
      console.log(isEmpty)
      console.log(data)
    }
  },
  mounted() {

  }
};
</script>
