function Input({ name, placeholder, value, onChange, type = "text" }) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-2 w-full rounded"
    />
  );
}

export default Input;