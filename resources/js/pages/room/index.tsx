import Dashboard from "@/pages/dashboard";
import { DRoom } from "@/pages/room/d-room";
import { Head } from "@inertiajs/react";
export default function Index() {
    return(
        <Dashboard>
            <Head>
                <title>Ruangan</title>
            </Head>
            <DRoom />
        </Dashboard>
    );
}
