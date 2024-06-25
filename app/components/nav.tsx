import { Navbar, Dropdown, DropdownItem } from 'flowbite-react';
import { FC, ReactNode } from 'react';
import icon from '~/assets/icon.svg';
import { cn } from '../utils/cn';
import { Trash } from 'lucide-react';

type IProps = {
  recentFiles: string[];
  handleSelectRecent: (file: string) => void;
  isDisabled: boolean;
  children: ReactNode;
  currentFile: string;
  removeFiles: () => void;
};

const Nav: FC<IProps> = ({
  recentFiles,
  handleSelectRecent,
  currentFile,
  removeFiles,

  children
}) => {
  return (
    <Navbar fluid border>
      <Navbar.Brand className="flex gap-2">
        <img src={icon} className="w-10" alt="logo" />
        <h3 className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Datalogger
        </h3>
      </Navbar.Brand>
      <Navbar.Toggle />

      <Navbar.Collapse>
        <div className="flex flex-col-reverse md:flex-row gap-4 items-center">
          <Dropdown label="Recent files" className="dark:text-white">
            {recentFiles?.map((file) => (
              <Dropdown.Item
                style={
                  currentFile === file
                    ? {
                        pointerEvents: 'none',
                        cursor: 'default',
                        opacity: 0.5
                      }
                    : {}
                }
                className={cn(currentFile === file && ['pointer-events-none'])}
                onClick={() => handleSelectRecent(file)}
                key={file}
              >
                {file}
              </Dropdown.Item>
            ))}
            {recentFiles.length ? (
              <>
                <Dropdown.Divider />

                <Dropdown.Item onClick={removeFiles}>
                  <Trash className="mr-2 text-red-500" /> Remove all files
                </Dropdown.Item>
              </>
            ) : null}
            {!recentFiles.length && (
              <DropdownItem className="cursor-default" disabled>
                No recent files
              </DropdownItem>
            )}
          </Dropdown>
          {children}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
