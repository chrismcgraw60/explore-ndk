import { useState, useEffect, useCallback, Suspense } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import NDK from '@nostr-dev-kit/ndk/ndk';
import { useUserProfileStore, Nip07Response } from '@/features/user-profile/UserProfileStore'

/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const { loginWithNip07, ndk } = useNDK();
    const {ndkUser, npubWithSigner, setNdkUser, setNpubWithSigner} = useUserProfileStore((state) => state);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        if (npubWithSigner && !ndkUser ) {

            const fetchAndSetUser = async (nip07: Nip07Response) => {
                const user = (ndk as NDK).getUser({npub: nip07?.npub});
                await user.fetchProfile();
                setNdkUser(user);
            };
            fetchAndSetUser(npubWithSigner)
        }
        setReady(true)
    }, [ndk, ndkUser, npubWithSigner, setNdkUser])

    async function connectExtension() {
        const user : Nip07Response = await loginWithNip07();
        setNpubWithSigner(user);
    }

    return ready ? (
            <div>

                {!npubWithSigner && (
                    <button onClick={() => connectExtension()}>
                        Connect with Extension
                    </button>
                )}
    
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