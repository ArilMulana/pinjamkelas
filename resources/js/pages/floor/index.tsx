import Dashboard from "@/pages/dashboard";
import { DFloor } from '@/pages/floor/d-floor';
import { Head } from "@inertiajs/react";
export default function Index() {
    return(
        <Dashboard>
              <Head>
                <title>Lantai</title>
            </Head>
            <DFloor>

            </DFloor>
        </Dashboard>
    );
}
