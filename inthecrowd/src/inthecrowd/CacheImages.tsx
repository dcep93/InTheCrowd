var initialized = false;

export default function CacheImages(): void {
  if (initialized) return;
  initialized = true;
  alert("caching");
}
