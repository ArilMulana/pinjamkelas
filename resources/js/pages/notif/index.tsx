import Dashboard from "@/pages/dashboard";
import { Head, usePage } from "@inertiajs/react";
// import Notifications from "./Notification";
export default function Index() {
        const { auth } = usePage().props;
        console.log(auth);
    return(
        <Dashboard>
            <Head>
                <title>Akademik</title>
            </Head>
            {/* <Notifications> */}

            {/* </Notifications> */}
        </Dashboard>
    );
}
