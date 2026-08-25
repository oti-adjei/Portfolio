import Field from './ui/Field';

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

/** @deprecated Use `ui/Field` with `as="textarea"`. Kept as a wrapper during the admin reskin migration. */
export default function FormTextarea(props: FormTextareaProps) {
  return <Field as="textarea" {...props} />;
}
