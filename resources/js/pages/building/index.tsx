import Dashboard from "@/pages/dashboard";
//import { RGedung } from '@/pages/building/r-gedung';
import { RGedung } from '@/pages/building/r-gedung';
//import { Testtable } from '@/pages/building/TestTable';
export default function Index() {
    return(
        <Dashboard>
            <RGedung>
                {/* <Testtable> */}

                {/* </Testtable> */}
            </RGedung>
        </Dashboard>
    );
}
