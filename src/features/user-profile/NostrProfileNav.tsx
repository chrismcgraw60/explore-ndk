/* eslint-disable @next/next/no-img-element */
"use client";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useUserProfileStore } from "@/features/user-profile/UserProfileStore";

const user = {
  name: "chrismcgraw60",
  email: "chrismcgraw60@gmail.com",
  imageUrl: "https://avatars.githubusercontent.com/u/4159345?v=4",
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NostrProfileNav() {

  const { loginWithNip07 } = useNDK();
  const userProfiles = useUserProfileStore((state) => state);

  async function connectExtension() {
    const user = await loginWithNip07();
    if (user) {
      userProfiles.setNpub07(user); 
    }
  }

  return (
    <>
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
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

            {!userProfiles.npub &&
              <Menu.Item key="sign_in">
                { ({ active }) => (<a href="#" onClick={() => connectExtension()} className={menuItemClass(active)}>Sign in</a>) }
              </Menu.Item>
            }

            {userProfiles.npub &&
              <>
              <Menu.Item key="show_profile">
                { ({ active }) => (<a href="/" className={menuItemClass(active)}>Your Profile</a>) }
              </Menu.Item>

              <Menu.Item key="sign_out">
                { ({ active }) => (<a href="#" onClick={() => userProfiles.clear()} className={menuItemClass(active)}>Sign out</a>) }
              </Menu.Item>
              </>
            }
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

function menuItemClass(active: boolean): string | undefined {
  return classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700");
}

