const UserInput = ({
    label,
    id,
    name,
    type = "text",
    placeholder,
    autoComplete,
    value,
    onChange,
}) =>{
    
    return (
        <div className="form-item">
            <label htmlFor={id}>
                {label}
            </label>
            
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
            />

        </div>
    )
}
export default UserInput