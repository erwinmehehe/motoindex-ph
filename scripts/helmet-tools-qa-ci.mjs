import fs from "node:fs";

// Chrome can briefly retain files in its temporary profile after SIGTERM on
// GitHub runners. Ignore only that cleanup race so the actual route assertions
// in helmet-tools-qa.mjs still decide whether the QA passes or fails.
const rmSync = fs.rmSync.bind(fs);
fs.rmSync = (...args) => {
  try {
    return rmSync(...args);
  } catch (error) {
    if (error?.code === "ENOTEMPTY" && String(args[0] || "").includes("motoindex-helmet-tools-")) return;
    throw error;
  }
};

await import("./helmet-tools-qa.mjs");
