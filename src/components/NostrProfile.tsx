'use client'

import { useState, useEffect, useCallback } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import NDK from '@nostr-dev-kit/ndk/ndk';
import { useUserProfileStore, Nip07Response } from '@/features/user-profile/UserProfileStore'

/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const { loginWithNip07, ndk } = useNDK();
    const userProfiles = useUserProfileStore((state) => state);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAndSetUser = useCallback(async (nip07: Nip07Response) => {

        if (userProfiles.ndkUser) return;

        const user = (ndk as NDK).getUser({npub: nip07?.npub});
        await user.fetchProfile();
        userProfiles.setNdkUser(user);

    }, [ndk, userProfiles]);

    useEffect(() => {
        if (userProfiles.npubWithSigner ) {
            fetchAndSetUser(userProfiles.npubWithSigner)
        }
    }, [fetchAndSetUser, userProfiles.npubWithSigner])



    async function connectExtension() {
        setLoading(true);

        const user : Nip07Response = await loginWithNip07();
        userProfiles.setNpubWithSigner(user);

        setLoading(false);
    }

    return (
        <div>

            {!userProfiles.npubWithSigner && (
                <button onClick={() => connectExtension()}>
                    {loading ? "..." : "Connect with Extension"}
                </button>
            )}

            <div className="overflow-auto">
                <code>
                    {userProfiles.ndkUser && (
                        <div className="overflow-auto">
                            USER: <code>{ JSON.stringify(userProfiles.ndkUser, null, 2) }</code>
                        </div>
                    )}
                </code>
            </div>
        </div>
    )
}