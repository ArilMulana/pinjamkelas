import { useState, useMemo, useEffect, useCallback} from 'react';
import { usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

type Building = { id: number; name: string ; code:string; lokasi:string; };
type FloorData = { id: number; building: Building; floor_number: number };
type FloorForm = { building_id: number; floor_number: number };

export function DFloor() {

  const { buildings, floors } = usePage<{ buildings: Building[]; floors: FloorData[] }>().props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FloorForm>({ building_id: 0, floor_number: 0 });
  const [data, setData] = useState<FloorData[]>(floors);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [loading,setLoading] = useState(false);
   const [exists, setExists] = useState<boolean | null>(null);
   //console.log(buildings);
  //edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId,setEditId] = useState<number | null>(null);


  // Group lantai per gedung
  const floorsByBuilding = data.reduce<Record<number, FloorData[]>>((acc, floor) => {
    if (!acc[floor.building.id]) acc[floor.building.id] = [];
    acc[floor.building.id].push(floor);
    return acc;
  }, {});

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'building_id' ? parseInt(value) || 0 : Number(value),
    }));
  };

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!form.building_id || !form.floor_number) {
      Swal.fire('Gagal', 'Semua field harus diisi.', 'error');
      return;
    }
    if(isEditMode && editId != null){
        router.put(route('floor.update',editId),form,{
            onSuccess: (page)=>{
                const updatedFloors = ((page.props as unknown) as {floors:FloorData[]}).floors;
                setData(updatedFloors);
                setModalOpen(false);
                setIsEditMode(false);
                setEditId(null);
                setLoading(false);
                setExists(null);
                setForm({ building_id: 0, floor_number:0 });
                Swal.fire('Sukses','Lantai Berhasil diperbarui','success');
            },
            onError:()=> Swal.fire('Gagal','Terjadi kesalahan saat mengedit','error'),
        });
    }else{
        router.post(route('floor.store'), form, {
            onSuccess: (page) => {
            const updatedFloors = ((page.props as unknown) as { floors: FloorData[] }).floors;
            setData(updatedFloors);
            setForm({ building_id: 0, floor_number: 0 });
            setModalOpen(false);
            setLoading(false);
            setExists(null);
            Swal.fire('Sukses', 'Lantai berhasil ditambahkan!', 'success');
        },
        onError: () => {
            Swal.fire('Gagal', 'Mohon check kembali apakah lantainya sudah ada apa belum.', 'error');
        },
        });
    }
  },[editId,form,isEditMode]);

   const handleDelete = useCallback((id: number)=> {
      Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Data yang dihapus tidak bisa dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
        router.delete(route('floor.destroy',id),
            {
            onSuccess: () => {
                Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success')
                router.visit(route('floor'));
            },
            onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
          });
        }
      });
    },[]);

    const handleEdit= useCallback((floor:FloorData)=>{
        setForm({
            building_id:floor.building.id,
            floor_number:floor.floor_number
        });
        setSelectedFloor(floor);
        setEditId(floor.id);
        setIsEditMode(true);
        setModalOpen(true);
    },[]);

const handleAddNewItem = () => {
    setEditId(null); // Pastikan ID di-reset
    setForm({building_id:0,floor_number:0}); // Reset form
    setIsEditMode(false);  // Menandakan modal tambah, bukan edit
    setModalOpen(true);  // Buka modal
};
    //filtered
    const [search, setSearch] = useState('');
    const filteredBuilding = useMemo(()=>{
        if (!search) return buildings;
        return buildings.filter(building =>
        building.name.toLowerCase().includes(search.toLowerCase()) ||
        building.lokasi.toLowerCase().includes(search.toLowerCase()) ||
        building.code.toLowerCase().includes(search.toLowerCase())
        )
    },[search,buildings])

          // Pagination
        const itemsPerPage = 5;
        const totalPages = Math.ceil(filteredBuilding.length / itemsPerPage);
        const [currentPage, setCurrentPage] = useState(1);

        const paginatedGedungs = useMemo(()=>{
            return filteredBuilding.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
            )},[currentPage,filteredBuilding]);

        // Pagination handlers
        const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
        const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
        const handlePageClick = (page: number) => setCurrentPage(page);

        useEffect(() => {
          if (search.trim() !== '') {
            setSelectedBuildingId(null);
          }
        }, [search]);

    const [selectedFloor, setSelectedFloor] = useState<FloorData | null>(null);

    // state untuk menyimpan data lama (original)
    const [originalBuildingId, setOriginalBuildingId] = useState("");
    const [originalFloorNumber, setOriginalFloorNumber] = useState("");

    // isi state ketika selectedFloor berubah
    useEffect(() => {
    if (selectedFloor) {
        setOriginalBuildingId(String(selectedFloor.building.id));
        setOriginalFloorNumber(String(selectedFloor.floor_number));
    } else {
        setOriginalBuildingId("");
        setOriginalFloorNumber("");
    }
    }, [selectedFloor]);

// cek apakah ada perubahan data
   const isFieldChanged = useMemo(() => {
    if (!selectedFloor) return false; // kalau tambah baru, dianggap false
    return (
        String(originalBuildingId) !== String(form.building_id) ||
        String(originalFloorNumber) !== String(form.floor_number)
    );
    }, [originalBuildingId,originalFloorNumber, form,selectedFloor]);

// state disable button
const isDisabled =
  loading ||         // tombol disable saat loading
  !!exists ||        // paksa exists jadi boolean, null → false
  (selectedFloor?.id !== undefined && !isFieldChanged);

const checkData = useCallback(async () => {
  // edit tapi tidak ada perubahan → skip fetch
  if (selectedFloor && !isFieldChanged) {
    setExists(false);
    return;
  }

  // kalau field kosong → reset exists dan skip
  if (!form.building_id || !form.floor_number) {
    setExists(false);
    return;
  }
  try {
    const response = await fetch(
      `/dashboard/floor/cek-floor?building_id=${encodeURIComponent(
        form.building_id
      )}&floor_number=${encodeURIComponent(form.floor_number)}`
    );

    if (!response.ok) throw new Error("Gagal terhubung ke server");

    const data = await response.json();
    setExists(!!data.exists); // paksa boolean
  } catch (err) {
    console.error("Gagal mengecek data:", err);
    setExists(false);
  }
}, [form.building_id, form.floor_number, isFieldChanged, selectedFloor]);


// otomatis cek ketika input berubah
useEffect(() => {
  checkData();
}, [checkData]);

 const gedungOption = useMemo(()=>{
    return buildings.map((item)=>({
        label:`${item.name} - ${item.code}`,
        value:item.id
    }))
 },[buildings]);

function cancelModal(){
    setExists(null);
    setModalOpen(false);
}
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Lantai</h1>
        <button
          onClick={handleAddNewItem}
          className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + Tambah Lantai
        </button>
      </div>
         {/* Search Input */}
        <input
          type="text"
          placeholder="Cari Gedung,Lokasi"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
                 {isEditMode ? 'Edit Lantai' : 'Tambah Lantai Baru'}
                </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gedung</label>
                <select
                  name="building_id"
                  value={form.building_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isEditMode}
                  required
                >
                  <option value={0}>-- Pilih Gedung --</option>
                  {gedungOption.map((item)=>
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nomor Lantai</label>
                <input
                  type="number"
                  name="floor_number"
                 onBlur={checkData}
                  value={form.floor_number || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min={1}
                  required
                />
           {exists !== null && (
            <p
                className={`mt-1 ${
                exists ? 'text-red-600' : 'text-green-600'
                }`}
            >
                {exists ? 'Data sudah ada.' : 'Data tersedia.'}
            </p>
            )}

              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={cancelModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                type="submit"
                disabled={isDisabled}
                className={`px-4 py-2 text-white rounded ${
                    isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                }`}
                >
                {loading ? 'Menyimpan...' : exists === true ? 'Kode Duplikat' : 'Simpan'}
            </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
        <thead className="bg-gray-100">
            <tr>
            {['No','Kode', 'Gedung', 'Lokasi', 'Jumlah Lantai'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-medium uppercase">
                {head}
                </th>
            ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGedungs.length === 0 ? (
            <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                Data tidak ditemukan.
                </td>
            </tr>
            ) : (
            paginatedGedungs.map((building, idx) => {
                const floorsForBuilding = floorsByBuilding[building.id] || [];
                const isSelected = selectedBuildingId === building.id;
                return (
                <tr key={building.id} >
                    <td className="px-4 py-2 text-sm">{idx + 1}</td>
                    <td className="px-4 py-2 text-sm">{building.code}</td>
                    <td className="px-4 py-2 text-sm">{building.name}</td>
                    <td className="px-4 py-2 text-sm">{building.lokasi}</td>
                    <td
                    className="px-4 py-2 "
                    onClick={() => setSelectedBuildingId(isSelected ? null : building.id)}
                    >
                        <span className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"> {floorsForBuilding.length}</span>

                    </td>
                </tr>
                );
            })
            )}
        </tbody>
        </table>
  {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          Prev
        </button>
        <div className="space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                page === currentPage ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === totalPages || totalPages === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:bg-indigo-100'
          }`}
        >
          Next
        </button>
      </div>
          {selectedBuildingId && (
            <div className="bg-white shadow-md rounded-md p-6 mt-4 max-w-xl mx-auto border border-gray-300">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Detail Lantai di:
                 <span className="text-indigo-600 font-bold">
                       {buildings.find(b => b.id === selectedBuildingId)?.name
                }
                    </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                {(floorsByBuilding[selectedBuildingId] || []).map(floor => (
                    <div key={floor.id} className="flex items-center justify-between mb-2">
                        <span className="bg-indigo-100 px-4 py-2 rounded-full font-semibold text-sm text-indigo-900" >Lantai {floor.floor_number}</span>
                        <button
                        onClick={() => {
                            handleEdit(floor);
                        }}
                        className='inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-blue-600 hover:bg-red-100 hover:text-blue-800 transition'>
                            <i className='cursor-pointer fas fa-edit'></i>
                        </button>
                        <button
                          onClick={() => {
                            //console.log('Deleting floor with ID:', floor.id);
                            handleDelete(floor.id);
                            }}
                        className=" rounded-md text-sm text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                            >
                                <i className="cursor-pointer fas fa-trash"></i>
                            </button>

                    </div>

                ))}
                </div>
            </div>
            )}


      </div>
    </div>
  );
}
