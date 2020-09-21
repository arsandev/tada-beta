<template>
  <div>
    <NavModule :doc="docsData.name" :menu="menu"/>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{partyDetail.name}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h6>Data:</h6>
            <ul class="list-group">
              <li v-for="(d, index) in partyDetail.data" class="list-group-item d-flex justify-content-between align-items-center">
                {{d.name}}
                <span
                :title="d.required?'Data ini wajib diisi (tidak boleh kosong) oleh pihak terlibat.':'Data ini boleh untuk tidak diisi pihak terlibat.'"
                class="badge badge-pill" :class="d.required?'badge-success':'badge-danger'">{{d.required?'Diwajibkan':'Tidak Wajib'}}</span>
                <span
                :title="d.canBeChanged?'Isi data yang diatur masih bisa diubah oleh pihak terlibat.':'Isi data ini telah daitur oleh admin dan tidak bisa diubah oleh pihak terlibat.'"
                class="badge badge-pill" :class="d.canBeChanged?'badge-success':'badge-danger'">{{d.canBeChanged?'Bisa Diubah':'Tidak Bisa Diubah'}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <router-link :to="{ name: 'aPartyCreate' }" class="mt-3 btn-sm btn btn-primary mb-3"><i class="fa fa-plus"></i> Tambah Pihak</router-link>
    <table id="datas" class="text-center table table-striped table-bordered" style="width:100%">
      <thead>
        <tr>
          <th>Pihak Ke-</th>
          <th>Nama</th>
          <th>Jumlah Data</th>
          <th>Opsi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, index) in parties" :key="index">
          <td>{{index+1}}</td>
          <td>{{d.name}}</td>
          <td>{{JSON.parse(d.data).length}}</td>
          <td>
            <a href="javascript:" @click="getPartyDetail(d.id)" class="text-success p-2 bg-white"><i class="fa fa-eye"></i></a>
            <router-link :to="{name:'aDocSettingPartyShow', params:{id_party:d.id}}" class="text-warning p-2 bg-white"><i class="fa fa-edit"></i></router-link>
            <a href="javascript:" @click="deleteParty(d.id)" class="text-danger p-2 bg-white"><i class="fa fa-trash"></i></a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import NavModule from '@/components/NavModule.vue'
export default {
  components: {
    NavModule
  },
  props: ['docsData'],
  data() {
    return {
      parties: [],
      partyDetail: {
        name: '',
        data: ''
      },
      menu: [
        {
          name: "Halaman Utama Dokumen",
          to: {name: "aDocDetail"}
        }
      ]
    }
  },
  methods: {
    getPartyDetail(id) {
      this.axios.get(`${this.api}/doc_party/${id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        this.partyDetail.name = res.data.res[0].name
        this.partyDetail.data = JSON.parse(res.data.res[0].data)
        $("#exampleModal").modal("show")
      })
    },
    deleteParty(id) {
      this.swal({
        title: "Hapus pihak ini?",
        text: "Menghapus pihak ini akan menghapus data pada pihak di dokumen ini.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.axios.delete(`${this.api}/doc_party/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            if (res.data.status) {
              this.toastr.success("Berhasil menghapus pihak!")
              this.getParties()
            } else {
              this.toastr.error("Gagal menghapus data!")
            }
          })
        }
      })
    },
    getParties() {
      this.axios.get(`${this.api}/doc_party/id_doc/${this.$route.params.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).then(res => {
        this.parties = res.data.res
      }).then(() => {
        $('#datas').DataTable()
      })
    }
  },
  mounted() {
    this.getParties()
  }
}
</script>
