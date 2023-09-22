"use client";

import React, { useState } from "react";
import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { Kind0 } from "@/features/kind-schemas/kind-schemas";
import NDK, { NDKKind, NDKEvent, NostrEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk"
import { useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { now } from "lodash";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function EventEditor() {

  const {npub} = useUserProfileStore((state) => state);
  const event : NostrEvent = {
    content: "",
    created_at: now(),
    kind: NDKKind.Text,
    pubkey: npub ? npub.npub : "",
    tags: [["t", "cmg60-flow"]]
  }

  const { loginWithNip07, ndk } = useNDK();
  const [ nip07Signer, setNip07Signer] = useState<NDKNip07Signer | undefined>(undefined);
  const [ isPublishing, setPublishing] = useState<boolean>(false);
  const [ result, setResult] = useState<string | undefined>(undefined);
  const [ eventJson, setEventJson] = useState<string | undefined>(JSON.stringify(event, null, 2));
  


  function handleEditorPreMount(monaco: Monaco) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [Kind0],
      schemaValidation: "error",
      enableSchemaRequest: false,
      allowComments: false
    });
  }

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

      if (!nip07Signer) {
        const loginResponse = await loginWithNip07();
        const nip07Signer = loginResponse && loginResponse.signer;
        (ndk as NDK).signer = nip07Signer;
        setNip07Signer(nip07Signer)
      }

      await publishEvent.sign();
      await publishEvent.publish();
      setResult(JSON.stringify(publishEvent.rawEvent(), null, 2));

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

      { !nip07Signer && (<div>No Signer</div>) }


      <div>
        { isPublishing ? "Publishing..." : <button onClick={() => publish()}>Publish</button> }
      </div>    

      <PanelGroup direction="vertical">
        <Panel maxSize={150}>
          <PanelGroup direction="horizontal">
            <Panel>
              <Editor
                beforeMount={handleEditorPreMount}
                defaultLanguage="json"
                defaultValue={JSON.stringify(event, null, 2)}
                onChange={handleEditorChange}
                theme="vs-dark"
              />
            </Panel>
            <PanelResizeHandle className="w-2 bg-zinc-800" />
            <Panel>
              <Editor
                  theme="vs-dark"
                />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="h-2 bg-zinc-800" />
        <Panel className="h-40">
          <div className="h-fit bg-monaco_dark">
            <code>
              <pre>
                some text to see the color
                {result}
              </pre>
            </code>
          </div>
        </Panel>
      </PanelGroup>

    </>   

  );
}

export default EventEditor;
