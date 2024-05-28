import { useState } from "react";

export default function CachedImage(props: {
  src: string;
  localCache?: boolean;
}) {
  const [data, updateData] = useState<string | null>(null);
  caches.open("CachedImage").then((cache) =>
    Promise.resolve()
      .then(() => cache.match(props.src))
      .then((cachedResponse) =>
        cachedResponse
          ? cachedResponse
          : fetch(props.src, { cache: "force-cache" })
              .then((response) => response.clone())
              .then((clone) => {
                if (props.localCache) cache.put(props.src, clone);
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
