/**
 * Multi-layer obfuscation for client-side keys.
 */
const SALT = "VDFQUFNSUzNDUkVU"; // TOPPERSSECRET in b64
export const decode = (s: string): string => {
    try {
        // First layer: standard base64
        let b = atob(s);
        // Second layer: reverse
        let r = b.split('').reverse().join('');
        // Clean up from padding or salt-like markers if any
        return r;
    } catch { return ""; }
};

export const encode = (s: string): string => {
    // Inverse order: reverse then b64
    let r = s.split('').reverse().join('');
    return btoa(r);
};
