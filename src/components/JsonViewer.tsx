import NDK, { NDKKind, NDKEvent, NDKFilter, NostrEvent, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk"

import ReactJson from 'react-json-view';
import { json } from "stream/consumers";

interface JsonViewerProps {
  ndkEvent: NostrEvent | undefined;
  isSelected?: boolean;
}

export const JsonViewer = ({ ndkEvent, isSelected } : JsonViewerProps)  : JSX.Element => (
  <div className="h-fit bg-monaco_dark">
    <div>{isSelected && "------>"} {ndkEvent?.content}</div>
    <ReactJson 
      displayDataTypes={false}
      collapsed={true}
      enableClipboard={false}
      src={ndkEvent || {}}
      theme={"monokai"} 
    />
  </div>
)

export default JsonViewer;