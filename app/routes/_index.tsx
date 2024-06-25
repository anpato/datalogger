import { useFetcher } from '@remix-run/react';
import { action } from './get-file';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button, FileInput } from 'flowbite-react';
import { LocalStorageHelpers } from '../utils/localstorage-helpers';
import Chart from '../components/chart';
import Heading from '../components/heading';
import Nav from '../components/nav';
import DefaultBanner from '../components/default-banner';
import DataMenu from '../components/data-menu';

// const strokeSettings = {
//   min: 1,
//   max: 4
// };

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const [chartData, addData] = useState<{ [key: string]: number | string }[]>(
    []
  );
  const [selectedColors, setColor] = useState<{
    [key: string]: string;
  }>({});
  const [strokeSize] = useState<number>(2);
  const [currFile, setFile] = useState<string>('');
  const [isDisabled, toggleDisabled] = useState(true);
  const [availableKeys, setKeys] = useState<string[]>([]);
  const [selectedKeys, setSelected] = useState<string[]>([]);
  const [recentFiles, setRecents] = useState<string[]>(
    LocalStorageHelpers.getValue('files', '[]') ?? []
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecents(JSON.parse(localStorage.getItem('files') ?? '[]') ?? []);
    }
  }, [globalThis.window]);

  useEffect(() => {
    formRef.current?.reset();
    if (fetcher.data) {
      const fetchedData = fetcher.data as {
        fileName: string;
        headers: string[];
        records: { [key: string]: number | string }[];
      };
      toggleDisabled(true);
      setFile(fetchedData.fileName);
      setKeys(
        fetchedData.headers.filter((key) => !key.toLowerCase().includes('time'))
      );

      addData(fetchedData.records);

      if (
        !LocalStorageHelpers.getValue<string[]>(
          fetchedData.fileName,
          '[]'
        ).includes(fetchedData.fileName)
      ) {
        const currFiles = LocalStorageHelpers.getValue<string[]>('files');

        LocalStorageHelpers.setAll<{
          fileName: string;
          headers: string[];
          records: { [key: string]: number | string }[];
        }>({
          files: [...currFiles, fetchedData.fileName],
          [fetchedData.fileName]: {
            fileName: fetchedData.fileName,
            headers: fetchedData.headers.filter(
              (key) => !key.toLowerCase().includes('time')
            ),
            records: fetchedData.records
          }
        });

        if (!recentFiles.includes(fetchedData.fileName)) {
          setRecents((prev) => [...prev, fetchedData.fileName]);
        }
      }
    }
  }, [fetcher.data]);

  const handleDefaultPrefs = (fileName?: string) => {
    setColor(
      LocalStorageHelpers.getValue(`${fileName ?? currFile}-colors`, '{}')
    );

    setSelected(
      LocalStorageHelpers.getValue(`${fileName ?? currFile}-toggled`, '[]')
    );
  };

  const detectChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      toggleDisabled(false);
    }
  }, []);

  const handleSelectRecent = (fileName: string) => {
    const fileData =
      LocalStorageHelpers.getValue<{
        headers: string[];
        records: { [key: string]: string | number }[];
      }>(fileName, '{}') ?? null;

    if (Object.keys(fileData).length) {
      setKeys(fileData.headers);
      addData(fileData.records);

      setFile(fileName);
    }
  };

  useEffect(() => {
    handleDefaultPrefs();
  }, [currFile]);

  const handleSwitchToggle = (isToggled: boolean, key: string) => {
    if (!selectedKeys.includes(key) && isToggled) {
      setSelected((prev) => {
        const newVals = [...prev, key];
        LocalStorageHelpers.setValues(`${currFile}-toggled`, newVals);
        return newVals;
      });
    } else {
      setSelected((prev) => {
        const newVals = prev.filter((p) => p !== key);
        LocalStorageHelpers.setValues(`${currFile}-toggled`, newVals);
        return newVals;
      });
    }
  };

  const handleColorChange = (color: string, key: string) => {
    setColor((prev) => {
      const newVals = {
        ...prev,
        [key.toString()]: color
      };

      LocalStorageHelpers.setValues(`${currFile}-colors`, newVals);
      return newVals;
    });
  };

  const removeAllFiles = () => {
    LocalStorageHelpers.clearAll();
    setRecents([]);
    setSelected([]);
    setKeys([]);
    setColor({});
    setFile('');
  };

  // const changeStrokeSize = (direction: 'up' | 'down') => {
  //   switch (direction) {
  //     case 'up':
  //       setStrokeSize((curr) => {
  //         if (curr < strokeSettings.max) {
  //           return (curr += 1);
  //         }
  //         return curr;
  //       });
  //       break;
  //     case 'down': {
  //       setStrokeSize((curr) => {
  //         if (curr > strokeSettings.min) {
  //           return (curr -= 1);
  //         }
  //         return curr;
  //       });
  //     }
  //   }
  // };

  return (
    <div className="h-full">
      <Nav
        isDisabled={isDisabled}
        handleSelectRecent={handleSelectRecent}
        recentFiles={recentFiles}
        removeFiles={removeAllFiles}
        currentFile={currFile}
      >
        <fetcher.Form
          ref={formRef}
          className="flex flex-row justify-center items-center gap-2"
          action="/get-file"
          method="POST"
          encType="multipart/form-data"
        >
          <FileInput
            accept=".csv, text/csv"
            disabled={fetcher.state !== 'idle'}
            name="telemetry"
            onChange={detectChange}
          />
          <Button
            isProcessing={fetcher.state !== 'idle'}
            disabled={isDisabled}
            size="sm"
            color="dark"
            type="submit"
            className="p-2 flex justify-between gap-2"
          >
            Upload
          </Button>
        </fetcher.Form>
      </Nav>
      <div className="w-full my-6">
        {currFile && <Heading currFile={currFile} />}

        {availableKeys.length ? (
          <>
            <div className="flex flex-row justify-center gap-2 px-4 mt-4">
              <div>
                <DataMenu
                  availableKeys={availableKeys}
                  selectedColors={selectedColors}
                  selectedKeys={selectedKeys}
                  handleColorChange={handleColorChange}
                  handleSwitchToggle={handleSwitchToggle}
                />
                <p className="prose text-center">
                  <span className="underline">{selectedKeys.length}</span> data
                  points selected
                </p>
              </div>
            </div>

            <Chart
              chartData={chartData}
              strokeSize={strokeSize}
              selectedKeys={selectedKeys}
              selectedColors={selectedColors}
            />
          </>
        ) : (
          <DefaultBanner />
        )}
      </div>
    </div>
  );
}
