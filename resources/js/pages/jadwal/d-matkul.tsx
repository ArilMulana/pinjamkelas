import { CirclePlus, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState} from "react";
import { Jadwal, JadwalRuangan } from "../../hooks/jadwal/use-jadwalruangan";
import DataTable from "@/hooks/datatables/use-datatables";
import { Ruangan, useDetailLantai } from "@/hooks/lantai/use-lantai";
import { useMatkul } from "@/hooks/matakuliah/use-matakuliah";
import { useFakultas } from "@/hooks/fakultas/use-fakultas";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import axios from "axios";

export function JadwalMatkul() {
     const {jadwalRuangan} = JadwalRuangan();
     const {rooms,floors,buildings} = useDetailLantai();
     const {matprodi} =useMatkul();
     const {prodi}= useFakultas();
    //  console.log("prodi", prodi);
    //console.log("matakuliah prodi",matprodi);
    const [formDataJadwal, setFormDataJadwal] = useState({
       rooms_id: 0,
        matakuliah_id: 0,
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
    });

     //console.log("matprodi", matprodi);
     //const [IdFloor,setIdFloor] = useState<number | null>(null);
     const [selectedIdJadwal,setSelectedIdJadwal] = useState<number | null>(null);
     //const matchProdi = jadwalRuangan.filter((p)=>p.id===selectedIdJadwal);

    const editJadwal = useCallback((id: number) => {
    const jadwal = jadwalRuangan.find(j => j.id === id);
    if (!jadwal) return;

    setFormDataJadwal({
        rooms_id: jadwal.rooms.id,
        matakuliah_id: jadwal.matakuliah_program_studi.id,
        hari: jadwal.hari,
        jam_mulai: jadwal.jam_mulai,
        jam_selesai: jadwal.jam_selesai,
    });
    //console.log(jadwal);

    setSelectedFloorId(jadwal.rooms.floor.id);

  // Set filteredRooms sesuai floor yang dipilih agar dropdown Ruangan sesuai
    setFilteredRooms(rooms.filter(room => room.floor_id === jadwal.rooms.floor.id));

    setModalOpen(true);
    setSelectedIdJadwal(id);
    }, [jadwalRuangan,rooms]);

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
            <button
            onClick={() => editJadwal(item.id)}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
            <CirclePlus size={14} color="white" />
            <span>Edit</span>
            </button>
            <button
            onClick={()=>deleteJadwal(item.id)}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
            <Trash2 size={14} color="white" />
            <span>Hapus</span>
            </button>
        </div>
        ),
    }));
    }, [jadwalRuangan,editJadwal]);

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
function tambahModal(){
   setFormDataJadwal({
    rooms_id: 0,
    matakuliah_id: 0,
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
  });

  setSelectedIdJadwal(null); // <– Mode tambah
  setSelectedFloorId("");    // <– Reset dropdown floor
  setFilteredRooms([]);      // <– Kosongkan ruangan dulu
  setModalOpen(true);

}
   const [selectedFloorId, setSelectedFloorId] = useState<number | "">("");
   const [filteredRooms, setFilteredRooms] = useState<Ruangan[]>([]);
   const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floorId = Number(e.target.value);
  setSelectedFloorId(floorId);
  // Filter ruangan sesuai lantai yang dipilih
  setFilteredRooms(rooms.filter(room => room.floor_id === floorId));
  // Reset rooms_id di form agar Ruangan dropdown ikut reset
  setFormDataJadwal(prev => ({ ...prev, rooms_id: 0 }));
  };

function tambahJadwal(e:React.FormEvent) {
    // Function to handle adding new schedule
    e.preventDefault();
    if(!selectedIdJadwal){
    router.post(route('jadwal-matkul.store'), formDataJadwal, {
            onSuccess: () => {
                console.log("Jadwal berhasil ditambahkan");
                setModalOpen(false);
                setFormDataJadwal({
                    rooms_id: 0,
                    matakuliah_id: 0,
                    hari: "",
                    jam_mulai: "",
                    jam_selesai: "",
                });
                Swal.fire('Sukses', 'Jadwal berhasil ditambahkan', 'success');
                // Optionally, refresh the data or show a success message
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Jadwal gagal ditambahkan. Silakan coba lagi.',
                });
                console.error("Error adding schedule:", error);
                // Handle error, e.g., show an error message
            },
        });
    }else{
          router.put(route('jadwal.update',selectedIdJadwal), formDataJadwal, {
            onSuccess: () => {
                setModalOpen(false);
                setFormDataJadwal({
                    rooms_id: 0,
                    matakuliah_id: 0,
                    hari: "",
                    jam_mulai: "",
                    jam_selesai: "",
                });
                Swal.fire('Sukses', 'Jadwal berhasil di update', 'success');
            },
            onError: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Jadwal gagal diupdate. Silakan coba lagi.',
                });
                console.error("Error adding schedule:", error);
                // Handle error, e.g., show an error message
            },
        });
    }

}

useEffect(() => {
  const selectedMataKuliah = matprodi.find(
    (mk) => mk.id === formDataJadwal.matakuliah_id
  );

  if (selectedMataKuliah && formDataJadwal.jam_mulai) {
    const sks = selectedMataKuliah.matakuliah.sks;
    const tambahanMenit = sks * 45;

    // pastikan jam_mulai selalu format HH:MM
    const [jam, menit] = formDataJadwal.jam_mulai.split(':').map(Number);
    const mulaiDate = new Date();
    mulaiDate.setHours(jam);
    mulaiDate.setMinutes(menit);

    // hitung jam selesai
    mulaiDate.setMinutes(mulaiDate.getMinutes() + tambahanMenit);

    // format jam selesai → "HH:MM"
    const jamSelesaiFormatted = mulaiDate.toTimeString().slice(0, 5);

    // format ulang jam_mulai → "HH:MM"
    const jamMulaiFormatted = `${String(jam).padStart(2, "0")}:${String(menit).padStart(2, "0")}`;

    setFormDataJadwal((prev) => ({
      ...prev,
      jam_mulai: jamMulaiFormatted,
      jam_selesai: jamSelesaiFormatted,
    }));
  }
}, [formDataJadwal.matakuliah_id, formDataJadwal.jam_mulai, matprodi]);

  const [errorBentrok, setErrorBentrok] = useState("");
  const [jadwalTersedia, setJadwalTersedia] = useState("");

  useEffect(() => {
    const { rooms_id, hari, jam_mulai, jam_selesai } = formDataJadwal;

    if (!rooms_id || !hari || !jam_mulai || !jam_selesai) {
      setErrorBentrok("");
      setJadwalTersedia("");
      return;
    }
    axios.post("/cek-jadwal-bentrok", {
        rooms_id,
        hari,
        jam_mulai,
        jam_selesai,
      })
      .then((res) => {
        if (res.data.bentrok) {
          setErrorBentrok(res.data.message || "Jadwal bentrok dengan jadwal lain.");
           setJadwalTersedia(""); // Kosongkan pesan tersedia
        } else {
          setErrorBentrok("");
           setJadwalTersedia("Jadwal tersedia dan tidak bentrok.");
        }
      })
      .catch((
        //err
        ) => {
        setErrorBentrok("Gagal memeriksa jadwal.");
        setJadwalTersedia("");
        //console.error(err);
      });
  }, [formDataJadwal]);

  function cancelModal(){
    setModalOpen(false);
    setFormDataJadwal({
      rooms_id: 0,
      matakuliah_id: 0,
      hari: "",
      jam_mulai: "",
      jam_selesai: "",
    });
    setErrorBentrok("");
    setJadwalTersedia("");
    setSelectedIdJadwal(null); // Reset selected ID when modal is closed
  }

function deleteJadwal(id: number) {
    Swal.fire({
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus Jadwal ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            router.delete(route('jadwal.destroy', id), {
                onSuccess: () => {
                    Swal.fire('Sukses', 'Jadwal berhasil dihapus', 'success');
                },
                onError: () => {
                    Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus Jadwal', 'error');

                }
            });
        }
    });
}
  return (

    <div className="overflow-x-auto text-black bg-white p-6 rounded-lg shadow-md">
    <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-3">Jadwal Matakuliah</h1>
        <div className="flex justify-end">
            <button
            onClick={tambahModal}
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
   <h2 className="text-2xl font-semibold mb-6 text-center">
  {selectedIdJadwal ? 'Edit Jadwal' : 'Tambah Jadwal'}
</h2>
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GEDUNG + LANTAI */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Gedung & Lantai)</label>
        <select
         onChange={handleFloorChange}
         value={selectedFloorId}

        className="border border-gray-300 rounded-md px-3 py-2 w-full">
              <option value="" disabled selected>
                Pilih Gedung dan Lantai
            </option>
              {buildings.map((building) => {
                const floorsInBuilding = floors.filter(
                (floor) => floor.building_id === building.id
                );
                if (floorsInBuilding.length === 0) return null;
                return (
                <optgroup key={building.id} label={building.name}>

                    {floorsInBuilding.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                       {floor.building.name} -
                       Lantai {floor.floor_number}
                    </option>
                    ))}
                </optgroup>
                );
            })}
        </select>
      </div>

      {/* RUANGAN */}
      <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ruangan</label>
     <select
     value={formDataJadwal.rooms_id ||''}
        onChange={(e)=>setFormDataJadwal({...formDataJadwal,rooms_id:Number(e.target.value)})}
     className="border border-gray-300 rounded-md px-3 py-2 w-full" id="">
        <option value="" disabled>
            Pilih Ruangan
        </option>
        {(!filteredRooms || filteredRooms.length === 0) ? (
            <option value="">Tidak ada ruangan tersedia</option>
        ) : (
            filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
                {room.name}
            </option>
            ))
        )}
        </select>
      </div>

     <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Hari & Jam</label>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* HARI */}
            <div>
            <select
            value={formDataJadwal.hari || ''}
            onChange={(e) => setFormDataJadwal({...formDataJadwal, hari: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 w-full">
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
          <Flatpickr
            options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                minuteIncrement: 1,
            }}
            value={formDataJadwal.jam_mulai || ''}
            onChange={([time]) => {
                const formattedTime = time.toTimeString().slice(0, 5);
                setFormDataJadwal({ ...formDataJadwal, jam_mulai: formattedTime });
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />

            {/* JAM SELESAI */}
              <Flatpickr
              disabled
            options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                minuteIncrement: 1,
            }}
            value={formDataJadwal.jam_selesai || ''}
            onChange={([time]) => {
                const formattedTime = time.toTimeString().slice(0, 5);
                setFormDataJadwal({ ...formDataJadwal, jam_selesai: formattedTime });
            }}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />

           {errorBentrok && (
            <div className="mt-2 px-4 py-2 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm">
                {errorBentrok}
            </div>
            )}
            {jadwalTersedia && !errorBentrok && (
            <div className="mt-2 px-4 py-2 rounded-md bg-green-100 text-green-700 border border-green-300 text-sm">
                {jadwalTersedia}
            </div>
            )}
        </div>
        </div>

      {/* PROGRAM STUDI + MATAKULIAH */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Matakuliah (berdasarkan Program Studi)</label>
        <select
        value={formDataJadwal.matakuliah_id || ''}
        onChange={(e) => {
             const newValue = Number(e.target.value);
             console.log("Selected matakuliah_id:", newValue);

            setFormDataJadwal({...formDataJadwal, matakuliah_id: newValue})
        }}
        className="border border-gray-300 rounded-md px-3 py-2 w-full">
               <option value="" disabled>
                Pilih Matakuliah
            </option>
        {prodi.map((prodi) => {
                const matkulInprodi = matprodi.filter(
                (item) => item.programstudi.id === prodi.id
                );
                if (matkulInprodi.length === 0) return null;
                return (
                <optgroup key={prodi.id} label={prodi.nama_program_studi}>
                    {matkulInprodi.map((matkul) => (
                    <option key={matkul.id} value={matkul.id}>
                     {matkul.matakuliah.nama_matakuliah} - {matkul.matakuliah.sks} SKS
                    </option>
                    ))}
                </optgroup>
                );
            })}
        </select>
      </div>
    </form>

    {/* BUTTONS */}
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick ={cancelModal}
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors duration-200"
      >
        Batal
      </button>
     <button
        onClick={tambahJadwal}
        disabled={!jadwalTersedia}
        className={`px-4 py-2 rounded text-white transition-colors duration-200
            ${!jadwalTersedia
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            }`}
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
