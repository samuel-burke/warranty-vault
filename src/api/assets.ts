export async function addAssetToBackend(asset: any) {
  const res = await fetch("http://localhost:5050/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asset),
  });
  if (!res.ok) throw new Error("Failed to add asset");
  return res.json();
}
