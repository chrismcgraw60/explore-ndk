import { useState, useEffect } from "react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import NDK from '@nostr-dev-kit/ndk';
import { useUserProfileStore, NPub07 } from '@/features/user-profile/UserProfileStore'

/**
 * Provides login features and profile information.
 */
export default function NostrProfile() {

    const { loginWithNip07, ndk } = useNDK();
    const {ndkUser, npub, setNdkUser, setNpub07} = useUserProfileStore((state) => state);
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        if (ndk && npub && !ndkUser ) {

            const fetchAndSetUser = async (npub: NPub07) => {
                const user = (ndk as NDK).getUser({npub: npub?.npub});
                await user.fetchProfile();
                setNdkUser(user);
            };
            fetchAndSetUser(npub)
        }
        setReady(true)
    }, [ndk, ndkUser, npub, setNdkUser])

    async function connectExtension() {
        const user = await loginWithNip07();
        if (user) {
            setNpub07(user); 
        }
    }

    return ready ? (
            <div>

                {!npub && (
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