import styles from "./styles.module.scss";

type ToggleButtonProps = {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export const ToggleButton = ({
  isActive,
  onToggle,
  disabled,
}: ToggleButtonProps) => {
  return (
    <label className={`${styles.switch} ${disabled ? styles.disabled : ""}`}>
      <input
        type="checkbox"
        checked={isActive}
        onChange={onToggle}
        disabled={disabled}
      />
      <span className={styles.slider}>
        <svg
          className={styles.sliderIcon}
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path fill="none" d="m4 16.5 8 8 16-16"></path>
        </svg>
      </span>
    </label>
  );
};
