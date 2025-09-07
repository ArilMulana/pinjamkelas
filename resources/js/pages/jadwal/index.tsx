import Dashboard from "@/pages/dashboard";
//import { DFloor } from '@/pages/floor/d-floor';
import { JadwalMatkul } from "./d-matkul";

export default function Index() {
    return(
        <Dashboard>
            <head>
                <title>Jadwal Matakuliah</title>
            </head>
            <JadwalMatkul>

            </JadwalMatkul>
        </Dashboard>
    );
}
