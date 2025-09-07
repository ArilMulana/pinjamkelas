import { Head } from "@inertiajs/react";
import Dashboard from "../dashboard";
import { User } from "./user";

export default function  Index(){
    return(
        <Dashboard>
            <Head>
                <title>User</title>
            </Head>
            <User>

            </User>
        </Dashboard>

    );
}
