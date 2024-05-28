import { useState } from "react";

export default function CachedImage(props: { src: string }) {
  const [data, updateData] = useState<string | null>(null);
  caches.open("CachedImage").then((cache) =>
    Promise.resolve()
      .then(() => cache.match(props.src))
      .then((cachedResponse) =>
        cachedResponse
          ? cachedResponse
          : fetch(props.src)
              .then((response) => response.clone())
              .then((clone) => {
                cache.put(props.src, clone);
                return clone;
              })
      )
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then(updateData)
  );
  if (data === null) return null;
  return <img alt={"CachedImage__broken"} src={data} />;
}
