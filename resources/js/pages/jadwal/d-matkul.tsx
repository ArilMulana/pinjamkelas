import { CirclePlus, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState} from "react";
import { Jadwal, JadwalRuangan } from "../../hooks/jadwal/use-jadwalruangan";
import DataTable from "@/hooks/datatables/use-datatables";

export function JadwalMatkul() {
     const {jadwalRuangan} = JadwalRuangan();
const data = useMemo<Jadwal[]>(() => {
  return jadwalRuangan.map((item) => ({
    gedung: item.rooms.floor.building.name,
    lantai: item.rooms.floor.floor_number,
    ruangan: item.rooms.name,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_selesai: item.jam_selesai,
    matkul: item.matakuliah_program_studi.matakuliah.nama_matakuliah,
    prodi: item.matakuliah_program_studi.programstudi.nama_program_studi,
    aksi: (
      <div className="flex items-center gap-2">
        <button className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          <CirclePlus size={14} color="white" />
          <span>Edit</span>
        </button>
        <button className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
          <Trash2 size={14} color="white" />
          <span>Hapus</span>
        </button>
      </div>
    ),
  }));
}, [jadwalRuangan]);

const columns:ColumnDef<Jadwal>[] = [

  {
    header: "Gedung",
    accessorKey: "gedung",
  },

  {
    header: "Lantai",
    accessorKey: "lantai",
  },
  {
    header: "Ruangan",
    accessorKey: "ruangan",
  },
  {
    header: "Hari",
    accessorKey: "hari",
  },
    {
      header: "Waktu",
      accessorFn: (row) => `${row.jam_mulai} - ${row.jam_selesai}`,
      id: "waktu",
      cell: (info) => info.getValue(),
    },
  {
    header: "Matakuliah",
    accessorKey: "matkul",
  },
  {
    header: "Program Studi",
    accessorKey: "prodi",
  },

 {
      header: "Aksi",
      accessorKey: "aksi",
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
];

const [modalOpen, setModalOpen] = useState(false);

function showModal(){
    // Function to show modal for adding new schedule
    console.log("Show modal for adding new schedule");
    setModalOpen(true);
    // Implement modal logic here

}
  return (

    <div className="overflow-x-auto text-black bg-white p-6 rounded-lg shadow-md">
    <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-3">Jadwal Matakuliah</h1>
        <div className="flex justify-end">
            <button
            onClick={showModal}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-200">
            <CirclePlus size={16} color="white" />
            Tambah Jadwal
            </button>
        </div>
          <DataTable data={data} columns={columns} />
    </div>
    {modalOpen && (
 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
    <h2 className="text-2xl font-semibold mb-6 text-center">Tambah Jadwal</h2>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GEDUNG + LANTAI */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Gedung & Lantai)</label>
        <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
          <optgroup label="Gedung A">
            <option value="Gedung A - Lantai 1">Lantai 1</option>
            <option value="Gedung A - Lantai 2">Lantai 2</option>
          </optgroup>
          <optgroup label="Gedung B">
            <option value="Gedung B - Lantai 1">Lantai 1</option>
            <option value="Gedung B - Lantai 2">Lantai 2</option>
            <option value="Gedung B - Lantai 3">Lantai 3</option>
          </optgroup>
        </select>
      </div>

      {/* RUANGAN */}
      <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
        <select className="border border-gray-300 rounded-md px-3 py-2 w-full" id="">
            <option value="">Pilih Ruangan</option>
            <option value="Ruang A101">Ruang A101</option>
            <option value="Ruang A102">Ruang A102</option>
            <option value="Ruang B201">Ruang B201</option>
            <option value="Ruang B202">Ruang B202</option>
            <option value="Ruang C301">Ruang C301</option>
            <option value="Ruang C302">Ruang C302</option>
        </select>
      </div>

     <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Hari & Jam</label>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* HARI */}
            <div>
            <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                <option value="">Pilih Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
            </select>
            </div>

            {/* JAM MULAI */}
            <div>
            <input
                type="time"
                step="60"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Jam Mulai"
            />
            </div>

            {/* JAM SELESAI */}
            <div>
            <input
                type="time"
                step="60"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Jam Selesai"
            />
            </div>
        </div>
        </div>

      {/* PROGRAM STUDI + MATAKULIAH */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Matakuliah (berdasarkan Program Studi)</label>
        <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
          <optgroup label="Teknik Informatika">
            <option value="Pemrograman Dasar">Pemrograman Dasar</option>
            <option value="Struktur Data">Struktur Data</option>
            <option value="Basis Data">Basis Data</option>
          </optgroup>
          <optgroup label="Sistem Informasi">
            <option value="Manajemen Proyek TI">Manajemen Proyek TI</option>
            <option value="Analisis Sistem">Analisis Sistem</option>
          </optgroup>
          <optgroup label="Teknik Elektro">
            <option value="Rangkaian Listrik">Rangkaian Listrik</option>
            <option value="Elektronika Dasar">Elektronika Dasar</option>
          </optgroup>
        </select>
      </div>
    </form>

    {/* BUTTONS */}
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={() => {
          console.log("Cancel adding new schedule");
          setModalOpen(false);
        }}
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-200"
      >
        Batal
      </button>
      <button
        onClick={() => {
          console.log("Save new schedule");
          setModalOpen(false);
        }}
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Simpan
      </button>
    </div>
  </div>
</div>

    )}
    </div>
  );
}
