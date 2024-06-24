import { Sidebar, Label, Tooltip, Popover, ToggleSwitch } from 'flowbite-react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '../utils/cn';
import { FC } from 'react';

type IProps = {
  availableKeys: string[];
  handleColorChange: (color: string, key: string) => void;
  selectedColors: { [key: string]: string };
  selectedKeys: string[];
  handleSwitchToggle: (isToggled: boolean, key: string) => void;
};

const DataToggle: FC<IProps> = ({
  availableKeys,
  handleColorChange,
  selectedColors,
  selectedKeys,
  handleSwitchToggle
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-1">
        <Sidebar className="px-2 w-full max-h-[200px] lg:max-h-[300px]">
          <Sidebar.Items className="max-h-[200px] lg:max-h-[300px]">
            <Sidebar.ItemGroup>
              {availableKeys.map((key) => (
                <Sidebar.Item key={key} className="flex flex-row w-full">
                  <div className="flex gap-2 justify-between">
                    <Label className={`mx-2 flex gap-2`}>
                      <span>
                        {' '}
                        <Tooltip content="Click to pick a color">
                          <Popover
                            content={
                              <HexColorPicker
                                color={selectedColors[key] ?? '#3182bd'}
                                onChange={(color) =>
                                  handleColorChange(color, key)
                                }
                              />
                            }
                          >
                            <div
                              style={{
                                pointerEvents: !selectedKeys.includes(key)
                                  ? 'none'
                                  : 'auto',
                                opacity: selectedKeys.includes(key)
                                  ? '1.0'
                                  : '0.2',
                                backgroundColor:
                                  selectedColors[key] ?? '#3182bd'
                              }}
                              className={cn(
                                'cursor-pointer h-6 w-6 rounded-full'
                              )}
                            ></div>
                          </Popover>
                        </Tooltip>
                      </span>
                      <Tooltip content={key} placement="right">
                        {key.length > 25 ? key.substring(0, 20) + '...' : key}
                      </Tooltip>
                    </Label>

                    <ToggleSwitch
                      color="success"
                      className="cursor-pointer"
                      checked={selectedKeys.includes(key)}
                      onChange={(isToggled) =>
                        handleSwitchToggle(isToggled, key)
                      }
                    />
                  </div>
                </Sidebar.Item>
              ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
        <p className="font-light">
          <code className="underline">{availableKeys.length}</code> data points
          availabe
        </p>
      </div>
    </div>
  );
};
export default DataToggle;
