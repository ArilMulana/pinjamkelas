import Dashboard from "@/pages/dashboard";
import { RFakultas } from '@/pages/fakultas/r-fakultas';
import { Head } from "@inertiajs/react";
export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Fakultas</title>
            </Head>
            <RFakultas>

            </RFakultas>
        </Dashboard>
    );
}
