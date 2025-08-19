import { usePage } from "@inertiajs/react";

export type Building = {
  id: number;
  name: string;
  code: string;
  lokasi: string;
};

export type Floors_Gedung = {
    id: number;
  building_id : number;
  building: Building;
  floor_number: number;
};

export type Ruangan = {
    id: number;
    floor_id: number;
    floors: Floors_Gedung;
    name: string;
    capacity: number;
    is_active:number;
};
//ngambil data matkul
export function useDetailLantai(){
      const {buildings,floors,rooms} = usePage<{
               floors: Floors_Gedung[];
               rooms: Ruangan[];
               buildings: Building[];
               }>().props;

        return {floors, rooms,buildings};
}




