
import { create } from 'zustand'
import { NDKUserProfile, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk/ndk"

export type Nip07Response = undefined | NPubWithSigner

interface NPubWithSigner{
    npub: string;
    signer: NDKNip07Signer;
}

export interface UserProfileState {
    npubWithSigner: Nip07Response;
    ndkProfile: NDKUserProfile | null;
    ndkUser: NDKUser | null;
    setNdkUser: (ndkUser: NDKUser) => void; 
    setNdkProfile: (ndkProfile: NDKUserProfile) => void; 
    setNpubWithSigner: (npubWithSigner: Nip07Response) => void; 
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
    npubWithSigner: undefined,
    ndkProfile: null,
    ndkUser: null,
    setNdkProfile: (ndkProfileToSet) => set(() => ({ndkProfile: ndkProfileToSet})),
    setNdkUser: (ndkUserToSet) => set(() => ({ndkUser: ndkUserToSet})),
    setNpubWithSigner: (setNpubWithSignerToSet) => set(() => ({npubWithSigner: setNpubWithSignerToSet})),
}));