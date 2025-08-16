import Dashboard from "@/pages/dashboard";
//import { DFloor } from '@/pages/floor/d-floor';
import { DMatpro } from "./d-matpro";
import { Head } from "@inertiajs/react";

export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Matakuliah Prodi</title>
            </Head>
           <DMatpro

            />
        </Dashboard>
    );
}
