import glob from 'glob';

export default function (filePattarn: string): string[] {
  const files = glob.sync(filePattarn);
  return files;
}
