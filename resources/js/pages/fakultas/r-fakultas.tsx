import { Fakultas, Prodi, useFakultas, useSearchFakultas } from "@/hooks/fakultas/use-fakultas";
import {  router } from "@inertiajs/react";
import React, { useState, useEffect} from 'react';
import Swal from 'sweetalert2';

export function RFakultas() {
    const {fakultas,prodi} = useFakultas();
    const [loading, setLoading] = useState(false);
    const {itemsPerPage,search, setSearch,
        //filteredFakultas,
        currentPage,setCurrentPage,currentItems,totalPages} = useSearchFakultas();
    //modal form

    const [isEditMode, setIsEditMode] = useState(false);
    const [isModalOpen,setModalOpen] = useState(false);
    const [EditId,setEditId] = useState<number|null>(null); //deklare setEditId untuk mengambil data fakultasid
    const [//data
        , setData] = useState<Fakultas[]>(fakultas);
    //edit

    const [formData,setFormData] = useState({kode_fakultas:'', nama_fakultas:''}); // mengambil data pada form
    const [selectedFakultas,setSelectedFakultas] = useState<Fakultas|null >(null); //mengambil data ketika edit
    //ngambildata menggunakan
    useEffect(()=>{
        if(selectedFakultas){
            setFormData({
                kode_fakultas:selectedFakultas.kode_fakultas,
                nama_fakultas:selectedFakultas.nama_fakultas
            })
        }
    },[selectedFakultas]);

    //buka modal edit

    function openEditModal(fakultas:Fakultas){
        setSelectedFakultas(fakultas);
        setModalOpen(true);
        setIsEditMode(true);
        setEditId(fakultas.id);
        //console.log(fakultas.id);
    }

    const HandleModal =()=>{
        setModalOpen(true);
        setFormData({kode_fakultas:'',nama_fakultas:''});
        setIsEditMode(false);
    }

    //modal prodi
    const [modalOpenProdi,setModalOpenProdi] = useState(false);
    const [isOpenReadOnly,setOpenReadOnly] = useState(true);
    //form tambah prodi
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formDataProdi, setFormDataProdi] = useState({kode_program_studi:'',nama_program_studi:'',fakultas_id:0 });

    const [selectedProdi,setSelectedProdi] = useState<Prodi|null >(null);

    const [selectedProdiNew,
        //setSelectedProdiNew
    ] = useState<Prodi|null >(null); //untuk tidak ada prodi pada fakultas
     const [//dataProdi
        , setDataProdi] = useState<Prodi[]>(prodi);

    //form tambah prodi jika

    const [modalTambahProdi,setModalTambahProdi] = useState(false);

    function formTambahProdi(id:number){
        setModalTambahProdi(true);
        setEditId(id);
         setFormDataProdiBaru(prev => ({
            ...prev,
            fakultas_id: id
        }));
    }

   const [formDataProdiBaru, setFormDataProdiBaru] = useState({
    kode_program_studi: '',
    nama_program_studi: '',
    fakultas_id: 0
    });


useEffect(() => {
  if (!EditId) return;

  const filtered = prodi.filter((p) => p.fakultas_id === EditId);
  const totalData = filtered.length;
  const newTotalData = totalData + 1;

  const selectedFakultas = fakultas.find((f) => f.id === EditId);
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
}, [EditId, prodi, fakultas]);


useEffect(() => {
  if (selectedProdi && modalOpenProdi) {
    setFormDataProdiBaru(prev=>({
      ...prev,
      fakultas_id: selectedProdi.fakultas_id
    }));
  }
}, [selectedProdi, modalOpenProdi]);

useEffect(() => {
  if (selectedProdiNew && modalTambahProdi) {
    setFormDataProdiBaru(prev=>({
      ...prev,
      fakultas_id: selectedProdiNew.fakultas_id
    }));
  }
}, [selectedProdiNew, modalTambahProdi]);


    //const jumlahKodeNamaProdi = filteredProdiList.filter(p => p.kode_nama_prodi && p.kode_nama_prodi.trim() !== '').length;
     useEffect(()=>{
        if(selectedProdi){
            setFormDataProdi({
                kode_program_studi:selectedProdi.kode_program_studi,
                nama_program_studi:selectedProdi.nama_program_studi,
                fakultas_id:selectedProdi.fakultas_id
            })
        }
    },[selectedProdi]);


    function openModalProdi (prodi:Prodi){
        setModalOpenProdi(true);
        //console.log(prodi.fakultas_id);
        setEditId(prodi.fakultas_id);
        setOpenReadOnly(true);
        setSelectedProdi(prodi);
        setIsFormVisible(true);
    }

    //console.log(EditId);
    function handleCancelEdit() {
    setOpenReadOnly(true);// kunci input lagi
    if (selectedProdi) {
        setFormDataProdi({
        kode_program_studi: selectedProdi.kode_program_studi,
        nama_program_studi: selectedProdi.nama_program_studi, // reset ke data awal
        fakultas_id: selectedProdi.fakultas_id,
        });
     }
    }

    const toggleForm=()=>{
        setIsFormVisible(true);
        if(modalTambahProdi){
            setModalTambahProdi(false);
            handleCancelEdit();
        }
        if(modalOpenProdi){
             setModalOpenProdi(false);
             handleCancelEdit();
        }
    }

    const resetForm=()=>{
        setIsFormVisible(true);
        setModalOpenProdi(true);
        handleCancelEdit();
          if (selectedProdi) {
                setFormDataProdiBaru({
                kode_program_studi: '',
                nama_program_studi: '', // reset ke data awal
                fakultas_id: selectedProdi.fakultas_id,
                });
            }
    }

    function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setLoading(true);
        if(isEditMode && EditId != null){
             router.put(route('fakultas.update',EditId),formData,{
                        onSuccess: (page)=>{
                             //const updatedList = (page.props as { fakultas: Fakultas[] }).fakultas;
                            const updatedFakultas = ((page.props as unknown) as {fakultas:Fakultas[]}).fakultas;
                            //console.log(updatedFakultas);
                            setData(updatedFakultas);
                            setModalOpen(false);
                            setIsEditMode(false);
                            setEditId(null);
                            setFormData({kode_fakultas:'',nama_fakultas:''});
                            setLoading(false);
                            Swal.fire('Sukses','Fakultas Berhasil diperbarui','success');
                        },
                        onError:()=> Swal.fire('Gagal','Terjadi kesalahan saat mengedit','error'),
                    });
        }else{
             router.post(route('fakultas.store'),formData, {
                    onSuccess: () => {
                      //resetFormState();
                      setLoading(false);
                      Swal.fire('Sukses', 'Fakultas berhasil ditambahkan', 'success');
                      setModalOpen(false);
                    },
                    onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan', 'error')
                });
        }
    }

      function handleDelete(fakultas:number) {
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
            router.delete(`/dashboard/fakultas/${fakultas}`, {
              onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'),
              onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
            });
          }
        });
      }

      function tambahProdi (e:React.FormEvent){
        setLoading(true);
         e.preventDefault();
            router.post(route('prodi.store'),
            formDataProdiBaru, {
                    onSuccess: () => {
                        if(modalTambahProdi){
                            setModalTambahProdi(false);
                        }
                            resetForm();
                            setLoading(false);
                      Swal.fire('Sukses', 'Program Studi berhasil ditambahkan', 'success');

                    },
                    onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan', 'error')
                });
        }


        const onlyProdiUpdate = {
            nama_program_studi:formDataProdi.nama_program_studi
        };
    function updateProdi(id:number) {
        setLoading(true);
        if (id != null) {
            router.put(route('prodi.update', id), onlyProdiUpdate, {
            onSuccess: (page) => {
                const updatedProdi = ((page.props as unknown) as {prodi:Prodi[]}).prodi;
                setDataProdi(updatedProdi);
                setIsFormVisible(true);
                setOpenReadOnly(true);
                setLoading(false);
                setModalOpenProdi(true);
                Swal.fire('Sukses', 'Program Studi Berhasil diperbarui', 'success');
            },
            onError: () => Swal.fire('Gagal', 'Terjadi kesalahan saat mengedit', 'error'),
            });
        }
        }
     function deleteProdi(prodi:number){
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
            router.delete(`/dashboard/prodi/${prodi}`, {
              onSuccess: () => Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success'),
              onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error'),
            });
          }
        });
     }
    return (
        <>
           <div className="p-6 bg-white rounded-lg shadow-md text-black">
            {/* Header + Add Button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Daftar Fakultas</h1>
                <button
                onClick={HandleModal}
                className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition"
                >
                + Tambah Fakultas
                </button>
            </div>
            {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
                 {isEditMode ? 'Edit Fakultas' : 'Tambah Fakultas Baru'}
                </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode Fakultas</label>
                <input
                  id ="kode"
                  type="text"
                  name="kode_fakultas"
                  value={formData.kode_fakultas ?? ''}
                  onChange={(e)=>setFormData({...formData,kode_fakultas:e.target.value})}
                  placeholder="example : FBS,FMIPA"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fakultas</label>
                <input
                  id="nama_fakultas"
                  type="text"
                  name="fakultas"
                  value={formData.nama_fakultas ??''}
                  onChange={(e)=>setFormData({...formData,nama_fakultas:e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
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
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                   style={{ cursor: loading ? 'progress' : 'pointer' }}
                >
                 {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
            )}
            {/* Search Input */}
            <input
                type="text"
                placeholder="Cari Fakultas...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            {/* Table */}
            <div className="overflow-x-auto text-black">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                    {['No', 'Kode', 'Fakultas', 'Aksi'].map((head, idx) => (
                        <th key={idx} className="px-4 py-3 text-left text-xs font-medium uppercase">
                        {head}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((item, idx) => {
                        const prodiMatch = prodi.find((prodiItem) => prodiItem.fakultas_id === item.id);
                        //console.log((currentPage - 1) * itemsPerPage + idx + 1);
                        return (
                            <tr key={item.id}>
                            <td className="px-4 py-3 text-sm">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                            <td className="px-4 py-3 text-sm">{item.kode_fakultas}</td>
                            <td className="px-4 py-3 text-sm">
                                {item.nama_fakultas}

                                {prodiMatch ? (
                                <button
                                    key={prodiMatch.id}
                                    onClick={() => openModalProdi(prodiMatch)}
                                    className="text-blue-900 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 flex items-center space-x-2 ml-4"
                                >
                                    <span className="fa fa-arrow-right"></span>
                                    Program Studi
                                </button>
                                ) : (
                                <button
                                    onClick={() => {
                                    //console.log('Tambah prodi untuk:', item.id);
                                    formTambahProdi(item.id); // <== item.id digunakan di sini
                                    }}
                                     className="text-blue-900 cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 flex items-center space-x-2 ml-4"
                                >
                                     <span className="fa fa-arrow-right"></span>
                                    Tidak ada Program Studi
                                    <span className="text-sm ml-1 font-semibold text-red-600"> (Tambah)</span>
                                </button>
                                )}
                            </td>

                            <td className="px-4 py-3 text-sm space-x-3">
                                <button
                                onClick={() => openEditModal(item)}
                                className="ease-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
                                >
                                <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                onClick={() => handleDelete(item.id)}
                                className="ease-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                                >
                                <i className="fas fa-trash"></i> Delete
                                </button>
                            </td>
                            </tr>
                        );
                        })}

                </tbody>
                </table>
            </div>

            {/* Pagination */}
           <div className="mt-4 flex justify-between items-center">
                <button
                    className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100 cursor-pointer'
                    }`}
                    onClick={() => {
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <div className="space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                        page === currentPage ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-100'
                        }`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                    ))}
                </div>

                <button
                    className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-indigo-600 hover:bg-indigo-100 cursor-pointer'
                    }`}
                    onClick={() => {
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                </div>

            {modalOpenProdi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-lg font-semibold mb-4 text-center">
                 {isFormVisible ? `${selectedProdi?.fakultas.nama_fakultas}` :'Tambah Program Studi'}
            </h2>
            <div className="text-right gap-1">
                {isFormVisible ?(
                     <button
                    onClick={()=>{
                        setIsFormVisible(false)
                    }}
                    className="bg-blue-600 rounded-sm shadow-xl p-1 text-blue-100 m-2 hover:bg-blue-800 cursor-pointer ">
                        <span className="fa fa-add"></span>
                        Tambah Program Studi
                    </button>
                ):(
                     <button
                    onClick={()=>{
                        setIsFormVisible(true)
                    }}
                    className="bg-blue-600 rounded-sm shadow-xl p-1 text-blue-100 m-2 hover:bg-blue-800 cursor-pointer ">
                        <span className="fa fa-arrow-left"></span>
                        Back
                    </button>
                )}

            </div>
            {isFormVisible ? (
            <form className="space-y-4">
            <div className="">
               <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Program Studi</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {prodi
                    .filter((p) => p.fakultas_id === EditId)
                    .map((filteredProdi, index) => (
                    <tr key={filteredProdi.id}>
                        <td className="border border-gray-300 px-4 py-2 text-left"> {index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 text-left" >

                        <input
                            readOnly={isOpenReadOnly}
                            type="text"
                            name="nama_program_studi"
                            value={
                            selectedProdi?.id === filteredProdi.id
                                ? formDataProdi.nama_program_studi
                                : filteredProdi.nama_program_studi
                            }

                            onChange={(e) => {
                            if (selectedProdi?.id === filteredProdi.id) {
                                setFormDataProdi({
                                ...formDataProdi,
                                nama_program_studi: e.target.value,
                                });
                            }
                            }}

                            className={`w-full px-2 py-1 rounded focus:outline-none ${
                            isOpenReadOnly
                                ? 'focus:ring-1 focus:ring-blue-500 cursor-not-allowed'
                                : 'focus:ring-1 focus:ring-blue-500'
                            }`}
                            //kode_program_studi dan fakultas_id
                        />
                        </td>
                        <td  className="border border-gray-300 px-4 py-2 text-center" >
                        {isOpenReadOnly || selectedProdi?.id !== filteredProdi.id ? (
                            <div>
                            <button
                            className="easy-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-indigo-600 hover:bg-indigo-100 hover:text-indigo-800 transition"
                            type="button"
                            onClick={() => {
                                setOpenReadOnly(false);
                                setSelectedProdi(filteredProdi);
                            }}
                            >
                                <span className="fa fa-edit text-blue-600"></span>
                            Edit
                            </button>
                             <button
                              className={`ease-in-out inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 transition ${
                                !isOpenReadOnly && selectedProdi?.id !== filteredProdi.id
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:translate-y-1 hover:scale-110 hover:bg-indigo-100 hover:text-red-800'
                            }`}
                            type="button"
                            disabled={!isOpenReadOnly && selectedProdi?.id !== filteredProdi.id}
                                onClick={()=>deleteProdi(filteredProdi.id)}
                            >
                            <span className="fa fa-trash text-red-600"></span>
                            Delete
                            </button>
                            </div>
                        ) : (
                            <>
                            <button
                             onClick={()=>updateProdi(filteredProdi.id)}
                                disabled={loading}
                                 style={{ cursor: loading ? 'progress' : 'pointer' }}
                            className="easy-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-blue-600 hover:bg-indigo-100 hover:text-blue-800 transition"
                            type="button">
                                <span className="fa fa-save">

                                </span>
                                  Save
                            </button>
                            <button
                            onClick={handleCancelEdit}
                            className="easy-in-out cursor-pointer hover:translate-y-1 hover:scale-110 inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-indigo-100 hover:text-red-800 transition"
                            type="button">
                                <span className="fa fa-cancel">
                                    </span>
                                    Cancel
                            </button>
                            </>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={toggleForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
              </div>
            </form>
              ):(
                  <form onSubmit={tambahProdi}
                  className="space-y-4 w-full mx-auto p-6 bg-white rounded-lg shadow-background shadow-lg">
                    {/* Select Option */}
                    <div className="flex flex-col">
                        <label htmlFor="program_studi" className="text-sm font-medium text-gray-700 mb-2">
                        Pilih Fakultas
                        </label>
                      <select
                            id="fakultas"
                            name="fakultas_id"
                            disabled={!isFormVisible}
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
                                        .filter((p) => p.id === EditId)
                                        .map((p) => (
                                            <option key={p.id} value={p.id}>
                                            {p.nama_fakultas}
                                            </option>
                                        ))}

                            </select>
                    </div>

                    {/* Input Text 2 */}
                    <div className="flex flex-col">
                        <label htmlFor="input2" className="text-sm font-medium text-gray-700 mb-2">
                        Kode Program Studi
                        </label>
                        <input
                        id="kode_prodi"
                        name="kode_prodi"
                        type="text"
                        value= {formDataProdiBaru.kode_program_studi}
                        onChange={(e)=>setFormDataProdiBaru({...formDataProdiBaru,kode_program_studi:e.target.value})}
                        placeholder="Masukkan Kode Program Studi"
                        className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                     {/* Input Text 1 */}
                    <div className="flex flex-col">
                        <label htmlFor="input1" className="text-sm font-medium text-gray-700 mb-2">
                        Nama Program Studi
                        </label>
                        <input
                        id="prodi"
                        name="prodi"
                        type="text"
                        value={formDataProdiBaru.nama_program_studi}
                        onChange={(e)=>setFormDataProdiBaru({...formDataProdiBaru,nama_program_studi:e.target.value})}
                        placeholder="Masukkan Nama Program Studi"
                        className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end">
                          <button
                        type="button"
                        onClick={toggleForm}
                        className="mr-1 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                        Batal
                        </button>
                        <button
                        type="submit"
                        disabled={loading}
                         style={{ cursor: loading ? 'progress' : 'pointer' }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                        Simpan
                        </button>
                    </div>
                    </form>
                )}
            </div>
            </div>
                )}

          {modalTambahProdi && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div
                    className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
                    >
                    <form
                        onSubmit={tambahProdi}
                        className="space-y-6 w-full mx-auto"
                    >
                        <div className="flex flex-col">
                        <label
                            htmlFor="fakultas"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Pilih Fakultas
                        </label>
                        <select
                            id="fakultas"
                            name="fakultas_id"
                            disabled
                            value={formDataProdiBaru.fakultas_id || ""}
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
                            .filter((p) => p.id === EditId)
                            .map((p) => (
                                <option key={p.id} value={p.id}>
                                {p.nama_fakultas}
                                </option>
                            ))}
                        </select>
                        </div>


                        <div className="flex flex-col">
                        <label
                            htmlFor="kode_prodi"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Kode Program Studi
                        </label>
                        <input
                            id="kode_prodi"
                            name="kode_prodi"
                            type="text"
                            value={formDataProdiBaru.kode_program_studi}
                            onChange={(e) =>
                            setFormDataProdiBaru({
                                ...formDataProdiBaru,
                                kode_program_studi: e.target.value,
                            })
                            }
                            placeholder="Masukkan Kode Program Studi"
                            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>

                        <div className="flex flex-col">
                        <label
                            htmlFor="prodi"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
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


                        <div className="flex justify-end space-x-2">
                        <button
                            type="button"

                            onClick={()=>{
                                setModalTambahProdi(false)
                            }}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ cursor: loading ? "progress" : "pointer" }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Simpan
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
                )}
            </div>



        </>

    );
}

