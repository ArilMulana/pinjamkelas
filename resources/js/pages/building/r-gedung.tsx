import { usePage, router, useForm } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Gedung {
  id: number;
  name: string;
  code: string;
  lokasi: string;
}

export function Main() {
  const { gedungs } = usePage<{ gedungs: Gedung[] }>().props;

  // States untuk search, pagination, modal dan form
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedGedung, setSelectedGedung] = useState<Gedung | null>(null);
   const [exists, setExists] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', lokasi: '' });
  const [isLoading,setLoading] = useState(false);
 const { errors } = useForm({
    code: '',
  });
  const itemsPerPage = 5;

  // Isi form saat modal dibuka (edit)
  useEffect(() => {
    if (selectedGedung) {
      setFormData({
        name: selectedGedung.name,
        code: selectedGedung.code,
        lokasi: selectedGedung.lokasi,
      });
    }
  }, [selectedGedung]);

  // Filter berdasarkan search (case insensitive)
  const filteredGedungs = useMemo(() => {
    if (!search) return gedungs;
    return gedungs.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase()) ||
      g.lokasi.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, gedungs]);

  // Pagination
  const totalPages = Math.ceil(filteredGedungs.length / itemsPerPage);
  const paginatedGedungs = filteredGedungs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination handlers
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  // Delete dengan konfirmasi SweetAlert
  function handleDelete(id: number) {
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
        router.delete(`/dashboard/building/${id}`, {
          onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'),
          onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
        });
      }
    });
  }

  function cancelModal(){
    setShowModal(false);
    setExists(null);
    // setErrors();
     setFormData({
            name:'',
            code:'',
            lokasi:''
        })
  }  // Membuka modal dan set data gedung yang akan diedit
  function openEditModal(gedung: Gedung) {
    setSelectedGedung(gedung);
    setShowModal(true);
  }

   const checkData = async () => {
    const kode = formData.code;
    //console.log(kode);
     if (selectedGedung && selectedGedung.code === kode) {
        setExists(false); // Tidak ada konflik, kode sama
        return;
    }
    try {
    const response = await fetch(`/dashboard/building/cek?value=${encodeURIComponent(kode)}`);
      if (!response.ok) throw new Error('Gagal terhubung ke server');
    const data = await response.json();
        setExists(data.exists);
    } catch (error) {
         console.error('Gagal mengecek data:', error);
        setExists(false);

    }
    };

    function tambahGedung(){
        setShowModal(true);
        setSelectedGedung(null);

    }
  // Submit form update gedung via PUT
  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (selectedGedung) {
         router.put(`/dashboard/building/${selectedGedung.id}`, formData, {
            onSuccess: () => {
                Swal.fire('Berhasil', 'Data berhasil diperbarui', 'success');
                setShowModal(false);
                setLoading(false);
                   setFormData({
                    name:'',
                    code:'',
                    lokasi:''
                })
            },
            onError: () => {
                Swal.fire('Gagal', 'Terjadi kesalahan saat update', 'error');
                 setLoading(false);
            },

            });
    }else{
           // Create new building
        router.post(route('building.store'), formData, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Gedung berhasil ditambahkan',
                    confirmButtonText: 'OK',
                })
                setLoading(false);
                setShowModal(false);
                setFormData({
                    name:'',
                    code:'',
                    lokasi:''
                })
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Terjadi Kesalahan',
                    confirmButtonText: 'OK',
                });
                 setLoading(false);
            },
        });
        }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Gedung</h1>
        <button
        onClick={tambahGedung}
        className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition"
        >
        Tambah Gedung
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Cari Gedung, Kode, atau Lokasi..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
      />

      {/* Table */}
      <div className="overflow-x-auto text-black">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {['No', 'Kode','Nama', 'Lokasi', 'Aksi'].map((head, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-xs font-medium uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGedungs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (

              paginatedGedungs.map((gedung,index) => (
                <tr key={gedung.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                         <td className="px-4 py-3 text-sm">{gedung.code}</td>
                  <td className="px-4 py-3 text-sm">{gedung.name}</td>
                  <td className="px-4 py-3 text-sm">{gedung.lokasi}</td>
                  <td className="px-4 py-3 text-sm space-x-3">
                    <button
                      onClick={() => openEditModal(gedung)}
                       className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
                    ><i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gedung.id)}
                       className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                    >
                        <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
     {/* Modal Edit */}
{showModal &&  (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">{selectedGedung ? 'Edit Gedung' : 'Tambah Gedung'}</h2>
      <form onSubmit={handleModalSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Gedung
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masukkan nama gedung"
            className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Kode Gedung
          </label>
          <input
            id="code"
            type="text"
            value={formData.code}
            onBlur={checkData}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="Masukkan kode gedung"
            className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                      {exists === true && <p style={{ color: 'red' }}>Data sudah ada.</p>}
                    {exists === false && <p style={{ color: 'green' }}>Data tersedia.</p>}
        </div>

        <div>
          <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi Gedung
          </label>
          <input
            id="lokasi"
            type="text"
            value={formData.lokasi}
            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
            placeholder="Masukkan lokasi gedung"
            className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={cancelModal}
            className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition"
          >
            Batal
          </button>
           <button
            type="submit"
            disabled={isLoading}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ${
                isLoading || exists === true ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
            >
            Save
            {isLoading && <span className="ml-2 animate-spin">⏳</span>}
            </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

