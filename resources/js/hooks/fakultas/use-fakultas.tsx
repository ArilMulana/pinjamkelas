import { usePage } from "@inertiajs/react";
import { useMemo, useState } from "react";

export interface Fakultas{
        id:number,
        kode_fakultas:string,
        nama_fakultas:string
    }
export interface Prodi {
    id:number,
    kode_program_studi:string,
    nama_program_studi:string,
    fakultas_id:number,
    fakultas: Fakultas
}

export function useFakultas(){
    const { fakultas, prodi } = usePage<{
        fakultas: Fakultas[];
        prodi: Prodi[];
    }>().props;
    // console.log(fakultas);
    return { fakultas, prodi };
}

export function useSearchFakultas(){
    const { fakultas } = useFakultas();
    const [search, setSearch] = useState('');

    const filteredFakultas = useMemo(() => {
        if (!search) return fakultas;
        return fakultas.filter(f =>
        f.id.toString().includes(search.toLowerCase()) ||
        f.kode_fakultas.toLowerCase().includes(search.toLowerCase()) ||
        f.nama_fakultas.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, fakultas]);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredFakultas.length/itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1); // mengaktifkan halaman pertama

    const currentItems = filteredFakultas.slice(
            (currentPage-1)*itemsPerPage,
        currentPage * itemsPerPage
        );
    // **PASTIKAN RETURN**
    return { search, setSearch, filteredFakultas,currentPage,setCurrentPage,currentItems,totalPages,itemsPerPage };
}
