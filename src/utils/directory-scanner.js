import glob from "glob";

export default function (filePattarn) {
    // return all file path that match the pattern "examples/*.js" in the current directory
    // and all subdirectories
    // should return a list of file paths that match the pattern like: ["examples/admin.js", "examples/auth.js"] etc.
    const files = glob.sync(filePattarn);
    return files;
}