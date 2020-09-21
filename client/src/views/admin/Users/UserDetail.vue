<template>
<div>
  <h5>Detail User</h5>
  <hr>
  <table class="table">
    <tr>
      <th>Username</th>
      <th>:</th>
      <th class="bg-secondary text-white">@{{user.username}}</th>
    </tr>
    <tr>
      <th>Password</th>
      <th>:</th>
      <th class="bg-secondary text-white">******</th>
    </tr>
  </table>
  <div class="mt-5">
    User ini telah terlibat dalam <b>1 Dokumen</b>:
    <div class="list-group mt-3">
      <a href="#" class="list-group-item list-group-item-action">
        <b>Pencatatan Properti</b> sebagai <b>Kepala Sekolah</b>
      </a>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      user: ''
    }
  },
  methods: {
    getUser() {
      this.axios.get(`${this.api}/users/${this.$route.params.id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.user = res.data.res[0]
      })
    }
  },
  mounted() {
    this.getUser()
  }
}
</script>
<style scoped>
  .table tr th, .table tr td {
    font-size: 25px;
  }
</style>
