import DataTable from "@/hooks/datatables/use-datatables";
import { router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import axios, { AxiosError } from "axios";
import { CirclePlus, Trash2 } from "lucide-react";
import { useCallback,useMemo, useState } from "react";
import Swal from "sweetalert2";

export interface User{
    id:number;
    name:string;
    email:string;
    password:string;
    role_id:number;
    role:Role
}

export interface userData{
    name:string;
    email:string;
    role_id:number;
    role_name:string;
    aksi:React.ReactNode;
}
export interface Role{
    id:number;
    name:string;
}

export function User(){
    return(
         <div className="bg-white rounded-lg shadow-md p-6 text-black">
            <h1 className="text-xl font-semibold mb-4">Daftar User</h1>
                <TableUser/>
        </div>
    )
}

function TableUser(){
    const {users:initialUsers,roles} = usePage<{users:User[],roles:Role[]}>().props;
    //console.log(roles);
    const[idUser,setIdUser]= useState<number |null>(null);
    const [users, setUserData] = useState<User[]>(initialUsers);

     const [loading, setLoading] = useState(false);
      const [formUser, setFormUser] = useState({
        name: '',
         role_id: 0,
         email:'',
         });
    const[editMode,setEditMode] = useState(false);
    const editUser= useCallback((id:number)=>{
        const user = users.find((u) => u.id === id);
        if (!user) return;
        setIdUser(id);
        setEditMode(true);
        setFormUser({
            name: user.name,
            role_id: user.role_id,
            email:user.email,
        });
    },[users]);
const deleteUser = useCallback((id: number) => {
  Swal.fire({
    title: 'Apakah anda yakin?',
    text: "Data yang dihapus tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/dashboard/user/${id}`);
        setUserData((prev) => prev.filter((user) => user.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: res.data?.message || 'Data berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false,
        });

        // TODO: refresh state data user, misalnya fetch ulang dari server
      } catch (error) {
         const err = error as AxiosError<{ message?: string }>;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response?.data.message || 'Gagal menghapus data.',
        });
      }
    }
  });
}, []);
    const data = useMemo<userData[]>(() => {
    return users.map((item) => ({
        name:item.name,
        email:item.email,
        role_id:item.role.id,
        role_name:item.role.name,
        aksi: (
        <div className="flex items-center gap-2">
            <button
            onClick={() => editUser(item.id)}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
            <CirclePlus size={14} color="white" />
            <span>Edit</span>
            </button>
            <button
            onClick={()=>deleteUser(item.id)}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
            <Trash2 size={14} color="white" />
            <span>Hapus</span>
            </button>
        </div>
        ),
    }));
    }, [users,editUser,deleteUser]);

     const columns:ColumnDef<userData>[] = [
       {
         header: "Nama",
         accessorKey: "name",
       },

       {
         header: "Email",
         accessorKey: "email",
       },
       {
         header: "Role",
         accessorKey: "role_name",

       },
      {
           header: "Aksi",
           accessorKey: "aksi",
           cell: (info) => info.getValue(),
           enableColumnFilter: false,
         },
     ];
    //  useEffect(() => {
    // setUserData(initialUsers);
    // }, [initialUsers]);

//    const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const payload = {name:formUser.name,role_id:formUser.role_id};
//     if (loading) return; // cegah submit ganda
//     setLoading(true);
//     //console.log(idUser);
//     try {

//         const res = await axios.put(`/dashboard/user/${idUser}`, payload);

//               setUserData(prev =>
//                 prev.map(u => (u.id === idUser ? { ...u, ...res.data.data } : u))
//             );
//             Swal.fire({
//             icon: "success",
//             title: "Berhasil!",
//             text: res.data.message,
//             timer: 2000,
//             showConfirmButton: false,
//             });
//                // 🔹 Tutup modal
//             setEditMode(false);
//             router.reload({ only: ["users"] });
//         // }
//     } catch (error) {
//       const err = error as AxiosError<{ message?: string }>;
//     Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: err.response?.data?.message || "Terjadi kesalahan.",
//     });
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUser || loading) return;

    setLoading(true);

    const payload = { name: formUser.name, role_id: formUser.role_id };

    router.put(`/dashboard/user/${idUser}`, payload, {
        onSuccess: (page) => {
            // Ambil data user terbaru dari props Inertia
              const props = page.props as unknown as { users: User[]; roles: Role[] };
            setUserData(props.users);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data user berhasil diperbarui.',
                timer: 2000,
                showConfirmButton: false,
            });

            setEditMode(false);
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengedit data.',
            });
        },
        onFinish: () => setLoading(false), // reset loading
    });
};

    if(!users || users.length===0){
       return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg shadow-md min-h-[150px]">
            <svg
            className="w-12 h-12 mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 5a7 7 0 110 14 7 7 0 010-14z"
            ></path>
            </svg>
            <p className="text-red-700 font-semibold text-lg">Tidak ada data</p>
            <p className="text-red-500 text-sm">Silakan tambahkan data terlebih dahulu.</p>
        </div>
        );

    }
    return(
        <>
    <DataTable
        data={data}
        columns={columns}
        />

        {editMode &&(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="name">Nama</label>
                            <input type="text" id="name" className="w-full px-3 py-2 border rounded"
                            value={formUser?.name||''}
                            onChange={(e)=>setFormUser({...formUser,name:e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input readOnly type="email" id="email" className="cursor-not-allowed w-full px-3 py-2 border rounded"
                             value={formUser?.email||''} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
                            <select id="role" className="w-full px-3 py-2 border rounded"
                            value={formUser?.role_id||''}
                              onChange={(e) =>
                                    setFormUser({ ...formUser, role_id: Number(e.target.value) })
                                }
                            >
                                <option value="">Pilih Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
                            <button type="submit"
                            disabled={loading}
                            className={
                                `px-4 py-2 rounded text-white
                                ${loading ? "bg-gray-400 cursor-not-allowed" :
                                    "bg-blue-500 hover:bg-blue-600"
                                }`}
                                >
                                {loading ? "Menyimpan..." : "Simpan"}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    )
}
