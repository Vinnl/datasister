import React from 'react';
import { ProfileWidget } from './widgets/Profile';
import { BookmarksWidget } from './widgets/Bookmarks';
import { FolderWidget } from './widgets/Folder';
import { AppsWidget } from './widgets/Apps';

export const Dashboard: React.FC<{
}> = (props) => {
  return (
    <>
      <section className="grid__four-column grid">
        <ProfileWidget/>
        <AppsWidget/>
        <FolderWidget/>
        <BookmarksWidget/>
      </section>
  </>);
};
