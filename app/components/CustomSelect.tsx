'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from '../Home.module.css'; // Kita akan gunakan style yang sama
import { ChevronDown, ChevronUp } from 'lucide-react';

// Tentukan tipe untuk props agar komponen kita kuat
type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onValueChange, placeholder, disabled }) => {
  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger className={styles.selectTrigger} aria-label={placeholder}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.selectIcon}>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={styles.selectContent} position="popper" sideOffset={5}>
          <Select.ScrollUpButton className={styles.selectScrollButton}>
            <ChevronUp size={16} />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.selectViewport}>
            {options.map(option => (
              <Select.Item key={option.value} value={option.value} className={styles.selectItem}>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.selectScrollButton}>
            <ChevronDown size={16} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CustomSelect;