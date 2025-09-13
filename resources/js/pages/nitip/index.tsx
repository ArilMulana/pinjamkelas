import Dashboard from "@/pages/dashboard";
import { Head } from "@inertiajs/react";
import { Nitip } from "./nitip";
// import { Nitip } from ".";
export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Penitipan Hewan</title>
            </Head>
            <Nitip>

            </Nitip>
        </Dashboard>
    );
}
