'use client'

import { useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKUserProfile } from "@nostr-dev-kit/ndk/ndk"
import { useUserProfileStore, UserProfileState, Nip07Response } from '@/features/user-profile/UserProfileStore'



/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const [nip07, setNip07] = useState<Nip07Response>(undefined);
    const userProfiles = useUserProfileStore((state) => state);
    const [loading, setLoading] = useState<boolean>(false);

    const { loginWithNip07, getProfile, getUser } = useNDK();

    async function connectExtension() {
        setLoading(true);

        const user : Nip07Response = await loginWithNip07();
        setNip07(user);

        setLoading(false);
    }

    return (
        <>
            {!nip07 && (
                <button onClick={() => connectExtension()}>
                    {loading ? "..." : "Connect with Extension"}
                </button>
            )}

            <div>
                <pre>
                    {nip07 && (
                        <div className="overflow-auto">
                            NPUB:
                            <code>{ JSON.stringify(nip07, null, 2) }</code>
                        </div>
                    )}
                </pre>
            </div>

            <div className="overflow-auto">
                <code>
                    {nip07 && (
                        <div className="overflow-auto">
                            USER:
                            <code>{ JSON.stringify(getUser(nip07.npub), null, 2) }</code>
                        </div>
                    )}
                </code>
            </div>

            <div className="overflow-auto">
                <code>
                    {nip07 && (
                        <div className="overflow-auto">
                            PROFILE:
                            <code>{ JSON.stringify(getProfile(nip07.npub), null, 2) }</code>
                        </div>
                    )}
                </code>
            </div>
        </>
    )
}