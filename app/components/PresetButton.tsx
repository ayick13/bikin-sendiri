// app/components/PresetButton.tsx
'use client';

import styles from '../Home.module.css';

type PresetButtonProps = {
  label: string;
  width: number;
  height: number;
  onClick: (width: number, height: number) => void;
  disabled?: boolean; // Tambahkan prop 'disabled' di sini
};

export default function PresetButton({ label, width, height, onClick, disabled = false }: PresetButtonProps) {
  return (
    <button
      type="button"
      className={styles.presetButton}
      onClick={() => onClick(width, height)}
      aria-label={`Preset rasio ${label}`}
      disabled={disabled} // Terapkan prop 'disabled' ke elemen tombol
    >
      {label}
    </button>
  );
}