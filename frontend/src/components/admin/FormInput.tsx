import Field from './ui/Field';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'number';
  required?: boolean;
}

/** @deprecated Use `ui/Field` directly. Kept as a wrapper during the admin reskin migration. */
export default function FormInput({ type = 'text', ...rest }: FormInputProps) {
  return <Field as="input" type={type} {...rest} />;
}
