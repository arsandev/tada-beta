<template>
<div>
  <button class="btn btn-primary" data-toggle="modal" data-target=".modal"><i class="fa fa-plus"></i> Tambah User</button>
  <hr>
  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tambah User Baru</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form method="post" @submit.prevent="createUser()">
          <div class="modal-body">
            <div>
              <b>Username</b>
              <input ref="username" type="text" autocomplete="off" class="form-control" placeholder="buat username baru">
            </div>
            <div class="mt-3">
              <b>Password</b>
              <input ref="password" type="text" autocomplete="off" class="form-control" placeholder="buat password baru">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
            <button type="submit" class="btn btn-primary"><i class="fa fa-plus"></i> Tambah</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <table id="datas" class="text-center table table-striped table-bordered" style="width:100%">
    <thead>
      <tr>
        <th>No.</th>
        <th>Username</th>
        <th>Password</th>
        <th>Opsi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(u, index) in users" :key="index">
        <td>{{index+1}}.</td>
        <td v-if="update.trigger !== u.id">{{u.username}}</td>
        <td v-else>
          <input type="text" v-model="update.username" class="form-control" placeholder="masukan username baru" autocomplete="off">
          <br>
        </td>
        <td v-if="update.trigger !== u.id">*****</td>
        <td v-else>
          <input type="text" v-model="update.password" class="form-control" placeholder="masukan password baru" autocomplete="off">
          <small class="text-danger">*kosongkan bila tidak ingin diubah</small>
        </td>
        <td v-if="update.trigger !== u.id">
          <router-link :to="{name: 'aUsersDetail', params:{id:u.id}}" class="text-success p-2 bg-white"><i class="fa fa-eye"></i></router-link>
          <a href="javascript:" @click="triggeringUpdate(u.id, u.username)" class="text-warning p-2 bg-white"><i class="fa fa-edit"></i></a>
          <a href="javascript:" @click="deleteUser(u.id)" class="text-danger p-2 bg-white"><i class="fa fa-trash"></i></a>
        </td>
        <td v-else>
          <button type="button" @click="updateUser(u.id)" class="btn btn-success btn-sm"><i class="fa fa-check"></i></button>
          <button type="button" @click="resetTriggerUpdate()" class="btn btn-danger btn-sm"><i class="fa fa-times"></i></button>
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
      users: [],
      vuebleUsers: [],
      update: {
        trigger: false,
        username: '',
        password: ''
      }
    }
  },
  methods: {
    getUsers() {
      this.axios.get(`${this.api}/users`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        this.users = res.data.res
      }).then(() => {
        $('#datas').DataTable()
      })
    },
    createUser() {
      this.axios.post(`${this.api}/users`, {
        username: this.$refs.username.value,
        password: this.$refs.password.value
      }, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        if (res.data.status) {
          this.getUsers()
          this.toastr.success("Berhasil menambah user baru!")
          $("#exampleModal").modal("hide")
        } else {
          if (res.data.err === "usernameExists") {
            this.toastr.warning("Username ini sudah ada!")
          }
        }
      })
    },
    deleteUser(id) {
      this.swal({
        title: "Hapus user ini?",
        text: "Menghapus user ini akan me-reset pihak pada dokumen yang melibatkan user ini.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          this.axios.delete(`${this.api}/users/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(res => {
            if (res.data.status) {
              this.toastr.success("Berhasil menghapus user!")
              this.getUsers()
            } else {
              this.toastr.error("Gagal menghapus data!")
            }
          })
        }
      })
    },
    triggeringUpdate(id, username) {
      this.update.trigger = id
      this.update.username = username
    },
    resetTriggerUpdate() {
      this.update.trigger = false
      this.update.username = ''
      this.update.password = ''
    },
    updateUser(id) {
      this.axios.put(`${this.api}/users/${id}`, {
        username: this.update.username,
        password: this.update.password
      }, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      }).then(res => {
        if (res.data.status) {
          this.toastr.success("Berhasil mengubah user!")
          this.getUsers()
          this.resetTriggerUpdate()
        } else {
          this.toastr.error("Gagal mengubah data!")
        }
      })
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>
