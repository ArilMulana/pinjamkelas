//import { useFakultas } from "@/hooks/fakultas/use-fakultas";
import { dataMatkul, MatkulData, tipeMatkul, useMatkul } from "@/hooks/matakuliah/use-matakuliah";
import DataTable from "@/hooks/datatables/use-datatables";
import { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";


export function DMatkul() {
  const { matkul } = useMatkul();
  //const { fakultas, prodi } = useFakultas();
  const fileInputRef = useRef<HTMLInputElement>(null);
 const [//data
    , setData] = useState<dataMatkul[]>(matkul.data);
 const [loading, setLoading] = useState(false);
 const [isModalOpen,setModalOpen] = useState(false);
  const [isEditMode,setEditMode] = useState(false);
  const [isEditId, setEditId] = useState<number | null>(null);

  const [formDataMatkul, setFormDataMatkul] = useState({
     kode_matakuliah: '',
     nama_matakuliah: '',
     sks: 0,
     tipe:''
     });

   const [originalKode, setOriginalKode] = useState('');
    const [originalData, setOriginalData] = useState({
     kode_matakuliah: '',
     nama_matakuliah: '',
     sks: 0,
     tipe:''
     });
    const [exists, setExists] = useState<boolean | null>(null);
    const isKodeSama = formDataMatkul.kode_matakuliah === originalKode;
const isNamaMatkulBerubah = formDataMatkul.nama_matakuliah !== originalData.nama_matakuliah;
const isSKSBerubah = formDataMatkul.sks !== originalData.sks;
const isTipeBerubah = formDataMatkul.tipe !== originalData.tipe;

const isDisabled =
  loading ||
  exists === true ||
 (isEditMode && isKodeSama && (!isNamaMatkulBerubah && !isSKSBerubah && !isTipeBerubah));

   const checkData = useCallback(async () => {
  const kode = formDataMatkul.kode_matakuliah;

  if (!kode) return;

  if (isEditMode && kode === originalKode) {
    //console.log(originalKode);
    setExists(false);
    return;
  }

  try {
    const response = await fetch(`/dashboard/matkul/cek-matakuliah?value=${encodeURIComponent(kode)}`);
    const data = await response.json();
    setExists(data.exists);
  } catch (error) {
    console.error('Gagal mengecek data:', error);
        setExists(null);
  }
}, [formDataMatkul.kode_matakuliah, isEditMode, originalKode]);

useEffect(() => {
  checkData();
}, [checkData]);

  function resetForm(){
      setFormDataMatkul({
        kode_matakuliah:'',
        nama_matakuliah:'',
        sks:0,
        tipe:''
      })
  }

  function handleBatal(){
    resetForm();
    setModalOpen(false);
    setEditMode(false);
    setExists(null);
      setOriginalKode('');      // reset originalKode supaya tidak salah cek
    setOriginalData({
        kode_matakuliah: '',
        nama_matakuliah: '',
        sks: 0,
        tipe: ''
    });  // reset originalData agar form kembali ke default saat batal
  }

        function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        if (!isEditMode && exists === true) {
            Swal.fire('Gagal', 'Kode matakuliah sudah ada di database.', 'error');
            setLoading(false);
            return;
            }
        if (isEditMode && isEditId !== null) {
            //console.log(formDataMatkul);
            router.put(route('matkul.update', isEditId), formDataMatkul, {
            onSuccess: (page) => {
                const updatedMatkul = (page.props as unknown as { matkul: dataMatkul[] }).matkul;
                setData(updatedMatkul);
                setModalOpen(false);
                resetForm();
                Swal.fire('Sukses', 'Matakuliah berhasil diupdate', 'success');
            },
            onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat mengedit', 'error'),
            onFinish: () => setLoading(false),
            });
        } else {

            router.post(route('matkul.store'), formDataMatkul, {
            onSuccess: () => {
                setLoading(false);
                resetForm();
                setModalOpen(false);
                Swal.fire('Sukses', 'Matakuliah berhasil ditambahkan', 'success');
            },
            onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan', 'error'),
            onFinish: () => setLoading(false),
            });
        }

        }

  function importExcel() {
    if (!fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0) {
        Swal.fire('Error', 'Pilih file terlebih dahulu', 'error');
        return;
    }
    const formData = new FormData();
    formData.append('file_excel', fileInputRef.current.files[0]);
    setLoading(true);

    Swal.fire({
        title: "Tambah Matkul",
        text: "Anda yakin mengimport file excel ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Import",
        cancelButtonText: "Batal",
    }).then((result) => {
        if (result.isConfirmed) {
            router.post(route('matkul.import'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    Swal.fire('Sukses', 'File berhasil diimport', 'success');
                    if (fileInputRef.current) fileInputRef.current.value = ''; // reset file input
                },
                onError: () => {
                    // console.error('Detail Error:', errors);
                    Swal.fire('Gagal', 'Import gagal, cek file dan format', 'error');
                },
                onFinish: () => setLoading(false),
            });
        } else {
            setLoading(false); // jika batal, matikan loading juga
        }
    });
}

  const columns: ColumnDef<MatkulData>[] = [

    { accessorKey: "kode_matakuliah", header: "Kode" },
    { accessorKey: "nama_matakuliah", header: "Nama" },
    { accessorKey: "sks", header: "SKS" },
    { accessorKey: "tipe", header: "Tipe" },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => {
        const data = row.original;

        function handleEdit(data: MatkulData){
              setFormDataMatkul(data);
            setOriginalKode(data.kode_matakuliah);
            setOriginalData(data);
            setEditMode(true);
            setModalOpen(true);
            setEditId(data.id);
        }

        const handleDelete = () => {
          Swal.fire({
            title: "Hapus Matkul",
            text: `Yakin ingin menghapus matkul "${data.nama_matakuliah}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal",
          }).then((result) => {
           if (result.isConfirmed) {
                      router.delete(route('matkul.destroy', data.id), {
                        onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'),
                        onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
                        });
                     }
          });
        };

        return (
          <div className="flex space-x-2">
            <button
                onClick={() => handleEdit(data)}
              className="ease-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
            >
            <span className="fa fa-edit"></span>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="ease-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-indigo-100 hover:text-red-800 transition"
            >
                <span className="fa fa-trash"></span>
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  if (!matkul || !matkul.data) {
    return <div>Loading...</div>;
  }


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Matakuliah</h1>
        <div className="flex gap-3">
          {/* Tombol Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 shadow-sm"
          >
            <span className="fa fa-upload"></span>
            Import Excel

          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls"
            className="hidden"
              onChange={importExcel}
          />

          {/* Tombol Tambah */}
          <button
           onClick={() => setModalOpen(true)}
            className="cursor-pointer px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 shadow-sm"
          >
            + Tambah Matkul
          </button>
        </div>
      </div>

    <DataTable
        data={matkul.data}
        columns={columns}
        />

       {isModalOpen && (
            <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
                </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Kode Matakuliah</label>
                <input
                  id ="kode"
                  type="text"
                  name="kode_matkul"
                  value={formDataMatkul.kode_matakuliah ?? ''}
                    onBlur={checkData}
                   onChange={(e) => {
                        setFormDataMatkul({ ...formDataMatkul, kode_matakuliah: e.target.value });
                        setExists(null); // reset pengecekan saat user mengetik ulang
                    }}
                  placeholder="contoh : 4234,2323"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />

               {exists === true && (
                <p className="text-red-600 mt-1">Data sudah ada.</p>
                )}
                {/* Tampilkan pesan hijau hanya jika bukan edit mode atau kode sudah diubah */}
                {exists === false && (!isEditMode || formDataMatkul.kode_matakuliah !== originalKode) && (
                <p className="text-green-600 mt-1">Data tersedia.</p>
                )}

              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Matakuliah</label>
                <input
                  id="matkul_id"
                  type="text"
                  placeholder="Contoh : Pemrograman 1.."
                  name="nama_matkul"
                  value={formDataMatkul.nama_matakuliah ??''}
                  onChange={(e)=>setFormDataMatkul({...formDataMatkul,nama_matakuliah:e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SKS</label>


                 <select
                    name="sks"
                    value={formDataMatkul.sks ??''}
                    onChange={(e)=>setFormDataMatkul({...formDataMatkul,sks:Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    >
                    <option value="">Pilih SKS</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    </select>
              </div>
                <div>
                <label className="block text-sm font-medium mb-1">Tipe</label>
                <select
                    name="tipe"
                    value={formDataMatkul.tipe}
                    onChange={(e) => {
                        const val = e.target.value as tipeMatkul; // casting ke enum
                        setFormDataMatkul({
                        ...formDataMatkul,
                        tipe: val,
                        });
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    >
                    <option value="">Pilih Tipe</option>
                    <option value={tipeMatkul.Wajib}>Wajib</option>
                    <option value={tipeMatkul.Umum}>Umum</option>
                    </select>

              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                   onClick={handleBatal}
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
    </div>
  );
}
