import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Room {
  id: number;
  floor_id: number;
  name: string;
  capacity: number;
  is_active: number;
  floor?: Floor;
}

interface Floor {
  id: number;
  floor_number: number;
  rooms: Room[];
  building_id: number;
}

interface Building {
  id: number;
  name: string;
  lokasi: string;
  code: string;
  floors: Floor[];
}

type RoomData = { id: number; floor_id: number; name: string; capacity: number };

export function DRoom() {
  const {rooms, buildings } = usePage<{ rooms: Room[]; buildings: Building[] }>().props;

  // States
  const [expandedBuildingId, setExpandedBuildingId] = useState<number | null>(null);
  const [data, setData] = useState<RoomData[]>(rooms);
  const [roomName, setRoomName] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState<number | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [totalCapacity, setCapacity] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Room | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading,setLoading] = useState(false);
  useEffect(() => setData(rooms), [rooms]);

  // Filtering Buildings based on search term
  const filteredBuilding = useMemo(() => {
    if (!search) return buildings;
    return buildings.filter(building =>
      building.name.toLowerCase().includes(search.toLowerCase()) ||
      building.lokasi.toLowerCase().includes(search.toLowerCase()) ||
      building.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, buildings]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBuilding.length / itemsPerPage);
  const paginatedGedungs = useMemo(()=>{
    return filteredBuilding.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );
    },[filteredBuilding,itemsPerPage,currentPage]);

  // Building toggle handler
  const toggleBuilding = useCallback((id: number) => {
    setExpandedBuildingId(expandedBuildingId === id ? null : id);
    setSelectedFloorId(null);
  },[expandedBuildingId]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  useEffect(() => {
    if (search.trim() !== '') {
      setExpandedBuildingId(null);
      setSelectedFloorId(null);
    }
  }, [search]);

  const selectedBuilding = useMemo(() => {
  return buildings.find(b => b.id === selectedBuildingId) || null;
}, [selectedBuildingId, buildings]);

  // Handle adding a new item
  const handleAddNewItem = useCallback(()=> {
    setEditId(null);
    setSelectedFloorId(null);
    setRoomName('');
    setCapacity(null);
    setIsEditMode(false);
    setModalOpen(true);
    setSelectedBuildingId(null);
  },[]);

  // Handle editing an existing room
  const handleEdit = useCallback((roomId: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return console.warn('Room not found');

    setForm(room);
    setEditId(room.id);
    setRoomName(room.name);
    setCapacity(room.capacity);
    setIsEditMode(true);
    setModalOpen(true);
    setSelectedBuildingId(room.floor?.building_id ?? null);
  },[rooms]);

  // Handle form submission for both add and edit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedFloorId || !roomName.trim() || !totalCapacity) {
      return alert('Mohon isi semua field');
    }

    const payload = { name: roomName, capacity: totalCapacity };

    if (form && editId !== null) {
      router.put(route('room.update', editId), payload, {
        onSuccess: (page) => {
          const updatedRooms = (page.props as unknown as { rooms: RoomData[] }).rooms;
          setData(updatedRooms);
          resetFormState();
          setLoading(false);
          Swal.fire('Sukses', 'Ruangan berhasil diperbarui', 'success');
        },
        onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat mengedit', 'error')
      });
    } else {
      router.post(route('room.store'), {
        floor_id: selectedFloorId,
        name: roomName,
        capacity: totalCapacity }, {
        onSuccess: () => {
          resetFormState();
           setLoading(false);
          Swal.fire('Sukses', 'Ruangan berhasil ditambahkan', 'success');
        },
        onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan', 'error')
      });
    }
  },[editId,form,roomName,selectedFloorId,totalCapacity]);

  const handleDelete = useCallback((id:number)=>{
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
            router.delete(route('room.destroy',id),
                {
                onSuccess: () => {
                    Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success')
                    router.visit(route('room'));
                },
                onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
              });
            }
          });
  },[]);
  const resetFormState = () => {
    setModalOpen(false);
    setRoomName('');
    setSelectedBuildingId(null);
    setSelectedFloorId(null);
    setCapacity(null);
    setIsEditMode(false);
    setForm(null);
    setEditId(null);
  };

  // Filter rooms by selected floor
  const selectedFloorRooms = useMemo(()=>{
    return data.filter(room => room.floor_id === selectedFloorId)},[data,selectedFloorId]);

    // helper function untuk teks tombol
const getButtonText = () => {
  if (loading) return "Loading...";
  return "Ruangan Tersedia";
};

// helper function untuk disabled state
const isButtonDisabled = () => {
  if (loading) return true;          // tombol disable saat loading
  return false;
    };
  return (


    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Ruangan</h1>
        <button onClick={handleAddNewItem} className="cursor-pointer inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          + Tambah Ruangan
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari Gedung, Lokasi"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Gedung Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {['No','Kode','Gedung', 'Lokasi', 'Jumlah Lantai'].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-medium uppercase">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGedungs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">Data tidak ditemukan.</td>
              </tr>
            ) : (
              paginatedGedungs.map((building, idx) => (
                <tr key={building.id}>
                  <td className="px-4 py-2 text-sm">{idx + 1}</td>
                  <td className="px-4 py-2 text-sm">{building.code}</td>
                  <td className="px-4 py-2 text-sm">{building.name}</td>
                  <td className="px-4 py-2 text-sm">{building.lokasi}</td>
                  <td onClick={() => toggleBuilding(building.id)} className="px-4 py-2 ">

                    <span className='cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition'>{building.floors.length}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lantai dan Ruangan Toggle */}
      {expandedBuildingId && (() => {
        const building = buildings.find((b) => b.id === expandedBuildingId);
        if (!building) return null;

        const selectedFloor = selectedFloorId
          ? building.floors.find((f) => f.id === selectedFloorId)
          : null;

        return (
          <div className="bg-white shadow-md rounded-md p-6 mt-4 max-w-xl mx-auto border border-gray-300">
            <h2 className="text-lg font-semibold mb-2">Lantai di <span className="text-indigo-600 font-bold">{building.name}</span></h2>
            <div className="flex flex-wrap gap-3">
              {building.floors.map((floor) => (
                <span
                  key={floor.id}
                  onClick={() => setSelectedFloorId(floor.id)}
                  className="cursor-pointer bg-indigo-100 px-4 py-2 rounded-full font-semibold text-sm text-indigo-900"
                >
                  Lantai {floor.floor_number}
                </span>
              ))}
            </div>

            {selectedFloorId && (
              <div className="mt-4">
                {selectedFloorRooms.length > 0 ? (
                  <>
                    <h3 className="text-md font-medium mb-2 text-gray-800">Daftar Ruangan di Lantai {selectedFloor?.floor_number}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFloorRooms.map((room) => (
                        <div key={room.id}>
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-100 px-4 py-2 rounded-full font-semibold text-sm text-indigo-900">{room.name}</span>
                            <button onClick={() => handleEdit(room.id)} className="hover:bg-blue-100 text-blue-900">
                              <span className="fa fa-edit cursor-pointer" />
                            </button>
                            <button onClick={()=>{

                                handleDelete(room.id)
                                //console.log(room.id);
                                }}
                                className="hover:bg-red-100 text-red-600">
                              <span className="fa fa-trash cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">Tidak ada ruangan di lantai ini.</p>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}>
          Prev
        </button>
        <div className="space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${page === currentPage ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'}`}
            >
              {page}
            </button>
          ))}
        </div>
        <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100'}`}>
          Next
        </button>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit Ruangan' : 'Tambah Ruangan'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Gedung</label>
                <select
                  name="building_id"
                  value={selectedBuildingId ?? ''}
                  onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  disabled={isEditMode}
                  required
                >
                  <option value="" disabled>Pilih Gedung</option>
                  {buildings.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nomor Lantai</label>
                <select
                  name="floors_id"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedFloorId ?? ''}
                  onChange={(e) => setSelectedFloorId(Number(e.target.value))}
                  disabled={isEditMode}
                >
                  <option value="" disabled>Pilih Lantai</option>
                  {selectedBuildingId && selectedBuilding?.floors.map(floor => (
                    <option key={floor.id} value={floor.id}>Lantai {floor.floor_number}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nama Ruangan</label>
                <input
                  name="ruangan"
                  type="text"
                  placeholder="Isi nama ruangan"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Kapasitas</label>
                <input
                  name="kapasitas"
                  type="number"
                  placeholder="Jumlah kapasitas"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={totalCapacity ?? ''}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
            type="submit"
            disabled={isButtonDisabled()}
            className={`px-4 py-2 rounded text-white transition-colors duration-200
                ${isButtonDisabled()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                }`}
            >
            {getButtonText()}
            </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
