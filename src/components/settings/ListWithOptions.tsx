import { Button, ListItem } from '@ui-kitten/components';

import ButtonPicker from '../shared/ButtonPicker';
import React from 'react';

type Props = {
  selectedIndex: number;
  setSelectedIndex: (newindex: number) => void;
  optionLabels: string[];
  title: string;
};

const ListWithOptions = ({
  selectedIndex,
  setSelectedIndex,
  optionLabels,
  title,
}: Props) => {
  return (
    <ListItem
      disabled
      title={title}
      accessoryRight={() => (
        <ButtonPicker
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          style={{ paddingRight: 10 }}
        >
          {optionLabels.map((label, i) => (
            <Button key={i}>{label}</Button>
          ))}
        </ButtonPicker>
      )}
    />
  );
};

export default ListWithOptions;
