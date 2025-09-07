import DataTable from "@/hooks/datatables/use-datatables";
import { usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

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
    const {users,roles} = usePage<{users:User[],roles:Role[]}>().props;
    //console.log(roles);
    const[idUser,setIdUser]= useState<number |null>(null);
     const[selectedIdRole,setSelectedIdRole] = useState<number|null>(null);

     const selectedUser = useMemo(() => {
      return users.find(b => b.id === idUser) || null;
    }, [idUser, users]);

    const[editMode,setEditMode] = useState(false);
    const editUser= useCallback((id:number)=>{
        setIdUser(id);
        setEditMode(true);
        setSelectedIdRole(users.find(u=>u.id===id)?.role_id||null)
    },[users]);

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
            //onClick={()=>deleteJadwal(item.id)}
            className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
            <Trash2 size={14} color="white" />
            <span>Hapus</span>
            </button>
        </div>
        ),
    }));
    }, [users,editUser]);
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
        //  cell: ({ row }) => {
        //     const role_name = row.original.role_name; // karena row.original masih tipe User
        //     return `${role_name}`;
        // },
       },
      {
           header: "Aksi",
           accessorKey: "aksi",
           cell: (info) => info.getValue(),
           enableColumnFilter: false,
         },
     ];

if(!users || users.length===0){
    return <div className="text-black bg-red-600 p-4 rounded-lg">tidak ada data</div>
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
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="name">Nama</label>
                            <input type="text" id="name" className="w-full px-3 py-2 border rounded"
                            value={selectedUser?.name} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input readOnly type="email" id="email" className="cursor-not-allowed w-full px-3 py-2 border rounded"
                             value={selectedUser?.email} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="role">Role</label>
                            <select id="role" className="w-full px-3 py-2 border rounded"
                            value={selectedIdRole??''}
                              onChange={(e) => setSelectedIdRole(Number(e.target.value))}
                            >
                                <option value="">Pilih Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </>
    )
}
