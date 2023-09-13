'use client'

import { useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useUserProfileStore, Nip07Response } from '@/features/user-profile/UserProfileStore'



/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const { loginWithNip07, getProfile, getUser } = useNDK();
    const userProfiles = useUserProfileStore((state) => state);
    const [loading, setLoading] = useState<boolean>(false);

    async function connectExtension() {
        setLoading(true);

        const user : Nip07Response = await loginWithNip07();
        userProfiles.setNpubWithSigner(user);

        setLoading(false);
    }

    return (
        <>
            {!userProfiles.npubWithSigner && (
                <button onClick={() => connectExtension()}>
                    {loading ? "..." : "Connect with Extension"}
                </button>
            )}

            <div>
                <pre>
                    {userProfiles.npubWithSigner && (
                        <div className="overflow-auto">
                            NPUB:
                            <code>{ JSON.stringify(userProfiles.npubWithSigner, null, 2) }</code>
                        </div>
                    )}
                </pre>
            </div>

            <div className="overflow-auto">
                <code>
                    {userProfiles.npubWithSigner && (
                        <div className="overflow-auto">
                            USER:
                            <code>{ JSON.stringify(getUser(userProfiles.npubWithSigner.npub), null, 2) }</code>
                        </div>
                    )}
                </code>
            </div>

            <div className="overflow-auto">
                <code>
                    {userProfiles.npubWithSigner && (
                        <div className="overflow-auto">
                            PROFILE:
                            <code>{ JSON.stringify(getProfile(userProfiles.npubWithSigner.npub), null, 2) }</code>
                        </div>
                    )}
                </code>
            </div>
        </>
    )
}