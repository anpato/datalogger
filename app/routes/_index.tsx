import type { MetaFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { action } from './get-file';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip as ChartTip
} from 'recharts';
import {
  Button,
  Tooltip,
  Dropdown,
  DropdownItem,
  FileInput,
  Label,
  Navbar,
  Popover,
  Sidebar,
  Banner,
  ToggleSwitch
} from 'flowbite-react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '../utils/cn';
import icon from '../assets/icon.svg';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ];
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const [chartData, addData] = useState<{ [key: string]: number | string }[]>(
    []
  );
  const [selectedColors, setColor] = useState<{
    [key: string]: string;
  }>({});
  const [currFile, setFile] = useState<string>('');
  const [isDisabled, toggleDisabled] = useState(true);
  const [availableKeys, setKeys] = useState<string[]>([]);
  const [selectedKeys, setSelected] = useState<string[]>([]);
  const [recentFiles, setRecents] = useState<string[]>(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('files') ?? '[]') ?? []
      : []
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
        typeof window !== 'undefined' &&
        !JSON.stringify(localStorage.getItem('files'))?.includes(
          fetchedData.fileName
        ) &&
        !localStorage.getItem(fetchedData.fileName)
      ) {
        const currFiles =
          JSON.parse(localStorage.getItem('files') ?? '[]') ?? [];

        localStorage.setItem(
          'files',
          JSON.stringify([...currFiles, fetchedData.fileName])
        );
        localStorage.setItem(
          fetchedData.fileName,
          JSON.stringify({
            fileName: fetchedData.fileName,
            headers: fetchedData.headers.filter(
              (key) => !key.toLowerCase().includes('time')
            ),
            records: fetchedData.records
          })
        );
        if (!recentFiles.includes(fetchedData.fileName)) {
          setRecents((prev) => [...prev, fetchedData.fileName]);
        }
      }
    }
  }, [fetcher.data]);

  const detectChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      toggleDisabled(false);
    }
  }, []);

  const handleSelectRecent = (fileName: string) => {
    const fileData =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem(fileName) ?? '')
        : null;
    if (fileData) {
      setKeys(fileData.headers);
      addData(fileData.records);
      setFile(fileName);
      setSelected(selectedKeys);
    }
  };

  return (
    <div className="h-full">
      <Navbar fluid border>
        <Navbar.Brand className="flex gap-2">
          <img src={icon} className="w-10" alt="logo" />
          <h3 className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Datalogger
          </h3>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <div className="flex flex-col-reverse lg:flex-row gap-2 items-center">
            <Dropdown inline label="Recent files">
              {recentFiles.map((file) => (
                <Dropdown.Item
                  onClick={() => handleSelectRecent(file)}
                  key={file}
                >
                  {file}
                </Dropdown.Item>
              ))}
              {!recentFiles.length && (
                <DropdownItem className="cursor-default" disabled>
                  No recent files
                </DropdownItem>
              )}
            </Dropdown>
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
          </div>
        </Navbar.Collapse>
      </Navbar>
      <div className="w-full my-6">
        {currFile && (
          <h3 className="whitespace-nowrap text-wrap text-center text-xl font-semibold dark:text-white mb-2">
            {currFile}
          </h3>
        )}

        <h3
          className={cn(
            !selectedKeys.length && currFile ? 'invisible' : 'visible',
            'whitespace-nowrap text-center text-xl font-light dark:text-white mb-2'
          )}
        >
          Select data points from the menu.
        </h3>

        {availableKeys.length ? (
          <div className="flex lg:flex-row flex-col-reverse gap-2 w-full">
            <div className="w-full lg:pl-6">
              <ResponsiveContainer
                className="h-full py-2"
                width={'100%'}
                height={900}
              >
                <LineChart data={chartData}>
                  {!selectedKeys.length ? (
                    <h3>Select options from the right</h3>
                  ) : null}
                  <ChartTip />
                  {selectedKeys.map((key) => {
                    const color =
                      selectedColors && selectedColors[key]
                        ? { stroke: selectedColors[key] }
                        : {};
                    return (
                      <Line
                        strokeWidth={2}
                        type="monotone"
                        dataKey={key}
                        key={key}
                        dot={false}
                        {...color}
                      />
                    );
                  })}
                  <YAxis
                    type="number"
                    tick={false}
                    scale="auto"
                    domain={['auto', 'auto']}
                  />
                  <XAxis tick={false} label={''} dataKey={'Time (msec)'} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Sidebar className="px-4 w-full flex-1">
              <Sidebar.Items className="max-h-[300px] lg:max-h-[800px]">
                <Sidebar.ItemGroup>
                  {availableKeys.map((key) => (
                    <Sidebar.Item
                      key={key}
                      className="flex flex-row justify-center items-start"
                    >
                      <div className="flex gap-2 items-center">
                        <ToggleSwitch
                          color="success"
                          className="cursor-pointer"
                          checked={selectedKeys.includes(key)}
                          onChange={(isToggled) => {
                            if (!selectedKeys.includes(key) && isToggled) {
                              setSelected((prev) => [...prev, key]);
                            } else {
                              setSelected((prev) =>
                                prev.filter((p) => p !== key)
                              );
                            }
                          }}
                        />
                        <Label className={`mx-2 flex items-center gap-2`}>
                          {key.length > 25 ? key.substring(0, 20) + '...' : key}

                          <span>
                            {' '}
                            <Tooltip
                              content="Click to pick a color"
                              className={cn(
                                !selectedKeys.includes(key)
                                  ? 'hidden'
                                  : 'visible'
                              )}
                            >
                              <Popover
                                content={
                                  <HexColorPicker
                                    color={selectedColors[key] ?? '#3182bd'}
                                    onChange={(color) =>
                                      setColor((prev) => ({
                                        ...prev,
                                        [key.toString()]: color
                                      }))
                                    }
                                  />
                                }
                              >
                                <div
                                  style={
                                    selectedColors && selectedColors[key]
                                      ? {
                                          backgroundColor: selectedColors[key],
                                          opacity: selectedKeys.includes(key)
                                            ? '1.0'
                                            : '0.2'
                                        }
                                      : {
                                          backgroundColor: '#3182bd',
                                          opacity: !selectedKeys.includes(key)
                                            ? '0.2'
                                            : '1.0'
                                        }
                                  }
                                  className={cn(
                                    'cursor-pointer h-6 w-6 rounded-full',
                                    !selectedKeys.includes(key)
                                      ? 'pointer-events-none'
                                      : 'pointer-events-auto'
                                  )}
                                ></div>
                              </Popover>
                            </Tooltip>
                          </span>
                        </Label>
                      </div>
                      <div></div>
                    </Sidebar.Item>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>
        ) : (
          <Banner className="">
            <div className="w-[80%] mx-auto border rounded-md border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
              <h3 className="text-center">Upload a file to get started</h3>

              <p className="font-bold text-center my-2">OR</p>
              <p className="text-center">Choose one of your recent files</p>
            </div>
          </Banner>
        )}
      </div>
    </div>
  );
}
