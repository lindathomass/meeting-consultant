import { fileOpen, fileSave } from "browser-fs-access";

export async function exportData() {
  // Get all keys from localStorage
  const localStorageData: { [key: string]: string | null } = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) {
      localStorageData[key] = localStorage.getItem(key);
    }
  }

  const data = {
    local: localStorageData,
  };

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  await fileSave(blob, { fileName: "chathub.json" });
}

export async function importData() {
  const blob = await fileOpen({ extensions: [".json"] });
  const json = JSON.parse(await blob.text());

  if (!json.local) {
    throw new Error("Invalid data");
  }

  if (
    !window.confirm(
      "Are you sure you want to import data? This will overwrite your current data"
    )
  ) {
    return;
  }

  localStorage.clear();

  for (const [k, v] of Object.entries(json.local)) {
    localStorage.setItem(k, String(v));
  }

  alert("Imported data successfully");
  location.reload();
}
