'use client'

import { useState } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKUserProfile } from "@nostr-dev-kit/ndk/ndk"
import { useUserProfileStore, UserProfileState, Nip07Response } from '@/features/user-profile/UserProfileStore'



/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {
    
    const userProfiles = useUserProfileStore((state) => state);
    const [loading, setLoading] = useState<boolean>(false);

    const { loginWithNip07, getProfile } = useNDK();

    const getProfileTest = (npub : string) => {
        getProfile(npub);
        return getProfile(npub);
    }
    
    if (!userProfiles.ndkProfile) {
        const profile = userProfiles.npubWithSigner ? getProfileTest(userProfiles.npubWithSigner.npub) : null;
        if (profile) {
            userProfiles.setNdkProfile(profile);
        }
    }

    async function connectExtension() {
        setLoading(true);

        const user : Nip07Response = await loginWithNip07();
        userProfiles.setNpubWithSigner(user);

        setLoading(false);
    }

    function renderProfile(userProfiles: UserProfileState) {
        const nip07Str = userProfiles.npubWithSigner ? JSON.stringify(userProfiles.npubWithSigner, null, 2) : "No Npub";
        const profileStr = userProfiles.ndkProfile ? JSON.stringify(userProfiles.ndkProfile, null, 2) : "No Profile";
        return "P:" + profileStr + "NPI07:" + nip07Str;
    }

    return (
        <>
            {!userProfiles.npubWithSigner && (
                <button onClick={() => connectExtension()}>
                    {loading ? "..." : "Connect with Extension"}
                </button>
            )}

            <pre>
                <code>{renderProfile(userProfiles)}</code>
            </pre>
{/* 
            <code>
            {
                getProfile(
                "npub1alpha9l6f7kk08jxfdaxrpqqnd7vwcz6e6cvtattgexjhxr2vrcqk86dsn"
                ).displayName
            }
            </code> */}
        </>
    )
}