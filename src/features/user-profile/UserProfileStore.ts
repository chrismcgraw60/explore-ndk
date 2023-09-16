'use client'
import { create } from 'zustand'
import { NDKNip07Signer, NDKUser, Npub } from "@nostr-dev-kit/ndk/ndk"
import { createJSONStorage, persist } from 'zustand/middleware';

export interface NPub07 { 
    npub: string;
    signer: NDKNip07Signer;
}

export interface UserProfileState {
    npub: NPub07 | undefined;
    ndkUser: NDKUser | undefined;

    setNdkUser: (ndkUser: NDKUser | undefined) => void; 
    setNpub07: (npubWithSigner: NPub07 | undefined) => void; 
    clear: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
    persist(
        (set) => ({
            npub: undefined,
            ndkUser: undefined,
            setNdkUser: (ndkUserToSet) => set(() => ({ndkUser: ndkUserToSet})),
            setNpub07: (npubWithSignerToSet) => set(() => ({npub: npubWithSignerToSet})),
            clear: () => set(() => ({
                npub : undefined,
                ndkUser : undefined
            }))
        }),
        {
            name: 'user-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);