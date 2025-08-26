import { useForm} from "@inertiajs/react";
import Swal from  'sweetalert2';
import { router } from '@inertiajs/react';
import { useState } from "react";



export function FormGedung() {

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    code: "",
    lokasi:"",
  });


 //console.log("data",data);
 const [exists, setExists] = useState<boolean | null>(null);

 function cancelForm(){
    reset();
    setExists(null);
  }
    const checkData = async () => {
    const kode = data.code;
    console.log(kode);
    if (!kode) return;

    try {
    const response = await fetch(`/dashboard/building/cek?value=${encodeURIComponent(kode)}`);
        const data = await response.json();
        setExists(data.exists);
    } catch (error) {
        console.error('Gagal mengecek data:', error);
    }
    };


const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post(route("building.store"), {
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Gedung berhasil ditambahkan',
        confirmButtonText: 'OK',
      }).then(() => {
        // Redirect manual setelah user klik OK
        router.visit(route('building'));
      });

      reset();
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        //html: Object.values(errors).map(err => `<p>${err}</p>`).join(''),
        confirmButtonText: 'OK',
      });
    }
  });
};

  return (
    <>
      <form className=" p-6 rounded-md" onSubmit={handleSubmit}>
        {/* ...form fields seperti sebelumnya */}
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold text-gray-900">Create Gedung</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
  {/* Hilangkan sm:grid-cols-6 supaya 1 kolom penuh */}

            <div className="col-span-full"> {/* pakai col-span-full supaya lebar penuh */}
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Nama
                </label>
                <div className="mt-2">
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring-indigo-500 text-black"
                    placeholder="Nama Gedung"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
            </div>

                <div className="col-span-full">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-900">
                    Kode Gedung
                    </label>
                    <div className="mt-2">
                    <input
                        type="text"
                        name="code"
                        id="code"
                          onBlur={checkData}
                        value={data.code}
                        onChange={e => setData("code", e.target.value)}
                        className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring-indigo-500 text-black"
                        placeholder="Kode Gedung"
                    />
                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                      {exists === true && <p style={{ color: 'red' }}>Data sudah ada.</p>}
                    {exists === false && <p style={{ color: 'green' }}>Data tersedia.</p>}
                    </div>
                </div>
                   <div className="col-span-full"> {/* pakai col-span-full supaya lebar penuh */}
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-900">
                Alamat
                </label>
                <div className="mt-2">
                <input
                    type="text"
                    name="lokasi"
                    id="lokasi"
                    value={data.lokasi}
                    onChange={(e) => setData("lokasi", e.target.value)}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 text-base focus:border-indigo-500 focus:ring-indigo-500 text-black"
                    placeholder="Alamat"
                />
                {errors.lokasi && <p className="mt-1 text-sm text-red-600">{errors.lokasi}</p>}
                </div>
            </div>
                </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button"
        //   onClick={() =>reset()}
        onClick={cancelForm}
          className="cursor-pointer text-sm font-semibold text-gray-900">
            Cancel
          </button>
         <button
            type="submit"
            disabled={processing}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ${
                processing || exists === true ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
            >
            Save
            {processing && <span className="ml-2 animate-spin">⏳</span>}
            </button>

        </div>
      </form>
    </>
  );
}
