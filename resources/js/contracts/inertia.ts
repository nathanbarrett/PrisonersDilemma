import { User } from "./models/user";
import { PageProps } from "@inertiajs/core";
import { ServerFlashMessage } from "@js/contracts/session-flash-messages";

/** Keep AppPageProps in sync with HandleInertiaRequests.php */
export interface AppPageProps extends PageProps {
    appName: string;
    stripePublicKey: string;
    csrfToken: string;
    auth: { user: User|null; }|null;
    "flash.success": ServerFlashMessage;
    "flash.error": ServerFlashMessage;
    "flash.info": ServerFlashMessage;
    passwordResetToken: string|null;
    passwordResetEmail: string|null;
}

// export function getAppProp<K extends keyof AppPageProps>(prop: K): AppPageProps[K] {
//     return get((usePage() as Page<AppPageProps>).props, prop);
// }
