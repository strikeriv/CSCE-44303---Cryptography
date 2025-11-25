declare global {
  interface Window {
    launchAttack: (event: SubmitEvent) => void;
  }
}

interface HashDictionaryAttackInput {
  nValue: string;
  dictionaryFile: File;
}

function launchAttack() {
  const form = event.target! as HTMLFormElement;
  const formData = new FormData(form);
  const { nValue, dictionaryFile } = Object.fromEntries(formData) as unknown as HashDictionaryAttackInput;

  const dictionaryUrl = URL.createObjectURL(dictionaryFile);
}
