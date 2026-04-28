:root {
  --color-primary: #0066ff;
  --color-primary-hover: #0052cc;
  --color-primary-active: #003da5;
  --color-button-bg: var(--color-primary);
  --color-button-bg-hover: var(--color-primary-hover);
  --color-button-text: #fff;
  --spacing-unit: 8px;
  --radius: 4px;
  --font-base: 'Inter', sans-serif;
  --font-size-base: 1rem;
}

.button {
  background-color: var(--color-button-bg);
  color: var(--color-button-text);
  padding: calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: var(--color-button-bg-hover);
}

/* Multi‑language support – keep translation keys in sync */
--welcome Message: "Bem‑vindo";
--loginLabel: "Entrar";

/* Example usage in HTML */
<!-- <button class="button">{{t('loginLabel')}}</button> -->