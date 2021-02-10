import { useEffect, useState } from 'react';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { reloadAllTimelines } from 'react-native-widgetkit';
import { useNotes, useSettings } from '../redux/selectors';

const DATA_KEY = 'noteData';
const GROUP_ID = 'group.com.mrarich.SharedNoteWidget';

export const useUpToDateBridgeData = (): [
  error: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
] => {
  const [error, setError] = useState<string>();
  const notes = useNotes();
  const appSettings = useSettings();

  useEffect(() => {
    const settings = {
      color: appSettings.widgetColor,
      showTitle: appSettings.showTitle,
      showLastModified: appSettings.showLastModified,
    };
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
  }, [
    appSettings.showLastModified,
    appSettings.showTitle,
    appSettings.widgetColor,
    notes,
  ]);

  return [error, setError];
};
