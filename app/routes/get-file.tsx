import {
  ActionFunctionArgs,
  json,
  unstable_parseMultipartFormData
} from '@remix-run/node';
import { parseCSVFromFile, uploadHandler } from '../utils/upload-handler';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const file = formData.get('telemetry') as File & { filepath: string };

  const data = await parseCSVFromFile(file.filepath);

  return json({ ...data, fileName: file.name });
};
