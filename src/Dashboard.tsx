import React from 'react';
import { ProfileWidget } from './widgets/Profile';
import { BookmarksWidget } from './widgets/Bookmarks';
import { FolderWidget } from './widgets/Folder';

export const Dashboard: React.FC<{
}> = (props) => {
  return (
    <>
      <section className="grid__four-column grid">
        <ProfileWidget/>
        <FolderWidget/>
        <BookmarksWidget/>
      </section>
  </>);
};
