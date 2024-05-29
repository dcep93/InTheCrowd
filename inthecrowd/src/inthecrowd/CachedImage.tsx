import { useEffect, useState } from "react";

export default function CachedImage(props: {
  src: string;
  f: (data: string) => JSX.Element;
}): JSX.Element | null {
  const CACHE_NAME = "CachedImage";
  const [data, updateData] = useState<string | undefined>(undefined);
  useEffect(() => {
    console.log("effect", props.src);
    caches.open(CACHE_NAME).then((cache) =>
      cache
        .match(props.src)
        .then((cachedResponse) =>
          cachedResponse
            ? cachedResponse
            : fetch("https://proxy420.appspot.com", {
                method: "POST",
                body: JSON.stringify({
                  maxAgeMs: 30 * 24 * 60 * 60 * 1000,
                  url: props.src,
                  options: { base64: true },
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((networkResponse) => {
                cache.put(props.src, networkResponse);
                return networkResponse;
              })
        )
        .then((response) => response.clone())
        .then((response) => response.text())
        .then((data) => `data:image/jpeg;base64,${data}`)
        .then(updateData)
    );
  }, [props.src]);
  if (data === undefined) return null;
  return props.f(data);
}
