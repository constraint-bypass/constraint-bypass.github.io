import React, {type ReactNode} from 'react';
import {BlogPostProvider} from '@docusaurus/plugin-content-blog/client';
import BlogPostItem from '@theme/BlogPostItem';
import type {Props} from '@theme/BlogPostItems';

export default function BlogPostItems({
  items,
  component: BlogPostItemComponent = BlogPostItem,
}: Props): ReactNode {
  return (
    <section className="blog-list-table">
      <div className="blog-list-header" aria-hidden="true">
        <span className="blog-list-col-date">Date</span>
        <span className="blog-list-col-title">Title</span>
        <span className="blog-list-col-author">Author</span>
      </div>
      {items.map(({content: BlogPostContent}) => (
        <BlogPostProvider
          key={BlogPostContent.metadata.permalink}
          content={BlogPostContent}>
          <BlogPostItemComponent>
            <BlogPostContent />
          </BlogPostItemComponent>
        </BlogPostProvider>
      ))}
    </section>
  );
}
