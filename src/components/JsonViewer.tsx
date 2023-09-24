
import ReactJson from 'react-json-view';

export const JsonViewer = ({ json: jsonObj } : { json: any})  : JSX.Element => (
  <div className="h-fit bg-monaco_dark">
    <ReactJson 
      displayDataTypes={false}
      collapsed={false}
      enableClipboard={false}
      src={jsonObj ? JSON.parse(jsonObj) : {}}
      theme={"monokai"} 
    />
  </div>
)

export default JsonViewer;