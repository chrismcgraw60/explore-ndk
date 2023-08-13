'use client'

import { useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKUserProfile } from "@nostr-dev-kit/ndk"

/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {
    
    const [result, setResult] = useState<string>("");
    const [user, setUser] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { loginWithNip07, getProfile } = useNDK();

    const profile = user ? getProfile(user) : null;

    async function connectExtension() {
        setLoading(true);
        const user = await loginWithNip07();
        if (user) {
          setResult(JSON.stringify(user, null, 2));
          setUser(user.npub);
        }
        setLoading(false);
    }

    function renderProfile(profile: NDKUserProfile | null) {
        return profile ? JSON.stringify(profile, null, 2) : "No Profile";
    }

    return (
        <>
            {!result && (
                <button onClick={() => connectExtension()}>
                    {loading ? "..." : "Connect with Extension"}
                </button>
            )}

            {result && (
                <pre>
                <code>{user}</code>
                </pre>
            )}

            <pre>
            <code>{renderProfile(profile)}</code>
            </pre>
            

        </>
    )
}