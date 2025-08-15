import Dashboard from "@/pages/dashboard";
//import { DFloor } from '@/pages/floor/d-floor';
import { JadwalMatkul } from "./d-matkul";
import { Head } from "@inertiajs/react";

export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Jadwal Matakuliah</title>
            </Head>
            <JadwalMatkul>

            </JadwalMatkul>
        </Dashboard>
    );
}
