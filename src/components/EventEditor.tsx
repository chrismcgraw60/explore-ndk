"use client";

import React, { useEffect, useState } from "react";
import { editor } from "monaco-editor";
import Editor, { Monaco } from "@monaco-editor/react";
import { Kind0 } from "@/features/kind-schemas/kind-schemas";
import NDK, { NDKKind, NDKEvent, NDKFilter, NostrEvent, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk"
import { useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import { useNDK } from "@/hooks/useNDK";
import { now } from "lodash";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import NostrEvents from "./NostrEvents";

function initEvent(ndkUser: NDKUser | undefined) : NostrEvent {

  return {
    content: "",
    created_at: now(),
    kind: NDKKind.Text,
    pubkey: ndkUser ? ndkUser["_hexpubkey"] : "loading..",
    tags: [["t", "cmg60-flow"]]
  };
}

async function publishNdkEvent(editorEvent: NostrEvent, ndk: NDK | undefined) {
  const publishEvent = new NDKEvent();
  publishEvent.kind = editorEvent.kind;
  publishEvent.content = editorEvent.content;
  publishEvent.tags = editorEvent.tags;
  publishEvent.ndk = ndk;

  await publishEvent.sign();
  await publishEvent.publish();
  return publishEvent;
}

async function ensureSigner(ndk: NDK | undefined) {
  if (ndk && !ndk.signer) {
    const signer = new NDKNip07Signer();
    await signer.user();
    ndk.signer = signer;
  }
}

function EventEditor() {

  const { ndkUser } = useUserProfileStore((state) => state);
  const { ndk } = useNDK();
  const [ isPublishing, setPublishing] = useState<boolean>(false);
  const [ editorEvent, setEditorEvent] = useState<NostrEvent | undefined>(undefined);
  const [ feedFilter, setFeedFilter] = useState<NDKFilter | undefined>(undefined);
  const [ result, setResult] = useState<NostrEvent | undefined>(undefined);

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
    if (!ndkUser) return;

      setFeedFilter({
        kinds: [1],
        authors: [ndkUser["_hexpubkey"]]
      });

      if (!editorEvent) {
        setEditorEvent(initEvent(ndkUser));
      }

  }, [editorEvent, ndkUser]);

  async function publish() {

    if (!editorEvent) return;

    setPublishing(true);

    try {
      await ensureSigner(ndk);
      const publishEvent = await publishNdkEvent(editorEvent, ndk);
      setResult(publishEvent.rawEvent());

      ndkUser && 
      setFeedFilter({
        kinds: [1],
        authors: [ndkUser["_hexpubkey"]]
      });
    }
    catch(err) {
      console.log("Error publishing: "  + err)
    }
    finally {
      setPublishing(false);
    }
  }

  function handleEventEditorChange(value: string | undefined,  _: editor.IModelContentChangedEvent ) {
    value && setEditorEvent(JSON.parse(value));
  }

  function handleContentEditorChange(value: string | undefined,  _: editor.IModelContentChangedEvent ) {
    setEditorEvent(editorEvent && { ...editorEvent, content: value || "" })
  }

  return (
    <>
      <div>
        { isPublishing ? "Publishing..." : <button onClick={() => publish()}> {ndk?.signer ? "Publish" : "Publish [!S]"} </button> }
      </div>    

      <PanelGroup direction="horizontal">

        <Panel>
          <PanelGroup direction="vertical">

            <Panel id="content_editor">
              <Editor 
                  defaultValue={""}
                  onChange={handleContentEditorChange}
                  theme="vs-dark"
                />
            </Panel>

            <PanelResizeHandle className="h-2 bg-zinc-800" />

            <Panel id="event_editor">
              <Editor
                beforeMount={handleEditorPreMount}
                defaultLanguage="json"
                value={JSON.stringify(editorEvent, null, 2)}
                onChange={handleEventEditorChange}
                theme="vs-dark"
              />
            </Panel>

          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="w-2 bg-zinc-800" />

        <Panel className="h-auto bg-monaco_dark" id="eventViewer_viewer" style={{overflowY: "auto"}}>
            <NostrEvents filter={ feedFilter } currentEventId={result?.id} />
        </Panel>

      </PanelGroup>

    </>   
  );
}

export default EventEditor;

