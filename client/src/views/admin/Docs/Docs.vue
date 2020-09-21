<template>
<div>
  <button class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg"><i class="fa fa-plus"></i> Tambah Dokumen</button>
  <hr>
  <div class="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tambah Dokumen Baru</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form method="post" @submit.prevent="createDoc()">
          <div class="modal-body">
            <div>
              <b>Nama</b>
              <input type="text" autocomplete="off" ref="name" class="form-control" placeholder="Nama Dokumen">
            </div>
            <div class="mt-3">
              <b>File/Dokumen (.docx)</b>
              <input @change="changeDocx" type="file" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-upload"></i> Unggah Dokumen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <table id="datas" class="text-center table table-striped table-bordered" style="width:100%">
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama</th>
        <th>Dokumen</th>
        <th>Jumlah Salinan</th>
        <th>Opsi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(d, index) in docs" :key="index">
        <td>{{index+1}}.</td>
        <td>{{d.name}}</td>
        <td><a href="#" target="_blank">{{d.docs}}</a></td>
        <td>3</td>
        <td>
          <router-link :to="{name: 'aDocDetail', params:{id:d.id}}" class="text-success p-2 bg-white"><i class="fa fa-eye"></i></router-link>
          <a href="#" class="text-warning p-2 bg-white"><i class="fa fa-edit"></i></a>
          <a href="javascript:" @click="deleteDoc(d.id)" class="text-danger p-2 bg-white"><i class="fa fa-trash"></i></a>
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
      fileDocx: '',
      docs: []
    }
  },
  methods: {
    changeDocx(e) {
      this.fileDocx = e.target.files[0]
    },
    createDoc() {
      var fd = new FormData()
      fd.append("name", this.$refs.name.value)
      fd.append("doc", this.fileDocx)
      this.axios.post(`${this.api}/docs`, fd, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        if (res.data.status) {
          this.getDocs()
          this.toastr.success("Berhasil menambah dokumen baru!")
          $("#exampleModal").modal("hide")
        }
        else {
          if (res.data.err === "notDocx") {
            this.toastr.warning("Dokumen ini bukan file .docx!")
          }
          else {
            this.toastr.error("Terjadi kesalahan sistem!")
          }
        }
      })
    },
    getDocs() {
      this.axios.get(`${this.api}/docs`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.docs = res.data.res
      }).then(() => {
        $('#datas').DataTable()
      })
    },
    deleteDoc(id) {
      this.swal({
        title: "Hapus dokumen ini?",
        text: "Penting! Menghapus dokumen ini akan menghapus seluruh salinan dan data dokumen.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.axios.delete(`${this.api}/docs/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            if (res.data.status) {
              this.toastr.success("Berhasil menghapus dokumen!")
              this.getDocs()
            } else {
              this.toastr.error("Gagal menghapus dokumen!")
            }
          })
        }
      })
    }
  },
  mounted() {
    this.getDocs()
  }
}
</script>
