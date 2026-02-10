import styles from "./styles.module.scss";

type ToggleButtonProps = {
  isActive: boolean;
  onToggle: () => void;
};

export const ToggleButton = ({ isActive, onToggle }: ToggleButtonProps) => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={isActive} onChange={onToggle} />
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
