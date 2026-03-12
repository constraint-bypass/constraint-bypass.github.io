import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';
import styles from './styles.module.css';

function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: Props): React.JSX.Element {
  const {metadata, frontMatter} = useDoc();
  const syntheticTitle = useSyntheticTitle();
  const dateValue = frontMatter.date;
  const date =
    dateValue instanceof Date
      ? dateValue.toISOString().slice(0, 10)
      : typeof dateValue === 'string'
        ? dateValue
        : null;
  const isTaskDoc = metadata.permalink.startsWith('/results/');

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1" className="docTitleCustom">
            {syntheticTitle}
          </Heading>
          {isTaskDoc && date ? <p className={styles.taskDate}>Date: {date}</p> : null}
        </header>
      )}
      {!syntheticTitle && isTaskDoc && date ? (
        <p className={styles.taskDateNoTitle}>Date: {date}</p>
      ) : null}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
