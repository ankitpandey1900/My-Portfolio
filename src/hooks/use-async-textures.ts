'use client';

import * as React from 'react';
import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();
const inflightCache = new Map<string, Promise<THREE.Texture>>();

function loadTexture(url: string): Promise<THREE.Texture> {
  const cached = textureCache.get(url);
  if (cached) return Promise.resolve(cached);

  let inflight = inflightCache.get(url);
  if (!inflight) {
    inflight = new THREE.TextureLoader()
      .loadAsync(url)
      .then((texture) => {
        textureCache.set(url, texture);
        inflightCache.delete(url);
        return texture;
      })
      .catch((error) => {
        inflightCache.delete(url);
        throw error;
      });
    inflightCache.set(url, inflight);
  }

  return inflight;
}

export function preloadTextures(urls: string[]): void {
  urls.forEach((url) => {
    void loadTexture(url);
  });
}

export function useAsyncTextures(urls: string[]): THREE.Texture[] | null {
  const key = urls.join('\0');

  const [textures, setTextures] = React.useState<THREE.Texture[] | null>(() => {
    if (urls.length === 0) return [];
    const allCached = urls.every((url) => textureCache.has(url));
    if (!allCached) return null;
    return urls.map((url) => textureCache.get(url)!);
  });

  React.useEffect(() => {
    const currentUrls = key ? key.split('\0') : [];
    
    if (currentUrls.length === 0) {
      queueMicrotask(() => setTextures([]));
      return;
    }

    let cancelled = false;

    Promise.all(currentUrls.map(loadTexture))
      .then((loaded) => {
        if (!cancelled) setTextures(loaded);
      })
      .catch(() => {
        if (!cancelled) setTextures(null);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return textures;
}

