import fs from "fs";
import path from "path";

function moveFiles(oldPath, newPath, callback) {
  if (!oldPath) return;
  if (!newPath) return;

  fs.rename(oldPath, newPath, function (err) {
    if (err) {
      console.error(`Cannot move file ${oldPath}`);
      console.error(err);
      return;
    }
    callback("Successfully renamed - AKA moved! " + newPath);
  });
}
// moveFiles()

function fromDir(startPath, filter, callback) {
  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      //   fromDir(filename, filter, callback); //recurse
    } else if (filter.test(filename)) callback(filename);
  }
}

const fileExtensions = [
  [/\.vcf$/, "contacts"],
  [/\.excalidraw$/, "excalidraw"],
  [/\.db$/, "databases"],
  [/\.pdf$/, "PDF"],
  [/\.exe$/, "exe"],
  [/\.msi$/, "exe"],
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
  [/\.iso$/i, "archives"],
  [/\.torrent$/i, "torrents"],
];

fileExtensions.forEach(([extension, folder]) => {
  fromDir("./", extension, function (filename) {
    // console.log("-- found: ", filename);
    try {
      fs.mkdirSync(new URL(`./${folder}`, import.meta.url));
    } catch (err) {}

    const oldPath = `./${filename}`;
    const newPath = `./${folder}/${filename}`;
    moveFiles(oldPath, newPath, (res) => {
      console.log(res);
    });
  });
});
