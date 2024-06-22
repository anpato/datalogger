import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react';
import styles from './tailwind.css?url';
import { LinksFunction, MetaFunction } from '@remix-run/node';
import { Flowbite, ThemeModeScript } from 'flowbite-react';

export const meta: MetaFunction = () => [
  {
    title: 'Datalogger'
  }
];

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />
        <ThemeModeScript suppressHydrationWarning />
      </head>

      <body suppressHydrationWarning>
        <Flowbite>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </Flowbite>
      </body>
    </html>
  );
}
