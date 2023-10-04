import { useState, useEffect } from "react";
import { useUserProfileStore } from '@/features/user-profile/UserProfileStore'

/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const {ndkUser } = useUserProfileStore((state) => state);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => setReady(true), [])

    return ready ? (
            <div>
                <div className="overflow-auto">
                    <code>
                        {ndkUser && (
                            <div className="overflow-auto">
                                USER: <code>{ JSON.stringify(ndkUser, null, 2) }</code>
                            </div>
                        )}
                    </code>
                </div>
            </div>
    ) : null
}