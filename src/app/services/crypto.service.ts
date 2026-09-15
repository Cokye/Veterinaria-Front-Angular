import { Injectable } from '@angular/core';

export interface SesionCifrado {
  claveAes: CryptoKey;
  claveAesEnvueltaBase64: string;
  ivPeticion: Uint8Array;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://localhost:8080/api/crypto/public-key';
  private clavePublicaRsaPromise: Promise<CryptoKey> | null = null;

  async obtenerClavePublica(): Promise<CryptoKey> {
  if (!this.clavePublicaRsaPromise) {
    this.clavePublicaRsaPromise = (async () => {
      try {
        const respuesta = await window.fetch(this.apiUrl, {
          method: 'GET',
          credentials: 'include'
        });

        if (!respuesta.ok) {
          throw new Error(`Error HTTP al obtener clave pública: ${respuesta.status}`);
        }

        const textoRespuesta = await respuesta.text();

        let claveBase64 = '';
        try {
          const data = JSON.parse(textoRespuesta);
          claveBase64 =
            data.clavePublica ||
            data.clavePublicaBase64 ||
            data.publicKey ||
            (typeof data === 'string' ? data : '');
        } catch {
          claveBase64 = textoRespuesta.trim();
        }

        if (!claveBase64) {
          throw new Error('No se pudo extraer la clave pública.');
        }

        const binaryDer = this.base64ToArrayBuffer(claveBase64);

        return await window.crypto.subtle.importKey(
          'spki',
          binaryDer,
          { name: 'RSA-OAEP', hash: 'SHA-256' },
          false,
          ['wrapKey', 'encrypt']
        );
      } catch (error) {
        this.clavePublicaRsaPromise = null;
        throw error;
      }
    })();
  }
  return this.clavePublicaRsaPromise;
}

  async prepararSesion(): Promise<SesionCifrado> {
    const rsaKey = await this.obtenerClavePublica();

    const claveAes = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const claveEnvueltaBuffer = await window.crypto.subtle.wrapKey(
      'raw',
      claveAes,
      rsaKey,
      { name: 'RSA-OAEP' }
    );

    const ivPeticion = window.crypto.getRandomValues(new Uint8Array(12));

    return {
      claveAes,
      claveAesEnvueltaBase64: this.arrayBufferToBase64(claveEnvueltaBuffer),
      ivPeticion
    };
  }

  async cifrarPayload(claveAes: CryptoKey, iv: Uint8Array, texto: string): Promise<string> {
    const encoder = new TextEncoder();
    const datos = encoder.encode(texto);

    const bufferCifrado = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as BufferSource, tagLength: 128 },
      claveAes,
      datos as BufferSource
    );

    return this.arrayBufferToBase64(bufferCifrado);
  }

  async descifrarPayload(claveAes: CryptoKey, ivBase64: string, cuerpoCifradoBase64: string): Promise<any> {
    const ivBuffer = this.base64ToArrayBuffer(ivBase64);
    const datosCifradosBuffer = this.base64ToArrayBuffer(cuerpoCifradoBase64);

    const bufferDescifrado = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(ivBuffer) as BufferSource, tagLength: 128 },
      claveAes,
      datosCifradosBuffer as BufferSource
    );

    const decoder = new TextDecoder('utf-8');
    const textoPlano = decoder.decode(bufferDescifrado);

    try {
      return JSON.parse(textoPlano);
    } catch {
      return textoPlano;
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    if (!base64) {
      throw new Error('base64ToArrayBuffer recibió un valor nulo o indefinido');
    }
    const binaryString = window.atob(base64.trim());
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}