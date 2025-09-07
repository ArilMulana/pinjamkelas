import Dashboard from "@/pages/dashboard";
//import { RGedung } from '@/pages/building/r-gedung';
import { RGedung } from '@/pages/building/r-gedung';
import { Head } from "@inertiajs/react";
//import { Testtable } from '@/pages/building/TestTable';
export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Gedung</title>
            </Head>
            <RGedung>
                {/* <Testtable> */}

                {/* </Testtable> */}
            </RGedung>
        </Dashboard>
    );
}
