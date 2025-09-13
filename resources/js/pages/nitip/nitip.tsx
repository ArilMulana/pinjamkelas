import { usePage, router } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { format, parseISO } from 'date-fns';

interface Penitipan {
  id: number;
  foto_hewan: string;
  jenis_hewan: string;
  nama_pemilik: string;
  email_pemilik: string;
  waktu_penitipan: string;
  waktu_pengambilan: string;
}

export function Nitip() {
  const { penitipans } = usePage<{ penitipans: Penitipan[] }>().props;

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<Penitipan | null>(null);
  const [formData, setFormData] = useState<{
  foto_hewan: File | null;
  jenis_hewan: string;
  nama_pemilik: string;
  email_pemilik: string;
  waktu_penitipan: string;
  waktu_pengambilan: string;
}>({
  foto_hewan: null,
  jenis_hewan: '',
  nama_pemilik: '',
  email_pemilik: '',
  waktu_penitipan: '',
  waktu_pengambilan: '',
});
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  // Filter & Pagination
  const filteredData = useMemo(() => {
    if (!search) return penitipans;
    return penitipans.filter(
      (d) =>
        d.jenis_hewan.toLowerCase().includes(search.toLowerCase()) ||
        d.nama_pemilik.toLowerCase().includes(search.toLowerCase()) ||
        d.email_pemilik.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, penitipans]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredData, currentPage]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);

  // Modal Open/Close
const openModal = (data: Penitipan | null = null) => {
  setSelectedData(data);
  setShowModal(true);

  if (data) {
    // Edit: hanya set waktu_pengambilan dan foto preview
    setFormData({
      foto_hewan: null, // tidak ubah foto saat edit
      jenis_hewan: data.jenis_hewan,
      nama_pemilik: data.nama_pemilik,
      email_pemilik: data.email_pemilik,
      waktu_penitipan: data.waktu_penitipan,
      waktu_pengambilan: data.waktu_pengambilan || '', // kosong jika belum ada
    });
    setFotoPreview(data.foto_hewan || null);
  } else {
    // Create: semua field kosong, foto null
    setFormData({
      foto_hewan: null,
      jenis_hewan: '',
      nama_pemilik: '',
      email_pemilik: '',
      waktu_penitipan: '',
      waktu_pengambilan: '',
    });
    setFotoPreview(null);
  }
};

const cancelModal = () => {
  setShowModal(false);
  setSelectedData(null);
  setFormData({
    foto_hewan: null,
    jenis_hewan: '',
    nama_pemilik: '',
    email_pemilik: '',
    waktu_penitipan: '',
    waktu_pengambilan: '',
  });
  setFotoPreview(null);
};

  // Submit Form
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const data = new FormData();
      if (formData.foto_hewan) data.append('foto_hewan', formData.foto_hewan);
      data.append('jenis_hewan', formData.jenis_hewan);
      data.append('nama_pemilik', formData.nama_pemilik);
      data.append('email_pemilik', formData.email_pemilik);
      data.append('waktu_penitipan', formData.waktu_penitipan);
      data.append('waktu_pengambilan', formData.waktu_pengambilan);

      if (selectedData) {
        // Update
        router.post(`/dashboard/nitip/${selectedData.id}?_method=PUT`, data, {
          onSuccess: () => {
            Swal.fire('Berhasil', 'Data diperbarui', 'success');
            setShowModal(false);
            setLoading(false);
          },
          onError: () => {
            Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
            setLoading(false);
          },
        });
      } else {
        // Create
        router.post('/dashboard/nitip', data, {
          onSuccess: () => {
            Swal.fire('Berhasil', 'Data ditambahkan', 'success');
            setShowModal(false);
            setLoading(false);
          },
          onError: () => {
            Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
            setLoading(false);
          },
        });
      }
    },
    [formData, selectedData]
  );

  // Delete
  const handleDelete = useCallback((id: number) => {
    Swal.fire({
      title: 'Yakin hapus?',
      text: 'Data akan hilang permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/dashboard/nitip/${id}`, {
          onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus', 'success'),
          onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan', 'error'),
        });
      }
    });
  }, []);

  const durasiJam = useMemo(() => {
  if (!selectedData || !formData.waktu_pengambilan) return 0;

  const start = new Date(selectedData.waktu_penitipan).getTime();
  console.log(start);
  const end = new Date(formData.waktu_pengambilan).getTime();
  const diff = Math.max(end - start, 0); // pastikan tidak negatif
  const hours = Math.ceil(diff / (1000 * 60 * 60)); // durasi dalam jam dibulatkan ke atas
  return hours;
}, [selectedData, formData.waktu_pengambilan]);

const totalBiaya = useMemo(() => durasiJam * 100000, [durasiJam]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Penitipan Hewan</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Tambah Penitipan
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari hewan atau pemilik..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-80 px-4 py-2 rounded-md border mb-4 focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded">
          <thead className="bg-gray-100">
            <tr>
              {['No', 'Foto', 'Jenis Hewan', 'Nama Pemilik', 'Email', 'Waktu Penitipan', 'Waktu Pengambilan', 'Aksi'].map((head, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-xs font-medium uppercase">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(currentPage-1)*itemsPerPage + index +1}</td>
                  <td className="px-4 py-3">
                    <img src={item.foto_hewan} alt="" className="w-12 h-12 rounded"/>
                  </td>
                  <td className="px-4 py-3">{item.jenis_hewan}</td>
                  <td className="px-4 py-3">{item.nama_pemilik}</td>
                  <td className="px-4 py-3">{item.email_pemilik}</td>
                  <td className="px-4 py-3">{item.waktu_penitipan}</td>
                  <td className="px-4 py-3">{item.waktu_pengambilan}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button onClick={handlePrev} disabled={currentPage===1} className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed">Prev</button>
        <div className="space-x-1">
          {Array.from({length: totalPages}, (_, i)=> i+1).map(p => (
            <button key={p} onClick={()=>handlePageClick(p)} className={`px-3 py-1 rounded text-sm ${currentPage===p?'bg-indigo-600 text-white':'bg-gray-200 hover:bg-gray-300'}`}>{p}</button>
          ))}
        </div>
        <button onClick={handleNext} disabled={currentPage===totalPages || totalPages===0} className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed">Next</button>
      </div>

      {/* Modal */}
   {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        {selectedData ? 'Edit Penitipan' : 'Tambah Penitipan'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-6">

          {/* FOTO HEWAN - Hanya tampil di Create */}
          {!selectedData && (
            <div className="md:w-1/3 flex flex-col items-center">
              {fotoPreview ? (
                <img
                  src={fotoPreview}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded mb-4 text-gray-400">
                  Preview
                </div>
              )}
              <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Pilih Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, foto_hewan: file });
                      setFotoPreview(URL.createObjectURL(file));
                    }
                  }}
                  required
                />
              </label>
            </div>
          )}

          {/* FORM INPUTS */}
          <div className="md:w-2/3 flex flex-col gap-4">
  {/* CREATE MODE */}
  {!selectedData && (
    <>
      {/* Jenis Hewan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Jenis Hewan</label>
        <select
          className="w-full p-3 border rounded"
          value={formData.jenis_hewan}
          onChange={(e) => setFormData({ ...formData, jenis_hewan: e.target.value })}
          required
        >
          <option value="" disabled>Pilih Jenis Hewan</option>
          <option value="Anjing">Anjing</option>
          <option value="Kucing">Kucing</option>
          <option value="Kelinci">Kelinci</option>
          <option value="Reptil">Reptil</option>
        </select>
      </div>

      {/* Nama Pemilik */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Nama Pemilik</label>
        <input
          type="text"
          className="w-full p-3 border rounded"
          placeholder="Masukkan Nama Pemilik"
          value={formData.nama_pemilik}
          onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
          required
        />
      </div>

      {/* Email Pemilik */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Email Pemilik</label>
        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Masukkan Email Pemilik"
          value={formData.email_pemilik}
          onChange={(e) => setFormData({ ...formData, email_pemilik: e.target.value })}
          required
        />
      </div>

      {/* Waktu Penitipan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Waktu Penitipan</label>
        <input
          type="datetime-local"
          className="w-full p-3 border rounded"
          value={formData.waktu_penitipan}
          onChange={(e) => setFormData({ ...formData, waktu_penitipan: e.target.value })}
          required
        />
        {formData.waktu_penitipan && (
          <p className="text-gray-500 text-sm mt-1">
            {format(parseISO(formData.waktu_penitipan), 'dd/MM/yyyy HH:mm:ss')}
          </p>
        )}
      </div>
    </>
  )}

  {/* EDIT MODE */}
  {selectedData && (
    <>
      {/* Waktu Pengambilan */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Waktu Pengambilan</label>
        <input
          type="datetime-local"
          className="w-full p-3 border rounded"
          value={formData.waktu_pengambilan}
          onChange={(e) => setFormData({ ...formData, waktu_pengambilan: e.target.value })}
        />
        {formData.waktu_pengambilan && (
          <p className="text-gray-500 text-sm mt-1">
            {format(parseISO(formData.waktu_pengambilan), 'dd/MM/yyyy HH:mm:ss')}
          </p>
        )}
      </div>

      {/* Total Biaya */}
      {formData.waktu_pengambilan && (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Total Biaya</label>
          <input
            type="text"
            className="w-full p-3 border rounded bg-gray-100"
            value={`Rp ${totalBiaya.toLocaleString()}`}
            readOnly
          />
        </div>
      )}
    </>
  )}
</div>
        </div>

        {/* Tombol aksi */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={cancelModal}
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>

      </form>
    </div>
  </div>
)}




    </div>
  );
}
