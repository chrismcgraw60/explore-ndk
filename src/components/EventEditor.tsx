"use client";

import React, { useEffect, useState } from "react";
import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { Kind0 } from "@/features/kind-schemas/kind-schemas";
import {NDKKind, NDKEvent, NostrEvent} from "@nostr-dev-kit/ndk"
import { useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import { useNDK } from "@nostr-dev-kit/ndk-react";

function EventEditor() {

  const {npub} = useUserProfileStore((state) => state);
  const event : NostrEvent = {
    content: "flow1",
    created_at: 0,
    kind: NDKKind.Text,
    pubkey: npub ? npub.npub : "KEY_GOES_HERE",
    tags: [["t", "cmg60-flow"]]
  }

  const { signer, signPublishEvent, loginWithNip07, ndk } = useNDK();
  const [isSignedIn, setSignedIn] = useState<boolean>(false);
  const [isPublishing, setPublishing] = useState<boolean>(false);
  const [result, setResult] = useState<string | undefined>(undefined);
  const [eventJson, setEventJson] = useState<string | undefined>(JSON.stringify(event, null, 2));
  

  function handleEditorPreMount(monaco: Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [Kind0],
      schemaValidation: "error",
      enableSchemaRequest: false,
      allowComments: false
    });
  }

  useEffect(() => {
    if (!isSignedIn) {
      const login = async () => await loginWithNip07();
      login();
      setSignedIn(true);
    }

  }, [isSignedIn, loginWithNip07]);

  async function publish() {

    if (!eventJson) return;

    setPublishing(true);

    const editorEvent : NostrEvent = JSON.parse(eventJson);
    const publishEvent = new NDKEvent();
    publishEvent.kind = editorEvent.kind;
    publishEvent.content = editorEvent.content;
    publishEvent.tags = editorEvent.tags;

    try {
      publishEvent.ndk = ndk;
      await publishEvent.sign();
      await publishEvent.publish();
    
      // const event = await signPublishEvent(publishEvent);
      if (publishEvent) {
        setResult(JSON.stringify(publishEvent.rawEvent(), null, 2));
      }
    }
    finally {
      setPublishing(false);
    }
  }

  function handleEditorChange(value: string | undefined,  _: editor.IModelContentChangedEvent ) {
    setEventJson(value);
  }

  return (
    <>
      {!signer && (<div>No Signer</div>)}

      {isSignedIn && (
        <div>
          { isPublishing ? "Publishing..." : <button onClick={() => publish()}>Publish</button> }
        </div>    
      )}

      <Editor
        beforeMount={handleEditorPreMount}
        defaultLanguage="json"
        defaultValue={JSON.stringify(event, null, 2)}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      
      ({result &&
        <div>
          <code>
            {result}
          </code>
        </div>
      })
    </>    
  );
}

export default EventEditor;
