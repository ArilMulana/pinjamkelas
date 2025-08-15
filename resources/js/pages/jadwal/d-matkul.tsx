import { CirclePlus, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
type Jadwal = {
  gedung: string;
  lantai: number;
  ruangan: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  matkul: string;
  prodi: string;
  aksi: React.ReactNode;
};

type JadwalRuangan = {
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  rooms: {
    name: string;
    floor: {
      floor_number: number;
      building: {
        name: string;
      };
    };
  };
  matakuliah_program_studi: {
    matakuliah: {
      nama_matakuliah: string;
    };
    programstudi: {
      nama_program_studi: string;
    };
  };
};


export function JadwalMatkul() {
     const {jadwalRuangan} = usePage<{
            jadwalRuangan: JadwalRuangan[];
            }>().props;
    console.log(jadwalRuangan);
const data = useMemo(() => {
  return jadwalRuangan.map((item) => ({
    gedung: item.rooms.floor.building.name,
    lantai: item.rooms.floor.floor_number,
    ruangan: item.rooms.name,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_selesai: item.jam_selesai,
    matkul: item.matakuliah_program_studi.matakuliah.nama_matakuliah,
    prodi: item.matakuliah_program_studi.programstudi.nama_program_studi,
    aksi: (
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          <CirclePlus size={14} color="white" />
          <span>Edit</span>
        </button>
        <button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
          <Trash2 size={14} color="white" />
          <span>Hapus</span>
        </button>
      </div>
    ),
  }));
}, [jadwalRuangan]);
    const columns:ColumnDef<Jadwal>[] = [
  {
    header: "Gedung",
    accessorKey: "gedung",
  },

  {
    header: "Lantai",
    accessorKey: "lantai",
  },
  {
    header: "Ruangan",
    accessorKey: "ruangan",
  },
  {
    header: "Hari",
    accessorKey: "hari",
  },
  {
    header: "Waktu",
    cell: ({ row }) => `${row.original.jam_mulai} - ${row.original.jam_selesai}`,
  },
  {
    header: "Matakuliah",
    accessorKey: "matkul",
  },
  {
    header: "Program Studi",
    accessorKey: "prodi",
  },
  {
    header: "Aksi",
    accessorKey: "aksi",
    cell: info => info.getValue(),
  },
];
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
});
  return (

      <div className="overflow-x-auto text-black bg-white p-6 rounded-lg shadow-md">
    <div className="mb-4">
        {/* Judul di tengah */}
        <h1 className="text-2xl font-bold text-center mb-3">Jadwal Matakuliah</h1>

        {/* Tombol di baris terpisah, rata kanan */}
        <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">
            <CirclePlus size={16} color="white" />
            Tambah Jadwal
            </button>
        </div>
        </div>

      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
  <thead className="bg-gray-100">
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id} className="px-4 py-3 text-sm">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
