// Learn how to customize the theme: https://rspress.rs/guide/basic/custom-theme
import './index.css';

import {
  type LayoutProps,
  Layout as ThemeLayout,
} from '@rspress/core/theme-original';
import { ProductMenu } from './ProductMenu';

export * from '@rspress/core/theme-original';

// Adds the product menu after the logo.
export function Layout(props: LayoutProps) {
  return (
    <ThemeLayout
      {...props}
      afterNavTitle={
        <>
          {props.afterNavTitle}
          <ProductMenu />
        </>
      }
    />
  );
}
