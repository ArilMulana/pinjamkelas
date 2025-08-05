import { usePage } from "@inertiajs/react";
import { Prodi } from "../fakultas/use-fakultas";

export enum tipeMatkul{
    Wajib = "wajib",
    Umum = "umum"
}

export interface MatkulData{
    id:number,
    kode_matakuliah:string,
    nama_matakuliah:string,
    sks:number,
    tipe:tipeMatkul

    [key: string]: number | string | tipeMatkul;
}

export interface dataMatkul{
     id:number,
    kode_matakuliah:string,
    nama_matakuliah:string,
    sks:number,
    tipe:tipeMatkul
}

export interface PaginatedMatkul {
  data: MatkulData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MatProdi {
  id: number;
  matakuliah_id: number;
  program_studi_id: number;
  matakuliah: {
    id: number;
    nama_matakuliah: string;
    kode_matakuliah: string;
    sks: number;
    tipe: string;
  };
  programstudi: {
    id: number;
    nama_program_studi: string;
    kode_program_studi: string;
    fakultas_id: number;
  };
}

export interface formMatPro{
    id:number;
    matakuliah_id:number;
    program_studi_id:number;
}
//ngambil data matkul
export function useMatkul(){
    const {matkul,matprodi,matkulData} = usePage<{
            matkul: PaginatedMatkul;
             matprodi: MatProdi[];
             matkulData:dataMatkul[];

        }>().props;

        return {matkul,matprodi,matkulData};
}

// export function useMatProdi(){
//     const {matprodi} = usePage<{
//             matprodi: MatProdi;

//         }>().props;

//         return {matprodi};
// }
// export function useFormMatkul(){
//     const {matkulData} = usePage<{
//         matkulData:dataMatkul;
//     }>().props;

//     // const{formMatkul,setFormatkul} = useState()
//     return {matkulData};
// }



