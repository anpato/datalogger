import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler
} from '@remix-run/node';
import csv from 'csvtojson';

export const allowedMimeTypes = {
  csv: 'text/csv'
};

export const uploadHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    maxPartSize: 5_000_000,
    file: ({ filename }) => `contact-uploads/${filename}`,
    filter: ({ contentType }) =>
      Object.values(allowedMimeTypes).includes(contentType)
  })
);

export async function parseCSVFromFile(filePath: string): Promise<{
  headers: string[];
  records: { [key: string]: number | string }[];
}> {
  const jsonData = await csv().fromFile(filePath);
  if (jsonData.length) {
    const headers = Object.keys(jsonData[0]);
    return {
      headers,
      records: jsonData.map((d) => {
        headers.forEach(
          (k) => (d[k] = d[k].includes('.') ? parseFloat(d[k]) : parseInt(d[k]))
        );
        return d;
      })
    };
  }
  return {
    headers: [] as string[],
    records: []
  };
}
