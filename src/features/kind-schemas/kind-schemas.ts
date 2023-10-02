
export const Kind0 = {
    uri: "http://flow/kind-0.json",
    fileMatch: ["*"],
    schema: {
        type: "object",
        additionalProperties:false,
        properties: {
            content: { "type": "string" },
            created_at: { "type": "number" },
            kind: { "type": "number" },
            pubkey: { "type": "string" },
            tags: { "type": "array" },   
        }
    }
};