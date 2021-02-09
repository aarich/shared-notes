import { useEffect, useState } from 'react';
import { useNotes, useSettings } from '../redux/selectors';

import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { reloadAllTimelines } from 'react-native-widgetkit';

const DATA_KEY = 'noteData';
const GROUP_ID = 'group.com.mrarich.SharedNoteWidget';

export const useUpToDateBridgeData = (): [
  error: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
] => {
  const [error, setError] = useState<string>();
  const notes = useNotes();
  const appSettings = useSettings();

  const settings = {
    color: appSettings.widgetColor,
    showTitle: appSettings.showTitle,
    showLastModified: appSettings.showLastModified,
  };

  useEffect(() => {
    const slugs: string[] = [];
    const names: string[] = [];

    notes.forEach((n) => {
      slugs.push(n.slug);
      names.push(n.name);
    });

    SharedGroupPreferences.setItem(
      DATA_KEY,
      { slugs, names, settings },
      GROUP_ID
    ).catch((e) => setError(e.message));

    reloadAllTimelines();
  }, [notes]);

  return [error, setError];
};
