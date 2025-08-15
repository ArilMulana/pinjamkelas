import { CirclePlus, Trash2 } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  Column,
   ColumnFiltersState,
} from '@tanstack/react-table';

import { useMemo, useState } from "react";
import { Jadwal, JadwalRuangan } from "../../hooks/jadwal/use-jadwalruangan";

type FilterInputProps = {
  column: Column<Jadwal, unknown>;
};

function FilterInput({ column }: FilterInputProps) {
  const value = column.getFilterValue() ?? "";

  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Filter..."
      className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export function JadwalMatkul() {
     const {jadwalRuangan} = JadwalRuangan();
       const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
        <button className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          <CirclePlus size={14} color="white" />
          <span>Edit</span>
        </button>
        <button className="cursor-pointer flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
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
      accessorFn: (row) => `${row.jam_mulai} - ${row.jam_selesai}`,
      id: "waktu",
      cell: (info) => info.getValue(),
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
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    },
];
const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (

      <div className="overflow-x-auto text-black bg-white p-6 rounded-lg shadow-md">
    <div className="mb-4">
        <h1 className="text-2xl font-bold text-center mb-3">Jadwal Matakuliah</h1>
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
                    {header.column.getCanFilter() && (
                            <FilterInput column={header.column} />
                        )}
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
