/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment, useState, useEffect } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import NDK from '@nostr-dev-kit/ndk/ndk';
import { useUserProfileStore, NPub07 } from "@/features/user-profile/UserProfileStore";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NostrProfileNav() {

  const { loginWithNip07, ndk  } = useNDK();
  const {ndkUser, npub, setNdkUser, setNpub07, clear} = useUserProfileStore((state) => state);
  const [userFetchAttempted, setUserFetchAttempted] = useState<boolean>(false);

  useEffect(() => {
    if (ndk && npub && !ndkUser ) {

        const fetchAndSetUser = async (npub: NPub07) => {
            const user = (ndk as NDK).getUser({npub: npub?.npub});
            await user.fetchProfile();
            setNdkUser(user);
        };
        fetchAndSetUser(npub)
    }
    setUserFetchAttempted(true)
  }, [ndk, ndkUser, npub, setNdkUser])

  async function connectExtension() {
    const user = await loginWithNip07();
    if (user) {
      setNpub07(user); 
    }
  }

  /* Profile dropdown */
  function profileDropDown() {
    return (
      <>
        <Menu as="div" className="relative ml-3">
          <div>
            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Open user menu</span>
              <img className="h-8 w-8 rounded-full" src={ndkUser?.profile?.image} alt="" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

              <Menu.Item key="show_profile">
                { ({ active }) => (<a href="/profile" className={menuItemClass(active)}>Your Profile</a>) }
              </Menu.Item>

              <Menu.Item key="sign_out">
                { ({ active }) => (<a href="#" onClick={() => clear()} className={menuItemClass(active)}>Sign out</a>) }
              </Menu.Item>

            </Menu.Items>
          </Transition>
        </Menu>
      </>
    );
  }

  function signInButton() {
    return (
      <a href="#" onClick={() => connectExtension()} 
        className="'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'">Sign in</a>
    );
  }

  return userFetchAttempted && (npub ? profileDropDown() : signInButton());
}

function menuItemClass(active: boolean): string | undefined {
  return classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700");
}

