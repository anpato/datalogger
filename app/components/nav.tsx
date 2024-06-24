import {
  Navbar,
  Dropdown,
  DropdownItem,
  DarkThemeToggle
} from 'flowbite-react';
import { FC, ReactNode } from 'react';
import icon from '~/assets/icon.svg';

type IProps = {
  recentFiles: string[];
  handleSelectRecent: (file: string) => void;
  isDisabled: boolean;
  children: ReactNode;
};

const Nav: FC<IProps> = ({
  recentFiles,
  handleSelectRecent,

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
        <div className="flex flex-col-reverse lg:flex-row gap-2 items-center">
          <Dropdown inline label="Recent files">
            {recentFiles?.map((file) => (
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
          {children}
        </div>
        {/* <DarkThemeToggle /> */}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
