import DataTable from "@/hooks/datatables/use-datatables";
import { usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus, Trash2 } from "lucide-react";
import { useMemo } from "react";

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

export function TableUser(){
    const {users} = usePage<{users:User[]}>().props;
    const data = useMemo<userData[]>(() => {
    return users.map((item) => ({
        name:item.name,
        email:item.email,
        role_id:item.role.id,
        role_name:item.role.name,
        aksi: (
        <div className="flex items-center gap-2">
            <button
            //onClick={() => editJadwal(item.id)}
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
    }, [users]);
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
         cell: ({ row }) => {
            //const role_id = row.original.role_id;
            const role_name = row.original.role_name; // karena row.original masih tipe User
            return `${role_name}`;
        },
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
    <DataTable
        data={data}
        columns={columns}
        />
    )
}
