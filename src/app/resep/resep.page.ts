import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-resep',
  templateUrl: './resep.page.html',
  styleUrls: ['./resep.page.scss'],
})
export class ResepPage implements OnInit {
  resepList: any[] = [];
  namaResep: string = '';
  langkah: string = '';
  selectedResep: any = null;
  isModalOpen: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadResep();
  }

  loadResep() {
    this.authService.getResep().subscribe((res) => {
      if (res && res.status === 'success') {
        this.resepList = res.data;
      } else {
        this.authService.notifikasi(res.message || 'Gagal memuat data resep.');
      }
    });
  }

  addResep() {
    if (this.namaResep.trim() && this.langkah.trim()) {
      this.authService
        .addResep(this.namaResep, this.langkah)
        .subscribe((res) => {
          if (res && res.status === 'success') {
            this.authService.notifikasi(
              res.message || 'Resep berhasil ditambahkan.'
            );
            this.closeModal();
            this.loadResep();
          } else {
            this.authService.notifikasi(
              res.message || 'Gagal menambahkan resep.'
            );
          }
        });
    } else {
      this.authService.notifikasi('Nama resep dan langkah harus diisi.');
    }
  }

  editResep() {
    if (this.selectedResep && this.namaResep.trim() && this.langkah.trim()) {
      this.authService
        .editResep(this.selectedResep.id_resep, this.namaResep, this.langkah)
        .subscribe((res) => {
          if (res && res.status === 'success') {
            this.authService.notifikasi('Resep berhasil diperbarui.');
            this.closeModal();
            this.loadResep();
          } else {
            this.authService.notifikasi('Gagal memperbarui resep.');
          }
        });
    } else {
      this.authService.notifikasi('Semua data harus diisi.');
    }
  }

  deleteResep(id: number) {
    this.authService.deleteResep(id).subscribe((res) => {
      if (res && res.status === 'success') {
        this.authService.notifikasi('Resep berhasil dihapus.');
        this.loadResep();
      } else {
        this.authService.notifikasi('Gagal menghapus resep.');
      }
    });
  }

  openAddResepModal() {
    this.isModalOpen = true;
    this.namaResep = '';
    this.langkah = '';
    this.selectedResep = null;
  }

  openEditResepModal(resep: any) {
    this.isModalOpen = true;
    this.selectedResep = resep;
    this.namaResep = resep.nama_resep;
    this.langkah = resep.langkah;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveResep() {
    if (this.selectedResep) {
      this.editResep();
    } else {
      this.addResep();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
