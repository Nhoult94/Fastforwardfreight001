export function Input({ name, type = "text", value, onChange, placeholder }: any) {
    return (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded text-sm"
      />
    );
  }
  