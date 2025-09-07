import Dashboard from "@/pages/dashboard";
//import { DFloor } from '@/pages/floor/d-floor';
import {DMatkul} from '@/pages/matkul/d-matkul';
import { Head } from "@inertiajs/react";
export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Akademik</title>
            </Head>
            <DMatkul>

            </DMatkul>
        </Dashboard>
    );
}
