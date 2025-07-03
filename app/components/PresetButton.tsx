// app/components/PresetButton.tsx
'use client';

import styles from '../Home.module.css';

type PresetButtonProps = {
  label: string;
  width: number;
  height: number;
  onClick: (width: number, height: number) => void;
};

export default function PresetButton({ label, width, height, onClick }: PresetButtonProps) {
  return (
    <button
      type="button"
      className={styles.presetButton}
      onClick={() => onClick(width, height)}
    >
      {label}
    </button>
  );
}