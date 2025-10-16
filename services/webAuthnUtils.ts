
// Helper functions for WebAuthn

/**
 * Decodes array buffer to base64.
 * @param buffer - The buffer to decode.
 * @returns The base64 string.
 */
export function bufferDecode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return window.btoa(String.fromCharCode(...bytes));
}

/**
 * Encodes a base64 string to an array buffer.
 * @param base64 - The base64 string to encode.
 * @returns The array buffer.
 */
export function bufferEncode(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Converts a public key credential to a JSON-serializable object.
 * @param pubKey - The public key credential.
 * @returns A JSON-serializable object.
 */
export function publicKeyCredentialToJSON(pubKey: PublicKeyCredential): any {
    if (pubKey instanceof Array) {
        return pubKey.map(publicKeyCredentialToJSON);
    }

    if (pubKey instanceof ArrayBuffer) {
        return bufferDecode(pubKey);
    }

    if (pubKey instanceof Object) {
        const obj: { [key: string]: any } = {};
        for (const key in pubKey) {
            obj[key] = publicKeyCredentialToJSON((pubKey as any)[key]);
        }
        return obj;
    }

    return pubKey;
}

// In a real app, these would interact with a server
// For this demo, we'll simulate it.

/**
 * Simulates registering a new passkey.
 */
export async function createCredential(): Promise<PublicKeyCredential | null> {
    try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: 'KredoBank' },
                user: {
                    id: new Uint8Array(16),
                    name: 'jane.doe@example.com',
                    displayName: 'Jane Doe',
                },
                pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    userVerification: 'required',
                },
                timeout: 60000,
                attestation: 'direct',
            },
        });
        console.log('Credential created:', publicKeyCredentialToJSON(credential as PublicKeyCredential));
        return credential as PublicKeyCredential;
    } catch (error) {
        console.error('Error creating credential:', error);
        return null;
    }
}

/**
 * Simulates authenticating with an existing passkey.
 */
export async function getCredential(): Promise<PublicKeyCredential | null> {
    try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.get({
            publicKey: {
                challenge,
                timeout: 60000,
                userVerification: 'required',
            },
        });
        console.log('Credential retrieved:', publicKeyCredentialToJSON(credential as PublicKeyCredential));
        return credential as PublicKeyCredential;
    } catch (error) {
        console.error('Error getting credential:', error);
        return null;
    }
}