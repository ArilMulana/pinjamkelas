import Dashboard from "@/pages/dashboard";
import { DRoom } from "@/pages/room/d-room";
export default function Index() {
    return(
        <Dashboard>
            <head>
                <title>Ruangan</title>
            </head>
            <DRoom />
        </Dashboard>
    );
}
