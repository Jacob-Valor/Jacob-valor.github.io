// Learn how to customize the theme: https://rspress.rs/guide/basic/custom-theme
import './index.css';

import {
  type LayoutProps,
  Layout as ThemeLayout,
} from '@rspress/core/theme-original';
import { AboutMenu } from './AboutMenu';
import { ProductMenu } from './ProductMenu';
import { SearchEnhancer } from './SearchEnhancer';

export * from '@rspress/core/theme-original';
// Replaces Rspress's one-line home footer.
export { HomeFooter } from './HomeFooter';

// Adds the product menu after the logo.
export function Layout(props: LayoutProps) {
  return (
    <ThemeLayout
      {...props}
      afterNavTitle={
        <>
          {props.afterNavTitle}
          <ProductMenu />
          <SearchEnhancer />
          <AboutMenu />
        </>
      }
    />
  );
}
