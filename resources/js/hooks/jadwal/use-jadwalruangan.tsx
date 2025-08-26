import { usePage } from "@inertiajs/react";

export type Jadwal = {
  gedung: string;
  lantai: number;
  ruangan: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  matkul: string;
  prodi: string;
  aksi: React.ReactNode;
};

export type JadwalRuangan = {
  id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  rooms: {
    id:number;
    name: string;
    floor: {
        id:number;
      floor_number: number;
      building: {
        name: string;
      };
    };
  };
  matakuliah_program_studi: {
    id:number;
    matakuliah: {
      nama_matakuliah: string;
    };
    programstudi: {
      nama_program_studi: string;
    };
  };
};
//ngambil data matkul
export function JadwalRuangan(){
      const {jadwalRuangan} = usePage<{
               jadwalRuangan: JadwalRuangan[];
               }>().props;

        return {jadwalRuangan};
}




