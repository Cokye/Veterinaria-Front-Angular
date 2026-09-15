import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, switchMap, catchError } from 'rxjs';
import { CryptoService, SesionCifrado } from '../services/crypto.service';

export const cifradoInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const cryptoService = inject(CryptoService);

  // Excluir la petición de clave pública
  if (req.url.includes('/api/crypto/public-key')) {
    return next(req.clone({ withCredentials: true }));
  }

  return from(cryptoService.prepararSesion()).pipe(
    switchMap((sesion: SesionCifrado) => {
      return from(prepararPeticionCifrada(req, sesion, cryptoService)).pipe(
        switchMap((cifradaReq) => next(cifradaReq)),
        switchMap((event) => from(procesarRespuesta(event, sesion, cryptoService))),
        catchError((err: unknown) => from(procesarError(err, sesion, cryptoService)))
      );
    })
  );
};

async function prepararPeticionCifrada(
  req: HttpRequest<unknown>,
  sesion: SesionCifrado,
  cryptoService: CryptoService
): Promise<HttpRequest<unknown>> {
  let headers = req.headers.set('X-Enc-Key', sesion.claveAesEnvueltaBase64);
  let cuerpo: any = req.body;

  if (req.body !== null && req.body !== undefined) {
    const ivBase64 = btoa(String.fromCharCode(...sesion.ivPeticion));
    headers = headers
      .set('X-Enc-Iv', ivBase64)
      .set('Content-Type', 'application/octet-stream');

    const textoPlano = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    cuerpo = await cryptoService.cifrarPayload(sesion.claveAes, sesion.ivPeticion, textoPlano);
  }

  return req.clone({
    headers,
    body: cuerpo,
    responseType: 'text',
    withCredentials: true
  });
}

async function procesarRespuesta(
  event: HttpEvent<unknown>,
  sesion: SesionCifrado,
  cryptoService: CryptoService
): Promise<HttpEvent<unknown>> {
  if (event instanceof HttpResponse) {
    const esCifrado = event.headers.get('X-Enc') === '1';
    const iv = event.headers.get('X-Enc-Iv');

    if (esCifrado && iv && typeof event.body === 'string') {
      const datosDescifrados = await cryptoService.descifrarPayload(sesion.claveAes, iv, event.body);
      return event.clone({ body: datosDescifrados });
    }
  }
  return event;
}

async function procesarError(
  err: unknown,
  sesion: SesionCifrado,
  cryptoService: CryptoService
): Promise<never> {
  if (err instanceof HttpErrorResponse) {
    const esCifrado = err.headers?.get('X-Enc') === '1';
    const iv = err.headers?.get('X-Enc-Iv');

    if (esCifrado && iv && typeof err.error === 'string') {
      try {
        const errorDescifrado = await cryptoService.descifrarPayload(sesion.claveAes, iv, err.error);
        throw new HttpErrorResponse({
          error: errorDescifrado,
          headers: err.headers,
          status: err.status,
          statusText: err.statusText,
          url: err.url ?? undefined
        });
      } catch {
        throw err;
      }
    }
  }
  throw err;
}