import { rename, existsSync, readdirSync, lstatSync, mkdirSync } from "node:fs";
import { join } from "node:path";

function moveFiles(
  oldPath: string,
  newPath: string,
  callback: (value: string) => void
) {
  if (!oldPath) return;
  if (!newPath) return;

  rename(oldPath, newPath, function (err) {
    if (err) {
      console.error(`Cannot move file ${oldPath}`);
      console.error(err);
      return;
    }
    callback("Successfully renamed - AKA moved! " + newPath);
  });
}
// moveFiles()

function fromDir(
  startPath: string,
  filter: RegExp,
  callback: (filename: string) => void
) {
  //console.log('Starting from dir '+startPath+'/');

  if (!existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  const files = readdirSync(startPath);
  files.forEach((file) => {
    const filename = join(startPath, file);
    const stat = lstatSync(filename);
    if (stat.isDirectory()) {
      //   fromDir(filename, filter, callback); //recurse
      return;
    }
    if (filter.test(filename)) callback(filename);
  });
}

const fileExtensions = [
  [/\.vcf$/, "contacts"],
  [/\.excalidraw$/, "excalidraw"],
  [/\.db$/, "databases"],
  [/\.pdf$/, "PDF"],
  [/(?<!\.sorter)\.exe$/, "exe"],
  [/\.msi$/, "exe"],
  [/\.msixbundle$/, "exe"],
  [/\.json$/, "json"],
  [/\.doc$/, "Documents"],
  [/\.docx$/, "Documents"],
  [/\.xls$/, "Documents"],
  [/\.xlsx$/, "Documents"],
  [/\.ppt$/, "Documents"],
  [/\.pptx$/, "Documents"],
  [/\.pptm$/, "Documents"],
  [/\.ods$/, "Documents"],
  [/\.csv$/, "CSV"],
  [/\.txt$/, "texts"],
  [/\.apk$/, "apps"],
  [/\.jpg$/i, "images"],
  [/\.tiff$/i, "images"],
  [/\.jfif$/i, "images"],
  [/\.avif$/i, "images"],
  [/\.heic$/i, "images"],
  [/\.jpeg$/i, "images"],
  [/\.webp$/i, "images"],
  [/\.png$/i, "images"],
  [/\.gif$/i, "images"],
  [/\.svg$/i, "images"],
  [/\.mp3$/i, "music"],
  [/\.wav$/i, "music"],
  [/\.m4a$/i, "music"],
  [/\.webm$/i, "videos"],
  [/\.mov$/i, "videos"],
  [/\.avi$/i, "videos"],
  [/\.mp4$/i, "videos"],
  [/\.3gp$/i, "videos"],
  [/\.mkv$/i, "videos"],
  [/\.rar$/i, "archives"],
  [/\.zst$/i, "archives"],
  [/\.zip$/i, "archives"],
  [/\.7z$/i, "archives"],
  [/\.tar\.xz$/i, "archives"],
  [/\.tar\.zst$/i, "archives"],
  [/\.iso$/i, "archives"],
  [/\.torrent$/i, "torrents"],
  [/\.nsp$/i, "nsp"],
];

fileExtensions.forEach(([extension, folder]) => {
  fromDir("./", extension as RegExp, async (filename) => {
    // console.log("-- found: ", filename);
    try {
      mkdirSync(new URL(`./${folder}`, import.meta.url));
    } catch (err) {
      console.error(err);
    }

    const oldPath = `./${filename}`;
    const newPath = `./${folder}/${filename}`;
    moveFiles(oldPath, newPath, (res) => {
      console.log(res);
    });
  });
});

