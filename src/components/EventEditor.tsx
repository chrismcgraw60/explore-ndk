"use client";

import React, { useRef, useState } from "react";
import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { Kind0 } from "@/features/kind-schemas/kind-schemas";
import NDK, { NDKKind, NDKEvent, NostrEvent, NDKNip07Signer } from "@nostr-dev-kit/ndk"
import { NPub07, useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { now } from "lodash";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactJson from 'react-json-view';

function initEvent(npub: NPub07 | undefined) : NostrEvent {
  return {
    content: "",
    created_at: now(),
    kind: NDKKind.Text,
    pubkey: npub ? npub.npub : "",
    tags: [["t", "cmg60-flow"]]
  };
}

function EventEditor() {

  const {npub} = useUserProfileStore((state) => state);
  const { loginWithNip07, ndk } = useNDK();
  const [ nip07Signer, setNip07Signer] = useState<NDKNip07Signer | undefined>(undefined);
  const [ isPublishing, setPublishing] = useState<boolean>(false);
  const [ editorEvent, setEditorEvent] = useState<NostrEvent>(initEvent(npub));
  const [ result, setResult] = useState<string | undefined>(undefined);

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

    if (!editorEvent) return;

    setPublishing(true);

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
    catch(err) {
      console.log("CAUGHT ERR"  + err)
      console.log(err);
    }
    finally {
      setPublishing(false);
    }
  }

  function handleEventEditorChange(value: string | undefined,  _: editor.IModelContentChangedEvent ) {
    value && setEditorEvent(JSON.parse(value));
  }

  function handleContentEditorChange(value: string | undefined,  _: editor.IModelContentChangedEvent ) {
    setEditorEvent({ ...editorEvent, content: value || "" })
  }

  return (
    <>
      <div>
        { isPublishing ? "Publishing..." : <button onClick={() => publish()}> {nip07Signer ? "Publish" : "Publish [!S]"} </button> }
      </div>    

      <PanelGroup direction="vertical">

        <Panel>
          <PanelGroup direction="horizontal">

            <Panel id="event_editor">
              <Editor
                beforeMount={handleEditorPreMount}
                defaultLanguage="json"
                value={JSON.stringify(editorEvent, null, 2)}
                onChange={handleEventEditorChange}
                theme="vs-dark"
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-zinc-800" />

            <Panel id="content_editor">
              <Editor
                  defaultValue={""}
                  onChange={handleContentEditorChange}
                  theme="vs-dark"
                />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="h-2 bg-zinc-800" />

        <Panel id="response_viewer" className="h-40">
          <div className="h-fit bg-monaco_dark">
            <ReactJson 
              collapsed={false}
              enableClipboard={false}
              src={result ? JSON.parse(result) : {}}
              theme={"monokai"} 
            />
          </div>
        </Panel>

      </PanelGroup>

    </>   

  );
}

export default EventEditor;

