import { useEffect, useRef, useState } from "react";
import NDK from "@nostr-dev-kit/ndk";

export default function NDKInstance(explicitRelayUrls: string[]) {
  const loaded = useRef(false);

  const [ndk, _setNDK] = useState<NDK | undefined>(undefined);

  useEffect(() => {
    async function load() {
      if (ndk === undefined && loaded.current === false) {
        loaded.current = true;
        await loadNdk(explicitRelayUrls);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explicitRelayUrls]);

  async function loadNdk(explicitRelayUrls: string[]) {
    const ndkInstance = new NDK({ explicitRelayUrls });

    try {
      await ndkInstance.connect();
      _setNDK(ndkInstance);
    } catch (error) {
      console.error("ERROR loading NDK NDKInstance", error);
    }
  }

  return {
    ndk,
    loadNdk,
  };
}
