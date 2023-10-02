'use client'
import { create } from 'zustand'
import NDK, { NDKNip07Signer, NDKUser, Npub } from "@nostr-dev-kit/ndk"
import { createJSONStorage, persist } from 'zustand/middleware';

export interface NPub07 { 
    npub: string;
    signer: NDKNip07Signer;
}

export interface UserProfileState {
    npub: string | undefined;
    ndkUser: NDKUser | undefined; // shouldn't be on state, hydrate via profile nave on page load.
    // store profile, this has no functions

    clear: () => void;
    fetchUser: (ndk:NDK) => void;
}

type setFn = (
    partial: UserProfileState | Partial<UserProfileState> | ((state: UserProfileState) => UserProfileState | Partial<UserProfileState>), 
    replace?: boolean | undefined) => void;

type getFn = () => UserProfileState;

async function _fetchUser(get: getFn, set: setFn, ndk:NDK) {
    if (get().ndkUser) {
        return;
    }

    const user = await fetchuser();
    user.ndk =ndk;
    await user.fetchProfile();
    set((s) => ({
        ...s,
        npub : user.hexpubkey,
        ndkUser : user
    }))
}

export const useUserProfileStore = create<UserProfileState>()(
    persist(
        (set, get) => ({
            npub: undefined,

            ndkUser: undefined,

            clear: () => set(() => ({
                npub : undefined,
                ndkUser : undefined
            })),

            fetchUser: async (ndk:NDK) => _fetchUser(get, set, ndk),
        }),
        {
            name: 'user-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);

async function fetchuser() {
    const signer = new NDKNip07Signer();
    return await signer.user();
}

