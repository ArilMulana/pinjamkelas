import { Fakultas,  useFakultas } from "@/hooks/fakultas/use-fakultas";
import {dataMatkul, formMatPro,  useMatkul } from "@/hooks/matakuliah/use-matakuliah";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Combobox } from '@headlessui/react'

export function DMatpro() {
  const { matkulData,matprodi } = useMatkul();
  const { fakultas, prodi } = useFakultas();
  const [toggleOpen, setToggleOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setEditId] = useState<number | null>(null);
  const [isEditMatkulProdi, setEditMatkulProdiId] = useState<number | null>(null);
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMatpro,setSelectedMatpro] = useState <formMatPro | null >(null);
const [isModalMatpro,setModalMatpro] = useState(false);
  //console.log(matprodi);

  const [formDataMatpro, setFormDataMatpro] = useState({
    program_studi_id: 0,
    matakuliah_id:0 ,
  });


  const [formDataProdiBaru, setFormDataProdiBaru] = useState({
    kode_program_studi: '',
    nama_program_studi: '',
    fakultas_id: 0
  });

  useEffect(() => {
    if (!isEdit) return;

    const filtered = prodi.filter((p) => p.fakultas_id === isEdit);
    const totalData = filtered.length;
    const newTotalData = totalData + 1;

    const selectedFakultas = fakultas.find((f) => f.id === isEdit);
    const kodeFakultas = selectedFakultas?.kode_fakultas || '';

    const urutanString =
      newTotalData < 10 ? '0' + newTotalData : newTotalData.toString();

    const newKodeProgramStudi = kodeFakultas + urutanString;

    setFormDataProdiBaru((prev) => {
      if (prev.kode_program_studi === newKodeProgramStudi) {
        return prev;
      }
      return {
        ...prev,
        kode_program_studi: newKodeProgramStudi,
      };
    });
  }, [isEdit, prodi, fakultas]);

  function dataAwalFormProdi() {
    if (selectedFakultas) {
      setFormDataProdiBaru({
        kode_program_studi: '',
        nama_program_studi: '',
        fakultas_id: 0,
      });
    }
  }

  function dataAwalFormMatpro(){
    if(selectedMatpro){
        setFormDataMatpro({
            program_studi_id:0,
            matakuliah_id:0,
        })
    }
  }

  function batalTambahProdi() {
    setModalOpen(false);
    dataAwalFormProdi();
  }


  function dataMatkulProdi(id: number) {
    setToggleOpen(true);
    setEditId(id); // Set the selected prodi for matkul
    batalTambahProdi(); // Reset form for prodi
    //console.log(id);
  }

  function modalTambahProdi(id: number) {
    setEditId(id); // Ambil id fakultas
    setModalOpen(true);
    setFormDataProdiBaru((prev) => ({
      ...prev,
      fakultas_id: id
    }));
  }

  function resetFormDataProdi() {
    setModalOpen(false);
    dataAwalFormProdi();
  }

  function tambahProdi(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();
    router.post(route('prodi.store'), formDataProdiBaru, {
      onSuccess: () => {
        resetFormDataProdi();
        setLoading(false);
        Swal.fire('Sukses', 'Program Studi berhasil ditambahkan', 'success');
      },
      onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan', 'error')
    });
  }
  const matchProdi = prodi.find((p) => p.id === isEdit);
 function OpenMatpro(id:number){
    setEditIdMatkulProdi(false);
    setModalMatpro(true);
    setEditId(id);
      setFormDataMatpro((prev) => ({
      ...prev,
      program_studi_id: id
    }));
 }
function resetFormMatpro(){
    dataAwalFormMatpro();
    setModalMatpro(false);
    setSelectedMatkul([]); // reset pilihan matkul
    setQuery('');
}


function tambahMatpro(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    console.log(isEditMatkulProdi);
    if (editIdMatkulProdi && isEditMatkulProdi !== null) {
        // Edit (update)
        router.put(route('matkul-prodi.update', isEditMatkulProdi), {
            ...formDataMatpro,
        }, {
            onSuccess: () => {
                // closeMatpro();
                setModalMatpro(false);
                setLoading(false);
                Swal.fire('Sukses', 'Matakuliah Berhasil diupdate', 'success');
            },
            onError: () => {
                Swal.fire('Gagal', 'Terjadi Kesalahan dalam Mengupdate data', 'error');
            }
        });
    } else {
        // Tambah (create)
        const matakuliah_ids = selectedMatkul.map((m) => m.id);
        router.post(route('matkul-prodi.store'), {
            ...formDataMatpro,
            matakuliah_ids // array of id
        }, {
            onSuccess: () => {
                resetFormMatpro();
                setLoading(false);
                Swal.fire('Sukses', 'Matakuliah Berhasil ditambahkan', 'success');
            },
            onError: () => {
                Swal.fire('Gagal', 'Terjadi Kesalahan dalam Menambahkan data', 'error');
            }
        });
    }
}
 function closeMatpro(){
    resetFormMatpro();
 }


  const [selectedMatkul, setSelectedMatkul] = useState<dataMatkul[]>([])
  const [query, setQuery] = useState('')
  const [search,setSearch] = useState('');

  const filteredMatkul =
    query === ''
      ? matkulData
      : matkulData.filter((p) =>
          p.nama_matakuliah.toLowerCase().includes(query.toLowerCase())
        )

const toggleSelection = (matkul: dataMatkul) => {
  if (selectedMatkul.some((p) => p.id === matkul.id)) {
    setSelectedMatkul(selectedMatkul.filter((p) => p.id !== matkul.id))
  } else {
    setSelectedMatkul([...selectedMatkul, matkul])
  }
}
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
// Filter berdasarkan prodi yang dipilih
const filteredByProdi = matprodi.filter((p) => p.program_studi_id === isEdit);

// Lalu filter search
const filteredMatkulprodi = search === ''
  ? filteredByProdi
  : filteredByProdi.filter((p) =>
      p.matakuliah.nama_matakuliah.toLowerCase().includes(search.toLowerCase()) ||
      p.matakuliah.kode_matakuliah.toLowerCase().includes(search.toLowerCase())
    );

// Pagination
const totalItems = filteredMatkulprodi.length;
const totalPages = Math.ceil(totalItems / itemsPerPage);
const paginatedMatkulprodi = filteredMatkulprodi.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

useEffect(() => { setCurrentPage(1); }, [search]);

const namaProdi = prodi.find((p) => p.id === isEdit)?.nama_program_studi || '';
const [editIdMatkulProdi, setEditIdMatkulProdi] = useState(false);

function editMatkulProdi(id: number) {
    setEditIdMatkulProdi(true);
    setEditMatkulProdiId(id);
  const selectedMatkulProdi = matprodi.find((p) => p.id === id);
  if (selectedMatkulProdi) {
    setSelectedMatpro(selectedMatkulProdi);
    setFormDataMatpro({
      program_studi_id: selectedMatkulProdi.program_studi_id,
      matakuliah_id: selectedMatkulProdi.matakuliah_id,
    });
    setModalMatpro(true);
  }
}

  return (
    <>
      {!toggleOpen ? (
        <div className="container mx-auto p-6 text-black bg-white">
          <h1 className="text-xl font-semibold mb-4">Daftar Fakultas Program Studi</h1>
          <table className="min-w-full table-auto border border-gray-300 divide-y divide-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Fakultas</th>
                <th className="px-4 py-2 text-left">Program Studi</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fakultas.map((fak, index) => {
                const daftarProdi = prodi.filter((p) => p.fakultas_id === fak.id);

                if (daftarProdi.length === 0) {
                  return (
                    <tr key={`no-prodi-${fak.id}`}>
                      <td className="px-4 py-2 align-top">{index + 1}</td>
                      <td className="px-4 py-2 align-top">{fak.nama_fakultas}</td>
                      <td colSpan={1} className="px-4 py-2 align-top">
                        <button
                          onClick={() => modalTambahProdi(fak.id)}
                          className="bg-blue-600 rounded-sm shadow-xl p-1 text-blue-100 m-2 hover:bg-blue-800 cursor-pointer "
                        >
                          Tambah Program Studi
                        </button>
                      </td>
                    </tr>
                  );
                }

                return daftarProdi.map((p, idx) => (
                  <tr key={`${fak.id}-${p.id}`}>
                    {idx === 0 && (
                      <>
                        <td rowSpan={daftarProdi.length} className="px-4 py-2 align-top">
                          {index + 1}
                        </td>
                        <td rowSpan={daftarProdi.length} className="px-4 py-2 align-top">
                          {fak.nama_fakultas}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-2">{p.nama_program_studi}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => dataMatkulProdi(p.id)}
                        className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="container mx-auto p-6 text-black bg-white">
          <h1 className="text-xl font-semibold mb-4">Daftar Matakuliah Program Studi {namaProdi}</h1>
          <div className="flex items-center justify-between mb-4 gap-4">
            <input
              type="text"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Cari Matakuliah"
              className="w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
            onClick={() => {
                //console.log(isEdit);
            if (isEdit !== null) {
                OpenMatpro(isEdit);
            }
            }}
              className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
            >
              <i className="fa fa-plus"></i>
              <span>Tambah Matakuliah</span>
            </button>
          </div>
          <table className="min-w-full table-auto border border-gray-300 divide-y divide-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left w-[5%]">No</th>
                <th className="px-4 py-2 text-left w-[15%]">Kode</th>
                <th className="px-4 py-2 text-left w-[40%]">Matakuliah</th>
                <th className="px-4 py-2 text-left w-[5%]">SKS</th>
                <th className="px-4 py-2 text-left w-[10%]">Tipe</th>
                <th className="px-4 py-2 text-left w-[30%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
       {paginatedMatkulprodi
          .filter((p) => p.program_studi_id === isEdit)
        .map((filteredMatProdi, index) => (
            <tr key={filteredMatProdi.id}>
            <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td className="px-4 py-2">{filteredMatProdi.matakuliah.kode_matakuliah}</td>
            <td className="px-4 py-2">{filteredMatProdi.matakuliah.nama_matakuliah}</td>
            <td className="px-4 py-2">{filteredMatProdi.matakuliah.sks}</td>
            <td className="px-4 py-2">
                {filteredMatProdi.matakuliah.tipe === 'wajib' ? (
                    <span className="text-green-600 font-semibold">Wajib</span>
                ) : (
                    <span className="text-blue-600 font-semibold">Umum</span>
                )}
            </td>
            <td className="px-4 py-2 space-x-2">
                <button
                onClick={() => editMatkulProdi(filteredMatProdi.id)}
                className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
                >
                <i className="fa fa-edit"></i>
                <span>Edit</span>
                </button>
                <button
                className="cursor-pointer ease-in-out hover:-translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                >
                <i className="fa fa-trash"></i>
                <span>Delete</span>
                </button>
            </td>
            </tr>
        ))}

            </tbody>
          </table>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
           <div className="mt-4 flex justify-between items-center">
            <button
                className={`px-3 py-1 rounded-md text-sm ${
                currentPage === 1 || totalItems === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-100 cursor-pointer'
                }`}
                onClick={() => {
                if (currentPage > 1 && totalItems > 0) setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage === 1 || totalItems === 0}
            >
                Prev
            </button>

            <div className="space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                    page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'text-indigo-600 hover:bg-indigo-100'
                    }`}
                    onClick={() => setCurrentPage(page)}
                    disabled={totalItems === 0}
                >
                    {page}
                </button>
                ))}
            </div>

            <button
                className={`px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages || totalItems === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-100 cursor-pointer'
                }`}
                onClick={() => {
                if (currentPage < totalPages && totalItems > 0) setCurrentPage(currentPage + 1);
                }}
                disabled={currentPage === totalPages || totalItems === 0}
            >
                Next
            </button>
            </div>

            <div>
                <button
                type="button"
                onClick={() => setToggleOpen(false)}
                className="cursor-pointer flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 shadow transition duration-200"
                >
                <i className="fa fa-arrow-left"></i>
                <span>Kembali</span>
                </button>
            </div>
            </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Tambah Program Studi
            </h2>
            <form
              onSubmit={tambahProdi}
              className="space-y-4"
            >
              <div className="flex flex-col">
                <label htmlFor="program_studi" className="text-sm font-medium text-gray-700 mb-2">
                  Pilih Fakultas
                </label>
                <select
                  id="fakultas"
                  name="fakultas_id"
                  disabled
                  value={formDataProdiBaru.fakultas_id || ''}
                  onChange={(e) =>
                    setFormDataProdiBaru({
                      ...formDataProdiBaru,
                      fakultas_id: Number(e.target.value),
                    })
                  }
                  className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Fakultas</option>
                  {fakultas
                    .filter((p) => p.id === isEdit)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_fakultas}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="kode_prodi" className="text-sm font-medium text-gray-700 mb-2">
                  Kode Program Studi
                </label>
                <input
                  id="kode_prodi"
                  name="kode_prodi"
                  type="text"
                  disabled
                  value={formDataProdiBaru.kode_program_studi}
                  className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="prodi" className="text-sm font-medium text-gray-700 mb-2">
                  Nama Program Studi
                </label>
                <input
                  id="prodi"
                  name="prodi"
                  type="text"
                  value={formDataProdiBaru.nama_program_studi}
                  onChange={(e) =>
                    setFormDataProdiBaru({
                      ...formDataProdiBaru,
                      nama_program_studi: e.target.value,
                    })
                  }
                  placeholder="Masukkan Nama Program Studi"
                  className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={batalTambahProdi}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                  <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  style={{ cursor:loading?'progress':'pointer' }}
                >
                 {loading?'Menyimpan...':'Simpan' }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalMatpro &&(
        <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-30 z-50">
         <form onSubmit={tambahMatpro}>
            <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
                {/* Judul Fakultas */}
                <h2 className="text-xl font-semibold mb-4">
                {matchProdi?.fakultas.nama_fakultas || 'Fakultas Tidak Ditemukan'}
                </h2>

                {/* Select Prodi */}
                <div className="mb-4">
                <label htmlFor="prodi" className="block text-gray-700 mb-2">Program Studi</label>
                <select
                    id="prodi"
                    name="prodi"
                    disabled
                    value={formDataMatpro.program_studi_id ?? ''}
                    onChange={(e) =>
                        setFormDataMatpro((prev) => ({
                            ...prev,
                            program_studi_id: parseInt(e.target.value),
                        }))
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                >
                    <option value="">-- Pilih Program Studi --</option>
                    {prodi.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.kode_program_studi} - {p.nama_program_studi}
                        </option>
                    ))}
                </select>
                </div>
                {editIdMatkulProdi ? (
             <div className="mb-4">
                <label htmlFor="Matkul" className="block text-gray-700 mb-2">Matakuliah</label>
                <select
                    value={formDataMatpro.matakuliah_id ?? ''}
                    onChange={(e) =>
                    setFormDataMatpro({
                        program_studi_id: formDataMatpro.program_studi_id,
                        matakuliah_id: Number(e.target.value),
                    })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                >
                    <option value="">-- Pilih Matakuliah --</option>
                    {/* Jika sedang edit, tampilkan option matakuliah yang sedang diedit di urutan paling atas */}
                    {editIdMatkulProdi && formDataMatpro.matakuliah_id
                    ? (() => {
                        const current = matkulData.find(m => m.id === formDataMatpro.matakuliah_id);
                        return current ? (
                            <option key={current.id} value={current.id}>
                            {current.kode_matakuliah} - {current.nama_matakuliah} ({current.sks} SKS)
                            </option>
                        ) : null;
                        })()
                    : null}
                    {/* Tampilkan semua matakuliah, kecuali yang sedang diedit (agar tidak dobel) */}
                    {matkulData
                    .filter(m => !editIdMatkulProdi || m.id !== formDataMatpro.matakuliah_id)
                    .map(matkul => (
                        <option key={matkul.id} value={matkul.id}>
                        {matkul.kode_matakuliah} - {matkul.nama_matakuliah} ({matkul.sks} SKS)
                        </option>
                    ))}
                </select>
                </div>
            ) : (
                 <div className="w-full max-w-md mx-auto">
                     <label htmlFor="matkul" className="block text-gray-700 mb-2">Matakuliah </label>
                    <Combobox value={selectedMatkul} multiple>
                        <div className="relative">
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            className="w-full rounded-md border border-gray-300 py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            displayValue={() => selectedMatkul.map((p) => p.nama_matakuliah+' ( '+p.sks + ' SKS )').join(', ')}
                            placeholder="Search and select people..."
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                            {filteredMatkul.length === 0 ? (
                            <div className="p-3 text-sm text-gray-500">No matches found.</div>
                            ) : (
                            filteredMatkul.map((p) => (
                                <Combobox.Option
                                key={p.id}
                                value={p}
                                as="div"
                                onClick={(e) => {
                                    e.preventDefault()
                                    toggleSelection(p)
                                }}
                                className={({ active }) =>
                                    `flex items-center px-4 py-2 cursor-pointer ${
                                    active ? 'bg-blue-500 text-blue-900' : ''
                                    }`
                                }
                                >
                                <input
                                    type="checkbox"
                                    checked={selectedMatkul.some((item) => item.id === p.id)}
                                    readOnly
                                    className="mr-3 accent-blue-600"
                                />
                                {p.nama_matakuliah}
                                </Combobox.Option>
                            ))
                            )}
                        </Combobox.Options>
                        </div>
                    </Combobox>

            {/* Display selected tags */}
            {selectedMatkul.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                {selectedMatkul.map((item) => (
                    <span
                    key={item.id}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                    >
                    {item.nama_matakuliah}  {'('+item.sks +' SKS)'}
                    <button
                        onClick={() =>
                        setSelectedMatkul(selectedMatkul.filter((p) => p.id !== item.id))
                        }
                        className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                        &times;
                    </button>
                    </span>
                ))}
                </div>
            )}
            </div>
)}

                {/* Tombol Aksi */}
                <div className="flex justify-end space-x-2">
                <button
                    type="button"
                   onClick={closeMatpro}
                //    onClick={() => setModalMatpro(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  style={{ cursor:loading?'progress':'pointer' }}
                >
                 {loading?'Menyimpan...':'Simpan' }
                </button>
                </div>
            </div>
            </form>

        </div>
      )}
    </>
  );
}
