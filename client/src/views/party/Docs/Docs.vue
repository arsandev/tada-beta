<template>
  <div>
    <h4>Dokumen yang harus anda tanda tangani:</h4>
    {{docs}}

    <table id="datas" class="text-center table table-striped table-bordered" style="width:100%">
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama Dokumen</th>
        <th>Opsi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(d, index) in docs">
        <td>{{index+1}}</td>
        <td>{{d.name}}</td>
        <td>
          <button class="btn btn-primary btn-sm">Isi Profil dan Tanda Tangani!</button>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: []
    }
  },
  methods: {
    getDocs() {
      this.axios.get(`${this.api}/doc_copy/party/get_docs?status=0`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.docs = res.data.res
      }).then(() => {
        $('#datas').DataTable()
      })
    }
  },
  mounted() {
    this.getDocs()
  }
}
</script>
