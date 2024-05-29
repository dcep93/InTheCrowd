import { useEffect, useState } from "react";

export default function CachedImage(props: {
  src: string;
  f: (data: string) => JSX.Element;
}): JSX.Element | null {
  const CACHE_NAME = "CachedImage";
  const [data, updateData] = useState<string | undefined>(undefined);
  useEffect(() => {
    caches.open(CACHE_NAME).then((cache) =>
      cache
        .match(props.src)
        .then((cachedResponse) =>
          cachedResponse
            ? cachedResponse
            : fetch(props.src).then((networkResponse) => {
                cache.put(props.src, networkResponse.clone());
                return networkResponse;
              })
        )
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then(updateData)
    );
  }, [props.src]);
  if (data === undefined) return null;
  return props.f(data);
}
